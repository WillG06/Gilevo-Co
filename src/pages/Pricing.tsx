import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";

const tiers = [
  {
    label: "50 / 50 PAYMENT",
    name: "Split Investment",
    desc: "Secure your project with 50% upfront and pay the remaining 50% once your website is complete and ready to launch.",
    price: "Custom",
    sub: "50% upfront · 50% on completion",
    addon: "+ £50/mo · maintenance, hosting & domain",
    features: [
      "Clear project contract provided before payment",
      "Custom design & development",
      "Bespoke pages - built to brief",
      "Responsive on all devices · 100/100 Lighthouse target",
      "SEO foundations · schema · sitemap",
      "30-day post-launch support",
      "You own everything, forever",
    ],
    cta: "Book a Free Quote",
    filled: false,
  },
  {
    label: "SPREAD THE COST",
    name: "Flexible Plan",
    desc: "A 50% deposit to get started, then split the remaining balance across 6-12 months.",
    price: "50% deposit",
    sub: "then equal monthly instalments - 6 or 12 months",
    addon: "+ £50/mo · maintenance, hosting & domain",
    features: [
      "Clear project contract provided before payment",
      "Everything in One-Time, plus:",
      "Priority build queue",
      "Monthly check-in calls",
      "Ongoing minor edits included",
      "Choose your term - 6 or 12 months",
      "Zero-interest split, no credit checks",
    ],
    cta: "Book a Free Quote",
    filled: true,
    popular: true,
  },
];

const Pricing = () => {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        titleSerif="Simple,"
        titleSans="transparent"
        intro="No hidden fees. No surprises. Book a free quote — then choose how you'd like to pay."
        variant="frame"
      />

      <section className="relative pb-32 overflow-hidden">
        <LineArt variant="grid" />

        {/* Soft brand wash */}
        <div aria-hidden className="absolute inset-0 -z-0 pointer-events-none">
          <div className="absolute top-20 left-10 h-[40vh] w-[40vh] rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-blue)/0.6), transparent 70%)" }} />
          <div className="absolute bottom-20 right-10 h-[40vh] w-[40vh] rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, hsl(var(--brand-gold)/0.5), transparent 70%)" }} />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {tiers.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative rounded-3xl overflow-hidden flex flex-col ${t.popular
                    ? "bg-brand-blue-deep text-background shadow-[0_40px_80px_-30px_hsl(var(--brand-blue-deep)/0.5)]"
                    : "bg-background border border-hairline"
                  }`}
              >
                {t.popular && (
                  <span className="absolute top-6 right-6 mono px-3 py-1 rounded-full bg-brand-gold text-brand-blue-deep">
                    Most Popular
                  </span>
                )}

                {/* Decorative pattern */}
                <div aria-hidden className="absolute inset-0 opacity-[0.06] pointer-events-none">
                  <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <g fill="none" stroke={t.popular ? "hsl(var(--brand-gold))" : "hsl(var(--brand-blue))"} strokeWidth="0.5">
                      {Array.from({ length: 18 }).map((_, idx) => (
                        <circle key={idx} cx="350" cy="50" r={20 + idx * 18} />
                      ))}
                    </g>
                  </svg>
                </div>

                <div className="relative p-8 lg:p-10 flex flex-col flex-1">
                  <p className={`mono ${t.popular ? "text-brand-gold" : "text-brand-blue"}`}>{t.label}</p>
                  <h3 className={`display-sans text-3xl lg:text-4xl mt-4 ${t.popular ? "text-background" : "text-blue-deep"}`}>{t.name}</h3>
                  <p className={`mt-3 leading-relaxed text-sm ${t.popular ? "text-background/70" : "text-ink/65"}`}>{t.desc}</p>

                  <div className="mt-8">
                    <p className={`display-serif text-5xl lg:text-6xl tracking-tight ${t.popular ? "text-brand-gold" : "text-blue-deep"}`}>{t.price}</p>
                    <p className={`mt-3 text-sm ${t.popular ? "text-background/60" : "text-ink/55"}`}>{t.sub}</p>
                    <p className={`text-xs mt-2 ${t.popular ? "text-background/40" : "text-ink/40"}`}>{t.addon}</p>
                  </div>

                  <ul className="mt-8 space-y-3 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className={`flex items-start gap-3 text-sm ${t.popular ? "text-background/85" : "text-ink/85"}`}>
                        <Check className={`h-4 w-4 shrink-0 mt-0.5 ${t.popular ? "text-brand-gold" : "text-brand-blue"}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    state={{ plan: t.name === "One-Time" ? "One-Time Payment" : "Flexible Plan" }}
                    className={`mt-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full transition-all ${t.popular
                        ? "bg-brand-gold text-brand-blue-deep hover:bg-background"
                        : "border border-brand-blue-deep text-brand-blue-deep hover:bg-brand-blue-deep hover:text-background"
                      }`}
                  >
                    {t.cta} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-12 text-center text-ink/55 text-sm max-w-2xl mx-auto leading-relaxed">
            All plans include hosting setup, SSL, and a fully managed handover.
            Maintenance covers uptime monitoring, security updates, and minor content edits.
            Free quotes always - no obligation.
          </p>

          {/* Maintenance breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="mt-20 rounded-2xl bg-background border border-hairline p-8 lg:p-12"
          >
            <p className="mono text-brand-blue mb-4">/ What's in maintenance &amp; domain</p>
            <h3 className="display-sans text-3xl lg:text-4xl text-blue-deep tracking-tight">
              The monthly side, <span className="display-serif text-brand-blue">explained.</span>
            </h3>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {[
                ["Hosting & domain", "Premium UK-based hosting with SSL, CDN, and a custom domain renewal handled for you."],
                ["Security & uptime", "Automated backups, security patches, and 24/7 uptime monitoring with alerts."],
                ["Content edits", "A monthly window of small content changes — copy tweaks, image swaps, new blog posts."],
              ].map(([k, v]) => (
                <div key={k} className="border-l-2 border-brand-gold/60 pl-4">
                  <p className="display-sans text-lg text-blue-deep">{k}</p>
                  <p className="mt-2 text-ink/65 text-sm leading-relaxed">{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
