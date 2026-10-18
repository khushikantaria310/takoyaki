/** A shallow bowl, drawn flat with ink outlines. */
export function Bowl({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 620 210" aria-hidden="true">
      <path
        d="M28 74 Q310 214 592 74"
        fill="#dccfae"
        stroke="var(--ink)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <ellipse cx="310" cy="74" rx="282" ry="50" fill="#e7ddc0" stroke="var(--ink)" strokeWidth="6" />
      <ellipse cx="310" cy="76" rx="238" ry="34" fill="#f2ead6" opacity="0.75" />
    </svg>
  );
}
