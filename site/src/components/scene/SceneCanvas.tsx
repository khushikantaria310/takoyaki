"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import HeroScene from "./HeroScene";

/**
 * ONE persistent, fixed canvas behind the whole site. It pauses whenever the
 * tab is hidden or the poster scrolls out of view, and clamps DPR for cost.
 */
export default function SceneCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);
  const active = inView && visible;

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const attach = () => {
      const target = document.querySelector("[data-poster-scene]");
      if (!target) {
        frame = requestAnimationFrame(attach);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { rootMargin: "240px" },
      );
      observer.observe(target);
    };

    attach();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="scene-canvas" ref={hostRef} aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 10], fov: 42, near: 0.1, far: 100 }}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[3, 6, 7]} intensity={2.2} />
        <directionalLight position={[-5, -3, 4]} intensity={0.6} color="#F7EBC0" />
        <HeroScene />
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}
