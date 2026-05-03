import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, Mail, Instagram } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

type NavItem = {
  label: string;
  to: string;
  blurb: string;
  bullets: string[];
};

const links: NavItem[] = [
  {
    label: "Work",
    to: "/work",
    blurb: "Bespoke projects — production-ready, fully responsive, lovingly crafted.",
    bullets: ["Bespoke client builds", "Live, interactive previews", "Birmingham & beyond"],
  },
  {
    label: "Services",
    to: "/services",
    blurb: "Design, development, branding, e-commerce and SEO under one roof.",
    bullets: ["Web design & dev", "Brand & identity", "E-commerce & SEO"],
  },
  {
    label: "About",
    to: "/about",
    blurb: "A Birmingham-based studio of one. Obsessive about the details.",
    bullets: ["Studio of one", "07+ years building", "Considered process"],
  },
  {
    label: "Pricing",
    to: "/pricing",
    blurb: "Free quote, then pay in full or split it across 6–12 months.",
    bullets: ["Free quote, no commitment", "Pay-in-full or 50% deposit", "Maintenance & domain plans"],
  },
  {
    label: "Contact",
    to: "/contact",
    blurb: "Start a project, license a template, or just say hello.",
    bullets: ["Reply within 24h", "Birmingham, UK", "Worldwide projects"],
  },
];

export const Nav = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setHovered(null); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const hoveredItem = links.find((l) => l.label === hovered);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
        className={`fixed top-0 inset-x-0 z-[55] transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 flex items-center justify-between">
          <Logo invert={!!hoveredItem} />

          <nav className="hidden md:flex items-center gap-1 glass-light rounded-full px-2 py-2 shadow-sm">
            {links.map((l) => (
              <div key={l.label} className="relative" onMouseEnter={() => setHovered(l.label)}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `relative inline-flex items-center gap-2 px-4 py-2 text-sm transition-all rounded-full ${
                      isActive
                        ? "text-background bg-brand-blue-deep"
                        : hovered === l.label
                          ? "text-brand-blue-deep bg-brand-blue-soft"
                          : "text-ink/60 hover:text-brand-blue-deep"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span layoutId="active-dot" className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                      )}
                      {l.label}
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </nav>

          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm rounded-full bg-brand-blue-deep text-background hover:bg-brand-gold hover:text-brand-blue-deep transition-colors group"
          >
            Start a project
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden h-10 w-10 grid place-items-center glass-light rounded-full"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      {/* Desktop hover overlay */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key="nav-preview"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="fixed top-0 inset-x-0 z-[54] pointer-events-none"
            onMouseEnter={() => setHovered(hoveredItem.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="glass-blue pointer-events-auto pt-24 pb-10 overflow-hidden relative">
              <svg aria-hidden className="absolute inset-0 w-full h-full text-brand-gold/20" viewBox="0 0 1440 240" preserveAspectRatio="none">
                <g fill="none" stroke="currentColor" strokeWidth="0.6">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <motion.path
                      key={i}
                      d={`M 0 ${30 + i * 26} Q 360 ${10 + i * 26} 720 ${50 + i * 26} T 1440 ${20 + i * 26}`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: i * 0.06 }}
                    />
                  ))}
                </g>
              </svg>
              <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-2">
                  <p className="mono text-brand-gold/80">/ {String(links.indexOf(hoveredItem) + 1).padStart(2, "0")}</p>
                  <p className="mono text-background/50 mt-2">Page</p>
                </div>
                <div className="lg:col-span-6">
                  <Link
                    to={hoveredItem.to}
                    className="display-serif italic text-5xl lg:text-7xl text-background hover:text-brand-gold transition-colors leading-[0.95] inline-flex items-baseline gap-3"
                  >
                    {hoveredItem.label}
                    <ArrowUpRight className="h-7 w-7 lg:h-10 lg:w-10 text-brand-gold" />
                  </Link>
                  <p className="mt-4 text-background/75 max-w-md leading-relaxed">{hoveredItem.blurb}</p>
                </div>
                <div className="lg:col-span-4">
                  <ul className="space-y-2 border-l border-brand-gold/30 pl-4">
                    {hoveredItem.bullets.map((b, i) => (
                      <motion.li
                        key={b}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className="text-background/80 text-sm flex items-start gap-2"
                      >
                        <span className="text-brand-gold mt-0.5">+</span>
                        {b}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-brand-blue-deep text-background flex flex-col overflow-hidden"
          >
            {/* Decorative SVG line art — matches desktop hover feel */}
            <svg
              aria-hidden
              className="absolute inset-0 w-full h-full text-brand-gold/10 pointer-events-none"
              viewBox="0 0 390 844"
              preserveAspectRatio="xMidYMid slice"
            >
              <g fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="340" cy="120" r="180" />
                <circle cx="340" cy="120" r="100" />
                <circle cx="340" cy="120" r="50" />
                <path d="M 0 600 Q 150 560 250 620 T 390 580" />
                <path d="M 0 650 Q 150 610 250 670 T 390 630" />
                <line x1="0" y1="400" x2="390" y2="300" strokeOpacity="0.4" />
              </g>
            </svg>

            {/* Header */}
            <div className="relative flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
              <Logo invert />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="h-10 w-10 grid place-items-center rounded-full border border-background/20 hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Gold divider */}
            <div className="relative mx-6 h-px bg-brand-gold/20 shrink-0" />

            {/* Nav links */}
            <nav className="relative flex-1 flex flex-col justify-center px-6 py-4 overflow-hidden">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                  className="border-b border-background/10 last:border-0"
                >
                  <Link
                    to={l.to}
                    className="group flex items-start justify-between py-4 gap-4"
                  >
                    {/* Left: number + title */}
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="mono text-brand-gold/60 text-[0.6rem] shrink-0 mt-1">
                        0{i + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="display-serif italic text-4xl text-background group-hover:text-brand-gold transition-colors duration-200 leading-none block">
                          {l.label}
                        </span>
                        <span className="mono text-background/40 text-[0.6rem] mt-1.5 block leading-relaxed group-hover:text-background/60 transition-colors">
                          {l.blurb}
                        </span>
                      </div>
                    </div>
                    {/* Right: arrow */}
                    <ArrowUpRight className="h-5 w-5 text-background/20 group-hover:text-brand-gold transition-colors shrink-0 mt-1" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="relative shrink-0 border-t border-background/10 px-6 py-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-brand-gold animate-pulse" />
                  <span className="relative h-2 w-2 rounded-full bg-brand-gold" />
                </span>
                <span className="mono text-background/50 text-[0.6rem]">Available for projects</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="mailto:gilevo.co@gmail.com"
                  aria-label="Email"
                  className="h-8 w-8 grid place-items-center rounded-full border border-background/15 text-background/50 hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://instagram.com/gilevo.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-8 w-8 grid place-items-center rounded-full border border-background/15 text-background/50 hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-gold text-brand-blue-deep text-xs mono hover:bg-background transition-colors whitespace-nowrap"
                >
                  Start a project →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};