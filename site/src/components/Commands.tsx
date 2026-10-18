"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { Plate } from "@/components/Plate";
import { HandArrow } from "@/components/HandArrow";
import { bill, commands } from "@/lib/data";

const tilts = [-6, 4, -3, 6, -5, 3, -7, 5];

/** Balls drop into the plate and sit shoulder to shoulder; point for a command. */
export function Commands() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const balls = gsap.utils.toArray<HTMLElement>("[data-ball]", scope.current);
    const drop = gsap.timeline({
      scrollTrigger: { trigger: "#commands", start: "top top", end: "bottom bottom", scrub: 1 },
    });

    // The plate slides in from the right; the balls drop the moment it lands.
    // The plate slides in from the right and lands centred; the balls drop
    // the moment it settles.
    drop.fromTo(
      "[data-plate]",
      { xPercent: 130, opacity: 0 },
      { xPercent: 0, opacity: 1, ease: "power4.out", duration: 1.3 },
      0,
    );
    balls.forEach((ball, index) => {
      drop.fromTo(
        ball,
        { yPercent: -560, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "bounce.out", duration: 1 },
        1.25 + index * 0.3,
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

  const row = (items: typeof commands, start: number) => (
    <div className="plate-balls__row">
      {items.map((item, index) => (
        <button
          type="button"
          className="ball ball--plate"
          data-ball
          key={item.id}
          aria-label={`${item.command}. ${item.note}`}
        >
          <Ball size={92} tilt={tilts[(start + index) % tilts.length]} />
          <span className="tag tag--glass tag--above">
            <span className="tag__cmd">
              <HandArrow className="tag__arrow" />
              {item.command}
            </span>
            <span className="tag__desc">{item.note}</span>
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div ref={scope}>
      <section id="commands" className="stage stage--tray">
        <div className="stage__head">
          <p className="stage__eyebrow">Commands</p>
          <h2 className="stage__title">Point at a ball for its command</h2>
        </div>

        <div className="stage__sticky">
          <div className="stage-plate-wrap" data-plate>
            <Plate className="stage-plate-img" />
          </div>

          <div className="plate-balls">
            {row(commands.slice(0, 3), 0)}
            {row(commands.slice(3, 6), 3)}
            {row(commands.slice(6, 8), 6)}
          </div>
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
