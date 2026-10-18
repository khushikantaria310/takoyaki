import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Terminal } from "lucide-react";
import { Footer } from "@/components/Footer";
import { discordInviteUrl } from "@/lib/site-config";
import { eventTypes, slashCommands } from "@/lib/features";

const steps = [
  {
    title: "Invite Takoyaki",
    body: "Add the bot to your server. It only needs permission to post in the channels you choose.",
  },
  {
    title: "Link your GitHub",
    body: "Run /github link to install the GitHub App on your account, then authorise with GitHub.",
  },
  {
    title: "Set a channel",
    body: "An admin runs /setchannel to pick a channel, in Standard mode or Org mode.",
  },
  {
    title: "Cook",
    body: "Pushes, pull requests, issues, new repos, and CI runs land in Discord in real time.",
  },
];

export function Commands() {
  return (
    <main id="main" className="page">
      <section className="content-section">
        <div className="section-inner">
          <p className="page-hero__eyebrow">Set up</p>
          <h1 className="section-title section-title--lg">Four steps to a hot plate</h1>

          <ol className="steps">
            {steps.map((step, index) => (
              <li className="step" key={step.title}>
                <span className="step__num">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <a className="invite-button section-cta" href={discordInviteUrl} target="_blank" rel="noreferrer">
            Add to Discord <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="content-section content-section--alt" aria-labelledby="commands-title">
        <div className="section-inner">
          <p className="page-hero__eyebrow">
            <Terminal size={14} strokeWidth={2.6} aria-hidden="true" /> Slash commands
          </p>
          <h2 id="commands-title" className="section-title">Command reference</h2>

          <div className="command-table" role="table" aria-label="Slash commands">
            {slashCommands.map((item) => (
              <div className="command-row" role="row" key={item.command}>
                <code className="command-row__cmd" role="cell">{item.command}</code>
                <span className="command-row__desc" role="cell">{item.description}</span>
                <span className="command-row__scope" role="cell">{item.scope}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" aria-labelledby="events-title">
        <div className="section-inner">
          <p className="page-hero__eyebrow">Webhook events</p>
          <h2 id="events-title" className="section-title">What lands in your channel</h2>

          <ul className="event-list">
            {eventTypes.map((item) => (
              <li className="event-row" key={item.event}>
                <code>{item.event}</code>
                <span>{item.detail}</span>
              </li>
            ))}
          </ul>

          <p className="privacy-note">
            <ShieldCheck size={15} strokeWidth={2.6} aria-hidden="true" /> Private repositories are
            masked as “a private repository” — the name never leaves GitHub. This website never reads
            your GitHub data.{" "}
            <Link href="/features">Back to the features</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
