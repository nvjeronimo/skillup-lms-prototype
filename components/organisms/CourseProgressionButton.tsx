import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Button, type ButtonSize } from "@/components/atoms/Button";

export type Milestone = "Topic" | "Reading Complete" | "Module" | "Course";

export interface CourseProgressionButtonProps {
  milestone?: Milestone;
  disabled?: boolean;
  size?: ButtonSize;
  onClick?: () => void;
}

const LABEL: Record<Milestone, string> = {
  Topic: "Next topic",
  "Reading Complete": "Mark complete",
  Module: "Next module",
  Course: "Finish course",
};

/** The progression CTA at the right of the Footer Nav. Label varies by milestone. */
export function CourseProgressionButton({
  milestone = "Topic",
  disabled = false,
  size = "md",
  onClick,
}: CourseProgressionButtonProps) {
  return (
    <Button variant="primary" size={size} rightIcon={ChevronRight} disabled={disabled} onClick={onClick}>
      {LABEL[milestone]}
    </Button>
  );
}
