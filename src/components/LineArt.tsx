import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Animated SVG line-art layers that draw / drift / rotate as you scroll.
 * Three preset compositions to be reused per page.
 */

type Variant = "grid" | "blueprint" | "orbit" | "topo" | "frame" | "compass" | "wavefield";

interface Props {
  variant?: Variant;
  className?: string;
}

export const LineArt = ({ variant = "grid", className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {variant === "grid" && <GridLines progress={scrollYProgress} />}
      {variant === "blueprint" && <Blueprint progress={scrollYProgress} />}
      {variant === "orbit" && <Orbit progress={scrollYProgress} />}
      {variant === "topo" && <Topo progress={scrollYProgress} />}
      {variant === "frame" && <Frame progress={scrollYProgress} />}
      {variant === "compass" && <Compass progress={scrollYProgress} />}
      {variant === "wavefield" && <Wavefield progress={scrollYProgress} />}
    </div>
  );
};

const GridLines = ({ progress }: { progress: MotionValue<number> }) => {
  const x = useTransform(progress, [0, 1], [-40, 40]);
  const y = useTransform(progress, [0, 1], [40, -40]);
  return (
    <motion.svg
      style={{ x, y }}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="g1" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--ink))" strokeOpacity="0.06" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="1440" height="900" fill="url(#g1)" />
    </motion.svg>
  );
};

const Blueprint = ({ progress }: { progress: MotionValue<number> }) => {
  const dash = useTransform(progress, [0, 1], [2000, 0]);
  const rot = useTransform(progress, [0, 1], [-8, 8]);
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <motion.g style={{ rotate: rot, originX: "50%", originY: "50%" }} stroke="hsl(var(--ink))" strokeOpacity="0.18" fill="none" strokeWidth="0.6">
        <motion.circle cx="1100" cy="200" r="280" strokeDasharray="2000" style={{ strokeDashoffset: dash }} />
        <motion.circle cx="200" cy="700" r="180" strokeDasharray="1500" style={{ strokeDashoffset: dash }} />
        <motion.line x1="0" y1="500" x2="1440" y2="420" strokeDasharray="1500" style={{ strokeDashoffset: dash }} />
        <motion.line x1="720" y1="0" x2="900" y2="900" strokeDasharray="1500" style={{ strokeDashoffset: dash }} />
        <motion.path d="M 100 100 Q 720 50 1340 200" strokeDasharray="2000" style={{ strokeDashoffset: dash }} />
      </motion.g>
    </svg>
  );
};

const Orbit = ({ progress }: { progress: MotionValue<number> }) => {
  const rot = useTransform(progress, [0, 1], [0, 60]);
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <motion.g style={{ rotate: rot, originX: "50%", originY: "50%" }} stroke="hsl(var(--ink))" strokeOpacity="0.12" fill="none" strokeWidth="0.5">
        <ellipse cx="720" cy="450" rx="600" ry="200" />
        <ellipse cx="720" cy="450" rx="450" ry="150" />
        <ellipse cx="720" cy="450" rx="300" ry="100" />
        <ellipse cx="720" cy="450" rx="700" ry="260" />
      </motion.g>
    </svg>
  );
};

const Topo = ({ progress }: { progress: MotionValue<number> }) => {
  const y = useTransform(progress, [0, 1], [60, -60]);
  return (
    <motion.svg style={{ y }} className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <g stroke="hsl(var(--ink))" strokeOpacity="0.09" fill="none" strokeWidth="0.5">
        {Array.from({ length: 18 }).map((_, i) => (
          <path
            key={i}
            d={`M 0 ${100 + i * 50} Q 360 ${50 + i * 50} 720 ${110 + i * 50} T 1440 ${90 + i * 50}`}
          />
        ))}
      </g>
    </motion.svg>
  );
};

const Frame = ({ progress }: { progress: MotionValue<number> }) => {
  const dash = useTransform(progress, [0, 0.6], [3000, 0]);
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <motion.rect
        x="40" y="40" width="1360" height="820"
        fill="none"
        stroke="hsl(var(--ink))"
        strokeOpacity="0.25"
        strokeWidth="0.5"
        strokeDasharray="3000"
        style={{ strokeDashoffset: dash }}
      />
    </svg>
  );
};

