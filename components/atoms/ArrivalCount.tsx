"use client";

import { useArrivalCount, useCountText, type ArrivalTrigger } from "@/lib/arrival/useArrival";

function Figure({ value, text, counting }: { value: string; text: string; counting: boolean }) {
  return counting ? (
    <>
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{value}</span>
    </>
  ) : (
    <>{value}</>
  );
}

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
      <Figure value={value} text={text} counting={counting} />
    </span>
  );
}

/** The same figure, counting on a trigger its owner holds (a bar's or a ring's: one start, review M2). */
export function ArrivalCountFrom({ value, trigger }: { value: string; trigger: ArrivalTrigger }) {
  const { text, counting } = useCountText(value, trigger);
  return <Figure value={value} text={text} counting={counting} />;
}
