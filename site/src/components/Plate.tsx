/** A flat white plate with an ink rim, as seen from a slight angle. */
export function Plate({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 380 170" aria-hidden="true">
      <ellipse cx="190" cy="94" rx="172" ry="60" fill="#e8e6e0" stroke="var(--ink)" strokeWidth="4" />
      <ellipse cx="190" cy="88" rx="138" ry="44" fill="#f7f5f0" stroke="var(--ink)" strokeWidth="2.5" />
    </svg>
  );
}
