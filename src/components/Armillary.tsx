import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import * as THREE from "three";

/**
 * Armillary — three interlocked chrome rings + dark central orb.
 * Drag to spin; momentum coasts; auto-rotate resumes; hover parallax.
 * Touch-enabled. Scales in on mount. Orbiting key light keeps highlights alive.
 */

const RingsGroup = ({
  dragRef,
  hoverRef,
  spunRef,
  velRef,
  draggingRef,
}: {
  dragRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverRef: React.MutableRefObject<{ x: number; y: number }>;
  spunRef: React.MutableRefObject<{ x: number; y: number }>;
  velRef: React.MutableRefObject<{ x: number; y: number }>;
  draggingRef: React.MutableRefObject<boolean>;
}) => {
  const group = useRef<THREE.Group>(null);
  const keyLight = useRef<THREE.PointLight>(null);
  const [scale, setScale] = useState(0.001);

  // Entry animation
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 1100);
      const eased = 1 - Math.pow(1 - t, 4);
      setScale(eased * 1.0);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);

    if (draggingRef.current) {
      // While dragging, use velocity directly
    } else {
      // Apply momentum
      spunRef.current.x += velRef.current.x * dt;
      spunRef.current.y += velRef.current.y * dt;
      // Decay
      const decay = Math.pow(0.04, dt);
      velRef.current.x *= decay;
      velRef.current.y *= decay;
      // Auto-rotate kicks in once momentum is small
      const speed = Math.hypot(velRef.current.x, velRef.current.y);
      if (speed < 0.05) {
        spunRef.current.y += dt * 0.25;
      }
    }

    // Apply rotation = accumulated spin + hover parallax
    group.current.rotation.x = spunRef.current.x + hoverRef.current.y * 0.25;
    group.current.rotation.y = spunRef.current.y + hoverRef.current.x * 0.35;
    group.current.scale.setScalar(scale);

    // Orbiting key light for moving specular highlights
    if (keyLight.current) {
      const t = state.clock.elapsedTime;
      keyLight.current.position.x = Math.cos(t * 0.4) * 6;
      keyLight.current.position.y = 2 + Math.sin(t * 0.3) * 1.5;
      keyLight.current.position.z = Math.sin(t * 0.4) * 6 + 3;
    }
  });

  // Chrome material — silvery metallic
  const chrome = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#c8ccd2"),
        metalness: 1,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        reflectivity: 1,
      }),
    []
  );

  const orb = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0e1622"),
        metalness: 0.6,
        roughness: 0.25,
        clearcoat: 1,
      }),
    []
  );

  return (
    <>
      {/* Warm orange key light */}
      <pointLight ref={keyLight} color="#ffb070" intensity={28} distance={20} decay={1.4} />
      {/* Cool blue fill */}
      <pointLight position={[-5, -2, -3]} color="#6aa8ff" intensity={14} distance={20} decay={1.6} />
      {/* Soft ambient */}
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#ffffff", "#222a36", 0.45]} />

      <group ref={group}>
        {/* Ring 1 — equatorial */}
        <mesh material={chrome}>
          <torusGeometry args={[1.7, 0.05, 32, 220]} />
        </mesh>
        {/* Ring 2 — tilted */}
        <mesh material={chrome} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.55, 0.05, 32, 220]} />
        </mesh>
        {/* Ring 3 — diagonal */}
        <mesh material={chrome} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
          <torusGeometry args={[1.4, 0.05, 32, 220]} />
        </mesh>
        {/* Inner small ring for depth */}
        <mesh material={chrome} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
          <torusGeometry args={[0.95, 0.035, 24, 180]} />
        </mesh>
        {/* Central dark orb */}
        <mesh material={orb}>
          <sphereGeometry args={[0.32, 64, 64]} />
        </mesh>
      </group>
    </>
  );
};

const Pointer = ({
  dragRef,
  hoverRef,
  spunRef,
  velRef,
  draggingRef,
}: {
  dragRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverRef: React.MutableRefObject<{ x: number; y: number }>;
  spunRef: React.MutableRefObject<{ x: number; y: number }>;
  velRef: React.MutableRefObject<{ x: number; y: number }>;
  draggingRef: React.MutableRefObject<boolean>;
}) => {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    let last: { x: number; y: number; t: number } | null = null;

    const getXY = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    };

    const onMove = (e: PointerEvent) => {
      const p = getXY(e);
      hoverRef.current.x = p.x;
      hoverRef.current.y = p.y;
      if (draggingRef.current && last) {
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        const dt = Math.max(0.001, (e.timeStamp - last.t) / 1000);
        spunRef.current.y += dx * 3.2;
        spunRef.current.x += dy * 3.2;
        velRef.current.y = (dx / dt) * 1.5;
        velRef.current.x = (dy / dt) * 1.5;
        last = { x: p.x, y: p.y, t: e.timeStamp };
      }
    };

    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      const p = getXY(e);
      last = { x: p.x, y: p.y, t: e.timeStamp };
    };
    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      try { el.releasePointerCapture(e.pointerId); } catch {}
      el.style.cursor = "grab";
      last = null;
    };
    const onLeave = () => {
      hoverRef.current.x = 0;
      hoverRef.current.y = 0;
    };

    el.style.cursor = "grab";
    el.style.touchAction = "none";
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl, dragRef, hoverRef, spunRef, velRef, draggingRef]);
  return null;
};

const FallbackHaze = () => (
  <div aria-hidden className="absolute inset-0 grid place-items-center">
    <div className="h-[60%] aspect-square rounded-full bg-gradient-to-br from-brand-blue/30 to-brand-gold/20 blur-3xl" />
  </div>
);

export const Armillary = ({ className = "" }: { className?: string }) => {
  const dragRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef({ x: 0, y: 0 });
  const spunRef = useRef({ x: -0.3, y: 0.2 });
  const velRef = useRef({ x: 0, y: 0.4 });
  const draggingRef = useRef(false);

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
    <div className={`relative w-full h-full ${className}`} data-cursor="hover">
      <Suspense fallback={<FallbackHaze />}>
        <Canvas
          camera={{ position: [0, 0, 5.6], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <RingsGroup
            dragRef={dragRef}
            hoverRef={hoverRef}
            spunRef={spunRef}
            velRef={velRef}
            draggingRef={draggingRef}
          />
          <Pointer
            dragRef={dragRef}
            hoverRef={hoverRef}
            spunRef={spunRef}
            velRef={velRef}
            draggingRef={draggingRef}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};
