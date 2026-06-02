"use client";

import * as React from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * Responsive breakpoint per prototype-flows.md:
 *   mobile:  ≤ 768
 *   tablet:  769–1024
 *   desktop: ≥ 1025
 */
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = React.useState<Breakpoint>("desktop");

  React.useEffect(() => {
    function compute() {
      const w = window.innerWidth;
      if (w <= 768) setBp("mobile");
      else if (w <= 1024) setBp("tablet");
      else setBp("desktop");
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return bp;
}
