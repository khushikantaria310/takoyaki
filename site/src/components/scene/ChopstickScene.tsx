"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import {
  createBallGeometry,
  createChopstickGeometry,
  createGradientMap,
  createMayoGeometry,
  createOnionRingGeometry,
  createSauceGeometry,
} from "./geometry";

const BALL_COUNT = 8;
const INK = "#1B1B22";

const DRIFT = [
  { x: 0.15, phase: 0.05, speed: 0.06, sesame: false },
  { x: 0.3, phase: 0.42, speed: 0.05, sesame: true },
  { x: 0.48, phase: 0.7, speed: 0.065, sesame: false },
  { x: 0.63, phase: 0.18, speed: 0.052, sesame: true },
  { x: 0.78, phase: 0.55, speed: 0.062, sesame: false },
  { x: 0.9, phase: 0.85, speed: 0.048, sesame: true },
  { x: 0.38, phase: 0.3, speed: 0.07, sesame: false },
  { x: 0.7, phase: 0.66, speed: 0.055, sesame: false },
];

/** Page 1: a single chopstick; balls drop in while the letters fall. */
export default function ChopstickScene() {
  const { camera, size } = useThree();

  const segments = size.width < 720 ? 32 : 48;
  const ballGeometry = useMemo(() => createBallGeometry(segments), [segments]);
  const chopstickGeometry = useMemo(() => createChopstickGeometry(), []);
  const mayoGeometry = useMemo(() => createMayoGeometry(), []);
  const sauceGeometry = useMemo(() => createSauceGeometry(), []);
  const onionRingGeometry = useMemo(() => createOnionRingGeometry(), []);
  const gradientMap = useMemo(() => createGradientMap(5), []);

  const chopstickRef = useRef<THREE.Group>(null);
  const driftRef = useRef<THREE.Group>(null);
  const ballRefs = useRef<(THREE.Group | null)[]>([]);
  const state = useRef(Array.from({ length: BALL_COUNT }, () => ({ p: 0, s: 0 })));
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const target = document.querySelector("[data-poster-scene]");
      rectRef.current = target ? target.getBoundingClientRect() : null;
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

  useGSAP(() => {
    const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]");
    gsap.set(letters, { yPercent: -170, opacity: 0, rotate: -10 });
    const drop = gsap.timeline({ delay: 0.4 });
    state.current.forEach((ball, index) => {
      const at = index * 0.34;
      drop.to(ball, { p: 1, duration: 0.7, ease: "power2.in" }, at);
      drop.fromTo(ball, { s: 1.15 }, { s: 0, duration: 1.05, ease: "elastic.out(1, 0.28)" }, at + 0.62);
      if (letters[index]) {
        drop.to(letters[index], { yPercent: 0, opacity: 1, rotate: 0, duration: 1.05, ease: "bounce.out" }, at + 0.35);
      }
    });
    return () => { drop.kill(); };
  }, { dependencies: [] });

  useFrame(() => {
    const rect = rectRef.current;
    if (!rect) return;

    const perspective = camera as THREE.PerspectiveCamera;
    const fov = perspective.fov * (Math.PI / 180);
    const wpp = (2 * Math.tan(fov / 2) * perspective.position.z) / size.height;
    const toX = (px: number) => (px - size.width / 2) * wpp;
    const toY = (py: number) => -(py - size.height / 2) * wpp;

    const centerX = toX(rect.left + rect.width * 0.5);
    const diameterPx = Math.min(rect.width * 0.12, rect.height * 0.055);
    const radius = diameterPx * 0.5 * wpp;
    const startX = centerX - rect.width * 0.18 * wpp;
    const chopTop = rect.top + rect.height * 0.12;

    const chopstick = chopstickRef.current;
    if (chopstick) {
      const chopRadius = rect.width * 0.016 * wpp;
      const length = diameterPx * 8.4 * wpp;
      chopstick.position.set(centerX, toY(chopTop + diameterPx * 3.8), -0.05);
      chopstick.rotation.set(0, 0, 0.03);
      chopstick.scale.set(chopRadius / 0.08, length, chopRadius / 0.08);
    }

    const time = performance.now() / 1000;

    for (let i = 0; i < BALL_COUNT; i++) {
      const group = ballRefs.current[i];
      if (!group) continue;
      const ball = state.current[i];
      const progress = ball.p;
      const chopY = toY(chopTop + diameterPx * (i + 0.6));
      const airborne = (size.height / 2) * wpp + radius * 2.4 + i * radius * 0.7;
      const x = THREE.MathUtils.lerp(startX, centerX, Math.min(1, progress * 1.25));
      const y = THREE.MathUtils.lerp(airborne, chopY, progress);

      const falling = 1 - progress;
      const squash = ball.s;
      const idle = progress >= 1 ? 1 : 0;

      group.position.set(x, y + Math.sin(time * 3.2 + i) * radius * 0.14 * idle, 0.12 + i * 0.015);
      group.rotation.z = (1 - progress) * 0.9 * Math.sin(i * 1.7) * 0.6 + Math.sin(time * 4 + i) * 0.07 * idle;
      group.rotation.y = (1 - progress) * 0.7;
      group.scale.set(
        radius * (1 + 0.3 * squash) * (1 - 0.24 * falling),
        radius * (1 - 0.46 * squash) * (1 + 0.5 * falling),
        radius * (1 + 0.3 * squash) * (1 - 0.24 * falling),
      );
    }

    const drift = driftRef.current;
    if (drift) {
      drift.children.forEach((child, index) => {
        const piece = DRIFT[index % DRIFT.length];
        const progress = (time * piece.speed + piece.phase) % 1;
        child.position.x = toX(rect.left + rect.width * piece.x);
        child.position.y = toY(rect.top + rect.height * (0.02 + progress * 0.95));
        child.position.z = 0.3;
        child.rotation.z = time * 0.9 + index;
        child.rotation.x = Math.sin(time * 0.5 + index) * 0.7;
      });
    }
  });

  return (
    <group>
      <group ref={chopstickRef}>
        <mesh geometry={chopstickGeometry}>
          <meshToonMaterial color="#EBD9AE" gradientMap={gradientMap} />
        </mesh>
        <mesh geometry={chopstickGeometry} scale={1.07}>
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      </group>

      <group ref={driftRef}>
        {DRIFT.map((piece, index) =>
          piece.sesame ? (
            <mesh key={index} scale={0.8}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshToonMaterial color="#F7EFDF" gradientMap={gradientMap} />
            </mesh>
          ) : (
            <mesh key={index} geometry={onionRingGeometry} scale={1.1 + (index % 3) * 0.2}>
              <meshToonMaterial color="#7FBF3A" gradientMap={gradientMap} />
            </mesh>
          ),
        )}
      </group>

      {state.current.map((_, index) => (
        <group
          key={index}
          ref={(element) => {
            ballRefs.current[index] = element;
          }}
        >
          <mesh geometry={ballGeometry}>
            <meshToonMaterial color="#C77C3C" gradientMap={gradientMap} />
          </mesh>
          <mesh geometry={ballGeometry} scale={1.07}>
            <meshBasicMaterial color={INK} side={THREE.BackSide} />
          </mesh>
          <mesh geometry={sauceGeometry}>
            <meshToonMaterial color="#5B2708" gradientMap={gradientMap} />
          </mesh>
          <mesh geometry={mayoGeometry}>
            <meshToonMaterial color="#F7EFDF" gradientMap={gradientMap} />
          </mesh>
          <mesh geometry={onionRingGeometry} position={[0.15, 0.9, 0.35]} rotation={[0.4, 0, 0.3]} scale={1.5}>
            <meshToonMaterial color="#7FBF3A" gradientMap={gradientMap} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
