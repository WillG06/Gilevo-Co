import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Check, Copy, Instagram, Github, Mail, MapPin, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";
import portrait from "@/assets/portrait-will.jpeg";

// EmailJS placeholders — replace with values from https://dashboard.emailjs.com
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const CONTACT_EMAIL = "gilevo.co@gmail.com";

const socials = [
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/gilevo.co" },
  { Icon: Github, label: "GitHub", href: "https://github.com/" },
];

const contactSchema = z.object({
  user_name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  user_email: z.string().trim().email("That doesn't look like a valid email").max(255),
  project_type: z.string().min(1, "Pick a project type"),
  plan_interest: z.string().min(1, "Pick a plan"),
  message: z.string().trim().min(10, "Tell me a little more (10+ chars)").max(2000, "Message is too long"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

const Contact = () => {
  const location = useLocation();
  const initialPlan = (location.state as { plan?: string } | null)?.plan ?? "Not Sure Yet";
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 14 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      toast.success("Copied ✓", { description: CONTACT_EMAIL });
    } catch {
      toast.error("Couldn't copy");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FieldErrors;
        if (k && !fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      toast.error("Please check the highlighted fields");
      return;
    }
    setErrors({});
    setSending(true);
    try {
      if (EMAILJS_PUBLIC_KEY.startsWith("YOUR_")) {
        await new Promise((r) => setTimeout(r, 800));
      } else {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, { publicKey: EMAILJS_PUBLIC_KEY });
      }
      setSent(true);
      form.reset();
    } catch {
      toast.error("Something went wrong. Please email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        titleSerif="Let's build"
        titleSans="something"
        intro="Available for freelance projects, collaborations, and template licensing. Tell me about your project — quotes are always free."
        variant="compass"
      />

      <section className="relative pb-32 overflow-hidden">
        <LineArt variant="wavefield" />

        <div aria-hidden className="absolute inset-0 -z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-30"
               style={{ background: "radial-gradient(circle, hsl(var(--brand-blue)/0.45), transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 h-[50vh] w-[50vh] rounded-full blur-3xl opacity-25"
               style={{ background: "radial-gradient(circle, hsl(var(--brand-gold)/0.45), transparent 70%)" }} />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <motion.button
                onClick={copyEmail}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group block text-left w-full"
              >
                <p className="mono text-brand-blue mb-3 flex items-center gap-2">
                  Drop me a line <Copy className="h-3 w-3" />
                </p>
                <span className="display-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter ink-underline break-all text-blue-deep">
                  {CONTACT_EMAIL}
                </span>
                <p className="mt-4 mono text-faint">Click to copy · Or fill the brief below</p>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
              className="lg:col-span-4"
              style={{ perspective: 1400 }}
            >
              <div onMouseMove={onMove} onMouseLeave={onLeave}>
                <motion.div
                  style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-brand-gold/20"
                >
                  <img src={portrait} alt="Will Giles — designer & developer, Birmingham UK" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-deep/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <p className="signature-script text-4xl text-background leading-none">WGiles</p>
                    <p className="mono text-brand-gold mt-1">/ Founder · Birmingham</p>
                  </div>
                  <span className="absolute top-4 right-4 mono text-[0.55rem] glass-blue rounded-full px-3 py-1 text-background">/ Hi, I'm Will</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="mt-20 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <p className="mono text-brand-blue mb-6">/ Or send a brief</p>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-brand-blue-deep text-background border border-brand-gold/30 rounded-2xl p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto h-16 w-16 rounded-full bg-brand-gold text-brand-blue-deep grid place-items-center"
                  >
                    <Check className="h-8 w-8" />
                  </motion.div>
                  <h3 className="display-serif text-4xl mt-6 text-brand-gold">Message sent.</h3>
                  <p className="mt-2 text-background/70">I'll be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="bg-background border border-hairline rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl relative overflow-hidden">
                  <div aria-hidden className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-gold/10 blur-2xl" />
                  <div aria-hidden className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-brand-blue/10 blur-2xl" />

                  <div className="relative grid sm:grid-cols-2 gap-5">
                    <Field label="Name" name="user_name" error={errors.user_name} onChange={() => errors.user_name && setErrors({ ...errors, user_name: undefined })} />
                    <Field label="Email" name="user_email" type="email" error={errors.user_email} onChange={() => errors.user_email && setErrors({ ...errors, user_email: undefined })} />
                  </div>
                  <div className="relative grid sm:grid-cols-2 gap-5">
                    <SelectField label="Project Type" name="project_type" options={["New Website", "Template", "Redesign", "Other"]} error={errors.project_type} />
                    <SelectField label="Plan Interest" name="plan_interest" defaultValue={initialPlan} options={["One-Time Payment", "Flexible Plan", "Not Sure Yet", "Just Browsing"]} error={errors.plan_interest} />
                  </div>
                  <div className="relative">
                    <label className="mono text-brand-blue block mb-2">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      onChange={() => errors.message && setErrors({ ...errors, message: undefined })}
                      className={`field-input resize-none ${errors.message ? "is-error" : ""}`}
                      placeholder="Tell me about your project…"
                    />
                    {errors.message && (
                      <p className="field-error"><AlertTriangle className="h-3 w-3" />{errors.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-blue-deep text-background font-medium hover:bg-brand-gold hover:text-brand-blue-deep transition-colors disabled:opacity-50"
                  >
                    {sending ? "Sending…" : "Send brief →"}
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-brand-blue-deep text-background p-8 relative overflow-hidden">
                <div aria-hidden className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-brand-gold/20 blur-2xl" />
                <p className="mono text-brand-gold mb-4 relative">/ Direct</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="display-serif text-2xl text-background hover:text-brand-gold transition-colors inline-flex items-center gap-2 relative break-all">
                  <Mail className="h-5 w-5 shrink-0" /> {CONTACT_EMAIL}
                </a>
                <div className="relative mt-6 flex items-center gap-3">
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-brand-gold animate-pulse-dot" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-brand-gold" />
                  </span>
                  <span className="text-sm text-background/80">Currently accepting new projects</span>
                </div>
              </div>

              <div className="rounded-2xl bg-background border border-hairline p-6">
                <p className="mono text-brand-blue mb-4">/ Elsewhere</p>
                <div className="grid grid-cols-2 gap-3">
                  {socials.map(({ Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-paper border border-hairline rounded-lg px-4 py-3 inline-flex items-center gap-3 hover:border-brand-blue hover:text-brand-blue transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-paper border border-hairline p-6 flex items-center justify-between">
                <div>
                  <p className="mono text-brand-blue mb-2">/ Studio</p>
                  <p className="display-serif text-2xl text-blue-deep flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-gold" /> Birmingham, UK
                  </p>
                  <p className="mono text-faint mt-2">52.4862° N, 1.8904° W</p>
                </div>
                {/* Sextant-style emblem — unique to Contact, replaces the
                    repeated compass graphic. */}
                <svg viewBox="0 0 100 100" className="h-20 w-20 text-brand-blue/40" fill="none" stroke="currentColor" strokeWidth="0.6">
                  {/* Sextant arc (60°) */}
                  <path d="M 12 80 A 70 70 0 0 1 88 80" />
                  <path d="M 22 80 A 60 60 0 0 1 78 80" />
                  {/* Index arm */}
                  <line x1="50" y1="80" x2="20" y2="22" stroke="hsl(var(--brand-gold))" strokeOpacity="0.7" />
                  {/* Telescope */}
                  <line x1="50" y1="80" x2="78" y2="34" />
                  <circle cx="78" cy="34" r="4" />
                  {/* Pivot */}
                  <circle cx="50" cy="80" r="2.5" fill="hsl(var(--brand-gold))" stroke="none" />
                  {/* Tick marks along arc */}
                  {Array.from({ length: 9 }).map((_, i) => {
                    const a = Math.PI + (i / 8) * Math.PI * 0.42 + Math.PI * 0.29;
                    const r1 = 70, r2 = 64;
                    const x1 = 50 + Math.cos(a) * r1, y1 = 80 + Math.sin(a) * r1;
                    const x2 = 50 + Math.cos(a) * r2, y2 = 80 + Math.sin(a) * r2;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Field = ({ label, name, type = "text", error, onChange }: { label: string; name: string; type?: string; error?: string; onChange?: () => void }) => (
  <div>
    <label className="mono text-brand-blue block mb-2">{label}</label>
    <input
      type={type}
      name={name}
      onChange={onChange}
      aria-invalid={!!error}
      className={`field-input ${error ? "is-error" : ""}`}
    />
    {error && (
      <p className="field-error"><AlertTriangle className="h-3 w-3" />{error}</p>
    )}
  </div>
);

const SelectField = ({ label, name, options, defaultValue, error }: { label: string; name: string; options: string[]; defaultValue?: string; error?: string }) => (
  <div>
    <label className="mono text-brand-blue block mb-2">{label}</label>
    <select
      name={name}
      defaultValue={defaultValue}
      aria-invalid={!!error}
      className={`field-input appearance-none ${error ? "is-error" : ""}`}
      style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e6b7b' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-background">{o}</option>
      ))}
    </select>
    {error && (
      <p className="field-error"><AlertTriangle className="h-3 w-3" />{error}</p>
    )}
  </div>
);

export default Contact;
