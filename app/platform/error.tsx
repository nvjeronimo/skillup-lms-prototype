"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { Button } from "@/components/atoms/Button";

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
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-sko-bg-faint p-6">
      <div role="alert" className="w-full max-w-xl bg-sko-bg-page">
        <EmptyState
          icon={AlertTriangle}
          titleAs="h1"
          title="This page did not load"
          description="Something went wrong on our side. Try again; if it keeps happening, go back to your Dashboard."
          action={
            <span className="flex flex-wrap items-center justify-center gap-3">
              <Button hierarchy="primary" onClick={reset}>
                Try again
              </Button>
              <Link
                href="/platform/dashboard"
                className="sk-text-sm-semibold inline-flex min-h-11 items-center text-sko-text-primary underline underline-offset-2"
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
