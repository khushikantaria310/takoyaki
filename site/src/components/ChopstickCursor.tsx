"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** A chopstick replaces the pointer on the features page (desktop only). */
export default function ChopstickCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    document.documentElement.classList.add("has-stick-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.12, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.12, ease: "power3" });

    const move = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      const overUi = Boolean(
        (event.target as HTMLElement | null)?.closest("a, button, input, textarea, select"),
      );
      el.classList.toggle("is-over-ui", overUi);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-stick-cursor");
    };
  }, []);

  return (
    <div ref={ref} className="chopstick-cursor" aria-hidden="true">
      <svg viewBox="0 0 30 240" width="30" height="240">
        <polygon points="0,0 7,14 24,232 15,238" fill="#E9D3A3" stroke="#1B1B22" strokeWidth="2" />
        <polygon points="0,0 7,14 5,10" fill="#7A3212" />
      </svg>
    </div>
  );
}
