"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SceneCanvas = dynamic(() => import("./scene/SceneCanvas"), { ssr: false });

function canRenderScene(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Mounts the 3D scene only when motion is welcome and WebGL works.
 * Otherwise the CSS/SVG poster stays exactly as rendered.
 */
export default function SceneCanvasMount() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (canRenderScene()) {
      setEnabled(true);
    } else {
      document.documentElement.classList.remove("fx");
    }
  }, []);

  if (!enabled) return null;
  return <SceneCanvas />;
}
