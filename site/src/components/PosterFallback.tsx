const letters = ["T", "A", "K", "O", "Y", "A", "K", "I"];

/**
 * The printed poster. It is always in the DOM: it shows while WebGL warms up,
 * if WebGL is unavailable, and when the visitor prefers reduced motion.
 */
export function PosterFallback() {
  return (
    <figure
      className="poster"
      data-poster
      role="img"
      aria-label="Vintage Takoyaki poster: a steel-blue panel with a vertical orange TAKOYAKI label, a single chopstick with takoyaki balls, and a folded paper-boat tray of takoyaki below on a cream floor."
    >
      <div className="poster__scene" data-poster-scene>
        <div className="poster__letters" aria-hidden="true">
          {letters.map((letter, index) => (
            <span key={`${letter}-label-${index}`} data-hero-letter>
              {letter}
            </span>
          ))}
        </div>

        <span className="poster__seal" aria-hidden="true">たこ焼き</span>
        <span className="poster__serial" aria-hidden="true">No. 08 · 焼きたて</span>

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
      </div>

      <figcaption className="poster__foot">
        <strong>GitHub → Discord</strong>
        <span>大阪風 · たこ焼き</span>
      </figcaption>
    </figure>
  );
}
