"use client";

import * as React from "react";
import { forgetFooterPosition } from "@/lib/motion/footerPosition";

/**
 * One visit to a course's player: it outlives the per-topic layout (which remounts on every
 * topic) and, when the learner leaves the player or changes course, forgets what the footer
 * showed, so the next visit paints its "n of N" still.
 */
export function PlayerSession({ children }: { children: React.ReactNode }) {
  React.useEffect(() => () => forgetFooterPosition(), []);
  return <>{children}</>;
}
