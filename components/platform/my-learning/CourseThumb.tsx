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
 * card is hovered (`group` on the card; hover only exists on devices that hover).
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
            shape === "cover" && "transition-transform duration-medium2 ease-standard-decelerate group-hover:scale-[1.03]",
          )}
        />
      ) : null}
    </span>
  );
}
