/** The hero illustration: a paper tray of takoyaki, drawn as one flat SVG. */
export function TakoyakiPlate({ className }: { className?: string }) {
  const ball = (x: number, y: number, scale: number, tilt: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}>
      <circle r="40" fill="var(--takoyaki)" stroke="var(--ink)" strokeWidth="4" />
      <path
        d="M-30-4c6-10 16-12 26-7 10 5 20 3 34-4-4 14-12 22-26 24-16 2-28-3-34-13Z"
        fill="var(--takoyaki-dark)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M-24-11c4-6 10-6 15-2 5 4 11 4 16-1"
        fill="none"
        stroke="var(--mayo)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M-10-21l6-6M9-20l-6-5" stroke="var(--onion)" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="-6" cy="8" rx="3" ry="2" fill="var(--mayo)" />
      <ellipse cx="8" cy="4" rx="3" ry="2" fill="var(--mayo)" />
    </g>
  );

  return (
    <svg className={className} viewBox="0 0 460 320" role="img" aria-label="A paper tray of takoyaki with mayo, sauce, and green onion">
      {/* tray */}
      <path
        d="M34 96 L426 96 L364 218 Q230 258 96 218 Z"
        fill="var(--tray)"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M34 96 L96 218" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M426 96 L364 218" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path
        d="M150 98 L178 214 M300 98 L276 214"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2"
        opacity="0.28"
      />

      {/* balls */}
      {ball(128, 168, 1.5, -6, "a")}
      {ball(214, 152, 1.55, 4, "b")}
      {ball(300, 168, 1.5, -3, "c")}
      {ball(172, 214, 1.5, 7, "d")}
      {ball(258, 220, 1.45, -5, "e")}

      {/* mayo mound */}
      <path
        d="M168 132c14-40 48-56 84-50 36 6 60 30 62 60 2 26-18 40-48 44-40 6-78 0-96-20-8-9-8-22-2-34Z"
        fill="var(--mayo)"
        stroke="var(--ink)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M186 128c4-14 18-22 34-20M212 112c10-6 24-6 34 0M250 112c10 2 18 8 22 16"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2"
        opacity="0.35"
        strokeLinecap="round"
      />

      {/* green onion + sesame on top */}
      <g stroke="var(--onion)" strokeWidth="6" strokeLinecap="round">
        <path d="M196 138l10-1" />
        <path d="M224 122l11-2" />
        <path d="M252 130l11 1" />
        <path d="M276 146l10 2" />
        <path d="M208 158l-10 2" />
      </g>
      <g fill="var(--mayo)">
        <ellipse cx="238" cy="118" rx="3.4" ry="2.2" />
        <ellipse cx="262" cy="134" rx="3.4" ry="2.2" />
        <ellipse cx="216" cy="146" rx="3.4" ry="2.2" />
        <ellipse cx="244" cy="150" rx="3.4" ry="2.2" />
      </g>
    </svg>
  );
}
