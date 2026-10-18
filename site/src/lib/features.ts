export type Feature = {
  id: string;
  title: string;
  blurb: string;
  command?: string;
};

/**
 * Feature copy mirrors the Logizel/takoyaki README: slash commands and the
 * webhook event list are the source of truth.
 */
export const features: Feature[] = [
  {
    id: "pings",
    title: "Real-time pings",
    blurb: "Instant Discord alerts for pushes, pull requests, issues, new repos, and CI runs.",
  },
  {
    id: "stats",
    title: "Contribution stats",
    blurb: "Today’s commits plus a trailing 365-day total and daily average.",
    command: "/stats me",
  },
  {
    id: "streak",
    title: "Streak heatmap",
    blurb: "A GitHub-style 182-day contribution heatmap, rendered as an image.",
    command: "/stats streak",
  },
  {
    id: "leaderboards",
    title: "Leaderboards",
    blurb: "The top committers across your server for the past 365 days.",
    command: "/stats top",
  },
  {
    id: "compare",
    title: "Compare",
    blurb: "Line your commit totals up against anyone else in the server.",
    command: "/stats compare @user",
  },
  {
    id: "topday",
    title: "Top day",
    blurb: "See who has racked up the most commits today.",
    command: "/stats top-day",
  },
  {
    id: "modes",
    title: "Personal & organisation modes",
    blurb: "Standard mode pings linked users; Org mode tracks a whole organisation, anonymised.",
    command: "/setchannel",
  },
  {
    id: "setup",
    title: "Easy setup",
    blurb: "Install the GitHub App and link your account in one command — no per-repo webhooks.",
    command: "/github link",
  },
];

export const slashCommands = [
  { command: "/github link", description: "Install the GitHub App and link your account.", scope: "Everyone" },
  { command: "/github unlink", description: "Remove your GitHub link.", scope: "Everyone" },
  { command: "/setchannel", description: "Set this channel for notifications, in Standard or Org mode.", scope: "Administrator" },
  { command: "/stats me", description: "Your commit count today and over the past 365 days.", scope: "Everyone" },
  { command: "/stats streak", description: "Your commit streak chart for the past year.", scope: "Everyone" },
  { command: "/stats compare @user", description: "Compare your commits with another user.", scope: "Everyone" },
  { command: "/stats top", description: "Leaderboard of commits in the past 365 days.", scope: "Everyone" },
  { command: "/stats top-day", description: "Who has the most commits today.", scope: "Everyone" },
];

export const eventTypes = [
  { event: "push", detail: "N commits to a repo, with the first commit message." },
  { event: "pull_request", detail: "Opened, closed, or merged, with the PR title." },
  { event: "issues", detail: "Opened or closed, with the issue title." },
  { event: "repository", detail: "A new repository was created." },
  { event: "workflow_run", detail: "A CI workflow finished, with its branch and conclusion." },
];

export const FOCUS_EVENT = "tako:focus";
export const BLUR_EVENT = "tako:blur";
export const KEYBOARD_EVENT = "tako:keyboard";

export type FocusDetail = { index: number; x: number; y: number };

export function emitFocus(index: number, x: number, y: number) {
  window.dispatchEvent(new CustomEvent<FocusDetail>(FOCUS_EVENT, { detail: { index, x, y } }));
}

export function emitBlur() {
  window.dispatchEvent(new Event(BLUR_EVENT));
}

export function emitKeyboard(index: number) {
  window.dispatchEvent(new CustomEvent<{ index: number }>(KEYBOARD_EVENT, { detail: { index } }));
}
