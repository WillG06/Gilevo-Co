import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import gcLogo from "@/assets/gc-logo.png";
import cardFront from "@/assets/contact-card-front.png";

/**
 * 3D interactive contact card.
 * Front: enhanced source image (slate blue + brush wordmark).
 * Back: split layout with a vertical divider at 40% from the left.
 */
export const ContactCard3D = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 14 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 120, damping: 14 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => setFlipped((f) => !f)}
      className="relative w-full max-w-[640px] aspect-[1.75/1] cursor-pointer"
      style={{ perspective: 1600 }}
    >
      {/* Floor shadow */}
      <div
        aria-hidden
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-12 w-3/4 rounded-full blur-2xl"
        style={{ background: "hsl(var(--brand-blue-deep) / 0.35)" }}
      />

      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          {/* Front — enhanced source render. Scaled up to crop the lighter
              outer bezel so only the darker inner blue remains. */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-brand-gold/20"
            style={{ backfaceVisibility: "hidden", background: "hsl(var(--brand-blue))" }}
          >
            <img
              src={cardFront}
              alt="Gilevo & Co. business card front"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: "scale(1.22)", transformOrigin: "center" }}
              draggable={false}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-black/20" />
          </div>

          {/* Back — white with vertical divider at 40% */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-background ring-1 ring-hairline"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Center divider line at 40% from left */}
            <div
              aria-hidden
              className="absolute top-[10%] bottom-[10%] w-px"
              style={{ left: "40%", background: "hsl(var(--brand-gold) / 0.55)" }}
            />

            {/* Subtle paper grain */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
              backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }} />

            <div className="relative h-full flex">
              {/* Left 40% — logo block */}
              <div className="w-[40%] h-full flex flex-col items-start justify-center pl-8 pr-4">
                <img src={gcLogo} alt="" className="h-12 w-12 rounded-md ring-1 ring-brand-gold/30" />
                <p className="brush-script text-3xl text-brand-blue-deep mt-3 leading-none">
                  Gilevo<span className="text-brand-gold">&amp;</span>Co.
                </p>
                <p className="mono text-brand-gold/80 mt-2">Studio · Birmingham</p>
              </div>

              {/* Right 60% — details */}
              <div className="w-[60%] h-full flex flex-col justify-center pr-8 pl-6 text-right">
                <p className="display-sans text-lg text-brand-blue-deep">Will Giles</p>
                <p className="text-sm text-ink/60">Designer &amp; Developer</p>
                <div className="pt-3 mt-3 border-t border-hairline space-y-1 text-sm">
                  <p className="text-ink">gilevo.co@gmail.com</p>
                  <p className="text-ink/60">Birmingham, UK</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        <motion.p
          key={flipped ? "back" : "front"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 mono text-brand-blue/70 whitespace-nowrap"
        >
          {flipped ? "/ Click to flip — front" : "/ Click to flip — details"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
