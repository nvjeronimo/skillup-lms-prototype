import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/atoms/Button";

export type Milestone = "Topic" | "Module" | "Course";

export interface CourseProgressionButtonProps {
  milestone?: Milestone;
  disabled?: boolean;
  size?: ButtonSize;
  onClick?: () => void;
}

/**
 * Footer progression CTA (Option A). Navigation only — never the topic's action.
 * - Topic  → outline "Next" (skipping is always allowed)
 * - Module → filled "Go to next Module" at the last topic of a module
 * - Course → filled "Go to next Course" at the last topic of the course
 */
const CONFIG: Record<Milestone, { label: string; variant: ButtonVariant }> = {
  Topic: { label: "Next", variant: "secondary" },
  Module: { label: "Go to next Module", variant: "primary" },
  Course: { label: "Go to next Course", variant: "primary" },
};

export function CourseProgressionButton({
  milestone = "Topic",
  disabled = false,
  size = "md",
  onClick,
}: CourseProgressionButtonProps) {
  const cfg = CONFIG[milestone];
  return (
    <Button
      variant={cfg.variant}
      size={size}
      rightIcon={ArrowRight}
      disabled={disabled}
      onClick={onClick}
    >
      {cfg.label}
    </Button>
  );
}
