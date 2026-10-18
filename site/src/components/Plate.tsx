/** The ceramic plate stand-in, drawn flat (shown if WebGL is unavailable). */
export function Plate({ className, "data-plate": dataPlate }: { className?: string; "data-plate"?: boolean }) {
  return (
    <svg className={className} data-plate={dataPlate ? "" : undefined} viewBox="0 0 360 150" aria-hidden="true">
      <ellipse cx="180" cy="92" rx="164" ry="46" fill="var(--tray)" stroke="var(--ink)" strokeWidth="4" />
      <ellipse cx="180" cy="86" rx="132" ry="34" fill="#efe7d2" stroke="var(--ink)" strokeWidth="3" />
    </svg>
  );
}
