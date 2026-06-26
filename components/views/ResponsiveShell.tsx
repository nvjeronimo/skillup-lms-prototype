"use client";

import * as React from "react";
import { Monitor, MonitorSmartphone, Smartphone, Tablet } from "lucide-react";
import { Icon } from "@/lib/icons";
import { useLmsStore, type DeviceMode } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Frame width per device. Auto/Desktop fill the window; tablet/mobile are framed. */
const FRAME_WIDTH: Record<DeviceMode, number | null> = {
  auto: null,
  desktop: null,
  tablet: 834,
  mobile: 390,
};

const MODES: { mode: DeviceMode; label: string; icon: typeof Monitor }[] = [
  { mode: "auto", label: "Responsive (follow window)", icon: MonitorSmartphone },
  { mode: "desktop", label: "Desktop", icon: Monitor },
  { mode: "tablet", label: "Tablet", icon: Tablet },
  { mode: "mobile", label: "Mobile", icon: Smartphone },
];

/**
 * Wraps the whole app. Mirrors the selected responsive mode by forcing the
 * breakpoint (via the store, read in useBreakpoint) AND constraining the width
 * for tablet/mobile, with a floating switcher to flip between modes.
 */
export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const mode = useLmsStore((s) => s.deviceMode);
  const setMode = useLmsStore((s) => s.setDeviceMode);
  const width = FRAME_WIDTH[mode];

  return (
    <>
      {width ? (
        <div className="flex min-h-[100dvh] justify-center bg-sk-bg-secondary">
          <div
            style={{ width }}
            className="w-full shrink-0 overflow-hidden border-x border-sk-border-secondary bg-sk-bg-primary shadow-2xl"
          >
            {children}
          </div>
        </div>
      ) : (
        children
      )}

      {/* Floating responsive-mode switcher (demo tool). */}
      <div className="fixed bottom-4 left-1/2 z-[80] -translate-x-1/2">
        <div className="flex items-center gap-0.5 rounded-full border border-sk-border-secondary bg-sk-bg-primary p-1 shadow-lg">
          {MODES.map((m) => {
            const active = mode === m.mode;
            return (
              <button
                key={m.mode}
                type="button"
                onClick={() => setMode(m.mode)}
                aria-pressed={active}
                aria-label={m.label}
                title={m.label}
                className={cn(
                  "inline-flex h-8 w-9 items-center justify-center rounded-full transition-colors",
                  active
                    ? "bg-sk-bg-brand-solid text-sk-text-primary-on-brand"
                    : "text-sk-text-tertiary hover:bg-sk-bg-secondary hover:text-sk-text-primary",
                )}
              >
                <Icon icon={m.icon} size={16} />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
