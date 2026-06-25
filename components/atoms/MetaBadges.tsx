import * as React from "react";
import { BarChart3, BookOpen, CalendarDays, Check, Package, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Course Type — Program / Course. Outlined pill with a leading icon (matches DS). */
export function CourseTypeBadge({ value }: { value: "Program" | "Course" }) {
  const icon = value === "Program" ? Package : BookOpen;
  return (
    <span className="sk-text-xs-medium inline-flex items-center gap-1.5 rounded-full border border-sk-border-primary bg-sk-bg-primary px-2.5 py-1 text-sk-text-secondary">
      <Icon icon={icon} size={14} className="text-sk-text-brand-secondary" />
      {value}
    </span>
  );
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Beginner: "text-sk-text-success-primary",
  Intermediate: "text-sk-text-warning-primary",
  Advanced: "text-sk-text-error-primary",
};

/** Difficulty — signal-bars icon + colored label, no background (matches DS). */
export function DifficultyBadge({ value }: { value: Difficulty }) {
  return (
    <span className={cn("sk-text-xs-medium inline-flex items-center gap-1.5", DIFFICULTY_COLOR[value])}>
      <Icon icon={BarChart3} size={14} />
      {value}
    </span>
  );
}

export type DeliveryMode = "Flexible Learning" | "Flexible + Live" | "Live Sessions";

const DELIVERY_ICON: Record<DeliveryMode, LucideIcon> = {
  "Live Sessions": CalendarDays,
  "Flexible + Live": Users,
  "Flexible Learning": Check,
};

/** Delivery Mode — icon + label, no background (matches DS). */
export function DeliveryModeBadge({ value }: { value: DeliveryMode }) {
  return (
    <span className="sk-text-xs-medium inline-flex items-center gap-1.5 text-sk-text-secondary">
      <Icon icon={DELIVERY_ICON[value]} size={14} className="text-sk-text-brand-secondary" />
      {value}
    </span>
  );
}

export type Provider =
  | "SkillUp"
  | "Microsoft"
  | "IBM"
  | "Google Cloud"
  | "FutureSkills"
  | "Pacific Lutheran University";

/** Provider — "by {name}" plain text (matches DS). */
export function ProviderBadge({ value }: { value: Provider }) {
  return (
    <span className="sk-text-xs-regular text-sk-text-tertiary">
      by <span className="sk-text-xs-medium text-sk-text-secondary">{value}</span>
    </span>
  );
}
