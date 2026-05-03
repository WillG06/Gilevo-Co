import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const Armillary = lazy(() => import("@/components/Armillary").then((m) => ({ default: m.Armillary })));

/**
 * Hero — brand wordmark + animated decorative line-art.
 * The line art (gold pen-strokes, blueprint circles, drifting dots)
 * draws itself in on mount — distinct from the orbital strokes
 * used on the CTA section.
 */
export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Soft brand colour wash */}
      <div aria-hidden className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[60vh] w-[60vh] rounded-full blur-3xl opacity-40"
             style={{ background: "radial-gradient(circle, hsl(var(--brand-blue)/0.35), transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 h-[55vh] w-[55vh] rounded-full blur-3xl opacity-40"
             style={{ background: "radial-gradient(circle, hsl(var(--brand-gold)/0.30), transparent 70%)" }} />
      </div>

      <HeroLineArt />

      {/* 3D Armillary sphere */}
      <div className="hidden min-[1250px]:block absolute top-2/3 right-[0vw] -translate-y-[50%] w-[40vw] max-w-[580px] min-w-[340px] h-[62vh] max-h-[640px] min-h-[380px] z-0 pointer-events-auto opacity-90">
        <Suspense fallback={null}>
          <Armillary />
        </Suspense>
      </div>

      {/* Text content */}
      <div className="relative z-[2] mx-auto max-w-[1440px] px-6 lg:px-10 pt-40 pb-32 min-h-[100svh] flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mono text-blue mb-10"
        >
          / Gilevo &amp; Co. — Est. Birmingham
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className="brush-script text-blue-deep text-[clamp(5rem,18vw,18rem)] leading-[0.9]"
        >
          Gilevo<span className="text-brand-gold">&amp;</span>Co.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1.4, delay: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="-mt-2 lg:-mt-4 italic text-gold uppercase font-medium text-[clamp(1rem,2.4vw,2rem)]"
          style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", letterSpacing: "0.35em" }}
        >
          Sites to be seen<span className="text-gold">.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-12 max-w-xl text-base md:text-lg text-ink/70 leading-relaxed"
        >
          Web design &amp; development from Birmingham, UK.
          Bespoke websites and licensable templates engineered for performance and the senses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link to="/work" className="ink-underline group inline-flex items-center gap-2 text-blue-deep">
            View Work <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-deep text-background font-medium hover:bg-blue transition-colors">
            Get in Touch →
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-6 lg:left-10 flex items-center gap-3 mono text-blue/70 z-[2]">
        <span className="rotate-180" style={{ writingMode: "vertical-rl" }}>Scroll to explore</span>
        <ArrowDown className="h-4 w-4 animate-scroll-arrow text-blue-deep" />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-2.5 glass-light rounded-full px-4 py-2 z-20">
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-gold animate-pulse-dot" />
          <span className="relative h-2 w-2 rounded-full bg-gold" />
        </span>
        <span className="mono text-ink/80">Available for new projects</span>
      </div>
    </section>
  );
};

/**
 * HeroLineArt — bespoke animated SVG with self-drawing gold curves,
 * blueprint circles, slow-drifting "constellation" dots, and a long
 * crosshair that scopes across the page.
 */
const HeroLineArt = () => {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="heroGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--brand-gold))" stopOpacity="0" />
          <stop offset="50%" stopColor="hsl(var(--brand-gold))" stopOpacity="0.55" />
          <stop offset="100%" stopColor="hsl(var(--brand-gold))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Concentric blueprint arcs top-right */}
      <g fill="none" stroke="hsl(var(--brand-blue))" strokeOpacity="0.15" strokeWidth="0.6">
        {[120, 220, 340, 480].map((r, i) => (
          <motion.circle
            key={r}
            cx="1280" cy="160" r={r}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.4 + i * 0.18, ease: "easeOut" }}
          />
        ))}
      </g>

      {/* Long sweeping gold pen strokes */}
      <g fill="none" strokeWidth="1.1">
        <motion.path
          d="M -50 760 Q 380 660 760 720 T 1500 640"
          stroke="url(#heroGold)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.6, delay: 0.6, ease: "easeInOut" }}
        />
        <motion.path
          d="M -50 820 Q 480 740 980 800 T 1500 760"
          stroke="hsl(var(--brand-gold))"
          strokeOpacity="0.18"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.0, delay: 0.9, ease: "easeInOut" }}
        />
      </g>

      {/* Diagonal blueprint lines */}
      <g stroke="hsl(var(--ink))" strokeOpacity="0.07" strokeWidth="0.5">
        <motion.line
          x1="0" y1="600" x2="1440" y2="280"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.3 }}
        />
        <motion.line
          x1="200" y1="0" x2="500" y2="900"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.5 }}
        />
      </g>

      {/* Drifting constellation dots */}
      {[
        { x: 140, y: 240, d: 0 },
        { x: 1100, y: 460, d: 0.6 },
        { x: 320, y: 720, d: 1.2 },
        { x: 920, y: 200, d: 1.8 },
        { x: 1280, y: 680, d: 2.4 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r="2"
          fill="hsl(var(--brand-gold))"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.4, 1, 1.2] }}
          transition={{ duration: 4, delay: 1 + p.d, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      ))}

      {/* Crosshair scope, slowly traversing */}
      <motion.g
        stroke="hsl(var(--brand-blue-deep))"
        strokeOpacity="0.4"
        strokeWidth="0.6"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: [0, 1200, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 18, delay: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <line x1="200" y1="100" x2="240" y2="100" />
        <line x1="220" y1="80" x2="220" y2="120" />
        <circle cx="220" cy="100" r="14" fill="none" />
      </motion.g>
    </svg>
  );
};
