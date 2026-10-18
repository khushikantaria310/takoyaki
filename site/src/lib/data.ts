export type Feature = {
  id: string;
  label: string;
  note: string;
};

export type CommandItem = {
  id: string;
  command: string;
  note: string;
};

/** Feature copy mirrors the Logizel/takoyaki README. */
export const features: Feature[] = [
  { id: "pings", label: "Real-time pings", note: "Push, PR & issue alerts" },
  { id: "stats", label: "Contribution stats", note: "/stats me" },
  { id: "streak", label: "Streak heatmap", note: "/stats streak" },
  { id: "leaderboards", label: "Leaderboards", note: "/stats top" },
  { id: "compare", label: "Compare", note: "/stats compare" },
  { id: "topday", label: "Top day", note: "/stats top-day" },
  { id: "modes", label: "Personal & org modes", note: "/setchannel" },
  { id: "setup", label: "Easy setup", note: "/github link" },
];

export const commands: CommandItem[] = [
  { id: "link", command: "/github link", note: "Install the app & link" },
  { id: "unlink", command: "/github unlink", note: "Remove your link" },
  { id: "setchannel", command: "/setchannel", note: "Pick a channel (admin)" },
  { id: "me", command: "/stats me", note: "Your 365-day total" },
  { id: "streak", command: "/stats streak", note: "Yearly streak chart" },
  { id: "compare", command: "/stats compare", note: "Compare two users" },
  { id: "top", command: "/stats top", note: "Server leaderboard" },
  { id: "topday", command: "/stats top-day", note: "Today’s top committer" },
];

export const bill = [
  { label: "Invite Takoyaki", value: "free" },
  { label: "/github link", value: "link your account" },
  { label: "/setchannel", value: "pick a channel" },
  { label: "Pings, stats & leaderboards", value: "included" },
];
