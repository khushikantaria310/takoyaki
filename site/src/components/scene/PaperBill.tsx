"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setupSteps } from "@/lib/data";

const TEX_W = 1024;
const TEX_H = 1500;
const PAPER_W = 1.8;
const PAPER_H = (TEX_H / TEX_W) * PAPER_W;

/** How fat the rolling cylinder looks on screen, in real pixels. */
const ROLL_RADIUS_PX = 70;
/** Loose roll: the sheet stops after a little over half a lap and hangs open. */
const ROLL_MAX_TURN = Math.PI * 1.15;

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cursor = y;
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, cx, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) {
    ctx.fillText(line, cx, cursor);
    cursor += lineHeight;
  }
  return cursor;
}

function drawReceipt(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  ctx.fillStyle = "#e7ddc0";
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Paper grain.
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(94, 76, 40, ${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * TEX_W, Math.random() * TEX_H, 1.6, 1.6);
  }

  // Soft light from the top, warmer shading at the bottom.
  const light = ctx.createLinearGradient(0, 0, 0, TEX_H);
  light.addColorStop(0, "rgba(255,255,255,0.26)");
  light.addColorStop(0.45, "rgba(255,255,255,0)");
  light.addColorStop(1, "rgba(118,96,54,0.16)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Torn-ish side shading.
  const edge = ctx.createLinearGradient(0, 0, TEX_W, 0);
  edge.addColorStop(0, "rgba(120,100,58,0.12)");
  edge.addColorStop(0.06, "rgba(120,100,58,0)");
  edge.addColorStop(0.94, "rgba(120,100,58,0)");
  edge.addColorStop(1, "rgba(120,100,58,0.12)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, TEX_W, TEX_H);

  // Visible crease/fold lines on the paper - looser spacing
  ctx.strokeStyle = "rgba(120,100,58,0.18)";
  ctx.lineWidth = 1.5;
  // Vertical center crease
  ctx.beginPath();
  ctx.moveTo(TEX_W / 2, 150);
  ctx.lineTo(TEX_W / 2, TEX_H - 80);
  ctx.stroke();
  // Horizontal crease lines - fewer, looser spacing
  for (let cy = 340; cy < 1350; cy += 300) {
    ctx.beginPath();
    ctx.moveTo(100, cy);
    ctx.lineTo(TEX_W - 100, cy);
    ctx.stroke();
  }

  // Faint fibre flecks, like pressed recycled paper.
  for (let i = 0; i < 260; i++) {
    ctx.strokeStyle = `rgba(140,116,70,${0.05 + Math.random() * 0.07})`;
    ctx.lineWidth = 1;
    const fx = Math.random() * TEX_W;
    const fy = Math.random() * TEX_H;
    const len = 6 + Math.random() * 26;
    const ang = Math.random() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + Math.cos(ang) * len, fy + Math.sin(ang) * len);
    ctx.stroke();
  }

  // Perforated tear strip along the bottom edge.
  ctx.fillStyle = "rgba(120,100,58,0.14)";
  for (let px = 40; px < TEX_W - 20; px += 26) {
    ctx.beginPath();
    ctx.arc(px, TEX_H - 26, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(120,100,58,0.28)";
  ctx.setLineDash([10, 9]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, TEX_H - 56);
  ctx.lineTo(TEX_W - 40, TEX_H - 56);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = "center";
  ctx.fillStyle = "#161616";
  ctx.font = '400 84px "Dela Gothic One", "Zen Kaku Gothic New", sans-serif';
  ctx.fillText("SETUP", TEX_W / 2, 176);

  ctx.font = '700 32px "Zen Kaku Gothic New", sans-serif';
  ctx.fillText("THREE STEPS, THEN IT JUST RUNS", TEX_W / 2, 246);

  ctx.font = '500 25px "Zen Kaku Gothic New", sans-serif';
  ctx.fillStyle = "#3a3a3a";
  wrap(ctx, "From install to your first ping in under a minute.", TEX_W / 2, 300, 760, 36);

  let y = 430;
  setupSteps.forEach((step) => {
    ctx.strokeStyle = "rgba(22,22,22,0.85)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(92, y);
    ctx.lineTo(TEX_W - 92, y);
    ctx.stroke();
    y += 62;

    ctx.textAlign = "left";
    ctx.fillStyle = "#161616";
    ctx.font = '400 44px "Dela Gothic One", "Zen Kaku Gothic New", sans-serif';
    ctx.fillText(step.num, 92, y);

    ctx.font = '700 36px "Zen Kaku Gothic New", sans-serif';
    ctx.fillText(step.title, 196, y);

    y += 46;
    ctx.font = '500 25px "Zen Kaku Gothic New", sans-serif';
    ctx.fillStyle = "#3a3a3a";
    y = wrap(ctx, step.body, 196, y, 730, 34) + 54;
  });

  // Double rule before the brand.
  ctx.strokeStyle = "rgba(22,22,22,0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(250, 1180);
  ctx.lineTo(TEX_W - 250, 1180);
  ctx.moveTo(250, 1192);
  ctx.lineTo(TEX_W - 250, 1192);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#161616";
  ctx.font = '400 100px "Dela Gothic One", "Zen Kaku Gothic New", sans-serif';
  ctx.fillText("Takoyaki", TEX_W / 2, 1330);

  ctx.font = '600 21px "Zen Kaku Gothic New", sans-serif';
  ctx.fillText("ESTD 2025", TEX_W / 2, 1378);

  ctx.font = '700 30px "Zen Kaku Gothic New", sans-serif';
  ctx.fillText("HOT OFF THE GRILL!", TEX_W / 2, 1430);
}

function Paper({
  progress,
  cursor,
}: {
  progress: React.MutableRefObject<number>;
  cursor: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Frozen copy of the flat grid: every frame is rebuilt from this, so the
  // displaced values can never feed back into themselves.
  const base = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(PAPER_W, PAPER_H, 44, 60);
    return Float32Array.from(geometry.attributes.position.array as Float32Array);
  }, []);

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = TEX_W;
    canvas.height = TEX_H;
    const ctx = canvas.getContext("2d");
    if (ctx) drawReceipt(ctx);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;

    // Redraw once the webfonts are available.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (ctx) drawReceipt(ctx);
        tex.needsUpdate = true;
      });
    }
    return tex;
  }, []);

  useFrame(({ clock, gl, camera }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geometry = mesh.geometry as THREE.PlaneGeometry;
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const normal = geometry.attributes.normal as THREE.BufferAttribute;
    const time = clock.getElapsedTime();
    // The bill unrolls as the user scrolls OR moves the cursor down.
    const p = Math.max(progress.current, cursor.current);
    const roll = 1 - p; // normalised height of the roll edge (1 top → 0 bottom)
    const rollY = roll * PAPER_H - PAPER_H / 2;
    // Keep the curl a constant size on screen: convert the wanted pixel
    // radius into world units for this canvas, no matter its size.
    const perspective = camera as THREE.PerspectiveCamera;
    const visibleH = 2 * camera.position.z * Math.tan(((perspective.fov ?? 40) * Math.PI) / 360);
    const pixelsPerUnit = gl.domElement.clientHeight / visibleH;
    const R = THREE.MathUtils.clamp(ROLL_RADIUS_PX / pixelsPerUnit, 0.2, 1.1);

    for (let i = 0; i < position.count; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const yn = (by + PAPER_H / 2) / PAPER_H;
      const edge = Math.abs(bx) / (PAPER_W / 2); // 0 centre → 1 edge

      if (yn < roll - 0.002) {
        // Below the roll edge the sheet is still rolled up, wrapped around
        // the rolling cylinder that travels downward as you scroll.
        const d = (roll - yn) * PAPER_H;
        const theta = Math.min(ROLL_MAX_TURN, d / R);

        // Real folding: each lap of paper creases over the last.
        const laps = d / (R * 1.1);
        const foldStrength = Math.sin(laps * Math.PI * 2) * 0.03 * (1 - p * 0.6);
        const foldTheta = theta + foldStrength;

        position.setX(i, bx);
        position.setY(i, rollY - R * Math.sin(foldTheta));
        position.setZ(i, R * (1 - Math.cos(foldTheta)) + Math.sin(bx * 2 + time) * 0.014);
      } else {
        // Above it the letter is revealed, hanging with a soft flutter that
        // swings forward and backward and grows toward the loose bottom end.
        const loose = Math.pow(1 - yn, 1.6);
        const sway = Math.sin(time * 0.9) * 0.09 * loose;
        const flutter =
          Math.sin(yn * 6 + time * 1.25) * 0.03 +
          Math.sin(bx * 2.4 + time * 0.9) * 0.02 +
          Math.sin(yn * 13 - time * 1.7) * 0.01;
        // The free edges of the paper curl a little, like real paper.
        const edgeCurl = Math.pow(edge, 2.2) * 0.05 * loose;
        position.setX(i, bx + sway);
        position.setY(i, by);
        position.setZ(i, flutter * (0.4 + yn) + Math.sin(yn * Math.PI) * 0.16 + edgeCurl);
      }
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.35) * 0.05;
      groupRef.current.rotation.x = -0.02 + Math.sin(time * 0.5) * 0.012;
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow>
        <planeGeometry args={[PAPER_W, PAPER_H, 44, 60]} />
        <meshStandardMaterial map={texture} roughness={0.92} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({
  progress,
  cursor,
}: {
  progress: React.MutableRefObject<number>;
  cursor: React.MutableRefObject<number>;
}) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <directionalLight position={[-4, -2, 2]} intensity={0.45} color="#ffe9c0" />
      <Paper progress={progress} cursor={cursor} />
    </>
  );
}

export default function PaperBill({ onReady }: { onReady?: () => void }) {
  const progress = useRef(0);
  const cursor = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(progress, {
      current: 1,
      ease: "none",
      scrollTrigger: { trigger: "[data-bill]", start: "top 85%", end: "top 12%", scrub: 1 },
    });

    // The cursor can unroll the bill too: moving down the viewport reveals it.
    const onMove = (event: PointerEvent) => {
      const top = window.innerHeight * 0.08;
      const bottom = window.innerHeight * 0.92;
      const next = (event.clientY - top) / (bottom - top);
      cursor.current = Math.max(0, Math.min(1, next));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      onCreated={onReady}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.6], fov: 40, near: 0.1, far: 50 }}
    >
      <Scene progress={progress} cursor={cursor} />
    </Canvas>
  );
}
