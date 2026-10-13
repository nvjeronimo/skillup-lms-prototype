import * as React from "react";
import { CalendarCheck, Clock, Video } from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

/**
 * Course Type — Program / Course (DS `LMS / Course Type Badge`, 19975:538072).
 * No box: no fill, no stroke, no padding, 4px gap, 16px high. The label is Montserrat
 * SemiBold 12 in capitals with no text style (nearest: body-small/Semibold), text/primary
 * for Program and text/subtle for Course. The icons are the DS's own 16px illustrations
 * (icon-program: three stacked sheets on bg/strong, border/primary-soft and bg/info;
 * icon-course: a sheet on border/primary-soft with three lines on bg/info), drawn here
 * from the component's vectors with the same tokens.
 */
function CourseTypeIcon({ program }: { program: boolean }) {
  return program ? (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="4.666" width="10" height="11.3333" rx="1.3333" className="fill-sko-bg-strong" />
      <rect x="3.334" y="2" width="10" height="11.3333" rx="1.3333" className="fill-sko-border-primary-soft" />
      <rect x="2" y="4" width="10" height="11.3333" rx="1.3333" className="fill-sko-bg-info" />
    </svg>
  ) : (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M2 3.5C2 2.39543 2.89543 1.5 4 1.5H12C13.1046 1.5 14 2.39543 14 3.5V12.5C14 13.6046 13.1046 14.5 12 14.5H4C2.89543 14.5 2 13.6046 2 12.5V3.5Z"
        className="fill-sko-border-primary-soft"
      />
      <rect x="4" y="4.5" width="8" height="1" className="fill-sko-bg-info" />
      <rect x="4" y="7.5" width="5" height="1" className="fill-sko-bg-info" />
      <rect x="4" y="10.5" width="6" height="1" className="fill-sko-bg-info" />
    </svg>
  );
}

export function CourseTypeBadge({ value }: { value: "Program" | "Course" }) {
  const program = value === "Program";
  return (
    <span
      className={cn(
        "sk-text-body-small-semibold inline-flex items-center gap-1 uppercase",
        program ? "text-sko-text-primary" : "text-sko-text-subtle",
      )}
    >
      <CourseTypeIcon program={program} />
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
 * Difficulty (DS `LMS / Difficulty Badge`, 19975:538077): Badge Style=Outline, Size=sm,
 * Color=Gray for every level — bg/faint pill, 1px inside stroke border/subtle (DS-D1), label
 * text/muted, level glyph icon/subtle at 12px.
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
 * Delivery Mode (DS `LMS/Platform/Discovery/Delivery-Mode-Badge`, 19975:538084): Badge
 * Style=Modern, Size=sm, Color=Info on the three types — bg/page pill, 1px inside stroke
 * border/info, label text/info, icon at 12px.
 */
export function DeliveryModeBadge({ value }: { value: DeliveryMode }) {
  return (
    <Badge variant="modern" color="info" leftIcon={DELIVERY_ICON[value]}>
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
 * Provider (DS `LMS / Provider-Partner Badge`, 19975:538091): Badge Style=Plain, Size=sm,
 * Color=Gray — the provider name only (body-small/Medium, text/muted), no "by" prefix.
 */
export function ProviderBadge({ value }: { value: Provider }) {
  return (
    <Badge variant="plain" color="gray">
      {value}
    </Badge>
  );
}
