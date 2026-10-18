/** The hero illustration: a folded paper tray of saucy takoyaki. */
export function TakoyakiPlate({ className }: { className?: string }) {
  const ball = (x: number, y: number, scale: number, tilt: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}>
      <circle r="40" fill="#e39a34" stroke="var(--ink)" strokeWidth="4" />
      <path d="M-35 2c2 15 16 26 35 26 12 0 22-5 28-13-6 6-16 9-28 9-14 0-26-8-30-22Z" fill="#f2b85e" />
      <path
        d="M-37 0c0-20 16-34 37-34s37 14 37 34c0 12-9 20-22 22-4 1-7-1-8-5-1-4-5-6-9-4-3 1-5 5-9 5-5 0-7-4-9-8-1-3-3-5-6-5-6 0-11-3-11-5Z"
        fill="#6b3410"
        stroke="var(--ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M-12-23c-3-9 6-14 10-8 1-8 11-8 13 0 5-5 13 0 10 9-3 7-9 9-16 9s-14-3-17-10Z"
        fill="#e8c98a"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <g fill="#4e7a2e">
        <rect x="-21" y="-18" width="7" height="4" rx="2" transform="rotate(-20 -21 -18)" />
        <rect x="7" y="-20" width="7" height="4" rx="2" transform="rotate(16 7 -20)" />
        <rect x="-6" y="-8" width="6" height="3.5" rx="1.8" transform="rotate(-8 -6 -8)" />
      </g>
      <g fill="#f2e8c9">
        <circle cx="-13" cy="-9" r="1.6" />
        <circle cx="11" cy="-7" r="1.6" />
        <circle cx="0" cy="-15" r="1.6" />
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
      {/* balls */}
      {ball(150, 168, 1.42, 6, "a")}
      {ball(300, 168, 1.42, -8, "b")}
      {ball(188, 222, 1.5, -4, "c")}
      {ball(280, 224, 1.5, 9, "d")}
      {ball(232, 190, 1.6, 2, "e")}
    </svg>
  );
}
