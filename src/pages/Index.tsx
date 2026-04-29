import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Hero } from "@/components/sections/Hero";
import { LineArt } from "@/components/LineArt";
import { ContactCard3D } from "@/components/ContactCard3D";
import { ArrowUpRight, Plus, Minus } from "lucide-react";

// 2D canvas — light, no Three.js
const LogoParticles = lazy(() =>
  import("@/components/LogoParticles").then((m) => ({ default: m.LogoParticles }))
);

/**
 * Home page — notebook stacking sections.
 * Each section is sticky 100vh; next slides up over previous.
 * Active section stays full opacity; covered sections dim only as the next overlaps.
 */
const Index = () => {
  return (
    <div className="relative">
      <div className="relative">
        <StackSection index={0}><Hero /></StackSection>
        <StackSection index={1}><PreviewWork /></StackSection>
        <StackSection index={2} className="min-h-[150svh]"><PreviewServices /></StackSection>
        <StackSection index={3}><PreviewAbout /></StackSection>
        <StackSection index={4} last><CTABand /></StackSection>
      </div>
    </div>
  );
};

const StackSection = ({
  children,
  index,
  last,
  className = "",
}: {
  children: React.ReactNode;
  index: number;
  last?: boolean;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.55, 0.2]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(3px)"]);

  return (
    <section
      ref={ref}
      className={`sticky top-0 min-h-[100svh] ${className}`}
      style={{ zIndex: 10 + index }}
    >
      <motion.div
        style={last ? undefined : { scale, opacity, filter: blur }}
        className="min-h-[100svh] bg-background relative"
      >
        {children}
      </motion.div>
    </section>
  );
};

/* ============ Section 1: Featured Work — 3D Contact Card swap ============ */
const PreviewWork = () => (
  <div className="relative min-h-[100svh] py-24 lg:py-32 overflow-hidden border-t border-hairline bg-background">
    <LineArt variant="topo" />
    <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center min-h-[80svh]">
      <div className="lg:col-span-5">
        <p className="mono text-brand-blue mb-6">/ 01 — The Studio</p>
        <h2 className="display-sans text-5xl lg:text-7xl tracking-tighter leading-[0.95] text-blue-deep">
          Pixel-perfect on<br /><span className="display-serif text-brand-blue">every screen.</span>
        </h2>
        <p className="mt-6 text-ink/65 leading-relaxed max-w-md">
          Our work is engineered to feel premium from the first paint —
          buttery animations, considered typography, zero compromise.
        </p>
        <Link to="/work" className="mt-8 inline-flex items-center gap-2 ink-underline text-blue-deep">
          Explore templates <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="lg:col-span-7 relative h-[520px] lg:h-[600px] grid place-items-center">
        <ContactCard3D />
      </div>
    </div>
  </div>
);

/* ============ Section 2: Services — interactive accordion ============ */
const HOME_SERVICES = [
  { n: "01", name: "Web Design", desc: "Bespoke design systems, art-directed pages, and considered motion that performs as well as it looks." },
  { n: "02", name: "Web Development", desc: "Hand-built React, Next.js, and Webflow with obsessive attention to performance." },
  { n: "03", name: "Templates", desc: "Production-ready, licensable templates for studios and founders alike." },
  { n: "04", name: "Brand & Identity", desc: "Logos, marks, and digital-first brand systems built to scale." },
  { n: "05", name: "E-commerce", desc: "Headless and traditional commerce that converts on the first visit." },
  { n: "06", name: "SEO & Performance", desc: "Technical foundations and measurable growth from launch day one." },
];

