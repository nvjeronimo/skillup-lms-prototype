import * as React from "react";
import { Search } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./SearchField.module.css";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Shown as the placeholder and used as the accessible name. */
  label: string;
  className?: string;
  /** Ref of the <input>, for a parent that moves focus to it. */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Extra attributes of the <input>: onFocus, onKeyDown, enterKeyHint, aria-* … */
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "className">;
}

/**
 * DS Input field, Size=sm with a leading search-md icon and no label (6376:17187): bg/page,
 * 1px border/default, radius 8, Elevation/level1, padding 8/12, gap 8, icon 20, text
 * body-large/Regular with text/placeholder for the placeholder. 40 tall as drawn; 44 on
 * mobile (minimum target). Focus: 2px border/primary, no ring (the DS Input focus).
 */
export function SearchField({ value, onChange, label, className, inputRef, inputProps }: SearchFieldProps) {
  return (
    <label
      className={cn(
        styles.field,
        className,
      )}
    >
      <Icon icon={Search} size={20} className={styles.icon} aria-hidden="true" />
      <span className="sk-sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        autoComplete="off"
        {...inputProps}
        ref={inputRef}
        className={cn("sk-text-body-large-regular", styles.input)}
      />
    </label>
  );
}
