// Save as: src/lib/contact-schema.ts
import { z } from "zod";

export const contactSchema = z.object({
  user_name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  user_email: z.string().trim().email("That doesn't look like a valid email").max(255),
  project_type: z.enum(["New Website", "Redesign", "Landing Page", "Maintenance / Updates", "Other"], {
    error: "Pick a project type",
  }),
  plan_interest: z.enum(["One-Time Payment", "Flexible Plan", "Not Sure Yet", "Just Browsing"], {
    error: "Pick a plan",
  }),
  message: z.string().trim().min(10, "Tell me a little more (10+ chars)").max(2000, "Message is too long"),
});

export const contactSubmissionSchema = contactSchema.extend({
  website: z.string().max(200).optional(), // honeypot
  turnstileToken: z.string().max(2048).optional(), // Cloudflare Turnstile
});