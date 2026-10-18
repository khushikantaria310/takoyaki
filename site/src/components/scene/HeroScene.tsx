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
  createGarnishGeometry,
  createGradientMap,
  createMayoGeometry,
  createOnionGeometries,
  createSauceGeometry,
  createTrayGeometry,
} from "./geometry";

const BALL_COUNT = 8;
const INK = "#1B1B22";

type BallState = { p: number; s: number; t: number };

/** Garnish drifting continuously down through the blue panel. */
const DRIFT = [
  { x: 0.14, phase: 0.05, speed: 0.055, sauce: false },
  { x: 0.3, phase: 0.42, speed: 0.048, sauce: true },
  { x: 0.46, phase: 0.7, speed: 0.06, sauce: false },
  { x: 0.62, phase: 0.18, speed: 0.05, sauce: true },
  { x: 0.76, phase: 0.55, speed: 0.058, sauce: false },
  { x: 0.88, phase: 0.85, speed: 0.045, sauce: true },
  { x: 0.38, phase: 0.3, speed: 0.065, sauce: false },
  { x: 0.68, phase: 0.66, speed: 0.052, sauce: true },
];

export default function HeroScene() {
  const { camera, size } = useThree();

  const segments = size.width < 720 ? 32 : 48;
  const ballGeometry = useMemo(() => createBallGeometry(segments), [segments]);
  const chopstickGeometry = useMemo(() => createChopstickGeometry(), []);
  const trayGeometry = useMemo(() => createTrayGeometry(), []);
  const mayoGeometry = useMemo(() => createMayoGeometry(), []);
  const sauceGeometry = useMemo(() => createSauceGeometry(), []);
  const onionGeometries = useMemo(() => createOnionGeometries(), []);
  const garnishGeometry = useMemo(() => createGarnishGeometry(), []);
  const gradientMap = useMemo(() => createGradientMap(5), []);

  const chopstickRef = useRef<THREE.Group>(null);
  const trayRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const driftRef = useRef<THREE.Group>(null);
  const ballRefs = useRef<(THREE.Group | null)[]>([]);
  const state = useRef<BallState[]>(
    Array.from({ length: BALL_COUNT }, (): BallState => ({ p: 0, s: 0, t: 0 })),
  );
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
    gsap.registerPlugin(ScrollTrigger);

    // 1. Autoplay: the balls drop onto the chopstick, then each big letter
    //    falls into place down the left side.
    const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]");
    gsap.set(letters, { yPercent: -170, opacity: 0, rotate: -10 });

    const drop = gsap.timeline({ delay: 0.4, defaults: { ease: "power2.out" } });
    state.current.forEach((ball, index) => {
      const at = index * 0.34;
      drop.to(ball, { p: 1, duration: 0.7, ease: "power2.in" }, at);
      drop.fromTo(
        ball,
        { s: 1 },
        { s: 0, duration: 0.95, ease: "elastic.out(1, 0.32)" },
        at + 0.6,
      );
      if (letters[index]) {
        drop.to(
          letters[index],
          { yPercent: 0, opacity: 1, rotate: 0, duration: 1.05, ease: "bounce.out" },
          at + 0.35,
        );
      }
    });

    // 2. Scroll: the balls arc off the chopstick and settle in the tray.
    const transfer = gsap.timeline({
      scrollTrigger: {
        trigger: "#opening",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });
    state.current.forEach((ball, index) => {
      transfer.to(ball, { t: 1, duration: 1, ease: "power2.inOut" }, index * 0.24);
    });

    return () => {
      drop.kill();
    };
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
    const chopX = centerX;

    const chopstick = chopstickRef.current;
    if (chopstick) {
      const chopRadius = rect.width * 0.016 * wpp;
      const length = diameterPx * 8.4 * wpp;
      chopstick.position.set(chopX, toY(chopTop + diameterPx * 3.8), -0.05);
      chopstick.rotation.set(0, 0, 0.03);
      chopstick.scale.set(chopRadius / 0.08, length, chopRadius / 0.08);
    }

    // Folded paper-boat tray, sitting low in the poster.
    const trayCx = toX(rect.left + rect.width * 0.5);
    const trayCy = toY(rect.top + rect.height * 0.82);
    const trayRadius = rect.width * 0.29 * wpp;
    const tray = trayRef.current;
    if (tray) {
      tray.position.set(trayCx, trayCy, 0.05);
      tray.rotation.set(-0.16, 0, 0);
      tray.scale.set(trayRadius, trayRadius * 0.5, trayRadius);
    }
    if (shadowRef.current) {
      shadowRef.current.position.set(trayCx, trayCy - trayRadius * 0.34, 0.03);
      shadowRef.current.scale.set(trayRadius * 1.35, trayRadius * 0.5, 1);
    }

    const arc = rect.height * 0.16 * wpp;

    for (let i = 0; i < BALL_COUNT; i++) {
      const group = ballRefs.current[i];
      if (!group) continue;

      const ball = state.current[i];
      const progress = ball.p;
      const transferAmount = ball.t;

      const chopY = toY(chopTop + diameterPx * (i + 0.6));
      const airborne = (size.height / 2) * wpp + radius * 2.4 + i * radius * 0.7;

      const col = i % 4;
      const row = Math.floor(i / 4);
      const slotX = toX(rect.left + rect.width * 0.5 + (col - 1.5) * diameterPx * 1.16);
      const slotY = toY(rect.top + rect.height * (0.76 + row * 0.055));
      const slotZ = 0.26 + row * 0.1;

      const dropX = THREE.MathUtils.lerp(startX, chopX, Math.min(1, progress * 1.25));
      const dropY = THREE.MathUtils.lerp(airborne, chopY, progress);

      const x = THREE.MathUtils.lerp(dropX, slotX, transferAmount);
      const y =
        THREE.MathUtils.lerp(dropY, slotY, transferAmount) +
        arc * Math.sin(Math.PI * transferAmount);

      group.position.set(x, y, THREE.MathUtils.lerp(0.12 + i * 0.015, slotZ, transferAmount));
      group.rotation.z = (1 - progress) * 0.5 + transferAmount * 0.15 * Math.sin(i);
      group.rotation.y = (1 - progress) * 0.7;

      const squash = ball.s;
      group.scale.set(
        radius * (1 + 0.2 * squash),
        radius * (1 - 0.34 * squash),
        radius * (1 + 0.2 * squash),
      );
    }

    // Garnish drifting smoothly down the panel, wrapping at the bottom.
    const drift = driftRef.current;
    if (drift) {
      const time = performance.now() / 1000;
      drift.children.forEach((child, index) => {
        const piece = DRIFT[index % DRIFT.length];
        const progress = (time * piece.speed + piece.phase) % 1;
        child.position.x = toX(rect.left + rect.width * piece.x);
        child.position.y = toY(rect.top + rect.height * (0.02 + progress * 0.95));
        child.position.z = 0.3;
        child.rotation.z = time * 0.6 + index;
        child.rotation.x = Math.sin(time * 0.4 + index) * 0.6;
        child.visible = true;
      });
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

      <group ref={trayRef}>
        <mesh geometry={trayGeometry}>
          <meshToonMaterial
            color="#E7D2A0"
            gradientMap={gradientMap}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={trayGeometry} scale={1.02}>
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      </group>

      <mesh ref={shadowRef}>
        <circleGeometry args={[1, 44]} />
        <meshBasicMaterial color="#1B1B22" transparent opacity={0.16} />
      </mesh>

      <group ref={driftRef}>
        {DRIFT.map((piece, index) =>
          piece.sauce ? (
            <mesh key={index} scale={0.6}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshToonMaterial color="#7A3212" gradientMap={gradientMap} />
            </mesh>
          ) : (
            <mesh
              key={index}
              geometry={garnishGeometry}
              scale={0.7 + (index % 3) * 0.12}
            >
              <meshToonMaterial color="#86C23F" gradientMap={gradientMap} />
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
            <meshToonMaterial color="#C25A1E" gradientMap={gradientMap} />
          </mesh>
          <mesh geometry={ballGeometry} scale={1.07}>
            <meshBasicMaterial color={INK} side={THREE.BackSide} />
          </mesh>
          <mesh geometry={sauceGeometry}>
            <meshToonMaterial color="#7A3212" gradientMap={gradientMap} />
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
