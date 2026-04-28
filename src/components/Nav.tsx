import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
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
    blurb: "Templates & projects — production-ready, fully responsive, lovingly crafted.",
    bullets: ["4 licensable templates", "Bespoke client builds", "Live, interactive previews"],
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
              <div
                key={l.label}
                className="relative"
                onMouseEnter={() => setHovered(l.label)}
              >
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
                        <motion.span
                          layoutId="active-dot"
                          className="h-1.5 w-1.5 rounded-full bg-brand-gold"
                        />
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

      {/* Full-width blue overlay preview */}
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
              {/* Wave line-art accent */}
              <svg
                aria-hidden
                className="absolute inset-0 w-full h-full text-brand-gold/20"
                viewBox="0 0 1440 240"
                preserveAspectRatio="none"
              >
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-brand-blue-deep text-background"
          >
            <div className="flex items-center justify-between p-6">
              <Logo invert />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="h-10 w-10 grid place-items-center rounded-full border border-background/20">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-2 px-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Link
                    to={l.to}
                    className="group flex items-baseline justify-between border-b border-background/15 py-5"
                  >
                    <span className="display-serif italic text-5xl group-hover:text-brand-gold transition-colors">{l.label}</span>
                    <span className="mono text-background/40 group-hover:text-brand-gold transition-colors">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
