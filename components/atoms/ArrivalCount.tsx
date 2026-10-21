"use client";

import { useArrivalCount } from "@/lib/arrival/useArrival";

/**
 * A figure that counts up from 0 the first time it shows on a page's first visit in the
 * session (motion-matrix §7.9). While it counts, the moving digits are aria-hidden and
 * screen readers get the final figure only (the AssessmentView pattern); otherwise it is
 * the plain figure.
 */
export function ArrivalCount({ value }: { value: string }) {
  const { ref, text, counting } = useArrivalCount<HTMLSpanElement>(value);
  return (
    <span ref={ref}>
      {counting ? (
        <>
          <span aria-hidden="true">{text}</span>
          <span className="sr-only">{value}</span>
        </>
      ) : (
        value
      )}
    </span>
  );
}
