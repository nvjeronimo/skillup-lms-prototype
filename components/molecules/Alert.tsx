import * as React from "react";
import { Info } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex items-start gap-4 rounded-xl border border-sko-border-primary-muted bg-sko-bg-primary-soft p-4 shadow-sm",
        className,
      )}
    >
      <span aria-hidden="true" className="relative inline-flex size-5 shrink-0 items-center justify-center">
        <span className="absolute -inset-1 rounded-full border-2 border-sko-border-primary opacity-30" />
        <span className="absolute -inset-[9px] rounded-full border-2 border-sko-border-primary opacity-10" />
        <Icon icon={Info} size={20} className="relative text-sko-icon-primary" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p id={id} className="sk-text-body-medium-semibold text-sko-text-default">
          {title}
        </p>
        {children ? <div className="sk-text-body-medium-regular text-sko-text-muted">{children}</div> : null}
      </div>
    </section>
  );
}
