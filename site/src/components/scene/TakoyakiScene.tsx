"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import {
  createBallGeometry,
  createChopstickGeometry,
  createMayoGeometry,
  createOnionRingGeometry,
  createSauceGeometry,
  createTrayGeometry,
} from "./geometry";

export type SceneMode = "hero" | "skewer" | "bowl";

const BALLS = 8;

type BallState = { p: number; lift: number };

const HERO_LAYOUT = [
  [-0.78, 0.16],
  [0.0, 0.34],
  [0.78, 0.16],
  [-0.44, -0.2],
  [0.44, -0.2],
];

const DRIFT = [
  { x: 0.16, phase: 0.05, speed: 0.06, sesame: false },
  { x: 0.3, phase: 0.42, speed: 0.05, sesame: true },
  { x: 0.72, phase: 0.2, speed: 0.052, sesame: true },
  { x: 0.86, phase: 0.62, speed: 0.058, sesame: false },
  { x: 0.44, phase: 0.75, speed: 0.066, sesame: false },
  { x: 0.6, phase: 0.32, speed: 0.05, sesame: false },
];

export default function TakoyakiScene({ mode, trigger }: { mode: SceneMode; trigger?: string }) {
  const { camera, size } = useThree();

  const segments = size.width < 720 ? 40 : 64;
  const ballGeometry = useMemo(() => createBallGeometry(segments), [segments]);
  const chopstickGeometry = useMemo(() => createChopstickGeometry(), []);
  const trayGeometry = useMemo(() => createTrayGeometry(), []);
  const sauceGeometry = useMemo(() => createSauceGeometry(), []);
  const mayoGeometry = useMemo(() => createMayoGeometry(), []);
  const onionGeometry = useMemo(() => createOnionRingGeometry(), []);
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
      gradient.addColorStop(0, "rgba(20,26,12,0.55)");
      gradient.addColorStop(1, "rgba(20,26,12,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const chopstickRef = useRef<THREE.Group>(null);
  const trayRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const driftRef = useRef<THREE.Group>(null);
  const ballRefs = useRef<(THREE.Group | null)[]>([]);
  const state = useRef<BallState[]>(Array.from({ length: BALLS }, () => ({ p: mode === "hero" ? 1 : 0, lift: 0 })));
  const rectsRef = useRef<{ ball: DOMRect | null; tray: DOMRect | null }>({ ball: null, tray: null });

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const ball = document.querySelector("[data-slot]");
      const tray = document.querySelector("[data-tray]");
      rectsRef.current = {
        ball: ball ? ball.getBoundingClientRect() : null,
        tray: tray ? tray.getBoundingClientRect() : null,
      };
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const interval = window.setInterval(schedule, 500);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const onClick = (event: Event) => {
      const detail = (event as CustomEvent<{ index: number }>).detail;
      const index = detail?.index ?? -1;
      state.current.forEach((ball, i) => {
        gsap.to(ball, {
          lift: i === index ? 1 : 0,
          duration: i === index ? 0.5 : 0.35,
          ease: i === index ? "back.out(2)" : "power2.out",
        });
      });
    };
    window.addEventListener("tako:hover", onClick);
    return () => window.removeEventListener("tako:hover", onClick);
  }, []);

  useGSAP(() => {
    if (!trigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const timeline = gsap.timeline({
      scrollTrigger: { trigger, start: "top top", end: "bottom bottom", scrub: 1 },
    });
    state.current.forEach((ball, index) => {
      timeline.to(ball, { p: 1, duration: 1, ease: "bounce.out" }, index * 0.34);
    });
  }, { dependencies: [trigger] });

  useFrame(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const fov = perspective.fov * (Math.PI / 180);
    const wpp = (2 * Math.tan(fov / 2) * perspective.position.z) / size.height;
    const toX = (px: number) => (px - size.width / 2) * wpp;
    const toY = (py: number) => -(py - size.height / 2) * wpp;
    const time = performance.now() / 1000;

    const slot = rectsRef.current.ball;
    const slotRadius = slot ? slot.width * 0.5 * wpp : mode === "hero" ? 0.95 : 0.6;
    const radius = mode === "bowl" ? slotRadius * 0.9 : slotRadius;
    const topWorld = (size.height / 2) * wpp;

    if (groupRef.current && mode === "hero") {
      groupRef.current.rotation.y = Math.sin(time * 0.25) * 0.3;
      groupRef.current.position.y = 0.55 + Math.sin(time * 0.7) * 0.07;
    }

    if (chopstickRef.current) {
      const chopRadius = Math.max(0.02, radius * 0.34);
      const length = radius * 7.6;
      chopstickRef.current.position.set(0, radius * 0.2, -0.1);
      chopstickRef.current.rotation.set(0, 0, 0.02);
      chopstickRef.current.scale.set(chopRadius / 0.08, length, chopRadius / 0.08);
      chopstickRef.current.visible = mode === "skewer";
    }

    if (trayRef.current) {
      const trayRect = rectsRef.current.tray;
      const trayRadius = trayRect ? trayRect.width * 0.5 * wpp : 2.0;
      const cy = trayRect ? toY(trayRect.top + trayRect.height * 0.5) : mode === "hero" ? -1.4 : -2.5;
      const cx = trayRect ? toX(trayRect.left + trayRect.width * 0.5) : 0;
      trayRef.current.position.set(cx, cy + (mode === "hero" ? 0.55 : 0), -0.15);
      trayRef.current.rotation.set(mode === "hero" ? -0.26 : -0.16, 0, 0);
      trayRef.current.scale.set(trayRadius, trayRadius * 0.5, trayRadius);
      trayRef.current.visible = mode === "bowl" || mode === "hero";
    }

    if (shadowRef.current) {
      const trayRect = rectsRef.current.tray;
      const trayRadius = trayRect ? trayRect.width * 0.5 * wpp : 2.6;
      const cy = trayRect ? toY(trayRect.top + trayRect.height * 0.72) : -2.5;
      const cx = trayRect ? toX(trayRect.left + trayRect.width * 0.5) : 0;
      shadowRef.current.position.set(cx, cy, -0.4);
      shadowRef.current.scale.set(trayRadius * 1.9, trayRadius * 0.7, 1);
      shadowRef.current.visible = mode !== "skewer";
    }

    for (let i = 0; i < BALLS; i++) {
      const ball = ballRefs.current[i];
      if (!ball) continue;
      const s = state.current[i];

      let targetX = 0;
      let targetY = 0;

      if (mode === "hero") {
        const [lx, ly] = HERO_LAYOUT[i % HERO_LAYOUT.length];
        targetX = lx;
        targetY = ly;
      } else if (slot) {
        const el = document.querySelectorAll<HTMLElement>("[data-slot]")[i];
        const rect = el ? el.getBoundingClientRect() : slot;
        targetX = toX(rect.left + rect.width * 0.5);
        targetY = toY(rect.top + rect.height * 0.5);
      }

      const startY = topWorld + radius * 3 + i * radius * 0.6;
      const y = THREE.MathUtils.lerp(startY, targetY, s.p) + s.lift * radius * 2.6;
      const z = 0.2 + s.lift * 0.5;

      ball.position.set(targetX, y + Math.sin(time * 2.6 + i) * radius * 0.05 * s.p, z);
      ball.rotation.y = time * 0.25 + i;
      ball.rotation.z = (1 - s.p) * 0.5 * Math.sin(i);

      const squash = 1 - 0.22 * Math.sin(Math.min(1, Math.max(0, (s.p - 0.85) * 6.6)) * Math.PI);
      const liftScale = 1 + s.lift * 0.12;
      ball.scale.setScalar(radius * squash * liftScale);
    }

    const drift = driftRef.current;
    if (drift) {
      drift.children.forEach((child, index) => {
        const piece = DRIFT[index % DRIFT.length];
        const progress = (time * piece.speed + piece.phase) % 1;
        child.position.set(
          (piece.x - 0.5) * size.width * wpp,
          topWorld - progress * size.height * wpp,
          0.6,
        );
        child.rotation.z = time * 0.9 + index;
        child.rotation.x = Math.sin(time * 0.5 + index) * 0.7;
      });
    }
  });

  return (
    <group>
      <group ref={trayRef}>
        <mesh geometry={trayGeometry} castShadow receiveShadow>
          <meshStandardMaterial color="#D9BE8E" roughness={0.92} metalness={0} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh ref={shadowRef}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} />
      </mesh>

      <group ref={chopstickRef}>
        <mesh geometry={chopstickGeometry} castShadow>
          <meshStandardMaterial color="#E6CD9E" roughness={0.7} metalness={0} />
        </mesh>
      </group>

      <group ref={driftRef}>
        {DRIFT.map((piece, index) =>
          piece.sesame ? (
            <mesh key={index} scale={0.7}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#F5EEDC" roughness={0.6} />
            </mesh>
          ) : (
            <mesh key={index} geometry={onionGeometry} scale={1.15 + (index % 3) * 0.2}>
              <meshStandardMaterial color="#6FA53A" roughness={0.65} />
            </mesh>
          ),
        )}
      </group>

      <group ref={groupRef}>
        {state.current.map((_, index) => (
          <group
            key={index}
            ref={(element) => {
              ballRefs.current[index] = element;
            }}
          >
            <mesh geometry={ballGeometry} castShadow receiveShadow>
              <meshPhysicalMaterial
                color="#CE8A3E"
                roughness={0.62}
                metalness={0}
                clearcoat={0.45}
                clearcoatRoughness={0.5}
                sheen={0.4}
                sheenColor="#E0A94A"
              />
            </mesh>
            <mesh geometry={sauceGeometry}>
              <meshPhysicalMaterial color="#5E2A0E" roughness={0.22} metalness={0} clearcoat={0.9} clearcoatRoughness={0.2} />
            </mesh>
            <mesh geometry={mayoGeometry}>
              <meshStandardMaterial color="#F5EEDC" roughness={0.75} />
            </mesh>
            <mesh geometry={onionGeometry} position={[0.15, 0.9, 0.35]} rotation={[0.4, 0, 0.3]} scale={1.6}>
              <meshStandardMaterial color="#6FA53A" roughness={0.6} />
            </mesh>
            <mesh geometry={onionGeometry} position={[-0.45, 0.6, 0.6]} rotation={[0.2, 0.6, -0.4]} scale={1.3}>
              <meshStandardMaterial color="#6FA53A" roughness={0.6} />
            </mesh>
            <mesh position={[0.55, 0.45, 0.6]} scale={1}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshStandardMaterial color="#F5EEDC" roughness={0.5} />
            </mesh>
            <mesh position={[-0.2, 0.72, 0.65]} scale={1}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#F5EEDC" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
