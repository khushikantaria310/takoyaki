"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { features } from "@/lib/data";

const tilts = [-8, 6, -4, 9, -6, 3, -9, 5];

const hover = (index: number) =>
  window.dispatchEvent(new CustomEvent("tako:hover", { detail: { index } }));

/** Balls are skewered onto the chopstick one by one as you scroll. */
export function Features() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reveal = gsap.timeline({
      scrollTrigger: { trigger: scope.current, start: "top 70%", end: "top 20%", scrub: true },
    });
    reveal.fromTo("[data-feature-head]", { opacity: 0, y: 24 }, { opacity: 1, y: 0 });

    const balls = gsap.utils.toArray<HTMLElement>("[data-slot]", scope.current);
    const drop = gsap.timeline({
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: 1 },
    });
    balls.forEach((ball, index) => {
      drop.fromTo(
        ball,
        { yPercent: -520, opacity: 0, rotate: -12 },
        { yPercent: 0, opacity: 1, rotate: 0, ease: "bounce.out", duration: 1 },
        index * 0.34,
      );
    });
  }, { scope });

  return (
    <section id="features" className="stage" ref={scope}>
      <div className="stage__head" data-feature-head>
        <p className="stage__eyebrow">On the menu</p>
        <h2 className="stage__title">Point at a ball to see what it does</h2>
      </div>

      <div className="stage__sticky">
        <div className="skewer" data-skewer aria-hidden="true" />

        {features.map((feature, index) => (
          <div className="slot" key={feature.id} style={{ top: `${20 + index * 8.5}%` }}>
            <button
              type="button"
              className="ball"
              data-slot
              data-kind="stick"
              aria-label={`${feature.label} — ${feature.note}`}
              onMouseEnter={() => hover(index)}
              onFocus={() => hover(index)}
              onMouseLeave={() => hover(-1)}
              onBlur={() => hover(-1)}
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
