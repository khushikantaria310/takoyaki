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

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

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

    const onUp = (event: PointerEvent) => {
      const dragging = dragRef.current;
      if (!dragging) return;
      dragRef.current = null;
      const el = dragging.el;

      const bowl = document.querySelector("[data-bowl]");
      const rect = bowl?.getBoundingClientRect();
      const inside =
        !!rect &&
        event.clientX > rect.left &&
        event.clientX < rect.right &&
        event.clientY > rect.top &&
        event.clientY < rect.bottom;

      if (!inside) {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
        return;
      }

      // Snap to the nearest slot so the ball visibly settles into the bowl.
      const elRect = el.getBoundingClientRect();
      const cx = elRect.left + elRect.width / 2;
      const cy = elRect.top + elRect.height / 2;
      let best: { x: number; y: number } | null = null;
      let bestDistance = Infinity;
      document.querySelectorAll("[data-slot]").forEach((slot) => {
        const r = slot.getBoundingClientRect();
        const sx = r.left + r.width / 2;
        const sy = r.top + r.height / 2;
        const distance = Math.hypot(sx - cx, sy - cy);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = { x: sx, y: sy };
        }
      });

      const currentX = Number(gsap.getProperty(el, "x")) || 0;
      const currentY = Number(gsap.getProperty(el, "y")) || 0;
      if (best) {
        const target = best as { x: number; y: number };
        gsap.to(el, {
          x: currentX + (target.x - cx),
          y: currentY + (target.y - cy),
          duration: 0.45,
          ease: "back.out(1.6)",
        });
      }
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

    const drop = gsap.timeline({
      scrollTrigger: { trigger: "#commands", start: "top top", end: "bottom bottom", scrub: 1 },
    });

    gsap.utils.toArray<HTMLElement>("[data-ball]", scope.current).forEach((ball, index) => {
      const side = index % 3 === 2 ? 1 : -1; // two from the left, one from the right
      drop.fromTo(
        ball,
        { xPercent: side * 58, yPercent: -520, opacity: 0, rotate: side * 16 },
        { xPercent: 0, yPercent: 0, opacity: 1, rotate: 0, ease: "back.out(1.25)", duration: 1.15 },
        1.1 + index * 0.26,
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
          <div className="stage__head">
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
                      if (!window.matchMedia("(pointer: fine)").matches) return;
                      const ball = ballsRef.current[index];
                      if (!ball) return;
                      event.preventDefault();
                      try {
                        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
                      } catch {
                        /* ignore */
                      }
                      dragRef.current = { el: ball, sx: event.clientX, sy: event.clientY };
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
            <div className="receipt__chopsticks" aria-hidden="true">
              <span className="receipt__stick receipt__stick--a" />
              <span className="receipt__stick receipt__stick--b" />
            </div>

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
