import * as React from "react";
import { Badge } from "./Badge";

/** Course Type — Program / Course. */
export function CourseTypeBadge({ value }: { value: "Program" | "Course" }) {
  return (
    <Badge tone={value === "Program" ? "brand" : "neutral"} eyebrow>
      {value}
    </Badge>
  );
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

const DIFFICULTY_TONE = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
} as const;

/** Difficulty — Beginner / Intermediate / Advanced. */
export function DifficultyBadge({ value }: { value: Difficulty }) {
  return <Badge tone={DIFFICULTY_TONE[value]}>{value}</Badge>;
}

export type DeliveryMode = "Flexible Learning" | "Flexible + Live" | "Cohort";

/** Delivery Mode — Flexible Learning / Flexible + Live / Cohort. */
export function DeliveryModeBadge({ value }: { value: DeliveryMode }) {
  return <Badge tone="outline">{value}</Badge>;
}

export type Provider = "SkillUp" | "Microsoft" | "IBM" | "Google Cloud" | "Stanford";

/** Provider — institution badge. Uses neutral pill with initial dot. */
export function ProviderBadge({ value }: { value: Provider }) {
  return (
    <Badge tone="neutral" className="font-display">
      {value}
    </Badge>
  );
}
