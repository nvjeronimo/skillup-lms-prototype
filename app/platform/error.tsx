import * as React from "react";
import Link from "@/lib/router";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Button } from "@/components/atoms/Button";
import styles from "./error.module.css";

/**
 * Error boundary of the platform routes: says what happened and offers the two ways
 * out (retry, or back to the Dashboard). The DS has no error page drawn; this reuses
 * `LMS / Empty State`.
 */
export default function PlatformError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.page}>
      <div role="alert" className={styles.panel}>
        <EmptyState
          icon={AlertTriangle}
          titleAs="h1"
          title="This page did not load"
          description="Something went wrong on our side. Try again; if it keeps happening, go back to your Dashboard."
          action={
            <span className={styles.actions}>
              <Button hierarchy="primary" onClick={reset}>
                Try again
              </Button>
              <Link
                href="/platform/dashboard"
                className={`sk-text-body-medium-semibold ${styles.link}`}
              >
                Go to Dashboard
              </Link>
            </span>
          }
        />
      </div>
    </div>
  );
}
