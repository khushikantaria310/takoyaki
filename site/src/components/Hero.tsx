import { ArrowDownRight } from "lucide-react";
import { discordInviteUrl } from "@/lib/site-config";
import { PosterArt } from "@/components/PosterArt";
import FeatureCard from "@/components/FeatureCard";
import FeatureNav from "@/components/FeatureNav";

export function Hero() {
  return (
    <main id="main">
      <h1 className="sr-only">Takoyaki — GitHub notifications straight to Discord</h1>

      <section className="hero hero--full" id="opening">
        <div className="poster__bg" aria-hidden="true" />

        <div className="poster__ui">
          <div className="poster__stage" data-poster-scene>
            <PosterArt />
          </div>
        </div>
      </section>

      <FeatureNav />
      <FeatureCard />

      <a
        className="invite-button cta-float"
        href={discordInviteUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Add Takoyaki to Discord"
      >
        Add to Discord <ArrowDownRight size={16} strokeWidth={2.5} aria-hidden="true" />
      </a>
    </main>
  );
}
