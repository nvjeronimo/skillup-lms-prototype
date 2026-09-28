import * as React from "react";
import { BookOpen, CalendarCheck, Clock, Package, Video } from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

/**
 * Course Type — Program / Course (DS `LMS / Course Type Badge`, 19975:538072).
 * No box: no fill, no stroke, no padding, 4px gap, 16px high. The label is Montserrat
 * SemiBold 12 in capitals with no text style (nearest: body-small/Semibold), text/primary
 * for Program and text/subtle for Course. The DS icons are custom 16px illustrations
 * (icon-program / icon-course); the lucide glyphs stand in, tinted to the label's role.
 */
export function CourseTypeBadge({ value }: { value: "Program" | "Course" }) {
  const program = value === "Program";
  return (
    <span
      className={cn(
        "sk-text-xs-semibold inline-flex items-center gap-1 uppercase",
        program ? "text-sko-text-primary" : "text-sko-text-subtle",
      )}
    >
      <Icon
        icon={program ? Package : BookOpen}
        size={16}
        className={program ? "text-sko-icon-primary" : "text-sko-icon-subtle"}
      />
      {value}
    </span>
  );
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

/* DS `LMS / Difficulty · Level Icon` (21868:5367): three vertical bars on a 24 grid at
   x = 5 / 12 / 19, heights 6 / 11 / 16, butt caps. Bars up to the level are the 'Icon'
   vector; the rest are the 'Track' at layer opacity 0.35 — both icon/subtle, so the level
   reads from the shape, not from colour. */
const LEVEL_BARS = ["M5 20V14", "M12 20V9", "M19 20V4"] as const;
const LEVEL_COUNT: Record<Difficulty, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };

export interface DifficultyLevelIconProps extends Omit<LucideProps, "ref"> {
  level: Difficulty;
}

/**
 * The difficulty level glyph. Takes the lucide props so it can sit in `Badge leftIcon`;
 * `vectorEffect="non-scaling-stroke"` keeps the stroke at the DS 1.5px at any size.
 */
export const DifficultyLevelIcon = React.forwardRef<SVGSVGElement, DifficultyLevelIconProps>(
  function DifficultyLevelIcon(
    // absoluteStrokeWidth is a lucide-only prop; pulled out so it is not spread onto the <svg>.
    { level, size = 12, strokeWidth = 1.5, absoluteStrokeWidth: _abs, color = "currentColor", ...rest },
    ref,
  ) {
    const filled = LEVEL_COUNT[level];
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        aria-hidden="true"
        {...rest}
      >
        {LEVEL_BARS.map((d, i) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" opacity={i < filled ? 1 : 0.35} />
        ))}
      </svg>
    );
  },
);

/* One LucideIcon-shaped component per level, so the glyph can go through Badge `leftIcon`. */
function levelIcon(level: Difficulty): LucideIcon {
  const C = React.forwardRef<SVGSVGElement, Omit<LucideProps, "ref">>(function LevelIcon(props, ref) {
    return <DifficultyLevelIcon ref={ref} level={level} {...props} />;
  });
  C.displayName = `DifficultyLevelIcon(${level})`;
  return C as LucideIcon;
}

const LEVEL_ICON: Record<Difficulty, LucideIcon> = {
  Beginner: levelIcon("Beginner"),
  Intermediate: levelIcon("Intermediate"),
  Advanced: levelIcon("Advanced"),
};

/**
 * Difficulty (DS `LMS / Difficulty Badge`, 19975:538077): Badge v2 Style=Outline, Size=sm,
 * Color=Gray for every level — bg/faint pill, 1px inside stroke, label text/muted, level
 * glyph icon/subtle at 12px.
 */
export function DifficultyBadge({ value }: { value: Difficulty }) {
  return (
    <Badge variant="outline" color="gray" leftIcon={LEVEL_ICON[value]}>
      {value}
    </Badge>
  );
}

export type DeliveryMode = "Flexible Learning" | "Flexible + Live" | "Live Sessions";

/* DS icons: video-recorder, calendar-check-01, clock (Untitled UI) → lucide equivalents. */
const DELIVERY_ICON: Record<DeliveryMode, LucideIcon> = {
  "Live Sessions": Video,
  "Flexible + Live": CalendarCheck,
  "Flexible Learning": Clock,
};

/**
 * Delivery Mode (DS `LMS / Delivery Mode Badge`, 19975:538084): Badge v2 Style=Soft,
 * Size=sm, Color=Info — bg/info-soft pill, no stroke, label text/info, icon icon/info at 12px.
 */
export function DeliveryModeBadge({ value }: { value: DeliveryMode }) {
  return (
    <Badge color="info" leftIcon={DELIVERY_ICON[value]}>
      {value}
    </Badge>
  );
}

export type Provider =
  | "SkillUp"
  | "Microsoft"
  | "IBM"
  | "Google Cloud"
  | "FutureSkills"
  | "Pacific Lutheran University";

/**
 * Provider (DS `LMS / Provider-Partner Badge`, 19975:538091): Badge v2 Style=Plain, Size=sm,
 * Color=Gray — the provider name only (body-small/Medium, text/muted), no "by" prefix.
 */
export function ProviderBadge({ value }: { value: Provider }) {
  return (
    <Badge variant="plain" color="gray">
      {value}
    </Badge>
  );
}
