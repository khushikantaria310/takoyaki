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
  createTrayGeometry,
} from "./geometry";
import { emitBlur, emitFocus, KEYBOARD_EVENT } from "@/lib/features";

const BALL_COUNT = 8;
const INK = "#1B1B22";

const DRIFT = [
  { x: 0.12, phase: 0.05, speed: 0.06, sesame: false },
  { x: 0.28, phase: 0.4, speed: 0.05, sesame: true },
  { x: 0.72, phase: 0.2, speed: 0.052, sesame: true },
  { x: 0.86, phase: 0.62, speed: 0.058, sesame: false },
  { x: 0.4, phase: 0.75, speed: 0.066, sesame: false },
  { x: 0.6, phase: 0.32, speed: 0.05, sesame: false },
];

type BallState = { p: number; s: number; lift: number };

/** Page 2: the balls land in the tray; poking one lifts it and names it. */
export default function BowlScene() {
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
    Array.from({ length: BALL_COUNT }, (): BallState => ({ p: 0, s: 0, lift: 0 })),
  );
  const rectRef = useRef<DOMRect | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const hoverCapable = useRef(false);
  const activeRef = useRef<{ index: number; source: "pointer" | "keyboard" | null }>({ index: -1, source: null });
  const lastEmit = useRef({ x: -999, y: -999, index: -2 });

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
    hoverCapable.current = window.matchMedia("(hover: hover)").matches;
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    const onPointerLeave = () => {
      pointerRef.current = null;
    };
    const onKey = (event: Event) => {
      setActive((event as CustomEvent<{ index: number }>).detail.index, "keyboard");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    gsap.set(letters, { yPercent: -60, opacity: 0 });

    const settle = gsap.timeline({ delay: 0.4 });
    state.current.forEach((ball, index) => {
      const at = index * 0.16;
      settle.fromTo(ball, { p: 0 }, { p: 1, duration: 0.8, ease: "bounce.out" }, at);
      settle.fromTo(ball, { s: 0.9 }, { s: 0, duration: 0.9, ease: "elastic.out(1, 0.3)" }, at + 0.35);
      if (letters[index]) {
        settle.to(letters[index], { yPercent: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }, index * 0.06);
      }
    });
    return () => { settle.kill(); };
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
    const diameterPx = Math.min(rect.width * 0.13, rect.height * 0.06);
    const radius = diameterPx * 0.5 * wpp;

    if (hoverCapable.current && pointerRef.current) {
      pointerNdc.set(
        (pointerRef.current.x / size.width) * 2 - 1,
        -(pointerRef.current.y / size.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const meshes = ballMeshRefs.current.filter((mesh): mesh is THREE.Mesh => Boolean(mesh));
      const hits = raycaster.intersectObjects(meshes, false);
      setActive(hits.length ? meshes.indexOf(hits[0].object as THREE.Mesh) : -1, "pointer");
    }

    const trayCx = centerX;
    const trayCy = toY(rect.top + rect.height * 0.68);
    const trayRadius = rect.width * 0.3 * wpp;
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

    const chopstick = chopstickRef.current;
    if (chopstick) {
      const chopRadius = rect.width * 0.016 * wpp;
      const length = diameterPx * 4.2 * wpp;
      chopstick.position.set(centerX + rect.width * 0.1 * wpp, trayCy + diameterPx * 2.6 * wpp, 0.35);
      chopstick.rotation.set(0, 0, -0.5);
      chopstick.scale.set(chopRadius / 0.08, length, chopRadius / 0.08);
    }

    const time = performance.now() / 1000;

    for (let i = 0; i < BALL_COUNT; i++) {
      const group = ballRefs.current[i];
      if (!group) continue;
      const ball = state.current[i];
      const progress = ball.p;

      const col = i % 4;
      const row = Math.floor(i / 4);
      const slotX = toX(rect.left + rect.width * 0.5 + (col - 1.5) * diameterPx * 1.18);
      const slotY = toY(rect.top + rect.height * (0.62 + row * 0.055));
      const slotZ = 0.28 + row * 0.12;

      const airborne = (size.height / 2) * wpp + radius * 2.6 + i * radius * 0.5;
      const x = slotX;
      const y = THREE.MathUtils.lerp(airborne, slotY, progress) + ball.lift * radius * 2.6;
      const z = THREE.MathUtils.lerp(0.12, slotZ, progress) + ball.lift * 0.4;

      const falling = 1 - progress;
      const squash = ball.s;
      const idle = progress >= 1 ? 1 : 0;

      group.position.set(x, y + Math.sin(time * 3 + i) * radius * 0.1 * idle, z);
      group.rotation.z = (1 - progress) * 0.4 * Math.sin(i) + Math.sin(time * 4 + i) * 0.05 * idle;
      group.rotation.y = (1 - progress) * 0.6 + ball.lift * 0.4;
      group.scale.set(
        radius * (1 + 0.3 * squash) * (1 - 0.2 * falling) * (1 + ball.lift * 0.12),
        radius * (1 - 0.46 * squash) * (1 + 0.45 * falling) * (1 + ball.lift * 0.12),
        radius * (1 + 0.3 * squash) * (1 - 0.2 * falling) * (1 + ball.lift * 0.12),
      );

      if (i === activeRef.current.index) {
        if (activeRef.current.source === "keyboard") {
          group.getWorldPosition(worldPoint);
          worldPoint.project(camera);
          const sx = (worldPoint.x * 0.5 + 0.5) * size.width;
          const sy = (-worldPoint.y * 0.5 + 0.5) * size.height;
          if (lastEmit.current.index !== i || Math.abs(sx - lastEmit.current.x) > 2 || Math.abs(sy - lastEmit.current.y) > 2) {
            emitFocus(i, sx, sy);
            lastEmit.current = { x: sx, y: sy, index: i };
          }
        } else if (pointerRef.current) {
          const px = pointerRef.current.x;
          const py = pointerRef.current.y;
          if (lastEmit.current.index !== i || Math.abs(px - lastEmit.current.x) > 4 || Math.abs(py - lastEmit.current.y) > 4) {
            emitFocus(i, px, py);
            lastEmit.current = { x: px, y: py, index: i };
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
        child.position.z = 0.4;
        child.rotation.z = time * 0.9 + index;
        child.rotation.x = Math.sin(time * 0.5 + index) * 0.7;
      });
    }
  });

  return (
    <group>
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
          <mesh geometry={onionRingGeometry} position={[0.15, 0.9, 0.35]} rotation={[0.4, 0, 0.3]} scale={1.5}>
            <meshToonMaterial color="#7FBF3A" gradientMap={gradientMap} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
