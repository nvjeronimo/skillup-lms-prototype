import * as React from "react";
import { CalendarCheck, Clock, Layers, Video } from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

/**
 * Course Type — Program / Course (DS `LMS / Course Type Badge`, 19975:538072, v1.1).
 * Words only: no box, no icon. The label is Montserrat SemiBold 12 in capitals with no text
 * style (nearest: body-small/Semibold), text/primary for Program and text/subtle for Course.
 * The icons were removed on 15 Oct 2026 (Nelson): the word and its colour say it as fast,
 * and the two cards already differ in shape.
 */
export function CourseTypeBadge({ value }: { value: "Program" | "Course" }) {
  const program = value === "Program";
  return (
    <span
      className={cn(
        "sk-text-body-small-semibold inline-flex items-center uppercase",
        program ? "text-sko-text-primary" : "text-sko-text-subtle",
      )}
    >
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

/**
 * Course count of a program (DS Program-Card v1.7, 15 Oct 2026): the third hero tag, Badge
 * Outline sm Gray with the Untitled `layers-three-01` icon (lucide Layers), e.g. "7 courses".
 */
export function CourseCountBadge({ count }: { count: number }) {
  return (
    <Badge variant="outline" color="gray" leftIcon={Layers}>
      {count} {count === 1 ? "course" : "courses"}
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

/** The partner artwork of DS Provider-Partner-Badge Type=Logo (exported from the DS, 16 Oct 2026). */
const PROVIDER_LOGO: Record<Provider, { light: string; dark?: string }> = {
  // The partner badge uses the monochrome SkillUp wordmark of the DS (Nelson, 16 Oct 2026), not the colour brand logo.
  SkillUp: { light: "/platform/partners/skillup-light.svg", dark: "/platform/partners/skillup-dark.svg" },
  Microsoft: { light: "/platform/partners/microsoft-light.svg", dark: "/platform/partners/microsoft-dark.svg" },
  IBM: { light: "/platform/partners/ibm-light.svg", dark: "/platform/partners/ibm-dark.svg" },
  "Google Cloud": { light: "/platform/partners/google-cloud-light.svg", dark: "/platform/partners/google-cloud-dark.svg" },
  // The dark drawing is the same bitmap through image filters in the DS (v1.2, Nelson), exported.
  FutureSkills: { light: "/platform/partners/futureskills.png", dark: "/platform/partners/futureskills-dark.png" },
  "Pacific Lutheran University": { light: "/platform/partners/plu-light.svg", dark: "/platform/partners/plu-dark.svg" },
};

/**
 * Provider (DS `LMS/Platform/Discovery/Provider-Partner-Badge` 1.3, 19975:538091).
 * Type=Text: Badge Style=Plain, Size=sm, Color=Gray, the name only (no "by" prefix).
 * Type=Logo: the artwork, 16 tall, on a bg/subtle chip with a 1px border/subtle, Radius/control
 * (6), still 28 tall (Nelson, 22 Oct 2026: the padding gives the border its pixel, 5 + 1). The DS Theme
 * (Light / Dark) follows the surface here: inside a `data-theme="dark"` band (the Program-Card
 * hero) the dark drawing shows (`.sk-logo-light` / `.sk-logo-dark`, app/globals.css).
 */
export function ProviderBadge({
  value,
  type = "text",
  chip = "subtle",
}: {
  value: Provider;
  type?: "text" | "logo";
  /**
   * The logo chip's fill: `subtle` (bg/subtle) on a card; `page` (bg/page) in a page header,
   * white on the light course band and the dark page colour on the dark program band
   * (DS Course-Header 1.1, Nelson 17 Oct 2026).
   */
  chip?: "subtle" | "page";
}) {
  if (type === "text")
    return (
      <Badge variant="plain" color="gray">
        {value}
      </Badge>
    );
  const logo = PROVIDER_LOGO[value];
  return (
    // DS 1.3 (22 Oct 2026): 1px border/subtle inside, Radius/control (6); 28 tall with the 16px artwork.
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-control border border-sko-border-subtle p-[5px]",
        chip === "page" ? "bg-sko-bg-page" : "bg-sko-bg-subtle",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.light} alt={value} className={cn("h-4 w-auto", logo.dark && "sk-logo-light")} />
      {logo.dark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo.dark} alt="" aria-hidden="true" className="sk-logo-dark h-4 w-auto" />
      ) : null}
    </span>
  );
}
