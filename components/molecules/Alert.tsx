import * as React from "react";
import { Info } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./Alert.module.css";

export interface AlertProps {
  /** The alert's text: one short line, body-medium Semibold. */
  title: string;
  /** The supporting text under it: a paragraph, a list, anything in body-medium Regular. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * DS `Alert`, Color=Brand, Size=Floating, with no dismiss, no actions and no close button
 * (the options the Lab screens use, 12 Oct 2026). bg/primary-soft, 1px border/primary-muted,
 * radius 12, padding 16, the small card shadow. The featured icon is a 20px info-circle in
 * icon/primary inside two rings of border/primary, 28 and 38 wide at 30% and 10%. Then the
 * text (body-medium Semibold, text/default) and the supporting text (body-medium Regular,
 * text/muted), 4 apart, 16 from the icon.
 * It informs, it does not interrupt: a plain section, not `role="alert"`.
 */
export function Alert({ title, children, className }: AlertProps) {
  const id = React.useId();
  return (
    <section
      aria-labelledby={id}
      className={cn(styles.alert, className)}
    >
      <span aria-hidden="true" className={styles.featured}>
        <span className={styles.ringInner} />
        <span className={styles.ringOuter} />
        <Icon icon={Info} size={20} className={styles.icon} />
      </span>
      <div className={styles.body}>
        <p id={id} className={`sk-text-body-medium-semibold ${styles.title}`}>
          {title}
        </p>
        {children ? <div className={`sk-text-body-medium-regular ${styles.text}`}>{children}</div> : null}
      </div>
    </section>
  );
}
