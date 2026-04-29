import { motion, type Variants } from "framer-motion";
import { LineArt } from "./LineArt";

const word: Variants = {
  initial: { y: "110%" },
  animate: (i: number) => ({
    y: "0%",
    transition: { delay: 0.15 + i * 0.07, duration: 0.9, ease: [0.65, 0, 0.35, 1] as const },
  }),
};

interface Props {
  eyebrow: string;
  titleSerif: string;
  titleSans: string;
  intro?: string;
  variant?: "grid" | "blueprint" | "orbit" | "topo" | "frame" | "compass" | "wavefield";
}

export const PageHero = ({ eyebrow, titleSerif, titleSans, intro, variant = "blueprint" }: Props) => {
  return (
    <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      <LineArt variant={variant} />
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mono text-brand-blue mb-8"
        >
          / {eyebrow}
        </motion.p>
        <h1 className="leading-[0.92] tracking-tighter">
          <span className="block reveal-mask">
            <motion.span variants={word} initial="initial" animate="animate" custom={0} className="display-serif text-[clamp(3rem,10vw,9rem)] block text-blue-deep">
              {titleSerif}
            </motion.span>
          </span>
          <span className="block reveal-mask -mt-2">
            <motion.span variants={word} initial="initial" animate="animate" custom={1} className="display-sans text-[clamp(3rem,10vw,9rem)] block text-blue-deep">
              {titleSans}<span className="text-brand-gold">.</span>
            </motion.span>
          </span>
        </h1>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-10 max-w-xl text-base md:text-lg text-ink/65 leading-relaxed"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </section>
  );
};
