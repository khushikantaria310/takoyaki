const letters = ["T", "A", "K", "O", "Y", "A", "K", "I"];

/**
 * The printed poster art: vertical letters, serial, seal, and the static
 * stand-in balls/chopstick/tray used before WebGL, if WebGL fails, or when
 * the visitor prefers reduced motion.
 */
export function PosterArt() {
  return (
    <>
      <div className="poster__letters" aria-label="Takoyaki">
        {letters.map((letter, index) => (
          <span key={`${letter}-label-${index}`} data-hero-letter>
            {letter}
          </span>
        ))}
      </div>

      <span className="poster__serial" aria-hidden="true">No. 08 · 焼きたて</span>
      <span className="poster__seal" aria-hidden="true">たこ焼き</span>

      <div className="poster__fallback" aria-hidden="true">
        <div className="poster__fallback-balls">
          {letters.map((letter, index) => (
            <span className="takoyaki-ball" key={`${letter}-ball-${index}`} />
          ))}
        </div>
        <span className="poster__chopstick" />
        <div className="poster__fallback-tray">
          {letters.slice(0, 4).map((letter, index) => (
            <span className="takoyaki-ball" key={`${letter}-tray-${index}`} />
          ))}
        </div>
      </div>
    </>
  );
}
