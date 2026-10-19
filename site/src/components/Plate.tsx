import { useId } from "react";

/**
 * The plate the takoyaki are served on: a wide, shallow dish drawn in flat
 * illustration style — a bold black rim, a bright ceramic body, an inner
 * rim line and a soft shadow, so it reads as a real object.
 *
 * `PlateArt` draws just the shapes so it can be dropped into a bigger
 * scene; `Plate` wraps it in its own SVG.
 */
export const PLATE_VIEWBOX = "0 0 1000 480";

export function PlateArt({ uid }: { uid: string }) {
  return (
    <>
      {/* Soft shadow under the plate. */}
      <ellipse cx="500" cy="420" rx="408" ry="18" fill="rgba(18, 24, 10, 0.2)" />

      {/* The dish — a wide oval seen from a little above. */}
      <ellipse cx="500" cy="270" rx="455" ry="125" fill={`url(#${uid}-body)`} stroke="var(--ink)" strokeWidth="7" />

      {/* The inner rim, where the dish turns down into the well. */}
      <ellipse cx="500" cy="262" rx="402" ry="92" fill="none" stroke="var(--ink)" strokeWidth="4" />

      {/* A highlight along the near rim. */}
      <path
        d="M120 362C222 396 350 414 502 414"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.85"
      />
    </>
  );
}

export function Plate({ className }: { className?: string }) {
  const uid = useId().replace(/:+/g, "");

  return (
    <svg className={className} viewBox={PLATE_VIEWBOX} aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#fbf7ee" />
          <stop offset="100%" stopColor="#e2d8c1" />
        </linearGradient>
      </defs>
      <PlateArt uid={uid} />
    </svg>
  );
}
