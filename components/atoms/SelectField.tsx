import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./SelectField.module.css";

/**
 * DS `Select` (Size=md): a native <select> drawn as the DS field. The browser's own arrow is
 * removed (`appearance-none`) and the DS chevron-down (20, icon/faint) sits 14 from the right
 * edge, 8 after the text, so the value lines up with the Input field (padding 10 / 14).
 * The caller passes the field look (border, background, type) through `className`.
 */
export const SelectField = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string }
>(function SelectField({ className, wrapperClassName, children, ...rest }, ref) {
  return (
    <span className={cn(styles.wrapper, wrapperClassName)}>
      <select ref={ref} className={cn(styles.select, className)} {...rest}>
        {children}
      </select>
      <Icon
        icon={ChevronDown}
        size={20}
        aria-hidden
        className={styles.chevron}
      />
    </span>
  );
});