/* Compass — large rotating compass + crossed bearing lines + corner ticks.
   Used for the Contact page hero. */
const Compass = ({ progress }: { progress: MotionValue<number> }) => {
  const rot = useTransform(progress, [0, 1], [0, 90]);
  const dash = useTransform(progress, [0, 1], [3000, 0]);
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <g stroke="hsl(var(--ink))" strokeOpacity="0.14" fill="none" strokeWidth="0.6">
        {/* Bearing lines */}
        <motion.line x1="0" y1="450" x2="1440" y2="450" strokeDasharray="2000" style={{ strokeDashoffset: dash }} />
        <motion.line x1="720" y1="0" x2="720" y2="900" strokeDasharray="2000" style={{ strokeDashoffset: dash }} />
        <motion.line x1="0" y1="0" x2="1440" y2="900" strokeDasharray="2000" style={{ strokeDashoffset: dash }} />
        <motion.line x1="1440" y1="0" x2="0" y2="900" strokeDasharray="2000" style={{ strokeDashoffset: dash }} />
      </g>
      {/* Compass rose, slowly rotating with scroll */}
      <motion.g style={{ rotate: rot, originX: "1180px", originY: "200px" }}>
        <g fill="none" stroke="hsl(var(--brand-blue))" strokeOpacity="0.35" strokeWidth="0.6">
          <circle cx="1180" cy="200" r="140" />
          <circle cx="1180" cy="200" r="100" />
          <circle cx="1180" cy="200" r="60" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * Math.PI) / 12;
            const r1 = i % 6 === 0 ? 120 : 130;
            const x1 = 1180 + Math.cos(a) * r1;
            const y1 = 200 + Math.sin(a) * r1;
            const x2 = 1180 + Math.cos(a) * 140;
            const y2 = 200 + Math.sin(a) * 140;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          <polygon
            points="1180,80 1186,200 1180,320 1174,200"
            fill="hsl(var(--brand-gold))"
            fillOpacity="0.55"
            stroke="none"
          />
        </g>
      </motion.g>
      {/* Corner crosshair ticks */}
      <g stroke="hsl(var(--brand-gold))" strokeOpacity="0.4" strokeWidth="0.6">
        <line x1="80" y1="80" x2="120" y2="80" />
        <line x1="80" y1="80" x2="80" y2="120" />
        <line x1="1360" y1="820" x2="1320" y2="820" />
        <line x1="1360" y1="820" x2="1360" y2="780" />
      </g>
    </svg>
  );
};

/* Wavefield — radio/sonar concentric rings emanating from bottom-left,
   with diagonal pen strokes overhead. Used for Contact mid-section. */
const Wavefield = ({ progress }: { progress: MotionValue<number> }) => {
  const t = useTransform(progress, [0, 1], [0, 1]);
  const dash = useTransform(progress, [0, 1], [2400, 0]);
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="wf" cx="0" cy="100%" r="80%">
          <stop offset="0%" stopColor="hsl(var(--brand-blue))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--brand-blue))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#wf)" />
      <g stroke="hsl(var(--brand-blue))" strokeOpacity="0.18" fill="none" strokeWidth="0.6">
        {[160, 280, 420, 580, 760, 960, 1180].map((r, i) => (
          <motion.circle
            key={r}
            cx="40" cy="900" r={r}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: i * 0.12 }}
          />
        ))}
      </g>
      {/* Gold diagonal pen strokes */}
      <g stroke="hsl(var(--brand-gold))" fill="none" strokeWidth="0.7">
        <motion.path
          d="M 200 100 Q 700 300 1380 240"
          strokeOpacity="0.5"
          strokeDasharray="2400"
          style={{ strokeDashoffset: dash }}
        />
        <motion.path
          d="M 100 260 Q 800 420 1380 380"
          strokeOpacity="0.3"
          strokeDasharray="2400"
          style={{ strokeDashoffset: dash }}
        />
      </g>
      {/* Floating dots */}
      {[
        { x: 1100, y: 180 }, { x: 880, y: 300 }, { x: 1280, y: 460 }, { x: 620, y: 140 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x} cy={p.y} r="2.5"
          fill="hsl(var(--brand-gold))"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ duration: 4, delay: 0.4 + i * 0.4, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
    </svg>
  );
};
