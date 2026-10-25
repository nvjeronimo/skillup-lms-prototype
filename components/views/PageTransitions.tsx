"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { navigateWithTransition, settlePageTransition, shouldTransitionClick } from "@/lib/motion/pageTransition";

/**
 * Sends link clicks to another page through a page transition (lib/motion/pageTransition): the
 * old page fades out while the new one fades in. It listens in the capture phase, before
 * next/link's own handler, which leaves a click whose default is prevented alone; the push is
 * then made here. It also tells the transition when the new route is in (a pathname change).
 * Mounted once, in ResponsiveShell. Renders nothing.
 */
export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    settlePageTransition();
  }, [pathname]);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || !shouldTransitionClick(e, anchor, window.location)) return;
      e.preventDefault();
      const url = new URL(anchor.href);
      navigateWithTransition(() => router.push(url.pathname + url.search + url.hash));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
