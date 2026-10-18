import type { CSSProperties } from "react";

/** A flat, ink-outlined takoyaki ball. All detail is vector — no images. */
export function Ball({
  size = 84,
  tilt = 0,
  style,
}: {
  size?: number;
  tilt?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      className="ball-art"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${tilt}deg)`, ...style }}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="40" fill="var(--takoyaki)" stroke="var(--ink)" strokeWidth="4" />
      <path
        d="M20 46c6-10 16-12 26-7 10 5 20 3 34-4-4 14-12 22-26 24-16 2-28-3-34-13Z"
        fill="var(--takoyaki-dark)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M26 39c4-6 10-6 15-2 5 4 11 4 16-1"
        fill="none"
        stroke="var(--mayo)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M26 39c4-6 10-6 15-2 5 4 11 4 16-1"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path d="M40 29l6-6M59 30l-6-5" stroke="var(--onion)" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="44" cy="58" rx="3" ry="2" fill="var(--mayo)" />
      <ellipse cx="58" cy="54" rx="3" ry="2" fill="var(--mayo)" />
    </svg>
  );
}
