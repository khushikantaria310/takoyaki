"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ball } from "@/components/Ball";
import { features } from "@/lib/data";

const tilts = [-6, 4, -3, 6, -5, 3, -7, 5];

/** Balls split 4 + 4 between a left and a right chopstick. */
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
      const side = index % 2 === 0 ? -1 : 1;
      drop.fromTo(
        ball,
        { yPercent: -420, opacity: 0, rotate: side * 12 },
        { yPercent: 0, opacity: 1, rotate: 0, ease: "back.out(1.25)", duration: 1.1 },
        index * 0.3,
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

        <div className="chopstick-pair">
          {[0, 1].map((column) => (
            <div className={`chopstick-col chopstick-col--${column === 0 ? "l" : "r"}`} key={column}>
              <span className="chopstick" aria-hidden="true" />
              <div className="skewer-balls">
                {features.slice(column * 4, column * 4 + 4).map((feature, index) => (
                  <button
                    type="button"
                    className="ball ball--skewer"
                    data-ball
                    key={feature.id}
                    aria-label={`${feature.label}. ${feature.desc}`}
                  >
                    <Ball size={118} tilt={tilts[(column * 4 + index) % tilts.length]} />
                    <span
                      className={`tag tag--glass ${index % 2 === 0 ? "tag--left" : "tag--right"}`}
                    >
                      <strong>{feature.label}</strong>
                      <span className="tag__desc">{feature.desc}</span>
                      <em>{feature.note}</em>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
