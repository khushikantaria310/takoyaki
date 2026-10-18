"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { features } from "@/lib/data";

const tilts = [-6, 4, -3, 6, -5, 3, -7, 5];

/** The balls are stacked adjacent on the chopstick; point at one for its story. */
export function Features() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reveal = gsap.timeline({
      scrollTrigger: { trigger: scope.current, start: "top 70%", end: "top 25%", scrub: true },
    });
    reveal.fromTo("[data-feature-head]", { opacity: 0, y: 20 }, { opacity: 1, y: 0 });

    const balls = gsap.utils.toArray<HTMLElement>("[data-ball]", scope.current);
    const drop = gsap.timeline({
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: 1 },
    });
    balls.forEach((ball, index) => {
      drop.fromTo(
        ball,
        { yPercent: -420, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "bounce.out", duration: 1 },
        index * 0.32,
      );
    });
  }, { scope });

  return (
    <section id="features" className="stage" ref={scope}>
      <div className="stage__sticky">
        <div className="stage__head" data-feature-head>
          <p className="stage__eyebrow">Features</p>
          <h2 className="stage__title">Everything you’d check a dashboard for</h2>
          <p className="stage__sub">Except you don’t have to. It shows up where your team already talks.</p>
        </div>

        <div className="skewer" data-skewer aria-hidden="true" />

        <div className="skewer-balls">
          {features.map((feature, index) => (
            <button
              type="button"
              className="ball ball--skewer"
              data-ball
              key={feature.id}
              aria-label={`${feature.label}. ${feature.desc}`}
            >
              <Ball size={104} tilt={tilts[index % tilts.length]} />
              <span className={`tag tag--glass ${index % 2 === 0 ? "tag--left" : "tag--right"}`}>
                <strong>{feature.label}</strong>
                <span className="tag__desc">{feature.desc}</span>
                <em>{feature.note}</em>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
