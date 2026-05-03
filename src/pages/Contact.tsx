import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Check, Copy, Instagram, Github, Mail, MapPin, AlertTriangle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";
import portrait from "@/assets/portrait-will.jpeg";

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

  // Hidden native inputs for EmailJS form serialisation
  const [projectType, setProjectType] = useState("New Website");
  const [planInterest, setPlanInterest] = useState(initialPlan);

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

        {/* ── Large email CTA ── */}
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10 pt-4 pb-16 border-b border-hairline">
          <motion.button
            onClick={copyEmail}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group text-left"
          >
            <p className="mono text-brand-blue mb-3 flex items-center gap-2">
              Drop me a line <Copy className="h-3 w-3" />
            </p>
            <span className="display-serif text-4xl md:text-6xl lg:text-8xl tracking-tighter ink-underline text-blue-deep leading-none">
              {CONTACT_EMAIL}
            </span>
            <p className="mt-5 mono text-faint">Click to copy · or fill the brief below</p>
          </motion.button>
        </div>

        {/* ── Main grid ── */}
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 pt-20">

            {/* ── Open form ── */}
            <div className="lg:col-span-7">
              <p className="mono text-brand-blue mb-12">/ Send a brief</p>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto h-16 w-16 rounded-full bg-brand-blue-deep text-brand-gold grid place-items-center">
                    <Check className="h-8 w-8" />
                  </motion.div>
                  <h3 className="display-serif text-5xl mt-8 text-blue-deep">Message sent.</h3>
                  <p className="mt-3 mono text-faint">I'll be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-10">
                  {/* Hidden inputs so EmailJS picks up the custom select values */}
                  <input type="hidden" name="project_type" value={projectType} />
                  <input type="hidden" name="plan_interest" value={planInterest} />

                  <div className="grid sm:grid-cols-2 gap-10">
                    <OpenField label="Name" name="user_name" error={errors.user_name}
                      onChange={() => errors.user_name && setErrors({ ...errors, user_name: undefined })} />
                    <OpenField label="Email" name="user_email" type="email" error={errors.user_email}
                      onChange={() => errors.user_email && setErrors({ ...errors, user_email: undefined })} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-10">
                    <CustomSelect
                      label="Project Type"
                      value={projectType}
                      onChange={(v) => { setProjectType(v); errors.project_type && setErrors({ ...errors, project_type: undefined }); }}
                      options={["New Website", "Template", "Redesign", "Other"]}
                      error={errors.project_type}
                    />
                    <CustomSelect
                      label="Plan Interest"
                      value={planInterest}
                      onChange={(v) => { setPlanInterest(v); errors.plan_interest && setErrors({ ...errors, plan_interest: undefined }); }}
                      options={["One-Time Payment", "Flexible Plan", "Not Sure Yet", "Just Browsing"]}
                      error={errors.plan_interest}
                    />
                  </div>

                  <div>
                    <label className="mono text-brand-blue block mb-3">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      onChange={() => errors.message && setErrors({ ...errors, message: undefined })}
                      placeholder="Tell me about your project…"
                      className={`w-full bg-transparent border-b py-3 text-ink placeholder:text-faint resize-none outline-none focus:border-brand-blue transition-colors text-base leading-relaxed ${
                        errors.message ? "border-red-400" : "border-hairline"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-2 mono text-[0.65rem] text-red-400 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />{errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-blue-deep text-background font-medium hover:bg-brand-gold hover:text-brand-blue-deep transition-colors disabled:opacity-50">
                      {sending ? "Sending…" : "Send brief →"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ── Portrait ── */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div style={{ perspective: 1400 }} onMouseMove={onMove} onMouseLeave={onLeave}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}>
                  <motion.div
                    style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl ring-1 ring-brand-gold/20">
                    <img src={portrait} alt="Will Giles — designer & developer, Birmingham UK"
                      className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-deep/85 via-transparent to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 p-6">
                      <p className="signature-script text-4xl text-background leading-none">WGiles</p>
                      <p className="mono text-brand-gold mt-1">/ Founder · Birmingham</p>
                    </div>
                    <span className="absolute top-4 right-4 mono text-[0.55rem] glass-blue rounded-full px-3 py-1 text-background">
                      / Hi, I'm Will
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inset-0 rounded-full bg-brand-gold animate-pulse-dot" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-brand-gold" />
                </span>
                <span className="mono text-ink/70 text-sm">Currently accepting new projects</span>
              </motion.div>
            </div>
          </div>

          {/* ── Footer info strip ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mt-24 pt-10 border-t border-hairline grid sm:grid-cols-3 gap-px bg-hairline rounded-xl overflow-hidden">

            {/* Direct */}
            <div className="bg-background px-8 py-8">
              <p className="mono text-brand-blue mb-4">/ Direct</p>
              <a href={"mailto:" + CONTACT_EMAIL}
                className="display-serif text-lg text-blue-deep hover:text-brand-blue transition-colors inline-flex items-center gap-2 break-all">
                <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
                {CONTACT_EMAIL}
              </a>
            </div>

            {/* Elsewhere */}
            <div className="bg-background px-8 py-8">
              <p className="mono text-brand-blue mb-4">/ Elsewhere</p>
              <div className="flex items-center gap-5">
                {socials.map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-ink/70 hover:text-brand-blue transition-colors text-sm">
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Studio */}
            <div className="bg-background px-8 py-8">
              <p className="mono text-brand-blue mb-4">/ Studio</p>
              <p className="display-serif text-lg text-blue-deep flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-gold shrink-0" />
                Birmingham, UK
              </p>
              <p className="mono text-faint mt-1 text-[0.65rem]">52.4862° N, 1.8904° W</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

/* ── Open underline text input ── */
const OpenField = ({ label, name, type = "text", error, onChange }: {
  label: string; name: string; type?: string; error?: string; onChange?: () => void;
}) => (
  <div>
    <label className="mono text-brand-blue block mb-3">{label}</label>
    <input
      type={type}
      name={name}
      onChange={onChange}
      aria-invalid={!!error}
      className={`w-full bg-transparent border-b py-3 text-ink placeholder:text-faint outline-none focus:border-brand-blue transition-colors text-base ${
        error ? "border-red-400" : "border-hairline"
      }`}
    />
    {error && (
      <p className="mt-2 mono text-[0.65rem] text-red-400 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />{error}
      </p>
    )}
  </div>
);

/* ── Custom luxury select dropdown ── */
const CustomSelect = ({ label, value, onChange, options, error }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="mono text-brand-blue block mb-3">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border-b py-3 text-base text-left outline-none transition-colors ${
          error ? "border-red-400" : open ? "border-brand-blue" : "border-hairline"
        }`}>
        <span className={value ? "text-ink" : "text-faint"}>{value || "Select…"}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-faint" />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.18, ease: [0.65, 0, 0.35, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-brand-blue-deep border border-brand-gold/20 rounded-xl overflow-hidden shadow-2xl">
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-5 py-3.5 text-sm transition-colors flex items-center justify-between group ${
                    opt === value
                      ? "text-brand-gold bg-white/5"
                      : "text-background/80 hover:text-background hover:bg-white/5"
                  }`}>
                  <span className="mono">{opt}</span>
                  {opt === value && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-2 mono text-[0.65rem] text-red-400 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />{error}
        </p>
      )}
    </div>
  );
};

export default Contact;