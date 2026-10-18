import { ArrowDownRight, ArrowRight } from "lucide-react";
import { discordInviteUrl } from "@/lib/site-config";
import { PosterFallback } from "@/components/PosterFallback";

const available = [
  "Real-time pings",
  "Pushes, pull requests & issues",
  "New repositories",
  "Easy setup",
];

const comingSoon = [
  "Contribution stats",
  "Streak heatmap",
  "Leaderboards",
  "Compare",
  "Top day",
  "Personal & organisation modes",
];

export function Hero() {
  return (
    <>
      <section className="hero" id="opening" aria-labelledby="hero-title">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">Osaka street-poster flavour for your server</p>
            <h1 className="hero__title" id="hero-title">
              GitHub, hot off the <em>grill.</em>
            </h1>
            <p className="hero__tagline">
              “GitHub events, hot off the grill and into Discord.”
            </p>
            <p className="hero__description">
              Takoyaki delivers real-time notifications for pushes, pull requests, issues, and newly
              created repositories straight to your Discord channel.
            </p>
            <p className="hero__setup" id="setup">
              Link your account with <code>/github link</code>, install the GitHub App with{" "}
              <code>/github install</code>, then an admin can pick a channel with{" "}
              <code>/setchannel</code>.
            </p>
            <a className="invite-button" href={discordInviteUrl} target="_blank" rel="noreferrer">
              Add to Discord <ArrowDownRight size={17} strokeWidth={2.5} aria-hidden="true" />
            </a>
            <p className="privacy-note">This page never reads your GitHub data.</p>
            <span className="scroll-cue">Scroll to plate up</span>
          </div>

          <PosterFallback />
        </div>
      </section>

      <section className="dispatch-strip" id="notifications" aria-labelledby="dispatch-title">
        <div className="dispatch-strip__heading">
          <span className="dispatch-label">On the menu</span>
          <h2 id="dispatch-title">What Takoyaki actually serves.</h2>
        </div>

        <div className="dispatch-grid">
          <div className="dispatch-group dispatch-group--live">
            <h3>Available now</h3>
            <ul className="dispatch-list">
              {available.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>

          <div className="dispatch-group dispatch-group--soon">
            <h3>On the roadmap — coming soon</h3>
            <ul className="dispatch-list">
              {comingSoon.map((item) => (
                <li key={item}>
                  {item} <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
