import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import bg1 from "@/assets/bg-ambient-1.jpg";
import bg2 from "@/assets/bg-ambient-2.jpg";
import bg3 from "@/assets/bg-ambient-3.jpg";
import bg4 from "@/assets/bg-ambient-4.jpg";

const layers = [
  { src: bg1, top: "8%", left: "-12%", w: "55vw", opacity: 0.18, range: [-60, 60] },
  { src: bg4, top: "55%", left: "60%", w: "60vw", opacity: 0.14, range: [80, -80] },
  { src: bg3, top: "120%", left: "-5%", w: "38vw", opacity: 0.16, range: [-40, 40] },
  { src: bg2, top: "180%", left: "55%", w: "70vw", opacity: 0.22, range: [60, -60] },
  { src: bg1, top: "240%", left: "10%", w: "50vw", opacity: 0.12, range: [-30, 30] },
];

/**
 * Page-wide low-opacity ambient image layers.
 * Subtly parallax with scroll. Purely decorative.
 */
export const AmbientBackdrop = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y0 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      {layers.map((l, i) => (
        <motion.img
          key={i}
          src={l.src}
          alt=""
          loading="lazy"
          style={{
            top: l.top,
            left: l.left,
            width: l.w,
            opacity: l.opacity,
            y: i % 2 === 0 ? y0 : y1,
            mixBlendMode: "multiply",
            filter: "saturate(0.4)",
          }}
          className="absolute select-none"
        />
      ))}
      {/* Soft vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, hsl(var(--background) / 0.5) 100%)" }} />
    </div>
  );
};
