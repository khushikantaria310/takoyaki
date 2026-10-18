import type { CSSProperties } from "react";

/** A flat, ink-outlined takoyaki ball: sauce cap, mayo zig-zag, onion, sesame. */
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
        d="M11 46c6-14 21-20 39-20s33 6 39 20c-4 14-20 22-39 22S15 60 11 46Z"
        fill="var(--takoyaki-dark)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M20 42c6-7 13-7 19-2 6 5 13 5 19-1 5-4 12-4 17 1"
        fill="none"
        stroke="var(--mayo)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M20 42c6-7 13-7 19-2 6 5 13 5 19-1 5-4 12-4 17 1"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <g stroke="var(--onion)" strokeWidth="5" strokeLinecap="round">
        <path d="M30 34l7-3" />
        <path d="M46 30l8-1" />
        <path d="M62 34l7 3" />
        <path d="M38 46l-7 3" />
        <path d="M58 48l8 2" />
      </g>
      <g fill="var(--mayo)">
        <ellipse cx="42" cy="38" rx="3" ry="1.8" />
        <ellipse cx="58" cy="40" rx="3" ry="1.8" />
        <ellipse cx="50" cy="50" rx="3" ry="1.8" />
      </g>
    </svg>
  );
}
