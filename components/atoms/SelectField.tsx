import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
    <span className={cn("relative flex w-full", wrapperClassName)}>
      <select ref={ref} className={cn("w-full cursor-pointer appearance-none pr-[42px]", className)} {...rest}>
        {children}
      </select>
      <Icon
        icon={ChevronDown}
        size={20}
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sko-icon-faint"
      />
    </span>
  );
});
