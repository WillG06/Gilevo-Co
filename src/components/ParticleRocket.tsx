import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

/**
 * ParticleRocket — a Three.js scroll-driven particle system that
 * (a) starts dispersed, (b) coalesces into a rocket silhouette as the
 * section enters view, then (c) disperses again as it leaves.
 *
 * Progress is driven from the parent via a 0-1 scroll value.
 */

// Sample points along a paper-plane silhouette — three triangular panels
// folded around a centre crease. More on-brand than a rocket: editorial,
// minimal, suggests "shipped work".
function buildRocketPoints(count: number): Float32Array {
  const pts: number[] = [];

  // Helper: random point inside triangle (a, b, c) in 3D
  const triPoint = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number]
  ) => {
    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const w = 1 - u - v;
    pts.push(
      a[0] * w + b[0] * u + c[0] * v,
      a[1] * w + b[1] * u + c[1] * v,
      a[2] * w + b[2] * u + c[2] * v
    );
  };

  // Plane geometry — nose forward (+x), tail at -x. Slightly tilted up.
  // Top panel (left of crease, viewed from above)
  const NOSE: [number, number, number] = [1.8, 0.05, 0];
  const TAIL_TOP: [number, number, number] = [-1.4, 0.55, -1.1];
  const TAIL_BOT: [number, number, number] = [-1.4, -0.45, 1.1];
  const CREASE_BACK: [number, number, number] = [-1.1, -0.05, 0];
  const FOLD_UP: [number, number, number] = [-0.2, 0.35, 0];

  // Top-left wing
  while (pts.length / 3 < count * 0.34) triPoint(NOSE, TAIL_TOP, CREASE_BACK);
  // Top-right wing (mirrored)
  while (pts.length / 3 < count * 0.68) triPoint(NOSE, TAIL_BOT, CREASE_BACK);
  // Inner fold (visible upper triangle along crease)
  while (pts.length / 3 < count * 0.92) triPoint(NOSE, FOLD_UP, CREASE_BACK);
  // Trailing edge accent dots
  while (pts.length / 3 < count) {
    const t = Math.random();
    const side = Math.random() < 0.5 ? 1 : -1;
    pts.push(
      -1.4 + Math.random() * 0.05,
      (Math.random() - 0.5) * 0.1,
      side * (0.6 + t * 0.5)
    );
  }
  return new Float32Array(pts);
}

function buildDispersed(count: number): Float32Array {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pts[i * 3] = (Math.random() - 0.5) * 12;
    pts[i * 3 + 1] = (Math.random() - 0.5) * 8;
    pts[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  return pts;
}

const Particles = ({ progress }: { progress: { current: number } }) => {
  const COUNT = 1800;
  const target = useMemo(() => buildRocketPoints(COUNT), []);
  const start = useMemo(() => buildDispersed(COUNT), []);
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const colorBlue = useMemo(() => new THREE.Color("#5e6b7b"), []);
  const colorGold = useMemo(() => new THREE.Color("#dfb030"), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Eased "form" amount: 0 dispersed -> 1 formed
    const p = Math.min(1, Math.max(0, progress.current));
    // Bell curve: peak in mid-section, dispersed at start/end
    const form = Math.sin(Math.PI * p);
    const t = clock.elapsedTime;

    const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colorAttr = ref.current.geometry.getAttribute("color") as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const tx = target[i * 3];
      const ty = target[i * 3 + 1];
      const tz = target[i * 3 + 2];
      const sx = start[i * 3];
      const sy = start[i * 3 + 1];
      const sz = start[i * 3 + 2];
      // Soft floating noise on dispersed points
      const drift = 0.15;
      const fx = sx + Math.sin(t * 0.5 + i) * drift;
      const fy = sy + Math.cos(t * 0.4 + i * 0.5) * drift;
      const fz = sz + Math.sin(t * 0.3 + i * 0.7) * drift;
      positions[i * 3] = fx + (tx - fx) * form;
      positions[i * 3 + 1] = fy + (ty - fy) * form;
      positions[i * 3 + 2] = fz + (tz - fz) * form;

      // Colour blend: dispersed = slate blue; formed leading-edge = gold
      const isLeadingEdge = tx > 1.0; // nose / front of plane
      const target3 = isLeadingEdge ? colorGold : colorBlue;
      const r = colorBlue.r + (target3.r - colorBlue.r) * form;
      const g = colorBlue.g + (target3.g - colorBlue.g) * form;
      const b = colorBlue.b + (target3.b - colorBlue.b) * form;
      colorAttr.setXYZ(i, r, g, b);
    }
    attr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    // Gentle yaw + slight pitch as it forms — like banking through air
    ref.current.rotation.y = -0.35 + t * 0.05 + form * 0.4;
    ref.current.rotation.z = form * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={COUNT}
          array={new Float32Array(COUNT * 3)}
          itemSize={3}
          args={[new Float32Array(COUNT * 3), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.85}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface Props {
  /** scroll progress 0..1 from parent */
  progressRef: { current: number };
}

const FallbackHaze = () => (
  <div aria-hidden className="absolute top-0 right-0 w-[55vw] max-w-[760px] h-[70vh] pointer-events-none">
    <div className="absolute top-1/4 left-1/4 h-[40vh] w-[40vh] rounded-full blur-3xl"
         style={{ background: "radial-gradient(circle, hsl(var(--brand-blue)/0.35), transparent 70%)" }} />
    <div className="absolute bottom-1/4 right-1/4 h-[40vh] w-[40vh] rounded-full blur-3xl"
         style={{ background: "radial-gradient(circle, hsl(var(--brand-gold)/0.25), transparent 70%)" }} />
  </div>
);

export const ParticleRocket = ({ progressRef }: Props) => {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const fn = () => setReduce(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);

  if (reduce) return <FallbackHaze />;

  return (
    // Anchored to the top-right of the parent section, sized so it does not
    // overlap the headline column on the left. Particles still fill the canvas
    // and we let them spill softly via low-opacity edges.
    <div className="absolute top-0 right-0 w-[55vw] max-w-[760px] h-[70vh] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <Particles progress={progressRef} />
      </Canvas>
      {/* Soft fade on the inner edge so it blends into the column copy */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, transparent 60%, hsl(var(--background)) 100%)",
        }}
      />
    </div>
  );
};
