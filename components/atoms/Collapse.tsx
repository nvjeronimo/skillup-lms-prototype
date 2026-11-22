import * as React from "react";
import { inertProps } from "@/lib/inert";
import { cn } from "@/lib/utils";
import styles from "./Collapse.module.css";

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: React.ReactNode;
}

/**
 * The body of an accordion: always rendered, it grows and shrinks to its content height
 * (grid rows 0fr ↔ 1fr, medium2, standard). Collapsed content is `inert` and `aria-hidden`,
 * so it is out of the tab order and the accessibility tree. Put padding on the children,
 * not on the Collapse: padding on the clipped row would stay visible when closed.
 * Extra props (id, role, aria-labelledby) go on the outer element. A closed body carries
 * `data-collapse="closed"`, so callers can tell it from inert set elsewhere (useDialog).
 * Reduced motion (globals.css): the rows snap, and the content fades in at short3.
 */
export function Collapse({ open, children, className, ...rest }: CollapseProps) {
  return (
    <div
      {...rest}
      data-collapse={open ? "open" : "closed"}
      aria-hidden={!open || undefined}
      {...inertProps(!open)}
      className={cn(
        styles.fold,
        open ? styles.open : styles.closed,
        className,
      )}
    >
      <div className={cn("sk-collapse-body", styles.body)}>{children}</div>
    </div>
  );
}
