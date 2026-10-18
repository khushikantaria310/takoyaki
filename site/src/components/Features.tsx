"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { features } from "@/lib/data";

const tilts = [-8, 6, -4, 9, -6, 3, -9, 5];

/** Balls are skewered onto the chopstick one by one as you scroll. */
export function Features() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const balls = gsap.utils.toArray<HTMLElement>("[data-ball]", scope.current);
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: 1 },
    });
    balls.forEach((ball, index) => {
      timeline.fromTo(
        ball,
        { y: -780, opacity: 0, rotate: -18 },
        { y: 0, opacity: 1, rotate: 0, ease: "bounce.out", duration: 1 },
        index * 0.34,
      );
    });
  }, { scope });

  return (
    <section id="features" className="stage" ref={scope}>
      <div className="stage__head">
        <p className="stage__eyebrow">On the menu</p>
        <h2 className="stage__title">Point at a ball to see what it does</h2>
      </div>

      <div className="stage__sticky">
        <div className="skewer" aria-hidden="true" />

        {features.map((feature, index) => (
          <div className="slot" key={feature.id} style={{ top: `${22 + index * 8}%` }}>
            <button
              type="button"
              className="ball"
              data-ball
              aria-label={`${feature.label} — ${feature.note}`}
            >
              <Ball size={78} tilt={tilts[index % tilts.length]} />
              <span className="tag tag--box">
                <strong>{feature.label}</strong>
                <em>{feature.note}</em>
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
