import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./Avatar.module.css";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  name: string;
  /** Optional image; falls back to initials. */
  src?: string;
  size?: AvatarSize;
  /** Online status dot. */
  status?: "online" | "offline" | "none";
  /**
   * Corner shape. "circle" (default) for people (thread authors, bylines);
   * "square" for the profile avatar, to match the rounded-lg of the topbar
   * icon buttons and CTAs.
   */
  shape?: "circle" | "square";
  className?: string;
}

// DS Avatar (19:1012), per Size variant:
// - text: initials style, body-small / body-medium / body-large / title-medium, all Semibold.
// - border: the Text=True stroke width (border/subtle, drawn inside): 0.5 / 0.75 / 1 / 1 px.
// - dot: the _Avatar online indicator, 6 / 8 / 10 / 12 px.
const SIZE: Record<AvatarSize, { box: string; text: string; stroke: string; dot: string }> = {
  xs: { box: styles.xs, text: "sk-text-body-small-semibold", stroke: styles.border05, dot: styles.dotXs },
  sm: { box: styles.sm, text: "sk-text-body-medium-semibold", stroke: styles.border075, dot: styles.dotSm },
  md: { box: styles.md, text: "sk-text-body-large-semibold", stroke: styles.border1, dot: styles.dotMd },
  lg: { box: styles.lg, text: "sk-text-title-medium-semibold", stroke: styles.border1, dot: styles.dotLg },
};

const DOT_COLOR: Record<"online" | "offline", string> = {
  // The DS _Avatar online indicator binds icon/success-strong as its fill. bg/success is
  // kept instead: the colourblind-safe [data-vision='cvd'] blocks in tokens/colors.css
  // remap it to blue, and they do not remap icon/success-strong.
  online: styles.online,
  // DS Avatar has no Offline status (only Online, Company, Verified); grey dot kept at its
  // previous value until the DS defines one (Avatar.module.css).
  offline: styles.offline,
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Avatar with image or initials fallback + optional status dot. */
export function Avatar({
  name,
  src,
  size = "md",
  status = "none",
  shape = "circle",
  className,
}: AvatarProps) {
  const s = SIZE[size];
  // Fall back to initials if no src OR the image fails to load (e.g. 404).
  const [failed, setFailed] = React.useState(false);
  const showImg = src && !failed;
  return (
    <span className={cn(styles.avatar, className)}>
      <span
        className={cn(
          styles.face,
          shape === "square" ? styles.square : styles.circle,
          s.box,
          s.text,
          // Initials (DS Text=True): bg/muted fill with a border/subtle stroke inside.
          showImg ? styles.withImage : cn(styles.initials, s.stroke),
        )}
      >
        {showImg ? (
          <img
            src={src}
            alt={name}
            className={styles.image}
            onError={() => setFailed(true)}
          />
        ) : (
          initials(name)
        )}
      </span>
      {status !== "none" ? (
        <span
          aria-label={status === "online" ? "Online" : "Offline"}
          className={cn(
            // DS _Avatar online indicator: 1.5px bg/page stroke drawn OUTSIDE the dot,
            // so a ring (outside the box) rather than a border (inside it).
            styles.dot,
            s.dot,
            DOT_COLOR[status],
          )}
        />
      ) : null}
    </span>
  );
}
