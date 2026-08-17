import { useEffect, useRef, useState } from "react";
import gcGlyph from "@/assets/gc-glyph-silhouette.png";

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  hue: number;
}

export const LogoParticles = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let raf = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const sample = (img: HTMLImageElement) => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;

      if (w === 0 || h === 0) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      const ratio = Math.min(w / img.width, h / img.height) * 1.05;
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      octx.fillStyle = "white";
      octx.fillRect(0, 0, w, h);
      octx.drawImage(img, dx, dy, dw, dh);
      const imgData = octx.getImageData(0, 0, w, h).data;

      const targets: { x: number; y: number }[] = [];
      const step = 4;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const i = (y * w + x) * 4;
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const lum = (r + g + b) / 3;
          if (lum < 100) {
            targets.push({ x: x + (Math.random() - 0.5) * step, y: y + (Math.random() - 0.5) * step });
          }
        }
      }

      const MAX = Math.min(targets.length, 1600);
      for (let i = targets.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }
      const chosen = targets.slice(0, MAX);

      particles = chosen.map((t) => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.6,
        tx: t.x,
        ty: t.y,
        dx: Math.random() * w,
        dy: Math.random() * h * 0.7,
        vx: 0,
        vy: 0,
        size: 1.2 + Math.random() * 1.4,
        color: Math.random() < 0.14 ? "#cba14a" : "#3a4a63",
        hue: Math.random() * Math.PI * 2,
      }));
      setReady(true);

      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        const time = performance.now() * 0.001;
        const p01 = progressRef.current;
        const e = p01 < 0.5 ? 2 * p01 * p01 : 1 - Math.pow(-2 * p01 + 2, 2) / 2;

        for (const p of particles) {
          const driftX = Math.sin(time * 0.6 + p.hue) * (1.2 - e);
          const driftY = Math.cos(time * 0.5 + p.hue * 1.3) * (1.2 - e);
          const targetX = p.dx * (1 - e) + p.tx * e + driftX;
          const targetY = p.dy * (1 - e) + p.ty * e + driftY;
          const ax = (targetX - p.x) * 0.05;
          const ay = (targetY - p.y) * 0.05;

          p.vx = (p.vx + ax) * 0.82;
          p.vy = (p.vy + ay) * 0.82;
          p.x += p.vx;
          p.y += p.vy;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.55 + 0.4 * e;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = gcGlyph;
    img.onload = () => sample(img);

    const onResize = () => {
      cancelAnimationFrame(raf);
      if (img.complete) sample(img);
    };
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = r.top + r.height / 2;
      const fromCenter = (center - vh / 2) / vh;
      const dist = Math.min(1, Math.abs(fromCenter) / 0.55);
      progressRef.current = 1 - dist;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
      {!ready && (
        <div aria-hidden className="absolute inset-0 grid place-items-center">
          <div className="h-24 w-24 rounded-full bg-brand-blue/10 blur-2xl" />
        </div>
      )}
    </div>
  );
};