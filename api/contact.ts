import { env } from "node:process";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { contactSubmissionSchema } from "../src/lib/contact-schema";

const jsonHeaders = { "Cache-Control": "no-store" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", jsonHeaders["Cache-Control"]);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const contentLength = Number(req.headers["content-length"] ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 10_000) {
    return res.status(413).json({ error: "Request is too large" });
  }

  const contentType = req.headers["content-type"];
  if (typeof contentType !== "string" || !contentType.includes("application/json")) {
    return res.status(415).json({ error: "Expected a JSON request" });
  }

  const parsed = contactSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please check the submitted fields" });
  }

  if (parsed.data.website) {
    return res.status(200).json({ ok: true });
  }

  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = env;
  const missingConfig = [
    !RESEND_API_KEY && "RESEND_API_KEY",
    !CONTACT_FROM_EMAIL && "CONTACT_FROM_EMAIL",
    !CONTACT_TO_EMAIL && "CONTACT_TO_EMAIL",
  ].filter(Boolean);

  if (missingConfig.length) {
    console.error(`Contact form is not configured: missing ${missingConfig.join(", ")}`);
    return res.status(500).json({ error: "The contact form is temporarily unavailable" });
  }

  const resend = new Resend(RESEND_API_KEY);
  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
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
