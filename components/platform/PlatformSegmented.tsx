import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./PlatformSegmented.module.css";

/**
 * DS `Button group` v2.0 (11 Oct 2026), as the Q&A filter draws it: a bg/muted track, padding 4,
 * gap 2, radius 8; the pressed segment is a pill on bg/page with 1px border/subtle and
 * text/primary. 32 tall, 44 on mobile.
 * An option can carry an icon before its label. With `compact`, the segments show the icon alone
 * below md (a phone or a small tablet) and icon + label from md up; the label stays the button's
 * name for assistive tech (Nelson, 23 Oct 2026, the Calendar's Agenda / Month).
 */
export function PlatformSegmented<T extends string>({
  label,
  options,
  value,
  onChange,
  compact = false,
  className,
}: {
  /** Names the group for assistive tech. */
  label: string;
  options: { id: T; label: string; icon?: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
  /** Icon-only segments below md (each option needs an icon). */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} data-segmented="" className={cn(styles.track, className)}>
      {options.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            "sk-text-body-medium-semibold",
            styles.segment,
            compact && item.icon && styles.iconOnly,
            value === item.id ? styles.segmentOn : styles.segmentOff,
          )}
        >
          {item.icon ? <Icon icon={item.icon} size={18} aria-hidden /> : null}
          <span className={cn(compact && item.icon && styles.iconOnlyLabel)}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
