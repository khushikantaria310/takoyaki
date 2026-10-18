"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { Tray } from "@/components/Tray";
import { HandArrow } from "@/components/HandArrow";
import SceneMount from "@/components/SceneMount";
import { bill, commands } from "@/lib/data";

const slots = [
  { left: 33, top: 65, tilt: -7 },
  { left: 45, top: 62, tilt: 5 },
  { left: 57, top: 65, tilt: -4 },
  { left: 69, top: 69, tilt: 8 },
  { left: 28, top: 79, tilt: -6 },
  { left: 42, top: 82, tilt: 3 },
  { left: 56, top: 82, tilt: -9 },
  { left: 70, top: 79, tilt: 6 },
];

const hover = (index: number) =>
  window.dispatchEvent(new CustomEvent("tako:hover", { detail: { index } }));

/** Balls drop into the tray, then a curtain slides away to the setup bill. */
export function Commands() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

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
          <div className="scene-layer">
            <SceneMount mode="bowl" trigger="#commands" />
          </div>

          <Tray className="stage-tray" data-tray />

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
