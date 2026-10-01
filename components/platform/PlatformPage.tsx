"use client";

import * as React from "react";
import { PlatformTopbar } from "./PlatformTopbar";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore } from "@/lib/store";
import type { PlatformSection } from "@/lib/platform/user";
import { cn } from "@/lib/utils";

/**
 * Shell of every platform page: the page ground is bg/faint, the light
 * `LMS / Platform / Topbar` on top, then the page's own <main>. The LMS sidebar
 * is in development and hidden on these pages.
 * The page sets its own padding: Dashboard and My Learning use 40 / 32 / 24
 * (desktop / tablet / mobile); Program Detail is full-bleed under the bar.
 */
export function PlatformPage({
  current,
  children,
  className,
}: {
  current: PlatformSection;
  children: React.ReactNode;
  className?: string;
}) {
  const toast = useLmsStore((s) => s.toast);
  const clearToast = useLmsStore((s) => s.clearToast);
  return (
    <div className="flex min-h-[100dvh] flex-col bg-sko-bg-faint">
      <PlatformTopbar current={current} />
      <main id="main" tabIndex={-1} className={cn("flex-1 outline-none", className)}>
        {children}
      </main>
      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
