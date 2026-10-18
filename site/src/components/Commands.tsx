"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { Tray } from "@/components/Tray";
import { HandArrow } from "@/components/HandArrow";
import { bill, commands } from "@/lib/data";

const slots = [
  { left: 30, top: 71, tilt: -7 },
  { left: 44, top: 68, tilt: 5 },
  { left: 58, top: 68, tilt: -4 },
  { left: 72, top: 71, tilt: 8 },
  { left: 26, top: 81, tilt: -6 },
  { left: 39, top: 83, tilt: 3 },
  { left: 52, top: 83, tilt: -9 },
  { left: 65, top: 81, tilt: 6 },
];

const hover = (index: number) =>
  window.dispatchEvent(new CustomEvent("tako:hover", { detail: { index } }));

/** Balls drop into the tray, then a curtain slides away to the setup bill. */
export function Commands() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const balls = gsap.utils.toArray<HTMLElement>("[data-slot]", scope.current);
    const drop = gsap.timeline({
      scrollTrigger: { trigger: "#commands", start: "top top", end: "bottom bottom", scrub: 1 },
    });
    balls.forEach((ball, index) => {
      drop.fromTo(
        ball,
        { yPercent: -560, opacity: 0, rotate: 12 },
        { yPercent: 0, opacity: 1, rotate: 0, ease: "bounce.out", duration: 1 },
        index * 0.34,
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
      { opacity: 0, scale: 0.86, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-curtain-section]", start: "top 60%", end: "top 10%", scrub: true },
      },
    );
  }, { scope });

  return (
    <div ref={scope}>
      <section id="commands" className="stage stage--tray">
        <div className="stage__head">
          <p className="stage__eyebrow">The commands</p>
          <h2 className="stage__title">Point at a ball for its command</h2>
        </div>

        <div className="stage__sticky">
          <Tray className="stage-tray" />

          {commands.map((item, index) => {
            const slot = slots[index % slots.length];
            return (
              <div
                className="slot slot--tray"
                key={item.id}
                style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
              >
                <button
                  type="button"
                  className="ball ball--sm"
                  data-slot
                  data-kind="plate"
                  aria-label={`${item.command} — ${item.note}`}
                  onMouseEnter={() => hover(index)}
                  onFocus={() => hover(index)}
                  onMouseLeave={() => hover(-1)}
                  onBlur={() => hover(-1)}
                >
                  <Ball size={66} tilt={slot.tilt} />
                  <span className="tag tag--free">
                    <HandArrow className="tag__arrow" />
                    <span className="tag__text">
                      {item.command}
                      <em>{item.note}</em>
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="curtain" data-curtain-section>
        <div className="curtain__receipt">
          <div className="receipt" data-receipt>
            <p className="receipt__title">たこやき · setup</p>
            <div className="receipt__rows">
              {bill.map((line) => (
                <div className="receipt__row" key={line.label}>
                  <span>{line.label}</span>
                  <span>{line.value}</span>
                </div>
              ))}
            </div>
            <div className="receipt__row receipt__row--total">
              <span>total</span>
              <span>hot &amp; ready</span>
            </div>
            <p className="receipt__foot">GitHub → Discord · served fresh</p>
          </div>
        </div>
        <div className="curtain__panel" data-curtain aria-hidden="true" />
      </section>
    </div>
  );
}
