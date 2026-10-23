"use client";

import * as React from "react";
import { FadeImage } from "@/components/atoms/FadeImage";
import { cn } from "@/lib/utils";

/**
 * Thumbnail of the DS `LMS / Course Card`: bg/primary-soft, radius 10, the Initials in
 * text/primary (title-large/Bold) and, with DS `Show image` on, the course's own image on
 * the `Image` layer over them (fill, cropped to the square). The initials stay underneath
 * as the fallback: they show while the image loads and if it fails. The image fades in when it
 * has loaded (FadeImage, motion-matrix §7.9).
 * The image is decorative (the course title is next to it), so it has no text alternative.
 * `cover` (22 Oct 2026, Nelson: the picture large on course cards and module rows): no radius of
 * its own (the card clips it), larger initials, and the picture eases in a little when the
 * card is hovered (`group` on the card; hover only exists on devices that hover): `.sk-cover-zoom`,
 * 1.02 over long2, in app/globals.css next to the load fade it shares a transition with.
 * Card pictures are 2:1 (Nelson, 23 Oct 2026: the course images are 2:1), so the callers size
 * the box at that ratio: `aspect-[2/1]` across a card, a width twice the row's height beside a
 * row (Course-Row 236 for its 118, list card 300 for its 150; at most 40% of a narrow row). The
 * exception is the program card's tile, which stays square (64 × 64, the picture cropped 1:1).
 */
export function CourseThumb({
  initials,
  imageSrc,
  shape = "tile",
  className,
}: {
  initials: string;
  imageSrc?: string;
  shape?: "tile" | "cover";
  /** Sets the size: 86 on Grid, 118 on List. */
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-sko-bg-primary-soft text-sko-text-primary",
        shape === "cover" ? "sk-text-headline-medium-bold" : "sk-text-title-large-bold rounded-control",
        className,
      )}
    >
      {initials}
      {imageSrc && !failed ? (
        <FadeImage
          src={imageSrc}
          alt=""
          // Covers sit below the fold in long lists: load them as they come near (audit 16 Oct 2026).
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 size-full object-cover",
            shape === "cover" && "sk-cover-zoom",
          )}
        />
      ) : null}
    </span>
  );
}
