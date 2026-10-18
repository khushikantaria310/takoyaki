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
  createOnionRingGeometry,
  createSauceGeometry,
  createTrayGeometry,
} from "./geometry";
import { emitBlur, emitFocus, KEYBOARD_EVENT } from "@/lib/features";

const BALL_COUNT = 8;
const INK = "#1B1B22";

type BallState = { p: number; s: number; t: number; lift: number };

/** Garnish drifting continuously down through the blue panel. */
const DRIFT = [
  { x: 0.14, phase: 0.05, speed: 0.06, kind: "onion" as const },
  { x: 0.3, phase: 0.42, speed: 0.05, kind: "sesame" as const },
  { x: 0.46, phase: 0.7, speed: 0.065, kind: "onion" as const },
  { x: 0.62, phase: 0.18, speed: 0.052, kind: "sesame" as const },
  { x: 0.76, phase: 0.55, speed: 0.062, kind: "onion" as const },
  { x: 0.88, phase: 0.85, speed: 0.048, kind: "sesame" as const },
  { x: 0.38, phase: 0.3, speed: 0.07, kind: "onion" as const },
  { x: 0.68, phase: 0.66, speed: 0.055, kind: "onion" as const },
];

const ONION_ON_BALL = [
  [0.15, 0.92, 0.32, 0.3],
  [-0.4, 0.78, 0.42, -0.6],
  [0.44, 0.66, 0.6, 0.9],
] as const;

const SESAME_ON_BALL = [
  [0.6, 0.5, 0.58],
  [-0.55, 0.58, 0.5],
  [0.1, 0.7, 0.68],
] as const;

