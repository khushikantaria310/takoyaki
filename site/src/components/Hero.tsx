import { ArrowDownRight } from "lucide-react";
import { discordInviteUrl } from "@/lib/site-config";
import { PosterArt } from "@/components/PosterArt";

export function Hero() {
  return (
    <main id="main">
      <section className="hero hero--full" id="opening" aria-labelledby="hero-title">
        <div className="poster__bg" aria-hidden="true" />

        <div className="poster__ui">
          <div className="poster__stage" data-poster-scene>
            <PosterArt />
          </div>

          <div className="overlay">
            <p className="overlay__eyebrow">大阪風 · GitHub → Discord</p>
            <h1 className="overlay__title" id="hero-title">
              GitHub, hot off the <em>grill.</em>
            </h1>
            <p className="overlay__tagline">
              “GitHub events, hot off the grill and into Discord.”
            </p>
            <p className="overlay__setup">
              <code>/github link</code> · <code>/github install</code> · <code>/setchannel</code>
            </p>
            <a className="invite-button" href={discordInviteUrl} target="_blank" rel="noreferrer">
              Add to Discord <ArrowDownRight size={17} strokeWidth={2.5} aria-hidden="true" />
            </a>
            <p className="overlay__note">This page never reads your GitHub data.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
