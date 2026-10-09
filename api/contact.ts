// Save as: api/contact.ts
// Install: npm i @upstash/ratelimit @upstash/redis
//
// Env vars (Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY          required
//   CONTACT_TO_EMAIL        required, inbox that receives enquiries
//   CONTACT_FROM_EMAIL      optional, defaults to Gilevo & Co. <hello@send.gilevo.co.uk>
//   TURNSTILE_SECRET_KEY    enables the bot check (Cloudflare Turnstile secret)
//   ALLOWED_ORIGINS         optional, comma separated, defaults to gilevo.co.uk + www
//   Upstash Redis vars      added by the Vercel Upstash integration
//                           (UPSTASH_REDIS_REST_URL/_TOKEN or KV_REST_API_URL/_TOKEN)

import { env } from "node:process";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { contactSubmissionSchema } from "../src/lib/contact-schema.js";

const jsonHeaders = { "Cache-Control": "no-store" };

const DEFAULT_FROM = "Gilevo & Co. <hello@send.gilevo.co.uk>";

const ALLOWED_ORIGINS = (env.ALLOWED_ORIGINS ?? "https://gilevo.co.uk,https://www.gilevo.co.uk")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// ---- Rate limiting (skipped with a warning if Upstash is not connected) ----
const redisUrl = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
const redisToken = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;

const limiters =
  redisUrl && redisToken
    ? (() => {
        const redis = new Redis({ url: redisUrl, token: redisToken });
        return {
          // 3 messages per hour per IP
          perIp: new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(3, "1 h"),
            prefix: "contact:ip",
          }),
          // 40 messages per day in total, protects your Resend quota
          global: new Ratelimit({
            redis,
            limiter: Ratelimit.fixedWindow(40, "1 d"),
            prefix: "contact:global",
          }),
        };
      })()
    : null;

if (!limiters) {
  console.warn("Rate limiting is OFF: connect Upstash Redis to this project.");
}

async function allowed(limiter: Ratelimit | undefined, key: string) {
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit(key);
    return success;
  } catch (err) {
    // Fail open so a Redis outage never breaks the contact form
    console.error("Rate limit check failed:", err instanceof Error ? err.message : err);
    return true;
  }
}

function getIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  return first || (req.headers["x-real-ip"] as string | undefined) || "unknown";
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  try {
    const form = new URLSearchParams();
    form.append("secret", secret);
    form.append("response", token);
    if (ip !== "unknown") form.append("remoteip", ip);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", jsonHeaders["Cache-Control"]);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // In production, only accept browser requests coming from your own site
  const origin = req.headers.origin;
  if (env.VERCEL_ENV === "production" && origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const contentLength = Number(req.headers["content-length"] ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 10_000) {
    return res.status(413).json({ error: "Request is too large" });
  }

  const contentType = req.headers["content-type"];
  if (typeof contentType !== "string" || !contentType.includes("application/json")) {
    return res.status(415).json({ error: "Expected a JSON request" });
  }

  const ip = getIp(req);

  if (!(await allowed(limiters?.perIp, ip))) {
    res.setHeader("Retry-After", "3600");
    return res.status(429).json({ error: "Too many messages. Please try again later." });
  }

  const parsed = contactSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please check the submitted fields" });
  }

  // Bots fill the hidden field. Pretend it worked and drop it.
  if (parsed.data.website) {
    return res.status(200).json({ ok: true });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, TURNSTILE_SECRET_KEY } = env;
  const from = env.CONTACT_FROM_EMAIL || DEFAULT_FROM;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    const missing = [
      !RESEND_API_KEY && "RESEND_API_KEY",
      !CONTACT_TO_EMAIL && "CONTACT_TO_EMAIL",
    ].filter(Boolean);
    console.error(`Contact form is not configured: missing ${missing.join(", ")}`);
    return res.status(500).json({ error: "The contact form is temporarily unavailable" });
  }

  // Bot check, required whenever a Turnstile secret is configured
  if (TURNSTILE_SECRET_KEY) {
    const token = parsed.data.turnstileToken;
    if (!token || !(await verifyTurnstile(token, TURNSTILE_SECRET_KEY, ip))) {
      return res
        .status(400)
        .json({ error: "Security check failed. Refresh the page and try again." });
    }
  }

  if (!(await allowed(limiters?.global, "all"))) {
    return res
      .status(429)
      .json({ error: "We're receiving a lot of messages right now. Please email me directly." });
  }

  const resend = new Resend(RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send({
      from,
      to: [CONTACT_TO_EMAIL],
      replyTo: parsed.data.user_email,
      subject: "New website enquiry",
      text: [
        "New website enquiry",
        "",
        `Name: ${parsed.data.user_name}`,
        `Email: ${parsed.data.user_email}`,
        `Project type: ${parsed.data.project_type}`,
        `Plan interest: ${parsed.data.plan_interest}`,
        "",
        "Message:",
        parsed.data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend failed to deliver a contact form email:", error.message);
      return res.status(502).json({ error: "The message could not be sent" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(
      "Resend request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return res.status(502).json({ error: "The message could not be sent" });
  }
}