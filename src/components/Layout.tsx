import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { CustomCursor } from "./CustomCursor";
import { SmoothScroll } from "./SmoothScroll";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { SplashScreen } from "./SplashScreen";

export const Layout = () => {
  const { pathname } = useLocation();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-background text-ink">
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <SmoothScroll />
      <CustomCursor />
      <AmbientBackdrop />
      <div className="grain" />
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};
