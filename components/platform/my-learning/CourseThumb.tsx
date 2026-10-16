"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Thumbnail of the DS `LMS / Course Card`: bg/primary-soft, radius 10, the Initials in
 * text/primary (title-large/Bold) and, with DS `Show image` on, the course's own image on
 * the `Image` layer over them (fill, cropped to the square). The initials stay underneath
 * as the fallback: they show while the image loads and if it fails.
 * The image is decorative (the course title is next to it), so it has no text alternative.
 */
export function CourseThumb({
  initials,
  imageSrc,
  className,
}: {
  initials: string;
  imageSrc?: string;
  /** Sets the size: 86 on Grid, 118 on List. */
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "sk-text-title-large-bold relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-sko-bg-primary-soft text-sko-text-primary",
        className,
      )}
    >
      {initials}
      {imageSrc && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt=""
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
    </span>
  );
}
