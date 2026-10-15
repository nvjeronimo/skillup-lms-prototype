import * as React from "react";
import { CalendarCheck, Clock, Video } from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

/**
 * Course Type — Program / Course (DS `LMS / Course Type Badge`, 19975:538072).
 * No box: no fill, no stroke, no padding, 4px gap, 16px high. The label is Montserrat
 * SemiBold 12 in capitals with no text style (nearest: body-small/Semibold), text/primary
 * for Program and text/subtle for Course.
 * Icons (Nelson, 15 Oct 2026): a course is one box (DS icon `cube-01`); a program is several
 * boxes that lead to a certificate (DS icon `boxes-certificate`: two boxes under a seal).
 * Both are the DS's 24-grid line icons drawn at 16, 1.5 stroke, in the label's colour.
 */
const COURSE_ICON =
  "M20.5 7.27783L12 12.0001M12 12.0001L3.49997 7.27783M12 12.0001L12 21.5001M21 16.0586V7.94153C21 7.59889 21 7.42757 20.9495 7.27477C20.9049 7.13959 20.8318 7.01551 20.7354 6.91082C20.6263 6.79248 20.4766 6.70928 20.177 6.54288L12.777 2.43177C12.4934 2.27421 12.3516 2.19543 12.2015 2.16454C12.0685 2.13721 11.9315 2.13721 11.7986 2.16454C11.6484 2.19543 11.5066 2.27421 11.223 2.43177L3.82297 6.54288C3.52345 6.70928 3.37369 6.79248 3.26463 6.91082C3.16816 7.01551 3.09515 7.13959 3.05048 7.27477C3 7.42757 3 7.59889 3 7.94153V16.0586C3 16.4013 3 16.5726 3.05048 16.7254C3.09515 16.8606 3.16816 16.9847 3.26463 17.0893C3.37369 17.2077 3.52345 17.2909 3.82297 17.4573L11.223 21.5684C11.5066 21.726 11.6484 21.8047 11.7986 21.8356C11.9315 21.863 12.0685 21.863 12.2015 21.8356C12.3516 21.8047 12.4934 21.726 12.777 21.5684L20.177 17.4573C20.4766 17.2909 20.6263 17.2077 20.7354 17.0893C20.8318 16.9847 20.9049 16.8606 20.9495 16.7254C21 16.5726 21 16.4013 21 16.0586Z";
/* Two boxes (the lucide "boxes" geometry) under a certificate seal: circle r 4.2 at 12/5,
   ribbons dropping into the gap between the boxes. */
const PROGRAM_ICON = [
  "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
  "M7 16.5 2.26 13.65M7 16.5l5-3M7 16.5v5.17",
  "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
  "M17 16.5l-5-3M17 16.5l4.74-2.85M17 16.5v5.17",
  "M9.9 8.612 9.48 13.4 12 12.2l2.52 1.2-.42-4.788",
] as const;

function CourseTypeIcon({ program }: { program: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* non-scaling-stroke: the DS stroke is 1.5 at 16px, not 1.5 on the 24 grid. */}
      {program ? (
        <>
          {PROGRAM_ICON.map((d) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
          <circle cx={12} cy={5} r={4.2} vectorEffect="non-scaling-stroke" />
        </>
      ) : (
        <path d={COURSE_ICON} vectorEffect="non-scaling-stroke" />
      )}
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
