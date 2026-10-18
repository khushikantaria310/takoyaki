"use client";

import { usePathname } from "next/navigation";
import ChopstickScene from "./ChopstickScene";
import BowlScene from "./BowlScene";

/** Picks the scene for the current route; the canvas itself never unmounts. */
export default function SceneRouter() {
  const pathname = usePathname();

  if (pathname.startsWith("/features")) return <BowlScene />;
  if (pathname === "/") return <ChopstickScene />;
  return null;
}
