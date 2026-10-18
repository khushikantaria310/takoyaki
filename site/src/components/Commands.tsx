"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { Bowl } from "@/components/Bowl";
import { HandArrow } from "@/components/HandArrow";
import { commands } from "@/lib/data";

const tilts = [-6, 4, -3, 6, -5, 3, -7, 5];

/** 4 at the back, 4 in front, seated in the bowl. */
const ballPositions = [
  { left: 33, top: 63 },
  { left: 44, top: 63 },
  { left: 56, top: 63 },
  { left: 67, top: 63 },
  { left: 33, top: 77 },
  { left: 44, top: 77 },
  { left: 56, top: 77 },
  { left: 67, top: 77 },
];

const steps = [
  {
    num: "01",
    title: "Install the GitHub App",
    body: "Add Takoyaki to your personal account or organization. For org tracking, install on the org directly.",
  },
  {
    num: "02",
    title: "Run /github link",
    body: "Connect your Discord account to your GitHub username via OAuth.",
  },
  {
    num: "03",
    title: "Run /setchannel",
    body: "Pick a channel and choose Standard Mode (personal pings) or Org Mode (anonymous org-wide events). Done.",
  },
];

export function Commands() {
  const scope = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const quickRef = useRef<{ x: (v: number) => void; y: (v: number) => void }[]>([]);
  const dragRef = useRef<{ el: HTMLButtonElement; sx: number; sy: number } | null>(null);
  const placedRef = useRef<boolean[]>([]);

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

    // Balls drop into the bowl one by one as you scroll (alternating sides).
    const drop = gsap.timeline({
      scrollTrigger: { trigger: "#commands", start: "top top", end: "bottom bottom", scrub: 1 },
    });
    gsap.utils.toArray<HTMLElement>("[data-ball]", scope.current).forEach((ball, index) => {
      const side = index % 3 === 2 ? 1 : -1; // two from the left, one from the right
      drop.fromTo(
        ball,
        { xPercent: side * 58, yPercent: -520, opacity: 0, rotate: side * 16 },
        { xPercent: 0, yPercent: 0, opacity: 1, rotate: 0, ease: "back.out(1.25)", duration: 1.15 },
        index * 0.3,
      );
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

          <div className="stage-bowl-wrap" data-bowl>
            <Bowl className="stage-bowl" />
          </div>

          <div className="plate-balls">
            {commands.map((item, index) => {
              const slot = ballPositions[index % ballPositions.length];
              return (
                <div className="plate-slot" data-slot key={item.id} style={{ left: `${slot.left}%`, top: `${slot.top}%` }}>
                  <button
                    type="button"
                    className="ball ball--plate"
                    data-ball
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
                    <Ball size={170} tilt={tilts[index % tilts.length]} />
                    <span className="tag tag--glass tag--above">
                      <span className="tag__cmd">
                        <HandArrow className="tag__arrow" />
                        {item.command}
                      </span>
                      <span className="tag__desc">{item.note}</span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bill" data-bill>
        <div className="bill__sticky">
          <div className="bill__shadow" data-receipt-shadow aria-hidden="true" />
          <div className="bill__stage">
            <svg className="receipt__chopsticks" viewBox="0 0 660 130" aria-hidden="true">
              <polygon
                points="2,118 18,96 654,30 654,39 18,107"
                fill="url(#takoWood)"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <polygon
                points="58,10 76,18 642,102 642,111 76,28"
                fill="url(#takoWood)"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <line x1="24" y1="101" x2="648" y2="34" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="20" x2="636" y2="105" stroke="rgba(255,255,255,0.32)" strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="receipt" data-receipt>
              <p className="receipt__thanks">Setup</p>
            <p className="receipt__lead">Three steps, then it just runs</p>
            <p className="receipt__note">From install to your first ping in under a minute.</p>

            <div className="receipt__steps">
              {steps.map((step) => (
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
          </div>
        </div>
      </section>
    </div>
  );
}
