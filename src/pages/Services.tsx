import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";

const services = [
  { n: "01", name: "Web Design", desc: "Bespoke design systems, art-directed pages, considered motion.", bullets: ["Brand-led design systems", "Art-directed landing pages", "Wireframes & high-fidelity mockups", "Motion principles & prototypes"] },
  { n: "02", name: "Web Development", desc: "Hand-built, well chosen tech stacks with obsessive performance.", bullets: ["Modernised tech stacks", "Performance oriented", "High Lighthouse targets", "Headless CMS integration"] },
  { n: "03", name: "Brand & Identity", desc: "Logos, marks, and digital-first brand systems built to scale.", bullets: ["Logo & wordmark", "Type & colour systems", "Brand guidelines PDF", "Social & business collateral"] },
  { n: "04", name: "E-commerce", desc: "Payment systems and deliveries handled through the site and third-party integrations done by hand.", bullets: ["Integrated payment systems", "Stripe checkout flows", "Subscription & memberships", "Conversion-optimised PDPs"] },
  { n: "05", name: "SEO & Performance", desc: "Technical foundations and measurable growth from launch day one.", bullets: ["Core Web Vitals tuning", "Schema & sitemap", "Content strategy", "Search Console reporting"] },
];

const Services = () => {
  const [active, setActive] = useState(0);

  return (
    <>
      <PageHero
        eyebrow="Services"
        titleSerif="What I"
        titleSans="do"
        intro="From a one-page launch to a fully bespoke web ecosystem, every project is built end-to-end with the same obsessive attention to detail."
        variant="grid"
      />

      <section className="relative pb-32 overflow-hidden -mt-8">
        <LineArt variant="orbit" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Left: service list */}
            <ul className="lg:col-span-5 lg:sticky lg:top-32 self-start">
              {services.map((s, i) => (
                <li key={s.n}>
                  <button
                    onClick={() => setActive(i)}
                    className={`group relative flex items-center gap-4 w-full text-left py-5 border-b border-hairline transition-all duration-300 ${
                      active === i ? "text-blue-deep" : "text-ink/40 hover:text-ink/70"
                    }`}
                  >
                    {/* Active background bar */}
                    <span
                      className={`absolute inset-y-0 -left-3 w-0.5 rounded-full transition-all duration-300 ${
                        active === i ? "bg-brand-gold opacity-100" : "bg-transparent opacity-0"
                      }`}
                    />
                    <span className="mono text-xs w-8 shrink-0 tabular-nums">{s.n}</span>
                    <span className={`display-sans tracking-tight transition-all duration-300 ${
                      active === i ? "text-4xl lg:text-5xl" : "text-3xl lg:text-4xl"
                    }`}>
                      {s.name}
                    </span>
                    <span className={`ml-auto h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-300 ${
                      active === i ? "bg-brand-gold scale-100" : "bg-ink/20 scale-75"
                    }`} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Right: detail card */}
            <div className="lg:col-span-7 lg:sticky lg:top-32 self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                  className="bg-brand-blue-deep text-background rounded-2xl p-8 lg:p-12 relative overflow-hidden shadow-2xl"
                >
                  {/* Decorative rings */}
                  <div aria-hidden className="absolute inset-0 opacity-[0.07]">
                    <svg viewBox="0 0 500 500" className="w-full h-full" preserveAspectRatio="xMaxYMin slice">
                      <g fill="none" stroke="hsl(var(--brand-gold))" strokeWidth="0.6">
                        {Array.from({ length: 16 }).map((_, idx) => (
                          <circle key={idx} cx="420" cy="80" r={18 + idx * 24} />
                        ))}
                      </g>
                    </svg>
                  </div>
                  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-brand-gold/10" />
                  <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl bg-blue/10" />

                  <div className="relative">
                    <p className="mono text-brand-gold/80 text-xs mb-8 tracking-widest">
                      {services[active].n} / {services[active].name.toUpperCase()}
                    </p>
                    <h3 className="display-serif italic text-5xl lg:text-7xl tracking-tight text-background leading-[0.9]">
                      {services[active].name}
                    </h3>
                    <p className="mt-6 text-background/65 max-w-lg leading-relaxed text-base lg:text-lg">
                      {services[active].desc}
                    </p>

                    <div className="mt-10 pt-10 border-t border-background/10">
                      <p className="mono text-background/30 text-xs mb-5 tracking-widest">INCLUDES</p>
                      <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                        {services[active].bullets.map((b, bi) => (
                          <motion.li
                            key={b}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: bi * 0.07, duration: 0.35 }}
                            className="flex items-start gap-3 text-background/80"
                          >
                            <span className="text-brand-gold mt-0.5 text-base leading-none">+</span>
                            <span className="text-sm leading-relaxed">{b}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Services;