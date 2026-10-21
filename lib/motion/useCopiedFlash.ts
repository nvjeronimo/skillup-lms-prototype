"use client";

import * as React from "react";
import { COPIED_MS } from "./feedback";

/**
 * The copy confirmation of a Share trigger (motion-matrix §7.9): `flash()` after a successful
 * copy turns `copied` on for COPIED_MS, then off. A second copy restarts the time; the timer
 * is cleared on unmount.
 */
export function useCopiedFlash(): { copied: boolean; flash: () => void } {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const flash = React.useCallback(() => {
    window.clearTimeout(timer.current);
    setCopied(true);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  }, []);
  return { copied, flash };
}
