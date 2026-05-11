import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, RotateCcw, Pause, Play,
  ArrowUpRight, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";

import coffeeHome from "@/assets/CoffeeCoHome.png";
import coffeeMenu from "@/assets/CoffeeCoMenu.png";
import coffeeVisit from "@/assets/CoffeeCoVisit.png";
import coffeeGallery from "@/assets/CoffeeCoGallery.png";

import cherryHome from "@/assets/CherryRedHome.png";
import cherryMenu from "@/assets/CherryRedMenu.png";
import cherryEvents from "@/assets/CherryRedEvents.png";
import cherryRooms from "@/assets/CherryRedRooms.png";

import foxHome from "@/assets/FoxHome.png";
import foxMenu from "@/assets/FoxMenu.png";
import foxGallery from "@/assets/FoxGallery.png";
import foxContact from "@/assets/FoxContact.png";

import GCKhome from "@/assets/GCKHome.png";
import GCKgallery from "@/assets/GCKGallery.png";
import GCKstory from "@/assets/GCKStory.png";
import GCKvisit from "@/assets/GCKVisit.png";

type Frame = { src: string; label: string };
type Project = {
  id: string;
  name: string;
  category: string;
  liveUrl: string;
  desc: string;
  frames: Frame[];
  domain: string;
};

const projects: Project[] = [
  {
    id: "coffee-bar-collective",
    name: "The Coffee Bar Collective",
    category: "Hospitality / Specialty Coffee",
    liveUrl: "https://willg06.github.io/CoffeeBarCo/",
    desc: "A bespoke build for a Birmingham specialty coffee house, full-bleed photography, animated menu, and a considered visit experience.",
    frames: [
      { src: coffeeHome, label: "home" },
      { src: coffeeMenu, label: "menu" },
      { src: coffeeGallery, label: "gallery" },
      { src: coffeeVisit, label: "visit" },
    ],
    domain: "thecoffeebarcollective.co.uk",
  },
  {
    id: "cherry-reds",
    name: "Cherry Reds",
    category: "Hospitality / Bar & Kitchen",
    liveUrl: "https://willg06.github.io/CherryReds/",
    desc: "An editorial bar and kitchen site, bold typography, art-directed photography.",
    frames: [
      { src: cherryHome, label: "home" },
      { src: cherryMenu, label: "menu" },
      { src: cherryEvents, label: "events" },
      { src: cherryRooms, label: "reservations" },
    ],
    domain: "cherryreds.com",
  },
  {
    id: "the-sly-old-fox",
    name: "The Sly Old Fox",
    category: "Hospitality / Pub",
    liveUrl: "https://willg06.github.io/TheSlyOldFox/",
    desc: "A characterful pub site, warm, welcoming, and built around food, drink and community.",
    frames: [
      { src: foxHome, label: "home" },
      { src: foxMenu, label: "food" },
      { src: foxGallery, label: "gallery" },
      { src: foxContact, label: "contact" },
    ],
    domain: "theslyoldfox.co.uk",
  },
  {
    id: "grand-central-kitchen",
    name: "Grand Central Kitchen",
    category: "Hospitality / Restaurant",
    liveUrl: "https://willg06.github.io/GrandCentralKitchen/",
    desc: "A refined restaurant site built for storytelling, menus, and table bookings — designed to feel as good as the food.",
    frames: [
      { src: GCKhome, label: "home" },
      { src: GCKgallery, label: "menu" },
      { src: GCKvisit, label: "visit" },
      { src: GCKstory, label: "story" },
    ],
    domain: "grandcentralkitchen.co.uk",
  },
];

