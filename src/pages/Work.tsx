import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "framer-motion";
import { ExternalLink, RotateCcw, Pause, Play, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
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

type Frame = { src: string; label: string };

type Template = {
  id: string;
  name: string;
  category: string;
  liveUrl: string;
  cover: string;
  desc: string;
  frames: Frame[];
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

/* =================== Lightbox =================== */
const Lightbox = ({ src, label, onClose }: { src: string; label: string; onClose: () => void }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-10 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between bg-paper rounded-t-2xl px-4 py-2 border-b border-hairline">
            <span className="mono text-faint text-[0.6rem]">/{label}</span>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-brand-blue-soft text-brand-blue-deep transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <img
            src={src}
            alt={label}
            className="w-full block rounded-b-2xl shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* =================== Big scrolling preview with arrow navigation =================== */
const BigPreview = ({
  template,
  activeIndex,
  onPrev,
  onNext,
  onPickIndex,
}: {
  template: Template;
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onPickIndex: (i: number) => void;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const [paused, setPaused] = useState(false);
  const frame = template.frames[activeIndex];

  // Reset scroll when frame changes
  useEffect(() => {
    offset.current = 0;
    if (trackRef.current) trackRef.current.scrollTop = 0;
  }, [activeIndex]);

  useAnimationFrame((_, delta) => {
    if (!trackRef.current || paused) return;
    const max = trackRef.current.scrollHeight - trackRef.current.clientHeight;
    if (max <= 0) return;
    offset.current += (delta / 1000) * 32;
    if (offset.current >= max + 60) {
      offset.current = max;
      return;
    }
    trackRef.current.scrollTop = Math.max(0, offset.current);
  });

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
        {/* Tab strip */}
        <div className="ml-2 flex items-center gap-1">
          {template.frames.map((f, i) => (
            <button
              key={f.label + i}
              onClick={() => onPickIndex(i)}
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
        {/* URL pill */}
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

      {/* Scrolling image */}
      <div
        ref={trackRef}
        className="h-[560px] lg:h-[680px] overflow-hidden bg-background relative"
        style={{ scrollBehavior: "auto" }}
      >
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

      {/* Left / right arrows */}
      <button
        onClick={onPrev}
        aria-label="Previous page"
        className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur border border-hairline hover:border-brand-blue hover:text-brand-blue-deep text-ink/60 transition-all shadow-md"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={onNext}
        aria-label="Next page"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/80 backdrop-blur border border-hairline hover:border-brand-blue hover:text-brand-blue-deep text-ink/60 transition-all shadow-md"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Page indicator dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {template.frames.map((_, i) => (
          <button
            key={i}
            onClick={() => onPickIndex(i)}
            className={`rounded-full transition-all ${
              i === activeIndex
                ? "h-2 w-5 bg-brand-blue-deep"
                : "h-2 w-2 bg-background/60 border border-hairline hover:bg-brand-blue/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/* =================== Static thumbnail with lightbox =================== */
const StaticThumb = ({ frame, templateName }: { frame: Frame; templateName: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group text-left rounded-xl overflow-hidden border border-hairline hover:border-brand-blue/50 transition-all"
        aria-label={`View ${frame.label} page`}
      >
        <div className="relative aspect-[9/16] sm:aspect-[3/4] overflow-hidden bg-paper">
          <img
            src={frame.src}
            alt={`${templateName} — ${frame.label}`}
            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay hint */}
          <div className="absolute inset-0 bg-brand-blue-deep/0 group-hover:bg-brand-blue-deep/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 backdrop-blur rounded-full px-4 py-2 mono text-[0.65rem] text-brand-blue-deep flex items-center gap-1.5">
              View full page <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <span className="absolute top-2 left-2 mono text-[0.55rem] bg-brand-blue-deep/80 backdrop-blur text-background rounded-full px-2 py-1">
            /{frame.label}
          </span>
        </div>
        <div className="px-4 py-2.5 flex items-center justify-between bg-background">
          <p className="display-sans text-sm text-blue-deep capitalize">{frame.label}</p>
          <ArrowUpRight className="h-4 w-4 text-brand-blue/60 group-hover:text-brand-gold transition-colors" />
        </div>
      </button>

      {open && (
        <Lightbox src={frame.src} label={frame.label} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

/* =================== Per-template section =================== */
const TemplateGallery = ({ template, index }: { template: Template; index: number }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + template.frames.length) % template.frames.length);
  const next = () => setActiveIndex((i) => (i + 1) % template.frames.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
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
        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Big scrolling preview */}
      <BigPreview
        template={template}
        activeIndex={activeIndex}
        onPrev={prev}
        onNext={next}
        onPickIndex={setActiveIndex}
      />

      {/* Static thumbnail row — click to lightbox */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {template.frames.map((f) => (
          <StaticThumb key={f.label} frame={f} templateName={template.name} />
        ))}
      </div>
    </motion.div>
  );
};

/* =================== Bespoke block =================== */
const BespokeBlock = () => (
  <div className="mt-32 relative">
    <div className="relative grid lg:grid-cols-12 gap-10 items-stretch rounded-3xl overflow-hidden border border-hairline bg-gradient-to-br from-paper via-background to-paper p-8 lg:p-12">
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

/* =================== Page =================== */
const Work = () => (
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
        <BespokeBlock />
      </div>
    </section>
  </>
);

export default Work;