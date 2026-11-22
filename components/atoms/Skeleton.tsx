import type * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./Skeleton.module.css";

const RADIUS = {
  none: styles.radiusNone,
  inner: styles.radiusInner,
  control: styles.radiusControl,
  card: styles.radiusCard,
  track: styles.radiusTrack,
  pill: styles.radiusPill,
};

type Size = number | string;
const px = (v: Size | undefined) => (typeof v === "number" ? `${v}px` : v);

export type SkeletonProps =
  | {
      /** A line of text: as tall as the text style's line, the bar ~0.8em of it. */
      variant?: "text";
      /** The `.sk-text-*` style it stands for, without the prefix (e.g. "body-medium-regular"). */
      text?: string;
      width?: Size;
      className?: string;
    }
  | {
      /** A box: a card, an image, a button, a bar. */
      variant: "block";
      width?: Size;
      height?: Size;
      radius?: keyof typeof RADIUS;
      className?: string;
    }
  | {
      /**
       * A known text (a title, a description) drawn as bars that wrap where it will: the text
       * itself, invisible, on bg/muted (`.sk-skeleton-ghost`). Static, no sweep.
       */
      variant: "ghost";
      text?: string;
      children: React.ReactNode;
      className?: string;
    }
  | {
      /** A disc: an avatar, a ring. */
      variant: "circle";
      size: Size;
      className?: string;
    };

/**
 * DS `Skeleton` (motion-matrix §7.9): a placeholder that holds the place of content while
 * it loads, in bg/muted with a soft bg/subtle sheen sweeping across (`.sk-skeleton`,
 * app/globals.css: calc(long2 × 2.4), linear; static under reduced motion). Always
 * aria-hidden: the page-level skeleton carries one role="status" and its "Loading…".
 * A text line takes the line height of its text style, so a skeleton built from the same
 * styles and paddings as the page has the page's geometry.
 */
export function Skeleton(props: SkeletonProps) {
  if (props.variant === "block") {
    return (
      <div
        aria-hidden="true"
        className={cn("sk-skeleton", RADIUS[props.radius ?? "control"], props.className)}
        style={{ width: px(props.width), height: px(props.height) }}
      />
    );
  }
  if (props.variant === "ghost") {
    return (
      <div aria-hidden="true" className={cn(`sk-text-${props.text ?? "body-medium-regular"}`, styles.ghost, props.className)}>
        <span className="sk-skeleton-ghost">{props.children}</span>
      </div>
    );
  }
  if (props.variant === "circle") {
    return (
      <div
        aria-hidden="true"
        className={cn("sk-skeleton", styles.circle, styles.radiusPill, props.className)}
        style={{ width: px(props.size), height: px(props.size) }}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={cn(`sk-text-${props.text ?? "body-medium-regular"}`, "sk-skeleton-line", props.className)}
      style={{ width: px(props.width) }}
    >
      {/* A zero-width space gives the box the text style's line height. */}
      {"​"}
      <span className={cn("sk-skeleton", styles.lineBar)} />
    </div>
  );
}

/**
 * A pill (a Badge, a segment, a button) whose width is its own label: the label invisible on
 * bg/muted, with the Badge's padding and height (sm 22, md 24), a segment's (32, 44 on a
 * phone) or a Button's (sm 36, md 44; buttonStyles).
 */
export function SkeletonPill({
  children,
  size = "sm",
  icon = false,
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "segment" | "button-sm" | "button-md";
  /** A button's leading 20px icon. */
  icon?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        styles.pill,
        size === "sm" && cn("sk-text-body-small-medium", styles.pillSm),
        size === "md" && cn("sk-text-body-medium-medium", styles.pillMd),
        size === "segment" && cn("sk-text-body-medium-semibold", styles.pillSegment),
        size === "button-sm" && cn("sk-text-body-medium-semibold", styles.pillButtonSm),
        size === "button-md" && cn("sk-text-body-medium-semibold", styles.pillButtonMd),
        className,
      )}
    >
      {icon ? <span className={styles.pillIcon} /> : null}
      {children}
    </span>
  );
}
