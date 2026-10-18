/** A dark slate plate with a soft bevel and shadow. */
export function Plate({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 560 260" aria-hidden="true">
      <defs>
        <linearGradient id="tako-slate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c4c4c" />
          <stop offset="0.55" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#101010" />
        </linearGradient>
        <linearGradient id="tako-slate-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#343434" />
          <stop offset="1" stopColor="#191919" />
        </linearGradient>
      </defs>

      <ellipse cx="280" cy="212" rx="252" ry="26" fill="rgba(18,24,10,0.22)" />

      <rect
        x="26"
        y="86"
        width="508"
        height="150"
        rx="30"
        fill="url(#tako-slate)"
        stroke="#0a0a0a"
        strokeWidth="6"
      />
      <rect x="48" y="104" width="464" height="114" rx="22" fill="url(#tako-slate-in)" opacity="0.92" />
      <path d="M50 118 Q280 94 510 118" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="4" />
    </svg>
  );
}
