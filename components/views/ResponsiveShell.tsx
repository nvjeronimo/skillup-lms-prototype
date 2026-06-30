"use client";

import * as React from "react";
import { useLmsStore, type DeviceMode } from "@/lib/store";

/** Frame width per device. Auto/Desktop fill the window; tablet/mobile are framed. */
const FRAME_WIDTH: Record<DeviceMode, number | null> = {
  auto: null,
  desktop: null,
  tablet: 834,
  mobile: 390,
};

/**
 * Wraps the whole app. Constrains the width for the tablet/mobile preview modes
 * and keeps <html data-theme> + data-skin in sync with the store, so every
 * `--sk-*` token flips. The device/shape/skin controls themselves now live in
 * the top-bar profile menu (DemoControlsMenu).
 */
export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const mode = useLmsStore((s) => s.deviceMode);
  const theme = useLmsStore((s) => s.theme);
  const skin = useLmsStore((s) => s.skin);
  const width = FRAME_WIDTH[mode];

  React.useEffect(() => {
    const el = document.documentElement;
    if (theme === "dark") el.setAttribute("data-theme", "dark");
    else el.removeAttribute("data-theme");
  }, [theme]);
  React.useEffect(() => {
    const el = document.documentElement;
    if (skin === "teal") el.removeAttribute("data-skin");
    else el.setAttribute("data-skin", skin);
  }, [skin]);

  if (!width) return <>{children}</>;

  return (
    <div className="flex min-h-[100dvh] justify-center bg-sk-bg-secondary">
      <div
        style={{ width }}
        className="w-full shrink-0 overflow-hidden border-x border-sk-border-secondary bg-sk-bg-primary shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
}
