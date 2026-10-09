import { useSyncExternalStore } from "react";

/* ─────────────────────────────────────────────────────────────
   Cookie consent store (UK GDPR + PECR compliant approach)

   - Nothing optional runs until the visitor opts in.
   - Consent is stored locally (localStorage) with a version + timestamp.
   - Consent expires after CONSENT_MAX_AGE_DAYS and is asked for again.
   - Bump CONSENT_VERSION whenever you add a new cookie/category so
     everyone is asked again.
   ───────────────────────────────────────────────────────────── */

export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";
export type ConsentChoices = Record<ConsentCategory, boolean>;

export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 180; // re-ask roughly every 6 months
const STORAGE_KEY = "gilevo_cookie_consent";

export const CATEGORIES: {
  id: ConsentCategory;
  label: string;
  description: string;
  required?: boolean;
}[] = [
  {
    id: "necessary",
    label: "Strictly necessary",
    description:
      "Keeps the site secure and working: remembers your cookie choices and protects the contact form from spam and bots. These can't be switched off.",
    required: true,
  },
  {
    id: "functional",
    label: "Preferences",
    description:
      "Remembers choices you make, like display settings, so you don't have to set them again.",
  },
  {
    id: "analytics",
    label: "Analytics",
    description:
      "Helps me understand how the site is used (pages visited, devices, rough location) so I can improve it. Data is aggregated.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description:
      "Used to measure campaigns and show relevant ads on other platforms. Currently not used on this site.",
  },
];

/**
 * Single source of truth for the cookie table on the Cookie Policy page,
 * the "view cookies" lists in the preference panel, and cookie clean-up
 * when consent is withdrawn.
 *
 * ⚠️  Keep this list accurate. Only list what your site really sets.
 *     Use a trailing * for wildcard cookie names (e.g. "_ga_*").
 */
export interface CookieInfo {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: ConsentCategory;
  type: "cookie" | "localStorage";
}

export const COOKIE_REGISTRY: CookieInfo[] = [
  {
    name: STORAGE_KEY,
    provider: "This site (gilevo.co)",
    purpose: "Stores your cookie choices so you aren't asked on every visit.",
    duration: `${CONSENT_MAX_AGE_DAYS} days`,
    category: "necessary",
    type: "localStorage",
  },
  {
    name: "Cloudflare Turnstile",
    provider: "Cloudflare, Inc.",
    purpose:
      "Spam and bot protection on the contact form. May read or store a small token in your browser to confirm you're a real person.",
    duration: "Session / short-lived",
    category: "necessary",
    type: "cookie",
  },
  // ── Add optional cookies below once you actually use them, e.g. ──
  // {
  //   name: "_ga, _ga_*",
  //   provider: "Google LLC",
  //   purpose: "Distinguishes visitors and measures site usage.",
  //   duration: "Up to 2 years",
  //   category: "analytics",
  //   type: "cookie",
  // },
];

/* ───────────── store ───────────── */

interface StoredConsent {
  version: number;
  timestamp: number;
  choices: ConsentChoices;
}

interface State {
  choices: ConsentChoices | null;
  timestamp: number | null;
  settingsOpen: boolean;
}

const DEFAULT_CHOICES: ConsentChoices = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const listeners = new Set<() => void>();

function load(): { choices: ConsentChoices | null; timestamp: number | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { choices: null, timestamp: null };
    const parsed = JSON.parse(raw) as StoredConsent;
    const ageDays = (Date.now() - parsed.timestamp) / 86_400_000;
    if (parsed.version !== CONSENT_VERSION || ageDays > CONSENT_MAX_AGE_DAYS) {
      return { choices: null, timestamp: null };
    }
    return { choices: { ...DEFAULT_CHOICES, ...parsed.choices, necessary: true }, timestamp: parsed.timestamp };
  } catch {
    return { choices: null, timestamp: null };
  }
}

let state: State = { ...load(), settingsOpen: false };

function setState(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Best-effort removal of cookies / storage for categories that are now off. */
function clearDisabled(choices: ConsentChoices) {
  for (const c of COOKIE_REGISTRY) {
    if (choices[c.category]) continue;
    const names = c.name.split(",").map((n) => n.trim());
    for (const name of names) {
      try {
        if (c.type === "localStorage") {
          localStorage.removeItem(name);
          continue;
        }
        const prefix = name.endsWith("*") ? name.slice(0, -1) : null;
        const matches = prefix
          ? document.cookie.split("; ").map((p) => p.split("=")[0]).filter((n) => n.startsWith(prefix))
          : [name];
        const host = location.hostname;
        const domains = [host, "." + host, "." + host.split(".").slice(-2).join(".")];
        for (const n of matches) {
          document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          for (const d of domains) {
            document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
          }
        }
      } catch {
        /* ignore */
      }
    }
  }
}

function persist(choices: ConsentChoices) {
  const finalChoices = { ...choices, necessary: true };
  const timestamp = Date.now();
  try {
    const payload: StoredConsent = { version: CONSENT_VERSION, timestamp, choices: finalChoices };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* storage blocked: choices last for this session only */
  }
  clearDisabled(finalChoices);
  setState({ choices: finalChoices, timestamp, settingsOpen: false });
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: finalChoices }));
}

/* ───────────── public API ───────────── */

export const acceptAll = () =>
  persist({ necessary: true, functional: true, analytics: true, marketing: true });

export const rejectAll = () => persist({ ...DEFAULT_CHOICES });

export const savePreferences = (choices: Partial<ConsentChoices>) =>
  persist({ ...DEFAULT_CHOICES, ...choices });

/** Call from a footer link / button to let visitors review or withdraw consent. */
export const openCookieSettings = () => setState({ settingsOpen: true });
export const closeCookieSettings = () => setState({ settingsOpen: false });

export function useCookieConsent() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** `const analyticsOn = useConsent("analytics")` */
export function useConsent(category: ConsentCategory): boolean {
  const { choices } = useCookieConsent();
  return category === "necessary" ? true : Boolean(choices?.[category]);
}

/** For non-React code: run a callback now (if allowed) and whenever consent changes. */
export function onConsent(category: ConsentCategory, cb: () => void) {
  if (state.choices?.[category]) cb();
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ConsentChoices>).detail;
    if (detail[category]) cb();
  };
  window.addEventListener("cookie-consent-change", handler);
  return () => window.removeEventListener("cookie-consent-change", handler);
}