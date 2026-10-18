/** The paper tray, drawn flat with ink outlines (stand-in for the 3D tray). */
export function Tray({ className, "data-tray": dataTray }: { className?: string; "data-tray"?: boolean }) {
  return (
    <svg
      className={className}
      data-tray={dataTray ? "" : undefined}
      viewBox="0 0 320 156"
      aria-hidden="true"
    >
      <path
        d="M16 26 L304 26 L262 124 Q160 154 58 124 Z"
        fill="var(--tray)"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M16 26 L58 124" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M304 26 L262 124" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path
        d="M118 28 L150 118 M202 28 L172 118"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2"
        opacity="0.25"
      />
    </svg>
  );
}
