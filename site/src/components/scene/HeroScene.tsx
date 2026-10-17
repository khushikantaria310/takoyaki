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
  createOnionGeometries,
} from "./geometry";

const BALL_COUNT = 8;
const INK = "#1B1B22";

type BallState = { p: number; s: number };

/**
 * The hero composition lives in world space but is aligned to the DOM
 * `[data-poster-scene]` box every frame, so the 3D balls sit exactly inside
 * the printed poster while the DOM supplies the vertical lettering.
 */
export default function HeroScene() {
  const { camera, size } = useThree();

  const segments = size.width < 720 ? 28 : 40;
  const ballGeometry = useMemo(() => createBallGeometry(segments), [segments]);
  const chopstickGeometry = useMemo(() => createChopstickGeometry(), []);
  const mayoGeometry = useMemo(() => createMayoGeometry(), []);
  const onionGeometries = useMemo(() => createOnionGeometries(), []);
  const gradientMap = useMemo(() => createGradientMap(4), []);

  const chopstickRef = useRef<THREE.Group>(null);
  const ballRefs = useRef<(THREE.Group | null)[]>([]);
  const state = useRef<BallState[]>(
    Array.from({ length: BALL_COUNT }, (): BallState => ({ p: 0, s: 0 })),
  );
  const rectRef = useRef<DOMRect | null>(null);

  // Track the poster box on scroll and resize (rAF-throttled).
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

  // One timeline drops every ball and reveals its matching letter.
  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]");
      gsap.set(letters, { opacity: 0, yPercent: -70 });

      const timeline = gsap.timeline({ delay: 0.45 });
      state.current.forEach((ball, index) => {
        const at = index * 0.34;
        timeline.to(ball, { p: 1, duration: 0.55, ease: "power2.in" }, at);
        timeline.fromTo(
          ball,
          { s: 1 },
          { s: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" },
          at + 0.5,
        );
        if (letters[index]) {
          timeline.to(
            letters[index],
            { opacity: 1, yPercent: 0, duration: 0.4, ease: "back.out(2)" },
            at + 0.5,
          );
        }
      });
    },
    { dependencies: [] },
  );

  useFrame(() => {
    const rect = rectRef.current;
    if (!rect) return;

    const perspective = camera as THREE.PerspectiveCamera;
    const fov = perspective.fov * (Math.PI / 180);
    const worldPerPixel = (2 * Math.tan(fov / 2) * perspective.position.z) / size.height;
    const toX = (px: number) => (px - size.width / 2) * worldPerPixel;
    const toY = (py: number) => -(py - size.height / 2) * worldPerPixel;

    const centerX = toX(rect.left + rect.width * 0.5);
    const radius = rect.width * 0.058 * worldPerPixel;
    const topY = toY(rect.top + rect.height * 0.16);
    const bottomY = toY(rect.top + rect.height * 0.86);
    const startX = centerX - rect.width * 0.16 * worldPerPixel;

    const chopstick = chopstickRef.current;
    if (chopstick) {
      const chopRadius = rect.width * 0.02 * worldPerPixel;
      const length = rect.height * 0.84 * worldPerPixel;
      chopstick.position.set(centerX, toY(rect.top + rect.height * 0.5), -0.05);
      chopstick.rotation.set(0, 0, 0.04);
      chopstick.scale.set(chopRadius / 0.08, length, chopRadius / 0.08);
    }

    for (let i = 0; i < BALL_COUNT; i++) {
      const group = ballRefs.current[i];
      if (!group) continue;

      const ball = state.current[i];
      const progress = ball.p;
      const targetY = topY + (bottomY - topY) * (i / (BALL_COUNT - 1));
      const airborne = (size.height / 2) * worldPerPixel + radius * 2.4 + i * radius * 0.7;
      const y = THREE.MathUtils.lerp(airborne, targetY, progress);
      const x = THREE.MathUtils.lerp(startX, centerX, Math.min(1, progress * 1.25));

      group.position.set(x, y, 0.12 + i * 0.015);
      group.rotation.z = (1 - progress) * 0.5;
      group.rotation.y = (1 - progress) * 0.7;

      const squash = ball.s;
      group.scale.set(
        radius * (1 + 0.2 * squash),
        radius * (1 - 0.34 * squash),
        radius * (1 + 0.2 * squash),
      );
    }
  });

  return (
    <group>
      <group ref={chopstickRef}>
        <mesh geometry={chopstickGeometry}>
          <meshToonMaterial color="#E9D3A3" gradientMap={gradientMap} />
        </mesh>
        <mesh geometry={chopstickGeometry} scale={1.07}>
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      </group>

      {state.current.map((_, index) => (
        <group
          key={index}
          ref={(element) => {
            ballRefs.current[index] = element;
          }}
        >
          <mesh geometry={ballGeometry}>
            <meshToonMaterial color="#C25A1E" gradientMap={gradientMap} />
          </mesh>
          <mesh geometry={ballGeometry} scale={1.08}>
            <meshBasicMaterial color={INK} side={THREE.BackSide} />
          </mesh>
          <mesh geometry={mayoGeometry}>
            <meshToonMaterial color="#F3E9D6" gradientMap={gradientMap} />
          </mesh>
          {onionGeometries.map((geometry, strand) => (
            <mesh key={strand} geometry={geometry}>
              <meshToonMaterial color="#86C23F" gradientMap={gradientMap} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
