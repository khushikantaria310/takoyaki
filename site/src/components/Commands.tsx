"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { Plate } from "@/components/Plate";
import { HandArrow } from "@/components/HandArrow";
import { commands } from "@/lib/data";

const tilts = [-6, 4, -3, 6, -5, 3, -7, 5];

/** 2 front · 2 right · 2 left · 2 back, so every ball stays visible. */
const ballPositions = [
  { left: 43, top: 51 },
  { left: 57, top: 51 },
  { left: 26, top: 65 },
  { left: 26, top: 81 },
  { left: 74, top: 65 },
  { left: 74, top: 81 },
  { left: 43, top: 91 },
  { left: 57, top: 91 },
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
      // Balls lean toward the cursor.
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
      const plate = document.querySelector("[data-plate]");
      const rect = plate?.getBoundingClientRect();
      const inside =
        rect &&
        event.clientX > rect.left &&
        event.clientX < rect.right &&
        event.clientY > rect.top &&
        event.clientY < rect.bottom;
      if (!inside) {
        gsap.to(dragging.el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
      } else {
        gsap.to(dragging.el, { scale: 1, duration: 0.3, ease: "back.out(2)" });
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

    drop.fromTo(
      "[data-plate]",
      { xPercent: 130, opacity: 0 },
      { xPercent: 0, opacity: 1, ease: "power4.out", duration: 1.3 },
      0,
    );

    gsap.utils.toArray<HTMLElement>("[data-ball]", scope.current).forEach((ball, index) => {
      drop.fromTo(
        ball,
        { yPercent: -560, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "back.out(1.25)", duration: 1.1 },
        1.1 + index * 0.26,
      );
    });

    gsap.to("[data-curtain]", {
      yPercent: -102,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-curtain-section]",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    gsap.fromTo(
      "[data-receipt]",
      { opacity: 0, y: 140, rotate: -16, scale: 0.84, transformOrigin: "50% 90%" },
      {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-curtain-section]", start: "top 70%", end: "top 15%", scrub: true },
      },
    );
    gsap.to("[data-receipt]", {
      y: -10,
      rotate: 1.4,
      duration: 3.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.6,
    });
  }, { scope });

  return (
    <div ref={scope}>
      <section id="commands" className="stage stage--tray">
        <div className="stage__head">
          <p className="stage__eyebrow">Commands</p>
          <h2 className="stage__title">Pick up a takoyaki and place it on the plate</h2>
        </div>

        <div className="stage__sticky">
          <div className="stage-plate-wrap" data-plate>
            <Plate className="stage-plate-img" />
          </div>

          <div className="plate-balls">
            {commands.map((item, index) => {
              const slot = ballPositions[index % ballPositions.length];
              return (
                <div className="plate-slot" key={item.id} style={{ left: `${slot.left}%`, top: `${slot.top}%` }}>
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

      <section className="curtain" data-curtain-section>
        <div className="curtain__receipt">
          <div className="receipt" data-receipt>
            <p className="receipt__thanks">Thank you!</p>
            <p className="receipt__lead">Set up Takoyaki in your server</p>
            <p className="receipt__note">
              From real-time pings to sticky stats — your commits are always welcome at Takoyaki.
            </p>

            <p className="receipt__dash">Catch you on your next commit</p>

            <div className="receipt__table">
              <div className="receipt__tr receipt__tr--head">
                <span>Qty</span>
                <span>Item</span>
                <span>Price</span>
              </div>
              {commands.map((item) => (
                <div className="receipt__tr" key={`bill-${item.id}`}>
                  <span>1</span>
                  <span className="receipt__item">{item.command}</span>
                  <span>{item.price}</span>
                </div>
              ))}
              <div className="receipt__tr receipt__tr--total">
                <span />
                <span>Total</span>
                <span>hot &amp; ready</span>
              </div>
            </div>

            <div className="receipt__divider" aria-hidden="true" />

            <p className="receipt__brand">Takoyaki</p>
            <p className="receipt__estd">estd 2025</p>
            <p className="receipt__tag">hot off the grill!</p>
          </div>
        </div>
        <div className="curtain__panel" data-curtain aria-hidden="true" />
      </section>
    </div>
  );
}
