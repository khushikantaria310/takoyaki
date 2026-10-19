"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import BillPaper from "@/components/BillPaper";
import { HandArrow } from "@/components/HandArrow";
import { Plate } from "@/components/Plate";
import { commands, setupSteps } from "@/lib/data";

const tilts = [-6, 4, -3, 6, -5, 3, -7, 5];

/**
 * Where each ball's hand-written note + arrow come from, so every ball is
 * pointed at from a different direction.
 *   t = from above the ball, b = from below; l/c/r = left/centre/right.
 */
const arrowPos: Record<string, "tl" | "tc" | "tr" | "bl" | "bc" | "br"> = {
  link: "tl",
  unlink: "tc",
  setchannel: "tc",
  me: "tr",
  streak: "bl",
  compare: "bc",
  top: "bc",
  topday: "br",
};

/**
 * Where each takoyaki sits on the plate, in the plate's own 1000×480 space.
 * Four in the back row, four in front — all the same size, neatly spaced,
 * and the front row overlaps the back one so the pile reads as heaped.
 */
const spots = [
  { x: 275, y: 226, z: 1 },
  { x: 425, y: 220, z: 1 },
  { x: 575, y: 220, z: 1 },
  { x: 725, y: 226, z: 1 },
  { x: 275, y: 318, z: 2 },
  { x: 425, y: 322, z: 2 },
  { x: 575, y: 322, z: 2 },
  { x: 725, y: 318, z: 2 },
];

