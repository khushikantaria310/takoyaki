const letters = ["T", "A", "K", "O", "Y", "A", "K", "I"];

/**
 * Poster art shared by the home and features pages: the big vertical letters
 * plus a static stand-in (chopstick / tray) used before WebGL, if WebGL fails,
 * or when the visitor prefers reduced motion.
 */
export function PosterArt({ variant = "home" }: { variant?: "home" | "features" }) {
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

      <div className="poster__fallback" aria-hidden="true">
        {variant === "features" ? (
          <>
            <span className="poster__chopstick poster__chopstick--short" />
            <div className="poster__fallback-tray">
              {letters.slice(0, 6).map((letter, index) => (
                <span className="takoyaki-ball" key={`${letter}-tray-${index}`} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="poster__fallback-balls">
              {letters.map((letter, index) => (
                <span className="takoyaki-ball" key={`${letter}-ball-${index}`} />
              ))}
            </div>
            <span className="poster__chopstick" />
          </>
        )}
      </div>
    </>
  );
}
