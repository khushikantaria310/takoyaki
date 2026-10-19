"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** The footer mark rises from the bottom into place. */
export default function FooterMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-footer-mark]",
        { yPercent: 170, opacity: 0 },
        {
          yPercent: -50,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".site-footer", start: "top 95%", end: "top 40%", scrub: 1 },
        },
      );

      // Slow breathing drift on the watermark so it never feels static.
      gsap.to("[data-footer-mark]", {
        letterSpacing: "0.14em",
        duration: 7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
    return () => context.revert();
  }, []);

  return null;
}
