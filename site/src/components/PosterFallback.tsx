const letters = ["T", "A", "K", "O", "Y", "A", "K", "I"];

/** Static poster art used before and instead of WebGL. */
export function PosterFallback() {
  return (
    <figure
      className="poster"
      data-poster-fallback
      role="img"
      aria-label="Vintage Takoyaki poster: eight illustrated takoyaki balls beside a vertical chopstick and the name Takoyaki set vertically in orange."
    >
      <div className="poster__head">
        <span className="poster__stamp">大阪風</span>
        <span className="poster__serial">No. 08 / hot &amp; ready</span>
      </div>

      <div className="poster__scene" data-poster-scene aria-hidden="true">
        <p className="poster__japanese">たこ焼き</p>
        <div className="poster__balls">
          {letters.map((letter, index) => (
            <span className="takoyaki-ball" key={`${letter}-${index}`} />
          ))}
        </div>
        <span className="poster__chopstick" />
        <div className="poster__letters">
          {letters.map((letter, index) => (
            <span key={`${letter}-label-${index}`} data-hero-letter>
              {letter}
            </span>
          ))}
        </div>
      </div>

      <figcaption className="poster__foot">
        <strong>One server. Fresh signals.</strong>
        <span>焼きたて</span>
      </figcaption>
    </figure>
  );
}
