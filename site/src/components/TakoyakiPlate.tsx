import { TakoyakiShape } from "@/components/TakoyakiShape";

/**
 * The hero illustration: a cluster of saucy takoyaki, drawn flat with bold
 * ink outlines.
 */
export function TakoyakiPlate({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 460 330"
      role="img"
      aria-label="A plate of takoyaki with sauce, mayo, green onion, and sesame"
    >
      {/* Back row. */}
      <g transform="translate(152 170) rotate(6) scale(1.42)">
        <TakoyakiShape />
      </g>
      <g transform="translate(302 170) rotate(-8) scale(1.42)">
        <TakoyakiShape />
      </g>

      {/* Front row. */}
      <g transform="translate(190 224) rotate(-4) scale(1.5)">
        <TakoyakiShape />
      </g>
      <g transform="translate(282 226) rotate(9) scale(1.5)">
        <TakoyakiShape />
      </g>

      {/* The one on top. */}
      <g transform="translate(234 192) rotate(2) scale(1.62)">
        <TakoyakiShape />
      </g>
    </svg>
  );
}
