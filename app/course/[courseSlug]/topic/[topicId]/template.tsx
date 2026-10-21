"use client";

import * as React from "react";
import { useArrival } from "@/lib/arrival/useArrival";

/**
 * The topic body comes in on every topic and tab change (a fade and a 4px nudge). Next mounts
 * a template afresh on each navigation, inside the layout: the player shell (top bar,
 * sidebar, footer) lives in that layout and the sidebar restores its own scroll position.
 * On a topic's first visit in the session the body arrives instead (skeleton, then its
 * sections in order: PlayerShell, motion-matrix §7.9), so the fade is left out for the
 * template that mounted with the topic; a tab opened afterwards fades as before.
 */
export default function TopicTemplate({ children }: { children: React.ReactNode }) {
  const { decided, released, first } = useArrival();
  // Read on the template's first render: before PlayerShell's controller has decided (it
  // decides in a layout effect). That effect's state update re-renders this template before the
  // browser paints, so the class below is settled (no fade on a first visit) by the first paint.
  const withTopic = React.useRef(!decided || !released).current;
  return <div className={withTopic && first ? undefined : "sk-animate-page"}>{children}</div>;
}