const PreviewServices = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="relative min-h-[100svh] py-24 lg:py-32 bg-paper border-t border-hairline">
      <LineArt variant="grid" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <p className="mono text-brand-blue mb-6">/ 02 — Services</p>
        <h2 className="display-sans text-5xl lg:text-7xl tracking-tighter leading-[0.95] text-blue-deep max-w-3xl">
          Six disciplines, <span className="display-serif text-brand-blue">one studio.</span>
        </h2>
        <ul className="mt-16 border-t border-hairline">
          {HOME_SERVICES.map((s, i) => {
            const isOpen = open === i;
            return (
              <li key={s.n} className="border-b border-hairline">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex items-baseline justify-between w-full py-6 text-left transition-all"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="mono text-faint">{s.n}</span>
                    <span className={`display-sans text-3xl lg:text-5xl tracking-tight transition-colors ${isOpen ? "text-brand-blue-deep" : "text-ink group-hover:text-brand-blue"}`}>
                      {s.name}
                    </span>
                  </span>
                  <span className={`grid place-items-center h-9 w-9 rounded-full border transition-all ${isOpen ? "bg-brand-blue-deep border-brand-blue-deep text-background" : "border-hairline text-brand-blue group-hover:border-brand-blue"}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pl-0 lg:pl-20 pr-4 pb-6 text-ink/65 leading-relaxed max-w-2xl">
                    {s.desc}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ul>
        <Link to="/services" className="mt-10 inline-flex items-center gap-2 ink-underline text-blue-deep">
          See all services <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

/* ============ Section 3: About — Cursor-gravity G&C particle field ============ */
const PreviewAbout = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref} className="relative min-h-[100svh] py-24 lg:py-32 overflow-hidden border-t border-hairline bg-background">
      {/* G&C particle field — dispersed top-right, converges to wordmark on scroll-in */}
      <div className="hidden md:block absolute top-0 right-0 w-[62vw] max-w-[900px] h-[78vh] max-h-[820px] pointer-events-none z-[1]">
        <Suspense fallback={null}>
          <LogoParticles />
        </Suspense>
      </div>

      {/* Subtle line-art layered behind */}
      <LineArt variant="orbit" className="opacity-50" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div style={{ y }} className="max-w-3xl relative z-[2]">
          <p className="mono text-brand-blue mb-6">/ 03 — About</p>
          <h2 className="display-sans text-5xl lg:text-7xl tracking-tighter leading-[0.95] text-blue-deep">
            Independent.<br /><span className="display-serif text-brand-blue">Obsessive.</span>
          </h2>
          <p className="mt-8 max-w-xl text-ink/70 text-lg leading-relaxed">
            A Birmingham-based design &amp; development studio of one — building
            fast, beautiful, conversion-focused websites for businesses who
            want to be seen.
          </p>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 ink-underline text-blue-deep">
            Read more <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Minimal stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden bg-background/70 backdrop-blur-sm relative z-[2]"
        >
          <StatCell value="03+" label="Years building" />
          <StatCell value="100" label="Lighthouse target" sub="every project" />
          <StatCell label="Sites shipped" loading />
          <StatCell label="Templates licensed" loading />
        </motion.div>
      </div>
    </div>
  );
};

const StatCell = ({ value, label, sub, loading }: { value?: string; label: string; sub?: string; loading?: boolean }) => (
  <div className="bg-background/85 backdrop-blur-sm p-7 lg:p-9 relative">
    {loading ? (
      <div className="space-y-2">
        <div className="h-10 w-24 rounded-md bg-gradient-to-r from-paper via-brand-blue-soft/60 to-paper animate-pulse" />
        <p className="mono text-faint text-[0.6rem] mt-3">/ Coming soon</p>
      </div>
    ) : (
      <p className="display-sans text-4xl lg:text-5xl tracking-tighter text-brand-blue-deep">{value}</p>
    )}
    <p className="mono text-brand-blue mt-3">{label}</p>
    {sub && <p className="mono text-faint mt-1 normal-case tracking-normal text-[0.6rem]">{sub}</p>}
  </div>
);

const CTABand = () => (
  <div className="relative min-h-[100svh] grid place-items-center overflow-hidden bg-brand-blue-deep text-background">
    <LineArt variant="orbit" className="opacity-40" />

    {/* Decorative line-art accents */}
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      className="absolute inset-0 w-full h-full text-brand-gold/30 pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <motion.circle
          cx="200" cy="200" r="120"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.circle
          cx="1240" cy="700" r="160"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, delay: 0.2, ease: "easeOut" }}
        />
        <motion.path
          d="M 0 450 Q 360 380 720 470 T 1440 420"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M 0 520 Q 480 490 960 540 T 1440 510"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.8, delay: 0.3, ease: "easeInOut" }}
        />
      </g>
    </svg>

    <motion.div
      aria-hidden
      className="absolute top-[18%] right-[14%] h-2 w-2 rounded-full bg-brand-gold"
      animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      aria-hidden
      className="absolute bottom-[22%] left-[12%] h-1.5 w-1.5 rounded-full bg-brand-gold/70"
      animate={{ y: [0, -8, 0], opacity: [0.3, 0.9, 0.3] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
    />

    <div className="relative text-center px-6 max-w-4xl">
      <p className="mono text-brand-gold mb-6">/ Let's begin</p>
      <h2 className="display-sans text-6xl lg:text-9xl tracking-tighter leading-[0.92]">
        Build something<br /><span className="display-serif text-brand-gold">remarkable.</span>
      </h2>
      <p className="mt-8 text-background/70 text-lg max-w-xl mx-auto leading-relaxed">
        Available for freelance projects, collaborations, and template licensing.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-gold text-brand-blue-deep font-medium hover:bg-background transition-colors">
          Start a project →
        </Link>
        <Link to="/pricing" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-background/30 hover:border-brand-gold hover:text-brand-gold transition-colors">
          See pricing
        </Link>
      </div>
    </div>
  </div>
);

export default Index;