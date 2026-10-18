import type { CSSProperties } from "react";

/** A glossy, ink-outlined takoyaki: sauce glaze with drips, bonito, onion, sesame. */
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
      <ellipse cx="50" cy="88" rx="34" ry="7" fill="rgba(24,30,12,0.22)" />
      <circle cx="50" cy="50" r="40" fill="url(#takoBall)" stroke="var(--ink)" strokeWidth="4" />
      <path
        d="M14 48c0-19 16-32 36-32s36 13 36 32c0 12-9 19-22 21-4 1-7-1-8-5-1-4-5-6-9-4-3 1-5 5-9 5-5 0-7-4-9-8-1-3-3-5-6-5-5 0-9-2-9-4Z"
        fill="url(#takoSauce)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="36" cy="30" rx="12" ry="7" fill="url(#takoGloss)" />
      <path
        d="M38 27c-3-9 6-14 10-8 1-8 11-8 13 0 5-5 13 0 10 9-3 7-9 9-16 9s-14-3-17-10Z"
        fill="url(#takoFlake)"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <g fill="#4e7a2e">
        <rect x="29" y="32" width="7" height="4" rx="2" transform="rotate(-20 29 32)" />
        <rect x="57" y="30" width="7" height="4" rx="2" transform="rotate(16 57 30)" />
        <rect x="44" y="42" width="6" height="3.5" rx="1.8" transform="rotate(-8 44 42)" />
      </g>
      <g fill="#f2e8c9">
        <circle cx="37" cy="41" r="1.6" />
        <circle cx="61" cy="43" r="1.6" />
        <circle cx="50" cy="35" r="1.6" />
      </g>
    </svg>
  );
}
