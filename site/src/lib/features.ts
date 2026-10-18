export type Feature = {
  id: string;
  title: string;
  command?: string;
  comingSoon: boolean;
};

/** Only real-time pings and setup exist in the bot today. */
export const features: Feature[] = [
  { id: "pings", title: "Real-time pings", comingSoon: false },
  { id: "stats", title: "Contribution stats", comingSoon: true },
  { id: "streak", title: "Streak heatmap", comingSoon: true },
  { id: "leaderboards", title: "Leaderboards", comingSoon: true },
  { id: "compare", title: "Compare", comingSoon: true },
  { id: "topday", title: "Top day", comingSoon: true },
  { id: "modes", title: "Personal & organisation modes", comingSoon: true },
  {
    id: "setup",
    title: "Easy setup",
    command: "/github link · /github install · /setchannel",
    comingSoon: false,
  },
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