/* ─── Lightbox ─────────────────────────────────────────────────────────── */
const Lightbox = ({ src, label, onClose }: { src: string; label: string; onClose: () => void }) => {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 lg:p-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.97, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-4xl flex flex-col rounded-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
          style={{ maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-2.5 bg-paper border-b border-hairline shrink-0">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-gold-soft" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
            </div>
            <div className="flex items-center gap-1.5 bg-background border border-hairline rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
              <span className="mono text-[0.6rem] text-faint">/{label}</span>
            </div>
            <button onClick={onClose} aria-label="Close"
              className="ml-auto h-7 w-7 grid place-items-center rounded-full hover:bg-red-100 hover:text-red-600 text-ink/50 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-y-auto overflow-x-hidden flex-1 bg-background">
            <img src={src} alt={label} className="w-full block select-none" draggable={false} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Shared scroll preview hook ──────────────────────────────────────── */
const useScrollPreview = (activeIndex: number) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollPos = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const stopRaf = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  const reset = useCallback(() => {
    stopRaf();
    setPlaying(false);
    setProgress(0);
    scrollPos.current = 0;
    if (trackRef.current) trackRef.current.scrollTop = 0;
  }, [stopRaf]);

  useEffect(() => { reset(); }, [activeIndex, reset]);

  useEffect(() => {
    if (!playing) { stopRaf(); return; }

    let last = 0;
    const step = (ts: number) => {
      if (!trackRef.current) return;
      // throttle to ~30fps for performance
      if (ts - last < 32) { rafRef.current = requestAnimationFrame(step); return; }
      last = ts;
      const el = trackRef.current;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) { reset(); return; }
      scrollPos.current = Math.min(scrollPos.current + 2.2, max);
      el.scrollTop = scrollPos.current;
      setProgress(scrollPos.current / max);
      if (scrollPos.current >= max) { stopRaf(); setPlaying(false); return; }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return stopRaf;
  }, [playing, stopRaf, reset]);

  useEffect(() => {
    const h = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  return { trackRef, playing, setPlaying, progress, reset };
};

/* ─── Desktop: full-width scroll preview ──────────────────────────────── */
const DesktopPreview = ({
  project, activeIndex, onPrev, onNext, onPickIndex,
}: {
  project: Project; activeIndex: number;
  onPrev: () => void; onNext: () => void; onPickIndex: (i: number) => void;
}) => {
  const { trackRef, playing, setPlaying, progress, reset } = useScrollPreview(activeIndex);
  const frame = project.frames[activeIndex];

  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-hairline bg-background shadow-[0_30px_80px_-20px_hsl(var(--brand-blue-deep)/0.35)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-paper">
        <div className="flex gap-1.5 shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gold-soft" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-blue-soft" />
        </div>
        <div className="ml-2 flex items-center gap-1 overflow-x-auto">
          {project.frames.map((f, i) => (
            <button key={f.label} onClick={() => onPickIndex(i)}
              className={`mono text-[0.6rem] px-3 py-1 rounded-t-md transition-colors whitespace-nowrap shrink-0 ${
                i === activeIndex
                  ? "bg-background text-brand-blue-deep border-t border-x border-hairline"
                  : "text-ink/50 hover:text-brand-blue-deep"
              }`}>
              /{f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 bg-background border border-hairline rounded-full px-3 py-1 mono text-[0.6rem] text-faint min-w-0 max-w-[35%] shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shrink-0" />
          <span className="truncate">{project.domain}/{frame.label}</span>
        </div>
        {playing && (
          <button onClick={() => setPlaying(false)} aria-label="Pause"
            className="h-7 w-7 shrink-0 grid place-items-center rounded-full hover:bg-brand-blue-soft text-brand-blue-deep transition-colors">
            <Pause className="h-3.5 w-3.5" />
          </button>
        )}
        <button onClick={reset} aria-label="Restart"
          className="h-7 w-7 shrink-0 grid place-items-center rounded-full hover:bg-brand-blue-soft text-brand-blue-deep transition-colors">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Viewport */}
      <div className="relative">
        {/* GPU layer hint on scroll container */}
        <div
          ref={trackRef}
          className="h-[560px] lg:h-[680px] overflow-hidden"
          style={{ scrollBehavior: "auto", transform: "translateZ(0)" }}
        >
          <img
            key={`${project.id}-${activeIndex}`}
            src={frame.src}
            alt={`${project.name} — ${frame.label}`}
            className="w-full block select-none"
            draggable={false}
            loading="lazy"
          />
        </div>

        {/* Play overlay — no backdrop-blur for perf */}
        {!playing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-blue-deep/20">
            <button onClick={() => setPlaying(true)} aria-label="Play scroll preview"
              className="group flex flex-col items-center gap-3">
              <span className="h-16 w-16 rounded-full bg-background/95 shadow-lg grid place-items-center group-hover:scale-110 group-hover:bg-brand-blue-deep group-hover:text-background text-brand-blue-deep transition-all duration-200">
                <Play className="h-6 w-6 translate-x-0.5" />
              </span>
              <span className="mono text-[0.65rem] text-background bg-brand-blue-deep/90 rounded-full px-3 py-1">
                Preview scroll
              </span>
            </button>
          </div>
        )}

        <button onClick={onPrev} aria-label="Previous page"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/85 border border-hairline hover:border-brand-blue hover:text-brand-blue-deep text-ink/60 transition-all shadow-md">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={onNext} aria-label="Next page"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 grid place-items-center rounded-full bg-background/85 border border-hairline hover:border-brand-blue hover:text-brand-blue-deep text-ink/60 transition-all shadow-md">
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {project.frames.map((_, i) => (
            <button key={i} onClick={() => onPickIndex(i)}
              className={`rounded-full transition-all ${
                i === activeIndex ? "h-2 w-5 bg-brand-blue-deep" : "h-2 w-2 bg-background/70 border border-hairline hover:bg-brand-blue/40"
              }`} />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-hairline">
        <div className="h-full bg-brand-gold" style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }} />
      </div>
    </div>
  );
};

/* ─── Mobile: compact scroll preview card ─────────────────────────────── */
const MobilePreviewCard = ({ project }: { project: Project }) => {
  const { trackRef, playing, setPlaying, progress, reset } = useScrollPreview(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const frame = project.frames[0];

  return (
    <>
      <div className="rounded-xl overflow-hidden border border-hairline bg-background">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-paper border-b border-hairline">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-brand-blue-soft" />
            <span className="h-2 w-2 rounded-full bg-brand-gold-soft" />
            <span className="h-2 w-2 rounded-full bg-brand-blue-soft" />
          </div>
          <span className="mono text-[0.5rem] text-faint truncate ml-1">{project.domain}/home</span>
          {playing && (
            <button onClick={() => setPlaying(false)} aria-label="Pause"
              className="ml-auto h-5 w-5 grid place-items-center rounded-full text-brand-blue-deep">
              <Pause className="h-3 w-3" />
            </button>
          )}
          <button onClick={reset} aria-label="Restart"
            className={`h-5 w-5 grid place-items-center rounded-full text-brand-blue-deep ${playing ? "" : "ml-auto"}`}>
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        <div className="relative aspect-[3/4] overflow-hidden bg-paper">
          <div ref={trackRef} className="absolute inset-0 overflow-hidden" style={{ scrollBehavior: "auto", transform: "translateZ(0)" }}>
            <img src={frame.src} alt={`${project.name} — home`}
              className="w-full block select-none" draggable={false} loading="lazy" />
          </div>

          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-blue-deep/20">
              <button onClick={() => setPlaying(true)} aria-label="Play scroll preview"
                className="group flex flex-col items-center gap-2">
                <span className="h-11 w-11 rounded-full bg-background/95 shadow-lg grid place-items-center group-hover:scale-110 group-hover:bg-brand-blue-deep group-hover:text-background text-brand-blue-deep transition-all duration-200">
                  <Play className="h-4 w-4 translate-x-0.5" />
                </span>
                <span className="mono text-[0.55rem] text-background bg-brand-blue-deep/90 rounded-full px-2.5 py-0.5">
                  Preview scroll
                </span>
              </button>
            </div>
          )}

          <span className="absolute top-2 left-2 mono text-[0.5rem] bg-brand-blue-deep/80 text-background rounded-full px-2 py-0.5">
            /home
          </span>
        </div>

        <div className="h-0.5 bg-hairline">
          <div className="h-full bg-brand-gold" style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }} />
        </div>

        <div className="px-3 py-2 flex items-center justify-between bg-background">
          <p className="display-sans text-sm text-blue-deep capitalize">Home</p>
          <button onClick={() => setLightboxOpen(true)} aria-label="View full page"
            className="h-6 w-6 grid place-items-center text-brand-blue/60 hover:text-brand-gold transition-colors">
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox src={frame.src} label="home" onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
};

/* ─── Static thumbnail with lightbox ──────────────────────────────────── */
const StaticThumb = ({ frame, projectName }: { frame: Frame; projectName: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="group text-left rounded-xl overflow-hidden border border-hairline hover:border-brand-blue/50 transition-all"
        aria-label={`View ${frame.label} page`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-paper">
          <img src={frame.src} alt={`${projectName} — ${frame.label}`}
            className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy" />
          <div className="absolute inset-0 bg-brand-blue-deep/0 group-hover:bg-brand-blue-deep/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 rounded-full px-3 py-1.5 mono text-[0.6rem] text-brand-blue-deep flex items-center gap-1">
              View full page <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <span className="absolute top-2 left-2 mono text-[0.5rem] bg-brand-blue-deep/80 text-background rounded-full px-2 py-0.5">
            /{frame.label}
          </span>
        </div>
        <div className="px-3 py-2 flex items-center justify-between bg-background">
          <p className="display-sans text-sm text-blue-deep capitalize">{frame.label}</p>
          <ArrowUpRight className="h-4 w-4 text-brand-blue/60 group-hover:text-brand-gold transition-colors" />
        </div>
      </button>
      {open && <Lightbox src={frame.src} label={frame.label} onClose={() => setOpen(false)} />}
    </>
  );
};

/* ─── Project section ──────────────────────────────────────────────────── */
const ProjectGallery = ({ project, index }: { project: Project; index: number }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prev = () => setActiveIndex((i) => (i - 1 + project.frames.length) % project.frames.length);
  const next = () => setActiveIndex((i) => (i + 1) % project.frames.length);

  // All frames except home for thumbnail rows
  const thumbFrames = project.frames.filter((f) => f.label !== "home");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.45, delay: index * 0.03 }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-brand-blue">/ {String(index + 1).padStart(2, "0")} — Project</p>
          <h2 className="display-serif text-3xl lg:text-5xl text-blue-deep tracking-tight mt-1">
            {project.name}
          </h2>
          <p className="mono text-faint mt-1">{project.category}</p>
          <p className="mt-3 max-w-2xl text-ink/65 leading-relaxed">{project.desc}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-hairline hover:border-brand-blue hover:text-brand-blue-deep transition-colors text-sm">
            Visit live site <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link to="/contact" state={{ plan: project.name }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-blue-deep text-background hover:bg-brand-gold hover:text-brand-blue-deep transition-colors text-sm">
            Start a project like this →
          </Link>
        </div>
      </div>

      {/* ── Mobile 2×2 grid ── */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        <MobilePreviewCard project={project} />
        {thumbFrames.map((f, i) => (
          <StaticThumb key={`mob-${project.id}-${f.label}-${i}`} frame={f} projectName={project.name} />
        ))}
      </div>

      {/* ── Desktop: large preview + 3 thumbs below ── */}
      <div className="hidden lg:block space-y-5">
        {/* Full-width large preview */}
        <DesktopPreview
          project={project}
          activeIndex={activeIndex}
          onPrev={prev}
          onNext={next}
          onPickIndex={setActiveIndex}
        />
        {/* 3 thumbnails in a row below */}
        <div className="grid grid-cols-3 gap-5">
          {thumbFrames.map((f, i) => (
            <StaticThumb key={`desk-${project.id}-${f.label}-${i}`} frame={f} projectName={project.name} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Bespoke block ────────────────────────────────────────────────────── */
const BespokeBlock = () => (
  <div className="mt-32 relative">
    <div className="relative grid lg:grid-cols-12 gap-10 items-stretch rounded-3xl overflow-hidden border border-hairline bg-gradient-to-br from-paper via-background to-paper p-8 lg:p-12">
      <svg aria-hidden viewBox="0 0 800 400"
        className="absolute inset-0 w-full h-full text-brand-blue/10 pointer-events-none"
        preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" strokeWidth="0.6">
          <circle cx="700" cy="80" r="220" />
          <circle cx="700" cy="80" r="140" />
          <path d="M 0 320 Q 300 280 500 340 T 800 300" />
          <line x1="0" y1="200" x2="800" y2="120" strokeOpacity="0.4" />
        </g>
      </svg>
      <div className="relative lg:col-span-7 flex flex-col justify-center">
        <p className="mono text-brand-blue">/ Your project</p>
        <h2 className="display-sans text-4xl lg:text-6xl tracking-tighter leading-[0.95] mt-4 text-blue-deep">
          Ready for something{" "}
          <span className="display-serif italic text-brand-blue">bespoke?</span>
        </h2>
        <p className="mt-6 text-ink/65 leading-relaxed max-w-lg">
          Every project is designed and built from scratch, tailored entirely to your brand, your
          audience, and your goals. No templates, no shortcuts. Built by hand, optimised to the
          millisecond, and shipped with care.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-blue-deep text-background hover:bg-brand-gold hover:text-brand-blue-deep transition-colors group">
            Start a brief <span className="transition-transform group-hover:translate-x-0.5">→</span>
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
          <div key={k}
            className="rounded-xl border border-hairline bg-background/80 p-5 hover:border-brand-blue/40 transition-colors">
            <p className="display-sans text-2xl lg:text-3xl tracking-tighter text-brand-blue-deep">{k}</p>
            <p className="mono text-faint mt-2 text-[0.6rem]">{v}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Page ─────────────────────────────────────────────────────────────── */
const Work = () => (
  <>
    <PageHero
      eyebrow="Work — Projects"
      titleSerif="Projects"
      titleSans="& Work"
      intro="Fully built, live websites, each one designed and developed from scratch, unique to the client. Responsive, fast, and crafted with care."
      variant="topo"
    />
    <section className="relative pb-20 overflow-hidden">
      <LineArt variant="grid" />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10 space-y-28">
        {projects.map((p, idx) => (
          <ProjectGallery key={p.id} project={p} index={idx} />
        ))}
        <BespokeBlock />
      </div>
    </section>
  </>
);

export default Work;