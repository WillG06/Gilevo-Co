import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { ExternalLink, ChevronDown, RotateCcw, Pause, Play, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";

import tpl1 from "@/assets/tpl-1.jpg";
import tpl2 from "@/assets/tpl-2.jpg";
import tpl3 from "@/assets/tpl-3.jpg";
import coffeeHero from "@/assets/tpl-coffee-hero.jpg";
import coffeeStore from "@/assets/tpl-coffee-store.jpg";
import coffeeMenu from "@/assets/tpl-coffee-menu.jpg";
import foodstudioHome from "@/assets/tpl-foodstudio-home.png";
import royaloakHome from "@/assets/tpl-royaloak-home.png";

type Template = {
  id: string;
  name: string;
  category: string;
  liveUrl: string;
  cover: string;
  desc: string;
  /** Multi-section preview frames — each acts like a distinct screen of the site */
  frames: { src: string; label: string }[];
  domain: string;
};

const templates: Template[] = [
  {
    id: "coffee-bar-collective",
    name: "The Coffee Bar Collective",
    category: "Hospitality / Specialty Coffee",
    liveUrl: "https://baab29de-5391-498e-9686-8e653642df1c.lovableproject.com/",
    cover: coffeeHero,
    desc: "A live client build for a Birmingham specialty coffee house — full-bleed photography, animated menu, and a considered visit experience.",
    frames: [
      { src: coffeeHero, label: "home" },
      { src: coffeeMenu, label: "menu" },
      { src: coffeeStore, label: "visit" },
    ],
    domain: "thecoffeebarcollective.co.uk",
  },
  {
    id: "food-studio",
    name: "The Food Studio",
    category: "Hospitality / Restaurant",
    liveUrl: "#",
    cover: foodstudioHome,
    desc: "An editorial restaurant template — generous typography, art-directed plates, and a quiet booking flow.",
    frames: [
      { src: foodstudioHome, label: "home" },
      { src: tpl3, label: "menu" },
      { src: tpl1, label: "reservations" },
    ],
    domain: "thefoodstudio.co",
  },
  {
    id: "royal-oak",
    name: "Royal Oak CC",
    category: "Sports / Members Club",
    liveUrl: "#",
    cover: royaloakHome,
    desc: "A members-club template built for fixtures, news and a clean members area. Crest-led, cricket-clean.",
    frames: [
      { src: royaloakHome, label: "home" },
      { src: tpl2, label: "fixtures" },
      { src: tpl1, label: "members" },
    ],
    domain: "royaloakcc.co.uk",
  },
  {
    id: "atelier",
    name: "Atelier",
    category: "Fashion / Editorial",
    liveUrl: "#",
    cover: tpl1,
    desc: "An editorial template for fashion and lifestyle brands. Built for storytelling, lookbooks, and bookings.",
    frames: [
      { src: tpl1, label: "home" },
      { src: tpl2, label: "lookbook" },
      { src: tpl3, label: "journal" },
    ],
    domain: "atelier.studio",
  },
];

const Work = () => {
  return (
    <>
      <PageHero
        eyebrow="Work — Templates & Projects"
        titleSerif="Templates"
        titleSans="& Projects"
        intro="Fully built, live websites available to license or customise. Each template is production-ready, fully responsive, and lovingly crafted."
        variant="topo"
      />

      <section className="relative pb-20 overflow-hidden">
        <LineArt variant="grid" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10 space-y-28">
          {templates.map((t, idx) => (
            <TemplateGallery key={t.id} template={t} index={idx} />
          ))}

          {/* ============= Bespoke section — restyled ============= */}
          <BespokeBlock />
        </div>
      </section>
    </>
  );
};

/* =================== Per-template gallery: big preview + 3 thumb pages =================== */
const TemplateGallery = ({ template, index }: { template: Template; index: number }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="relative"
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-brand-blue">/ {String(index + 1).padStart(2, "0")} — Template</p>
          <h2 className="display-serif text-3xl lg:text-5xl text-blue-deep tracking-tight mt-1">
            {template.name}
          </h2>
          <p className="mono text-faint mt-1">{template.category}</p>
          <p className="mt-3 max-w-2xl text-ink/65 leading-relaxed">{template.desc}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={template.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-hairline hover:border-brand-blue hover:text-brand-blue-deep transition-colors text-sm"
          >
            Visit live site <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link
            to="/contact"
            state={{ plan: template.name }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-blue-deep text-background hover:bg-brand-gold hover:text-brand-blue-deep transition-colors text-sm"
          >
            Use this template →
          </Link>
        </div>
      </div>

      {/* Big live-scrolling preview of currently-selected page */}
      <BigPreview
        key={`${template.id}-${activeIndex}`}
        template={template}
        speed={32}
        activeIndex={activeIndex}
        onPick={setActiveIndex}
      />

      {/* 3-4 smaller "page" thumbnails — faster scroll */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {template.frames.map((f, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={f.label + i}
              onClick={() => setActiveIndex(i)}
              className={`group text-left rounded-xl overflow-hidden border transition-all ${
                isActive
                  ? "border-brand-blue-deep shadow-[0_18px_40px_-18px_hsl(var(--brand-blue-deep)/0.45)]"
                  : "border-hairline hover:border-brand-blue/50"
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                <ThumbScroller src={f.src} active={isActive} />
                <span className="absolute top-2 left-2 mono text-[0.55rem] glass-blue text-background rounded-full px-2 py-1">
                  /{f.label}
                </span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between bg-background">
                <p className="display-sans text-sm text-blue-deep capitalize">{f.label}</p>
                <ArrowUpRight className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-brand-gold" : "text-brand-blue/60"}`} />
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};


/* =================== Big auto-scrolling hero preview =================== */
const BigPreview = ({
  template,
  speed,
  activeIndex: controlledIndex,
  onPick,
}: {
  template: Template;
  speed: number;
  activeIndex?: number;
  onPick?: (i: number) => void;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const [paused, setPaused] = useState(false);
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex ?? internalIndex;
  const setActiveIndex = (i: number | ((p: number) => number)) => {
    const next = typeof i === "function" ? (i as (p: number) => number)(activeIndex) : i;
    if (onPick) onPick(next);
    else setInternalIndex(next);
  };

  useAnimationFrame((_, delta) => {
    if (!trackRef.current || paused) return;
    const max = trackRef.current.scrollHeight - trackRef.current.clientHeight;
    if (max <= 0) return;
    offset.current += (delta / 1000) * speed;
    if (offset.current >= max + 60) {
      offset.current = 0;
      setActiveIndex((i) => (i + 1) % template.frames.length);
      return;
    }
    trackRef.current.scrollTop = Math.max(0, offset.current);
  });

  useEffect(() => { offset.current = 0; if (trackRef.current) trackRef.current.scrollTop = 0; }, [activeIndex]);

  const frame = template.frames[activeIndex];

  return (
    <div
      className="relative rounded-2xl overflow-hidden ring-1 ring-hairline bg-background shadow-[0_30px_80px_-20px_hsl(var(--brand-blue-deep)/0.35)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-hairline bg-paper">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gold-soft" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
        </div>
        <div className="ml-2 flex items-center gap-1">
          {template.frames.map((f, i) => (
            <button
              key={f.label + i}
              onClick={() => setActiveIndex(i)}
              className={`mono text-[0.6rem] px-3 py-1 rounded-t-md transition-colors whitespace-nowrap ${
                i === activeIndex
                  ? "bg-background text-brand-blue-deep border-t border-x border-hairline"
                  : "text-ink/50 hover:text-brand-blue-deep"
              }`}
            >
              /{f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 bg-background border border-hairline rounded-full px-3 py-1 mono text-[0.6rem] text-faint min-w-0 max-w-[40%]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
          <span className="truncate">{template.domain}/{frame.label}</span>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play" : "Pause"}
          className="h-7 w-7 grid place-items-center rounded-full hover:bg-brand-blue-soft text-brand-blue-deep transition-colors"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => { offset.current = 0; if (trackRef.current) trackRef.current.scrollTop = 0; }}
          aria-label="Restart"
          className="h-7 w-7 grid place-items-center rounded-full hover:bg-brand-blue-soft text-brand-blue-deep transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div ref={trackRef} className="h-[560px] lg:h-[640px] overflow-hidden bg-background" style={{ scrollBehavior: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={frame.label + activeIndex}
            src={frame.src}
            alt={`${template.name} — ${frame.label}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full block select-none"
            draggable={false}
            loading="lazy"
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

/* =================== Thumbnail mini auto-scroller (faster) =================== */
const ThumbScroller = ({ src, active }: { src: string; active: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const off = useRef(0);

  useAnimationFrame((_, delta) => {
    if (!ref.current) return;
    const max = ref.current.scrollHeight - ref.current.clientHeight;
    if (max <= 0) return;
    // Faster than the big preview
    off.current += (delta / 1000) * (active ? 80 : 55);
    if (off.current > max) off.current = 0;
    ref.current.scrollTop = off.current;
  });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <img src={src} alt="" className="w-full block" loading="lazy" />
    </div>
  );
};

/* =================== Restyled Bespoke block =================== */
const BespokeBlock = () => (
  <div className="mt-32 relative">
    <div className="relative grid lg:grid-cols-12 gap-10 items-stretch rounded-3xl overflow-hidden border border-hairline bg-gradient-to-br from-paper via-background to-paper p-8 lg:p-12">
      {/* Decorative line-art */}
      <svg
        aria-hidden
        viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full text-brand-blue/10 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="currentColor" strokeWidth="0.6">
          <circle cx="700" cy="80" r="220" />
          <circle cx="700" cy="80" r="140" />
          <path d="M 0 320 Q 300 280 500 340 T 800 300" />
          <line x1="0" y1="200" x2="800" y2="120" strokeOpacity="0.4" />
        </g>
      </svg>

      <div className="relative lg:col-span-7 flex flex-col justify-center">
        <p className="mono text-brand-blue">/ Beyond templates</p>
        <h2 className="display-sans text-4xl lg:text-6xl tracking-tighter leading-[0.95] mt-4 text-blue-deep">
          Need something <span className="display-serif italic text-brand-blue">bespoke?</span>
        </h2>
        <p className="mt-6 text-ink/65 leading-relaxed max-w-lg">
          Every template here can be fully customised, or I can design something entirely new from scratch.
          Either way — built by hand, optimised to the millisecond, and shipped with care.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-blue-deep text-background hover:bg-brand-gold hover:text-brand-blue-deep transition-colors group"
          >
            Start a brief
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link to="/services" className="ink-underline text-blue-deep inline-flex items-center gap-2">
            See services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative lg:col-span-5 grid grid-cols-2 gap-3">
        {[
          ["End-to-end", "Design + build, one studio"],
          ["A11Y", "WCAG AA+ by default"],
          ["100/100", "Lighthouse target"],
          ["<1.5s", "First paint average"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="rounded-xl border border-hairline bg-background/80 backdrop-blur-sm p-5 hover:border-brand-blue/40 transition-colors"
          >
            <p className="display-sans text-2xl lg:text-3xl tracking-tighter text-brand-blue-deep">{k}</p>
            <p className="mono text-faint mt-2 text-[0.6rem]">{v}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* =================== Existing complex preview (kept as the per-card live frame) =================== */
const ComplexPreview = ({ frames, domain }: { frames: { src: string; label: string }[]; domain: string }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const switchTo = (i: number) => {
    if (i === activeIndex) return;
    setIsLoading(true);
    offset.current = 0;
    if (trackRef.current) trackRef.current.scrollTop = 0;
    setTimeout(() => {
      setActiveIndex(i);
      setTimeout(() => setIsLoading(false), 250);
    }, 200);
  };

  useAnimationFrame((_, delta) => {
    if (!trackRef.current || paused || isLoading) return;
    const max = trackRef.current.scrollHeight - trackRef.current.clientHeight;
    if (max <= 0) return;
    offset.current += (delta / 1000) * 28;
    if (offset.current >= max + 80) {
      const next = (activeIndex + 1) % frames.length;
      switchTo(next);
      return;
    }
    trackRef.current.scrollTop = Math.max(0, offset.current);
  });

  useEffect(() => { offset.current = 0; }, [activeIndex]);

  const activeFrame = frames[activeIndex];

  return (
    <div className="relative rounded-xl overflow-hidden ring-1 ring-hairline bg-background shadow-2xl">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-hairline bg-paper">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gold-soft" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
        </div>
        <div className="flex items-center gap-1 ml-2 overflow-x-auto">
          {frames.map((f, i) => (
            <button
              key={f.label + i}
              onClick={() => switchTo(i)}
              className={`mono text-[0.6rem] px-3 py-1 rounded-t-md transition-colors whitespace-nowrap ${
                i === activeIndex
                  ? "bg-background text-brand-blue-deep border-t border-x border-hairline"
                  : "text-ink/50 hover:text-brand-blue-deep"
              }`}
            >
              /{f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 bg-background border border-hairline rounded-full px-3 py-1 mono text-[0.6rem] text-faint min-w-0 max-w-[40%]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
          <span className="truncate">{domain}/{activeFrame.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"} className="h-7 w-7 grid place-items-center rounded-full hover:bg-brand-blue-soft text-brand-blue-deep transition-colors">
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => { offset.current = 0; if (trackRef.current) trackRef.current.scrollTop = 0; }} aria-label="Restart" className="h-7 w-7 grid place-items-center rounded-full hover:bg-brand-blue-soft text-brand-blue-deep transition-colors">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative h-0.5 bg-paper overflow-hidden">
        <AnimatePresence>
          {isLoading && (
            <motion.div key="loader" initial={{ width: "0%" }} animate={{ width: "100%" }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="absolute inset-y-0 left-0 bg-brand-gold" />
          )}
        </AnimatePresence>
      </div>

      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} ref={trackRef} className="h-[440px] lg:h-[520px] overflow-hidden relative bg-background" style={{ scrollBehavior: "auto" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeFrame.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <img src={activeFrame.src} alt={activeFrame.label} className="w-full block select-none" draggable={false} loading="lazy" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-4 py-2 mono text-faint text-[0.6rem] border-t border-hairline flex items-center justify-between">
        <span>{paused ? "/ paused — hover off to resume" : isLoading ? "/ loading next page…" : "/ auto-scrolling"}</span>
        <span>{activeIndex + 1} / {frames.length}</span>
      </div>
    </div>
  );
};

export default Work;
