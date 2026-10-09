import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie, ChevronDown, X } from "lucide-react";
import {
  CATEGORIES,
  COOKIE_REGISTRY,
  acceptAll,
  closeCookieSettings,
  openCookieSettings,
  rejectAll,
  savePreferences,
  useCookieConsent,
  type ConsentCategory,
  type ConsentChoices,
} from "@/lib/cookie-consent";

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** Equal-weight buttons so "Reject" is as easy as "Accept" (ICO / PECR requirement). */
const btnBase =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold";

export const CookieConsent = ({ showReopenButton = true }: { showReopenButton?: boolean }) => {
  const { choices, settingsOpen } = useCookieConsent();
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  // Small delay so the banner doesn't fight the page-load animation
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  const undecided = choices === null;

  return (
    <>
      {/* ── Banner (non-blocking, site stays usable) ── */}
      <AnimatePresence>
        {ready && undecided && !settingsOpen && (
          <motion.div
            role="region"
            aria-label="Cookie consent"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed z-[100] bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-[440px] rounded-2xl bg-brand-blue-deep text-background border border-brand-gold/20 shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-7">
              <p className="mono text-brand-gold mb-3 flex items-center gap-2">
                <Cookie className="h-3.5 w-3.5" /> / Cookies
              </p>
              <h2 className="display-serif text-2xl leading-tight">Your privacy, your call.</h2>
              <p className="mt-3 text-sm leading-relaxed text-background/70">
                I use essential cookies to keep this site secure and working. With your permission,
                I'd also like to use optional cookies to understand how the site is used. You can
                change your mind at any time. See my{" "}
                <Link to="/cookies" className="underline underline-offset-2 hover:text-brand-gold transition-colors">
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-brand-gold transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={acceptAll}
                  className={`${btnBase} bg-brand-gold text-brand-blue-deep hover:bg-background`}
                >
                  Accept all
                </button>
                <button
                  onClick={rejectAll}
                  className={`${btnBase} border border-brand-gold/60 text-brand-gold hover:bg-brand-gold hover:text-brand-blue-deep`}
                >
                  Reject all
                </button>
              </div>
              <button
                onClick={openCookieSettings}
                className="mt-4 w-full mono text-background/70 hover:text-brand-gold transition-colors underline underline-offset-4 decoration-background/30"
              >
                Customise choices
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preferences panel ── */}
      <AnimatePresence>{settingsOpen && <PreferencesPanel key="prefs" />}</AnimatePresence>

      {/* ── Re-open (withdraw consent as easily as it was given) ── */}
      <AnimatePresence>
        {showReopenButton && ready && !undecided && !settingsOpen && (
          <motion.button
            key="reopen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={openCookieSettings}
            aria-label="Open cookie settings"
            title="Cookie settings"
            className="fixed z-[90] bottom-4 left-4 sm:bottom-6 sm:left-6 grid place-items-center h-10 w-10 rounded-full bg-brand-blue-deep text-brand-gold border border-brand-gold/20 shadow-lg hover:bg-brand-gold hover:text-brand-blue-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            <Cookie className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

/* ───────────────────────────── Preferences ───────────────────────────── */

const PreferencesPanel = () => {
  const { choices } = useCookieConsent();
  const [draft, setDraft] = useState<ConsentChoices>(
    choices ?? { necessary: true, functional: false, analytics: false, marketing: false }
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Focus management, Escape to close, simple focus trap, scroll lock
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCookieSettings();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const toggle = (id: ConsentCategory) => setDraft((d) => ({ ...d, [id]: !d[id] }));

  return (
    <motion.div
      className="fixed inset-0 z-[110] grid place-items-end sm:place-items-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 bg-brand-blue-deep/60 backdrop-blur-sm"
        onClick={closeCookieSettings}
        aria-hidden="true"
      />

      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-prefs-title"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative w-full sm:max-w-2xl max-h-[92svh] flex flex-col bg-background text-ink rounded-t-2xl sm:rounded-2xl shadow-2xl ring-1 ring-brand-gold/20 outline-none overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 px-6 sm:px-8 pt-7 pb-5 border-b border-hairline">
          <div>
            <p className="mono text-brand-blue mb-2">/ Cookie settings</p>
            <h2 id="cookie-prefs-title" className="display-serif text-3xl text-blue-deep leading-tight">
              Choose what you're comfortable with.
            </h2>
          </div>
          <button
            onClick={closeCookieSettings}
            aria-label="Close cookie settings"
            className="shrink-0 grid place-items-center h-9 w-9 rounded-full border border-hairline text-brand-blue hover:border-brand-blue transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 sm:px-8 py-6">
          <p className="text-sm leading-relaxed text-ink/65 max-w-xl">
            Cookies are small files stored on your device. Strictly necessary cookies are always on
            because the site can't work securely without them. Everything else is off until you say
            otherwise. Read more in my{" "}
            <Link to="/cookies" onClick={closeCookieSettings} className="ink-underline text-blue-deep">
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link to="/privacy" onClick={closeCookieSettings} className="ink-underline text-blue-deep">
              Privacy Policy
            </Link>
            .
          </p>

          <ul className="mt-6 border-t border-hairline">
            {CATEGORIES.map((cat) => (
              <CategoryRow
                key={cat.id}
                id={cat.id}
                label={cat.label}
                description={cat.description}
                required={cat.required}
                checked={cat.required ? true : draft[cat.id]}
                onToggle={() => toggle(cat.id)}
              />
            ))}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="px-6 sm:px-8 py-5 border-t border-hairline bg-paper grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={rejectAll}
            className={`${btnBase} border border-brand-blue-deep/40 text-brand-blue-deep hover:bg-brand-blue-deep hover:text-background`}
          >
            Reject all
          </button>
          <button
            onClick={acceptAll}
            className={`${btnBase} border border-brand-blue-deep/40 text-brand-blue-deep hover:bg-brand-blue-deep hover:text-background`}
          >
            Accept all
          </button>
          <button
            onClick={() => savePreferences(draft)}
            className={`${btnBase} bg-brand-blue-deep text-background hover:bg-brand-gold hover:text-brand-blue-deep`}
          >
            Save my choices
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CategoryRow = ({
  id,
  label,
  description,
  required,
  checked,
  onToggle,
}: {
  id: ConsentCategory;
  label: string;
  description: string;
  required?: boolean;
  checked: boolean;
  onToggle: () => void;
}) => {
  const [showList, setShowList] = useState(false);
  const cookies = COOKIE_REGISTRY.filter((c) => c.category === id);
  const labelId = `cookie-cat-${id}`;

  return (
    <li className="border-b border-hairline py-6">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 id={labelId} className="display-sans text-lg tracking-tight text-blue-deep flex items-center gap-3">
            {label}
            {required && <span className="mono text-[0.6rem] text-faint">/ Always on</span>}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65 max-w-md">{description}</p>

          <button
            type="button"
            onClick={() => setShowList((s) => !s)}
            aria-expanded={showList}
            className="mt-3 mono text-brand-blue inline-flex items-center gap-1.5 hover:text-brand-blue-deep transition-colors"
          >
            {cookies.length === 0 ? "No cookies in use" : `${showList ? "Hide" : "View"} cookies (${cookies.length})`}
            {cookies.length > 0 && (
              <ChevronDown className={`h-3 w-3 transition-transform ${showList ? "rotate-180" : ""}`} />
            )}
          </button>
        </div>

        <Switch checked={checked} disabled={required} onToggle={onToggle} labelledBy={labelId} />
      </div>

      <AnimatePresence initial={false}>
        {showList && cookies.length > 0 && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden mt-4 space-y-3"
          >
            {cookies.map((c) => (
              <li key={c.name} className="rounded-xl bg-paper px-4 py-3 text-sm">
                <p className="mono text-blue-deep break-all">{c.name}</p>
                <p className="mt-1 text-ink/65 leading-relaxed">{c.purpose}</p>
                <p className="mt-1 mono text-faint text-[0.6rem]">
                  {c.provider} · {c.duration}
                </p>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const Switch = ({
  checked,
  disabled,
  onToggle,
  labelledBy,
}: {
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  labelledBy: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    disabled={disabled}
    onClick={onToggle}
    className={`relative shrink-0 h-7 w-12 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
      checked ? "bg-brand-blue-deep" : "bg-ink/20"
    } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className={`absolute top-1 h-5 w-5 rounded-full ${checked ? "bg-brand-gold" : "bg-background"}`}
      style={{ left: checked ? "calc(100% - 1.5rem)" : "0.25rem" }}
    />
  </button>
);

export default CookieConsent;