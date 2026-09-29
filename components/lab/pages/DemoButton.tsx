"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

/**
 * A DS Button whose destination does not exist in the lab. It stays a real button and says so when used,
 * instead of pretending with href="#".
 */
export function DemoButton({ children, ...props }: Omit<ButtonProps, "onClick">) {
  // A full-width button (e.g. `w-full sm:w-auto`) needs its wrapper to follow, or it stays content-width.
  const full = /(^|\s)w-full(\s|$)/.test(props.className ?? "");
  const [said, setSaid] = React.useState(false);
  return (
    <span className={cn("inline-flex flex-col items-start gap-1", full && "w-full items-stretch sm:w-auto sm:items-start")}>
      <Button {...props} onClick={() => setSaid(true)}>
        {children}
      </Button>
      <span role="status" className="sk-text-xs-regular text-sko-text-muted">
        {said ? "Lab demo — this action isn't wired yet." : ""}
      </span>
    </span>
  );
}
