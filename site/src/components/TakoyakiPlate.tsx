/** The hero illustration: a folded paper tray of saucy takoyaki. */
export function TakoyakiPlate({ className }: { className?: string }) {
  const ball = (x: number, y: number, scale: number, tilt: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}>
      <circle r="40" fill="var(--takoyaki)" stroke="var(--ink)" strokeWidth="4" />
      <path
        d="M-39-4c6-14 21-20 39-20s33 6 39 20c-4 14-20 22-39 22S-35 10-39-4Z"
        fill="var(--takoyaki-dark)"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M-30-8c6-7 13-7 19-2 6 5 13 5 19-1 5-4 12-4 17 1"
        fill="none"
        stroke="var(--mayo)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g stroke="var(--onion)" strokeWidth="5" strokeLinecap="round">
        <path d="M-20-16l7-3" />
        <path d="M-4-20l8-1" />
        <path d="M12-16l7 3" />
        <path d="M-12-4l-7 3" />
        <path d="M8-2l8 2" />
      </g>
      <g fill="var(--mayo)">
        <ellipse cx="-8" cy="-12" rx="3" ry="1.8" />
        <ellipse cx="8" cy="-10" rx="3" ry="1.8" />
        <ellipse cx="0" cy="0" rx="3" ry="1.8" />
      </g>
    </g>
  );

  return (
    <svg
      className={className}
      viewBox="0 0 460 330"
      role="img"
      aria-label="A folded paper tray of takoyaki with sauce, mayo, green onion, and sesame"
    >
      {/* tray */}
      <path
        d="M40 120 L420 120 L366 232 Q230 268 94 232 Z"
        fill="var(--tray)"
        stroke="var(--ink)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M40 120 L94 232" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M420 120 L366 232" fill="none" stroke="var(--ink)" strokeWidth="3" />
      <path d="M92 126 L138 226 M368 126 L322 226" fill="none" stroke="var(--ink)" strokeWidth="2.5" opacity="0.45" />

      {/* balls */}
      {ball(150, 168, 1.42, 6, "a")}
      {ball(300, 168, 1.42, -8, "b")}
      {ball(188, 222, 1.5, -4, "c")}
      {ball(280, 224, 1.5, 9, "d")}
      {ball(232, 190, 1.6, 2, "e")}
    </svg>
  );
}
