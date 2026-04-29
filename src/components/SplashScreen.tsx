import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import gcLogo from "@/assets/gc-logo.png";

/**
 * SplashScreen — runs on initial app mount (and on hard refresh).
 * Sequence: two halves slide in from left/right, meet, show loader,
 * then halves split apart and reveal the site.
 *
 * Phases: enter (0-700ms) → loading (700-1900ms) → exit (1900-2700ms) → done
 */
export const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  const [phase, setPhase] = useState<"enter" | "loading" | "exit" | "done">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("loading"), 750);
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    const t3 = setTimeout(() => { setPhase("done"); onDone(); }, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  if (phase === "done") return null;

  const halvesOut = phase === "exit";

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        className="fixed inset-0 z-[9998] pointer-events-none"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Left half — slides in from left, then exits left.
            Width is 50% + 60px so the diagonal slant fully covers the
            centre line (no gap between halves when they meet). */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: halvesOut ? "-100%" : "0%" }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
          className="absolute top-0 bottom-0 left-0 bg-brand-blue-deep"
          style={{
            width: "calc(50% + 60px)",
            clipPath: "polygon(0 0, 100% 0, calc(100% - 60px) 100%, 0 100%)",
          }}
        />
        {/* Right half — slides in from right, exits right */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: halvesOut ? "100%" : "0%" }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
          className="absolute top-0 bottom-0 right-0 bg-brand-blue-deep"
          style={{
            width: "calc(50% + 60px)",
            clipPath: "polygon(60px 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />

        {/* Center loader */}
        <AnimatePresence>
          {phase === "loading" && (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 grid place-items-center"
            >
              <div className="text-center">
                <motion.img
                  src={gcLogo}
                  alt="Gilevo & Co."
                  className="mx-auto h-20 w-20 rounded-xl ring-1 ring-brand-gold/40 shadow-2xl"
                  animate={{ rotate: [0, 0, 360] }}
                  transition={{ duration: 2.4, ease: "easeInOut" }}
                />
                <p className="brush-script text-5xl text-background mt-6">
                  Gilevo<span className="text-brand-gold">&amp;</span>Co.
                </p>
                <p className="mono text-brand-gold/80 mt-3 tracking-[0.4em]">SITES TO BE SEEN</p>
                <div className="mx-auto mt-6 h-px w-40 bg-brand-gold/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-gold"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};
