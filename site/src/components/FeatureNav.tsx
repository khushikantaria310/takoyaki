"use client";

import { useRef } from "react";
import { emitBlur, emitKeyboard, features } from "@/lib/features";

/**
 * Keyboard/touch stand-ins for the eight balls: focusing or tapping a dot
 * lifts the matching ball and shows its feature card.
 */
export default function FeatureNav() {
  const last = useRef<number | null>(null);

  const show = (index: number) => {
    last.current = index;
    emitKeyboard(index);
  };

  const hide = () => {
    last.current = null;
    emitBlur();
  };

  return (
    <div className="feature-nav" role="group" aria-label="Takoyaki feature shortcuts">
      {features.map((feature, index) => (
        <button
          key={feature.id}
          type="button"
          className="feature-nav__dot"
          aria-label={`Show feature: ${feature.title}${feature.comingSoon ? " (coming soon)" : ""}`}
          onFocus={() => show(index)}
          onBlur={() => hide()}
          onMouseEnter={() => show(index)}
          onMouseLeave={() => hide()}
          onClick={() => show(index)}
        >
          <span aria-hidden="true">{index + 1}</span>
        </button>
      ))}
    </div>
  );
}