export function Commands() {
  const scope = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const quickRef = useRef<{ x: (v: number) => void; y: (v: number) => void }[]>([]);
  const dragRef = useRef<{ el: HTMLButtonElement; sx: number; sy: number } | null>(null);
  const placedRef = useRef<boolean[]>([]);

  const renderBall = (item: (typeof commands)[number], index: number) => {
    const spot = spots[index];
    return (
      <div
        className="plate-slot"
        key={item.id}
        style={{
          left: `${(spot.x / 1000) * 100}%`,
          top: `${(spot.y / 480) * 100}%`,
          zIndex: spot.z,
        }}
      >
        <button
          type="button"
          className="ball ball--plate"
          data-ball
          data-slot
          aria-label={`${item.command}. ${item.note}`}
          ref={(element) => {
            ballsRef.current[index] = element;
          }}
          onPointerDown={(event) => {
            const ball = ballsRef.current[index];
            if (!ball) return;
            event.preventDefault();
            try {
              (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
            } catch {
              /* ignore */
            }
            dragRef.current = { el: ball, sx: event.clientX, sy: event.clientY };
            placedRef.current[index] = true;
            gsap.to(ball, { scale: 1.12, duration: 0.25, ease: "back.out(2)" });
          }}
        >
          <Ball size={200} tilt={tilts[index % tilts.length]} />
          <span
            className={`tag tag--above tag--${arrowPos[item.id]}${spot.z === 1 ? " tag--row-back" : ""}`}
            aria-hidden="true"
          >
            {spot.z === 1 || arrowPos[item.id][0] === "t" ? (
              <>
                <span className="tag__bubble">
                  <span className="tag__note">
                    <span className="tag__note-in">
                      <span className="tag__note-text">{item.note}</span>
                      <span className={`tag__price price--${item.price}`}>{item.price}</span>
                    </span>
                  </span>
                </span>
                <span className="tag__label">
                  <span className="tag__label-text">{item.command}</span>
                  <HandArrow className="tag__label-arrow" />
                </span>
              </>
            ) : (
              <>
                <span className="tag__label">
                  <span className="tag__label-text">{item.command}</span>
                  <HandArrow className="tag__label-arrow" />
                </span>
                <span className="tag__bubble">
                  <span className="tag__note">
                    <span className="tag__note-in">
                      <span className="tag__note-text">{item.note}</span>
                      <span className={`tag__price price--${item.price}`}>{item.price}</span>
                    </span>
                  </span>
                </span>
              </>
            )}
          </span>
        </button>
      </div>
    );
  };

  useEffect(() => {
    quickRef.current = ballsRef.current.map((ball) =>
      ball
        ? {
            x: gsap.quickTo(ball, "x", { duration: 0.6, ease: "power3" }),
            y: gsap.quickTo(ball, "y", { duration: 0.6, ease: "power3" }),
          }
        : { x: () => {}, y: () => {} },
    );

    const onMove = (event: PointerEvent) => {
      const dragging = dragRef.current;
      if (dragging) {
        gsap.set(dragging.el, { x: event.clientX - dragging.sx, y: event.clientY - dragging.sy });
        return;
      }
      ballsRef.current.forEach((ball, index) => {
        if (!ball) return;
        // A ball the user has placed keeps its position — no magnetic pull.
        if (placedRef.current[index]) return;
        const rect = ball.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const reach = 260;
        const pull = distance < reach ? (1 - distance / reach) * 0.24 : 0;
        quickRef.current[index]?.x(dx * pull);
        quickRef.current[index]?.y(dy * pull);
      });
    };

    const onUp = () => {
      // The ball stays exactly where the cursor left it — no springing back.
      if (dragRef.current) {
        gsap.to(dragRef.current.el, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
      }
      dragRef.current = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const intro = gsap.timeline({
      scrollTrigger: { trigger: "#commands", start: "top 70%", end: "top 20%", scrub: true },
    });
    intro.fromTo("[data-commands-head]", { opacity: 0, y: 20 }, { opacity: 1, y: 0 });

    // Each takoyaki falls onto the plate, bounces, and settles for good.
    const fall = gsap.timeline({
      scrollTrigger: {
        trigger: "#commands",
        start: "top 55%",
        toggleActions: "play none none none",
      },
    });

    gsap.utils.toArray<HTMLElement>("[data-ball]", scope.current).forEach((ball, index) => {
      const at = index * 0.14;
      const spin = (index % 2 === 0 ? 1 : -1) * (8 + index * 2);

      fall
        .fromTo(
          ball,
          { y: -window.innerHeight * 1.1, opacity: 0, rotation: spin * 3 },
          { opacity: 1, duration: 0.08 },
          at,
        )
        // Gravity: accelerating drop onto the plate.
        .to(ball, { y: 0, duration: 1.05, ease: "power1.in" }, at)
        // Impact: the ball squashes and hops.
        .to(ball, { scaleY: 0.76, scaleX: 1.18, duration: 0.09, ease: "power2.out" }, at + 1.05)
        .to(ball, { y: -46, duration: 0.24, ease: "power2.out" }, at + 1.09)
        // Settle: it bounces a couple of times, then comes to rest.
        .to(ball, { y: 0, duration: 0.85, ease: "bounce.out" }, at + 1.33)
        .to(ball, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" }, at + 1.14)
        .to(ball, { rotation: spin, duration: 0.9, ease: "elastic.out(1, 0.35)" }, at + 1.14);
    });

    // The bill unrolls downward like a letter, then floats.
    gsap.fromTo(
      "[data-receipt]",
      { clipPath: "inset(0% 0% 100% 0%)", y: 0 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: "[data-bill]", start: "top 85%", end: "bottom bottom", scrub: 1 },
      },
    );
    gsap.fromTo(
      "[data-receipt-roll]",
      { top: "0%" },
      {
        top: "100%",
        ease: "none",
        scrollTrigger: { trigger: "[data-bill]", start: "top 85%", end: "bottom bottom", scrub: 1 },
      },
    );
    gsap.to("[data-receipt]", {
      y: -10,
      rotate: 0.8,
      duration: 3.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.4,
    });
    gsap.to("[data-receipt-shadow]", {
      scaleX: 1.08,
      opacity: 0.34,
      duration: 3.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.4,
    });
  }, { scope });

  return (
    <div ref={scope}>
      <section id="commands" className="stage stage--tray">
        <div className="stage__sticky">
          <div className="stage__head" data-commands-head>
            <p className="stage__eyebrow">Commands</p>
            <h2 className="stage__title">Point at a takoyaki for its command</h2>
          </div>

          <div className="stage-plate-wrap">
            <div className="plate-scene">
              <Plate className="plate-scene__back" />
              <div className="plate-scene__balls">
                {commands.map((item, index) => renderBall(item, index))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bill" data-bill>
        <div className="bill__sticky">
          <div className="bill__shadow" data-receipt-shadow aria-hidden="true" />
          <BillPaper />
          <div className="bill__stage">
            <svg className="receipt__chopsticks receipt__chopsticks--back" viewBox="0 0 900 220" aria-hidden="true">
              {/* Back stick — tucks behind the paper. */}
              <polygon
                points="0,112 900,15 900,25 0,128"
                fill="url(#takoWood)"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <line x1="40" y1="112" x2="880" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="receipt" data-receipt>
              <p className="receipt__thanks">Setup</p>
            <p className="receipt__lead">Three steps, then it just runs</p>
            <p className="receipt__note">From install to your first ping in under a minute.</p>

            <div className="receipt__steps">
              {setupSteps.map((step) => (
                <div className="receipt__step" key={step.num}>
                  <span className="receipt__num">{step.num}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="receipt__divider" aria-hidden="true" />

            <p className="receipt__brand">Takoyaki</p>
            <p className="receipt__estd">estd 2025</p>
            <p className="receipt__tag">hot off the grill!</p>

            <span className="receipt__roll-edge" data-receipt-roll aria-hidden="true" />
            </div>

            <svg className="receipt__chopsticks receipt__chopsticks--front" viewBox="0 0 900 220" aria-hidden="true">
              {/* Front stick — lies across the paper. */}
              <polygon
                points="0,92 900,195 900,205 0,108"
                fill="url(#takoWood)"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <line x1="40" y1="100" x2="880" y2="200" stroke="rgba(255,255,255,0.32)" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}
