/**
 * One takoyaki, drawn in a 100×100 box centred on the origin.
 * Shared by the hero scene, the plate art and the inline balls.
 */
export function TakoyakiShape() {
  return (
    <g transform="translate(-50 -50)">
      {/* Golden fried base. */}
      <circle cx="50" cy="50" r="40" fill="url(#takoBall)" stroke="var(--ink)" strokeWidth="4" />

      {/* Sauce cap: covers the top and drips unevenly down the sides. */}
      <path
        d="M10 46c0-21 18-34 40-34s40 13 40 34c0 5-5 7-9 4-4-3-9 0-8 6 1 7-6 9-9 3-3-6-9-4-9 2 0 6-8 6-9 0-1-6-7-8-12-2 0-6 2-6 2s-4-2-6-2c-3 6-8 12-14 12C12 62 9 55 10 46Z"
        fill="url(#takoSauce)"
      />
      {/* Draw the sauce perimeter as a hand-shaped open outline. Keeping
          the fill and outline separate avoids a straight closing seam
          cutting across the fried base. */}
      <path
        d="M10 46c0-21 18-34 40-34s40 13 40 34c0 5-5 7-9 4-4-3-9 0-8 6 1 7-6 9-9 3-3-6-9-4-9 2 0 6-8 6-9 0-1-6-7-8-12-2 0-6 2-6 2s-4-2-6-2c-3 6-8 12-14 12C12 62 9 55 10 46Z"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Mayo squiggles running across the sauce. */}
      <g fill="none" stroke="#f6efdd" strokeWidth="4.5" strokeLinecap="round">
        <path d="M24 30c8-8 16-8 24-2s16 6 24 0" />
        <path d="M21 41c8-8 16-8 24-2s16 6 24 0" />
        <path d="M31 21c7-6 14-6 21-1" />
      </g>

      {/* Green onion. */}
      <g fill="#4e7a2e">
        <rect x="28" y="47" width="8" height="4" rx="2" transform="rotate(-24 28 47)" />
        <rect x="60" y="44" width="8" height="4" rx="2" transform="rotate(18 60 44)" />
        <rect x="46" y="53" width="7" height="3.5" rx="1.8" transform="rotate(-6 46 53)" />
        <rect x="38" y="24" width="6" height="3" rx="1.5" transform="rotate(12 38 24)" />
      </g>

      {/* Sesame. */}
      <g fill="#f4ead2">
        <circle cx="36" cy="37" r="1.7" />
        <circle cx="62" cy="39" r="1.7" />
        <circle cx="50" cy="30" r="1.5" />
        <circle cx="55" cy="48" r="1.4" />
      </g>

      {/* Soft highlight. */}
      <ellipse cx="34" cy="26" rx="11" ry="6" fill="url(#takoGloss)" opacity="0.8" />
    </g>
  );
}
