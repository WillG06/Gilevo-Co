import { motion } from "framer-motion";

/** Lightweight in-page loading indicator for slow / suspended routes */
export const RouteLoader = () => (
  <div className="fixed top-0 inset-x-0 z-[80] pointer-events-none">
    <motion.div
      initial={{ width: "0%" }}
      animate={{ width: "85%" }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      className="h-[2px] bg-brand-gold"
    />
  </div>
);