export default function HeroScene() {
  const { camera, size } = useThree();

  const segments = size.width < 720 ? 32 : 48;
  const ballGeometry = useMemo(() => createBallGeometry(segments), [segments]);
  const chopstickGeometry = useMemo(() => createChopstickGeometry(), []);
  const trayGeometry = useMemo(() => createTrayGeometry(), []);
  const mayoGeometry = useMemo(() => createMayoGeometry(), []);
  const sauceGeometry = useMemo(() => createSauceGeometry(), []);
  const onionRingGeometry = useMemo(() => createOnionRingGeometry(), []);
  const gradientMap = useMemo(() => createGradientMap(5), []);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useMemo(() => new THREE.Vector2(), []);
  const worldPoint = useMemo(() => new THREE.Vector3(), []);

  const chopstickRef = useRef<THREE.Group>(null);
  const trayRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const driftRef = useRef<THREE.Group>(null);
  const ballRefs = useRef<(THREE.Group | null)[]>([]);
  const ballMeshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const state = useRef<BallState[]>(
    Array.from({ length: BALL_COUNT }, (): BallState => ({ p: 0, s: 0, t: 0, lift: 0 })),
  );
  const rectRef = useRef<DOMRect | null>(null);

  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const hoverCapable = useRef(false);
  const activeRef = useRef<{ index: number; source: "pointer" | "keyboard" | null }>({
    index: -1,
    source: null,
  });
  const lastEmit = useRef({ x: -999, y: -999, index: -2, frame: 0 });

  useEffect(() => {
    hoverCapable.current = window.matchMedia("(hover: hover)").matches;

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    const onPointerLeave = () => {
      pointerRef.current = null;
    };
    const onKey = (event: Event) => {
      const index = (event as CustomEvent<{ index: number }>).detail.index;
      setActive(index, "keyboard");
    };
    const onBlur = () => setActive(-1, null);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener(KEYBOARD_EVENT, onKey);
    window.addEventListener("tako:blur", onBlur);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener(KEYBOARD_EVENT, onKey);
      window.removeEventListener("tako:blur", onBlur);
    };
  }, []);

  const setActive = (index: number, source: "pointer" | "keyboard" | null) => {
    const previous = activeRef.current;
    if (previous.index === index && previous.source === source) return;
    if (previous.index >= 0) {
      gsap.to(state.current[previous.index], { lift: 0, duration: 0.35, ease: "power2.out" });
    }
    if (index >= 0) {
      gsap.to(state.current[index], { lift: 1, duration: 0.45, ease: "back.out(2)" });
    } else {
      lastEmit.current.index = -1;
      emitBlur();
    }
    activeRef.current = { index, source };
  };

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

    const letters = gsap.utils.toArray<HTMLElement>("[data-hero-letter]");
    gsap.set(letters, { yPercent: -170, opacity: 0, rotate: -10 });

    const drop = gsap.timeline({ delay: 0.4 });
    state.current.forEach((ball, index) => {
      const at = index * 0.34;
      drop.to(ball, { p: 1, duration: 0.7, ease: "power2.in" }, at);
      drop.fromTo(
        ball,
        { s: 1.15 },
        { s: 0, duration: 1.05, ease: "elastic.out(1, 0.28)" },
        at + 0.62,
      );
      if (letters[index]) {
        drop.to(
          letters[index],
          { yPercent: 0, opacity: 1, rotate: 0, duration: 1.05, ease: "bounce.out" },
          at + 0.35,
        );
      }
    });

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

    // Hover detection: raycast the pointer into the stack of balls.
    if (hoverCapable.current && pointerRef.current) {
      pointerNdc.set(
        (pointerRef.current.x / size.width) * 2 - 1,
        -(pointerRef.current.y / size.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const meshes = ballMeshRefs.current.filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
      const hits = raycaster.intersectObjects(meshes, false);
      setActive(hits.length ? meshes.indexOf(hits[0].object as THREE.Mesh) : -1, hits.length ? "pointer" : "pointer");
    }

    const chopstick = chopstickRef.current;
    if (chopstick) {
      const chopRadius = rect.width * 0.016 * wpp;
      const length = diameterPx * 8.4 * wpp;
      chopstick.position.set(chopX, toY(chopTop + diameterPx * 3.8), -0.05);
      chopstick.rotation.set(0, 0, 0.03);
      chopstick.scale.set(chopRadius / 0.08, length, chopRadius / 0.08);
    }

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
    const time = performance.now() / 1000;

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

      const falling = 1 - progress;
      const squash = ball.s;
      const stretch = 1 + 0.5 * falling;
      const width = 1 - 0.24 * falling;
      const impactY = 1 - 0.46 * squash;
      const impactXZ = 1 + 0.3 * squash;
      const idle = (1 - transferAmount) * (progress >= 1 ? 1 : 0);

      const lift = ball.lift;

      group.position.set(
        x,
        y + Math.sin(time * 3.2 + i) * radius * 0.14 * idle + lift * radius * 3.4,
        THREE.MathUtils.lerp(0.12 + i * 0.015, slotZ, transferAmount) + lift * 0.35,
      );
      group.rotation.z =
        (1 - progress) * 0.9 * Math.sin(i * 1.7) * 0.6 +
        Math.sin(time * 4 + i) * 0.07 * idle +
        transferAmount * 0.18 * Math.sin(i * 2.1);
      group.rotation.y = (1 - progress) * 0.7 + transferAmount * Math.PI * 0.6 + lift * 0.4;

      group.scale.set(
        radius * impactXZ * width * (1 + lift * 0.12),
        radius * impactY * stretch * (1 + lift * 0.12),
        radius * impactXZ * width * (1 + lift * 0.12),
      );

      if (i === activeRef.current.index) {
        const frame = lastEmit.current.frame + 1;
        lastEmit.current.frame = frame;
        if (activeRef.current.source === "keyboard") {
          group.getWorldPosition(worldPoint);
          worldPoint.project(camera);
          const sx = (worldPoint.x * 0.5 + 0.5) * size.width;
          const sy = (-worldPoint.y * 0.5 + 0.5) * size.height;
          if (
            lastEmit.current.index !== i ||
            Math.abs(sx - lastEmit.current.x) > 2 ||
            Math.abs(sy - lastEmit.current.y) > 2
          ) {
            emitFocus(i, sx, sy);
            lastEmit.current = { x: sx, y: sy, index: i, frame };
          }
        } else if (pointerRef.current) {
          const px = pointerRef.current.x;
          const py = pointerRef.current.y;
          if (
            lastEmit.current.index !== i ||
            Math.abs(px - lastEmit.current.x) > 4 ||
            Math.abs(py - lastEmit.current.y) > 4
          ) {
            emitFocus(i, px, py);
            lastEmit.current = { x: px, y: py, index: i, frame };
          }
        }
      }
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

      <group ref={trayRef}>
        <mesh geometry={trayGeometry}>
          <meshToonMaterial color="#E9D9B4" gradientMap={gradientMap} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={trayGeometry} scale={1.02}>
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      </group>

      <mesh ref={shadowRef}>
        <circleGeometry args={[1, 44]} />
        <meshBasicMaterial color="#0A2A55" transparent opacity={0.22} />
      </mesh>

      <group ref={driftRef}>
        {DRIFT.map((piece, index) =>
          piece.kind === "sesame" ? (
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
          <mesh
            ref={(element) => {
              ballMeshRefs.current[index] = element;
            }}
            geometry={ballGeometry}
          >
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
          {ONION_ON_BALL.map(([x, y, z, rz], ring) => (
            <mesh
              key={`ring-${ring}`}
              geometry={onionRingGeometry}
              position={[x, y, z]}
              rotation={[0.4, 0, rz]}
              scale={1.5}
            >
              <meshToonMaterial color="#7FBF3A" gradientMap={gradientMap} />
            </mesh>
          ))}
          {SESAME_ON_BALL.map(([x, y, z], seed) => (
            <mesh key={`seed-${seed}`} position={[x, y, z]} scale={1.1}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshToonMaterial color="#F7EFDF" gradientMap={gradientMap} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
