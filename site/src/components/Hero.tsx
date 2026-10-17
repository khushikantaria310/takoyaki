import { ArrowDownRight } from "lucide-react";
import { discordInviteUrl } from "@/lib/site-config";
import { PosterFallback } from "@/components/PosterFallback";

const notifications = [
  "Pushes",
  "Pull requests · opened / closed",
  "Issues · opened / closed",
  "New repositories",
];

export function Hero() {
  return (
    <>
      <section className="hero" id="opening" aria-labelledby="hero-title">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">A little Osaka flavour for your server</p>
            <h1 className="hero__title" id="hero-title">
              GitHub, hot off the <em>grill.</em>
            </h1>
            <p className="hero__tagline">
              “GitHub events, hot off the grill and into Discord.”
            </p>
            <p className="hero__description">
              Takoyaki sends real-time notifications for pushes, pull requests, issues, and newly
              created repositories to your Discord channel.
            </p>
            <p className="hero__setup" id="setup">
              Link your account with <code>/github link</code>, install the GitHub App with{" "}
              <code>/github install</code>, then an admin can choose a channel with{" "}
              <code>/setchannel</code>.
            </p>
            <a className="invite-button" href={discordInviteUrl} target="_blank" rel="noreferrer">
              Add to Discord <ArrowDownRight size={17} strokeWidth={2.5} aria-hidden="true" />
            </a>
            <p className="privacy-note">This page never reads your GitHub data.</p>
          </div>

          <PosterFallback />
        </div>
      </section>

      <section className="dispatch-strip" id="notifications" aria-labelledby="dispatch-title">
        <div className="dispatch-strip__heading">
          <span className="dispatch-label">On the menu</span>
          <h2 id="dispatch-title">Only what Takoyaki really serves.</h2>
        </div>
        <ul className="dispatch-list">
          {notifications.map((notification) => <li key={notification}>{notification}</li>)}
        </ul>
      </section>
    </>
  );
}
