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

  // Visible crease/fold lines on the paper
  ctx.strokeStyle = "rgba(120,100,58,0.25)";
  ctx.lineWidth = 2;
  // Vertical center crease
  ctx.beginPath();
  ctx.moveTo(TEX_W / 2, 150);
  ctx.lineTo(TEX_W / 2, TEX_H - 80);
  ctx.stroke();
  // Horizontal crease lines
  for (let cy = 320; cy < 1350; cy += 220) {
    ctx.beginPath();
    ctx.moveTo(80, cy);
    ctx.lineTo(TEX_W - 80, cy);
    ctx.stroke();
  }

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

function Paper({ progress }: { progress: React.MutableRefObject<number> }) {
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

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const geometry = mesh.geometry as THREE.PlaneGeometry;
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const normal = geometry.attributes.normal as THREE.BufferAttribute;
    const time = clock.getElapsedTime();
    const p = progress.current;
    const roll = 1 - p; // normalised height of the roll edge (1 top → 0 bottom)
    const rollY = roll * PAPER_H - PAPER_H / 2;
    const R = 0.07;

    for (let i = 0; i < position.count; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const yn = (by + PAPER_H / 2) / PAPER_H;

      if (yn < roll - 0.002) {
        // Below the roll edge the sheet is still rolled up, wrapped around
        // the rolling cylinder that travels downward as you scroll.
        const d = (roll - yn) * PAPER_H;
        const theta = Math.min(Math.PI, d / R);
        
        // Visible fold lines - add sharp crease displacement
        const foldStrength = Math.sin(d * 40) * 0.003 * (1 - p);
        const foldTheta = theta + foldStrength;
        
        position.setX(i, bx);
        position.setY(i, rollY - R * Math.sin(foldTheta));
        position.setZ(i, R * (1 - Math.cos(foldTheta)) + Math.sin(bx * 2 + time) * 0.006);
      } else {
        // Above it the letter is revealed, hanging with a soft flutter.
        const flutter =
          Math.sin(yn * 6 + time * 1.25) * 0.02 +
          Math.sin(bx * 2.4 + time * 0.9) * 0.012 +
          Math.sin(yn * 13 - time * 1.7) * 0.006;
        position.setX(i, bx);
        position.setY(i, by);
        position.setZ(i, flutter * (0.4 + yn) + Math.sin(yn * Math.PI) * 0.14);
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

function Chopsticks() {
  const stick = useMemo(() => {
    const points: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      points.push(new THREE.Vector2(0.016 + 0.038 * Math.pow(t, 1.5), t));
    }
    const geometry = new THREE.LatheGeometry(points, 18);
    geometry.translate(0, -0.5, 0);
    geometry.rotateZ(Math.PI / 2);
    return geometry;
  }, []);

  const tipY = PAPER_H / 2 + 0.02;

  return (
    <group>
      {/* Back stick, tip reaching down behind the paper. */}
      <mesh geometry={stick} position={[1.02, tipY + 0.6, -0.22]} rotation={[0, -0.06, 0.5]} scale={[-2.1, 1, 1]}>
        <meshStandardMaterial color="#c1955c" roughness={0.55} metalness={0} />
      </mesh>
      {/* Front stick, tip pinching the roll from the front. */}
      <mesh geometry={stick} position={[-1.02, tipY + 0.6, 0.22]} rotation={[0, 0.06, -0.5]} scale={[2.1, 1, 1]}>
        <meshStandardMaterial color="#dcb986" roughness={0.5} metalness={0} />
      </mesh>
    </group>
  );
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <directionalLight position={[-4, -2, 2]} intensity={0.45} color="#ffe9c0" />
      <Paper progress={progress} />
      <Chopsticks />
    </>
  );
}

export default function PaperBill({ onReady }: { onReady?: () => void }) {
  const progress = useRef(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(progress, {
      current: 1,
      ease: "none",
      scrollTrigger: { trigger: "[data-bill]", start: "top 85%", end: "top 12%", scrub: 1 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
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
      <Scene progress={progress} />
    </Canvas>
  );
}
