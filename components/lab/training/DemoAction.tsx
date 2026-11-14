import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./DemoAction.module.css";

/**
 * A control whose destination does not exist in the lab. It stays a real button (keyboard, focus, 44px),
 * and says so when used instead of pretending with href="#".
 */
export function DemoAction({ className, children }: { className?: string; children: React.ReactNode }) {
  const [said, setSaid] = React.useState(false);
  return (
    <span className={styles.wrap}>
      <button type="button" className={cn(className)} onClick={() => setSaid(true)}>
        {children}
      </button>
      <span role="status" className="tb-meta tb-c-ink2">
        {said ? "Lab demo — this action isn't wired yet." : ""}
      </span>
    </span>
  );
}
