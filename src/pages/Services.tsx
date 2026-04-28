import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";

const services = [
  { n: "01", name: "Web Design", desc: "Bespoke design systems, art-directed pages, considered motion.", bullets: ["Brand-led design systems", "Art-directed landing pages", "Wireframes & high-fidelity mockups", "Motion principles & prototypes"] },
  { n: "02", name: "Web Development", desc: "Hand-built React, Next.js, and Webflow with obsessive performance.", bullets: ["React, Next.js & Astro stacks", "Webflow & Framer development", "100/100 Lighthouse targets", "Headless CMS integration"] },
  { n: "03", name: "Template Design", desc: "Production-ready, licensable templates for studios and founders.", bullets: ["Multi-page Webflow & Framer templates", "Editable CMS structures", "Lifetime license", "Free updates"] },
  { n: "04", name: "Brand & Identity", desc: "Logos, marks, and digital-first brand systems built to scale.", bullets: ["Logo & wordmark", "Type & colour systems", "Brand guidelines PDF", "Social & business collateral"] },
  { n: "05", name: "E-commerce", desc: "Shopify and headless commerce that converts on the first visit.", bullets: ["Shopify 2.0 themes", "Stripe checkout flows", "Subscription & memberships", "Conversion-optimised PDPs"] },
  { n: "06", name: "SEO & Performance", desc: "Technical foundations and measurable growth from launch day one.", bullets: ["Core Web Vitals tuning", "Schema & sitemap", "Content strategy", "Search Console reporting"] },
];

const Services = () => {
  const [active, setActive] = useState(0);
  return (
    <>
      <PageHero
        eyebrow="Services"
        titleSerif="What I"
        titleSans="do"
        intro="From a one-page launch to a fully bespoke web ecosystem — every project is built end-to-end with the same obsessive attention to detail."
        variant="grid"
      />

      <section className="relative pb-32 overflow-hidden">
        <LineArt variant="orbit" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-10">
            <ul className="lg:col-span-5 lg:sticky lg:top-32 self-start space-y-1">
              {services.map((s, i) => (
                <li key={s.n}>
                  <button
                    onClick={() => setActive(i)}
                    className={`group flex items-baseline gap-4 w-full text-left py-4 border-b border-hairline transition-colors ${active === i ? "text-blue-deep" : "text-ink/45 hover:text-blue"}`}
                  >
                    <span className="mono text-faint w-10">{s.n}</span>
                    <span className="display-sans text-3xl lg:text-4xl tracking-tight">{s.name}</span>
                    <span className={`ml-auto h-2 w-2 rounded-full transition-all ${active === i ? "bg-brand-gold scale-100" : "bg-ink/15 scale-75"}`} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="lg:col-span-7 lg:sticky lg:top-32 self-start min-h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                  className="bg-brand-blue-deep text-background rounded-2xl p-8 lg:p-12 relative overflow-hidden shadow-2xl mx-auto max-w-2xl"
                >
                  {/* Decorative pattern */}
                  <div aria-hidden className="absolute inset-0 opacity-10">
                    <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                      <g fill="none" stroke="hsl(var(--brand-gold))" strokeWidth="0.5">
                        {Array.from({ length: 14 }).map((_, idx) => (
                          <circle key={idx} cx="320" cy="80" r={20 + idx * 22} />
                        ))}
                      </g>
                    </svg>
                  </div>
                  <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl bg-brand-gold/15" />

                  <div className="relative">
                    <p className="mono text-brand-gold mb-6">{services[active].n} / {services[active].name}</p>
                    <h3 className="display-serif italic text-4xl lg:text-6xl tracking-tight text-background">{services[active].name}</h3>
                    <p className="mt-6 text-background/75 max-w-xl leading-relaxed text-lg">{services[active].desc}</p>
                    <ul className="mt-10 grid sm:grid-cols-2 gap-3">
                      {services[active].bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-background/90">
                          <span className="text-brand-gold mt-0.5">+</span>
                          <span className="text-sm">{b}</span>
                        </li>
                      ))}
                    </ul>
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
