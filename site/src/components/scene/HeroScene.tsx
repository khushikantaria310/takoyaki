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
  createGradientMap,
  createMayoGeometry,
  createOnionGeometries,
  createSauceGeometry,
  createTrayGeometry,
} from "./geometry";

const BALL_COUNT = 8;
const INK = "#1B1B22";

type BallState = { p: number; s: number; t: number };

/** A handful of loose onion strands drifting in the blue panel. */
const SCATTER = [
  { x: 0.2, y: 0.75, r: 0.7 },
  { x: 0.74, y: 0.62, r: -0.4 },
  { x: 0.3, y: 0.44, r: 2.1 },
  { x: 0.82, y: 0.34, r: 1.2 },
  { x: 0.14, y: 0.28, r: -1.6 },
  { x: 0.66, y: 0.18, r: 0.5 },
];

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
  const trayGeometry = useMemo(() => createTrayGeometry(), []);
  const mayoGeometry = useMemo(() => createMayoGeometry(), []);
  const sauceGeometry = useMemo(() => createSauceGeometry(), []);
  const onionGeometries = useMemo(() => createOnionGeometries(), []);
  const gradientMap = useMemo(() => createGradientMap(4), []);

  const chopstickRef = useRef<THREE.Group>(null);
  const trayRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const scatterRef = useRef<THREE.Group>(null);
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

    // 1. Autoplay: the balls drop onto the chopstick and the letters appear.
    const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]");
    gsap.set(letters, { opacity: 0, yPercent: -70 });

    const drop = gsap.timeline({ delay: 0.5 });
    state.current.forEach((ball, index) => {
      const at = index * 0.34;
      drop.to(ball, { p: 1, duration: 0.55, ease: "power2.in" }, at);
      drop.fromTo(
        ball,
        { s: 1 },
        { s: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" },
        at + 0.5,
      );
      if (letters[index]) {
        drop.to(
          letters[index],
          { opacity: 1, yPercent: 0, duration: 0.4, ease: "back.out(2)" },
          at + 0.5,
        );
      }
    });

    // 2. Scroll: the same balls arc off the chopstick and settle in the tray.
    //    Desktop pins the poster for a cinematic transfer; phones keep the
    //    scroll-driven sequence without pinning so nothing is trapped.
    const media = gsap.matchMedia();

    media.add("(min-width: 761px)", () => {
      const transfer = gsap.timeline({
        scrollTrigger: {
          trigger: "#opening",
          start: "top top",
          end: "+=110%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      state.current.forEach((ball, index) => {
        transfer.to(ball, { t: 1, duration: 1, ease: "power2.inOut" }, index * 0.24);
      });
      return () => transfer.kill();
    });

    media.add("(max-width: 760px)", () => {
      const transfer = gsap.timeline({
        scrollTrigger: {
          trigger: "#opening",
          start: "top 65%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
      state.current.forEach((ball, index) => {
        transfer.to(ball, { t: 1, duration: 1, ease: "power2.inOut" }, index * 0.24);
      });
      return () => transfer.kill();
    });

    return () => {
      drop.kill();
      media.revert();
    };
  }, { dependencies: [] });

  useFrame((_, delta) => {
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

    // Paper-boat tray, sitting low in the poster.
    const trayCx = toX(rect.left + rect.width * 0.5);
    const trayCy = toY(rect.top + rect.height * 0.79);
    const trayScaleX = rect.width * 0.34 * wpp;
    const trayScaleY = rect.width * 0.15 * wpp;
    const trayScaleZ = rect.width * 0.24 * wpp;
    const tray = trayRef.current;
    if (tray) {
      tray.position.set(trayCx, trayCy, 0.05);
      tray.rotation.set(-0.22, 0, 0);
      tray.scale.set(trayScaleX, trayScaleY, trayScaleZ);
    }
    if (shadowRef.current) {
      shadowRef.current.position.set(trayCx, trayCy - trayScaleY * 0.55, 0.04);
      shadowRef.current.scale.set(trayScaleX * 1.3, trayScaleY * 0.7, 1);
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
      const slotX = toX(rect.left + rect.width * 0.5 + (col - 1.5) * diameterPx * 1.22);
      const slotY = toY(rect.top + rect.height * 0.79 + (row - 0.5) * diameterPx * 1.15);
      const slotZ = 0.34 + row * 0.12;

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

    // Gentle drift for the loose onion strands.
    const scatter = scatterRef.current;
    if (scatter) {
      const time = performance.now() / 1000;
      scatter.position.set(centerX, toY(rect.top + rect.height * 0.42), 0.3);
      scatter.children.forEach((child, index) => {
        child.rotation.z = time * 0.25 + index;
        child.position.y = Math.sin(time * 0.8 + index) * 0.06;
      });
    }
    void delta;
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
            color="#E9D3A3"
            gradientMap={gradientMap}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={trayGeometry} scale={1.03}>
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      </group>

      <mesh ref={shadowRef}>
        <circleGeometry args={[1, 40]} />
        <meshBasicMaterial color="#1B1B22" transparent opacity={0.16} />
      </mesh>

      <group ref={scatterRef}>
        {SCATTER.map((piece, index) => (
          <mesh
            key={index}
            geometry={onionGeometries[index % onionGeometries.length]}
            position={[(piece.x - 0.5) * 1.2, (piece.y - 0.5) * 1.2, 0]}
            rotation={[0, 0, piece.r]}
            scale={0.7}
          >
            <meshToonMaterial color="#86C23F" gradientMap={gradientMap} />
          </mesh>
        ))}
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
