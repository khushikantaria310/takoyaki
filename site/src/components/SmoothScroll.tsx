"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ONE Lenis instance for the whole site, wired into ONE gsap ticker
 * so smooth scroll and scroll scenes share a single clock.
 * Cleaned up on unmount; disabled for prefers-reduced-motion.
 */
export default function SmoothScroll() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    const updateScroll = () => ScrollTrigger.update();
    lenis.on("scroll", updateScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const selector = anchor?.getAttribute("href");
      if (!anchor || !selector || selector === "#") return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      lenis.off("scroll", updateScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, { scope });

  return <div ref={scope} className="scroll-runtime" aria-hidden="true" />;
}
