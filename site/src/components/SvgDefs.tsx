/** Shared SVG gradients, drawn once and referenced by every takoyaki. */
export function SvgDefs() {
  return (
    <svg className="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="takoBall" cx="34%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#f2b968" />
          <stop offset="52%" stopColor="#e09a34" />
          <stop offset="100%" stopColor="#bd7522" />
        </radialGradient>
        <linearGradient id="takoSauce" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8f4722" />
          <stop offset="60%" stopColor="#6b3410" />
          <stop offset="100%" stopColor="#4f1f06" />
        </linearGradient>
        <linearGradient id="takoFlake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e2b8" />
          <stop offset="100%" stopColor="#dcc089" />
        </linearGradient>
        <linearGradient id="takoWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a97b45" />
          <stop offset="38%" stopColor="#ecd6a6" />
          <stop offset="62%" stopColor="#dcc08d" />
          <stop offset="100%" stopColor="#a97b45" />
        </linearGradient>
        <radialGradient id="takoGloss" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
