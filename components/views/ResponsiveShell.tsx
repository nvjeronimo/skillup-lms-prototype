"use client";

import * as React from "react";
import { useLargeTargets, useLmsStore, type DeviceMode } from "@/lib/store";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { PageTransitions } from "@/components/views/PageTransitions";

/** Frame width per device. Auto/Desktop fill the window; tablet/mobile are framed. */
const FRAME_WIDTH: Record<DeviceMode, number | null> = {
  auto: null,
  desktop: null,
  tablet: 834,
  // DS mobile canvas: the Mobile topbar variant is 375 wide.
  mobile: 375,
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
  const vision = useLmsStore((s) => s.vision);
  const textSize = useLmsStore((s) => s.textSize);
  const reduceMotion = useLmsStore((s) => s.reduceMotion);
  const underlineLinks = useLmsStore((s) => s.underlineLinks);
  const squareCorners = useLmsStore((s) => s.squareCorners);
  const setSkin = useLmsStore((s) => s.setSkin);
  const largeTargets = useLargeTargets();
  const width = FRAME_WIDTH[mode];

  const flag = (attr: string, on: boolean) => {
    const el = document.documentElement;
    if (on) el.setAttribute(attr, "");
    else el.removeAttribute(attr);
  };

  // A theme or skin change cross-fades the whole page instead of jumping in one frame (Apple:
  // avoid abrupt brightness changes; 22 Oct 2026). The first paint and browsers without View
  // Transitions apply it at once. The fade is opacity only, so it stays under reduced motion.
  const appearanceReady = React.useRef(false);
  const applyAppearance = (apply: () => void) => {
    type Transition = { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void> };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => Transition };
    if (!appearanceReady.current || typeof doc.startViewTransition !== "function" || document.visibilityState !== "visible") {
      apply();
      return;
    }
    // A transition the browser skips (a second change before the first painted, a hidden tab)
    // rejects its promises; the change itself is still applied, so the rejections are expected.
    const t = doc.startViewTransition(apply);
    const ignore = () => {};
    t.ready.catch(ignore);
    t.finished.catch(ignore);
    t.updateCallbackDone.catch(ignore);
  };
  React.useEffect(() => {
    applyAppearance(() => {
      const el = document.documentElement;
      if (theme === "dark") el.setAttribute("data-theme", "dark");
      else el.removeAttribute("data-theme");
    });
  }, [theme]);
  React.useEffect(() => {
    applyAppearance(() => {
      const el = document.documentElement;
      if (skin === "teal") el.removeAttribute("data-skin");
      else el.setAttribute("data-skin", skin);
      // Studio is a direction more than a palette: its stylesheet keys on data-direction.
      if (skin === "studio") el.setAttribute("data-direction", "studio");
      else el.removeAttribute("data-direction");
    });
  }, [skin]);
  React.useEffect(() => {
    appearanceReady.current = true;
  }, []);
  React.useEffect(() => {
    const el = document.documentElement;
    if (vision === "cvd") el.setAttribute("data-vision", "cvd");
    else el.removeAttribute("data-vision");
  }, [vision]);
  React.useEffect(() => {
    const el = document.documentElement;
    if (textSize === "md") el.removeAttribute("data-text-size");
    else el.setAttribute("data-text-size", textSize);
  }, [textSize]);
  React.useEffect(() => flag("data-reduce-motion", reduceMotion), [reduceMotion]);
  React.useEffect(() => flag("data-underline-links", underlineLinks), [underlineLinks]);
  React.useEffect(() => flag("data-square-corners", squareCorners), [squareCorners]);
  // ?direction=studio / ?direction=classic picks the Studio skin or SKO (a shareable link).
  React.useEffect(() => {
    const dq = new URLSearchParams(window.location.search).get("direction");
    if (dq === "studio") setSkin("studio");
    else if (dq === "classic") setSkin("teal");
  }, [setSkin]);
  React.useEffect(() => flag("data-large-targets", largeTargets), [largeTargets]);

  // The assistant is mounted once, for every page (it shows on platform and player pages only).
  if (!width)
    return (
      <>
        {children}
        <AssistantChat />
        <PageTransitions />
      </>
    );

  return (
    <div className="flex min-h-[100dvh] justify-center bg-sko-bg-subtle">
      <div
        style={{ width }}
        className="w-full shrink-0 overflow-hidden border-x border-sko-border-subtle bg-sko-bg-page shadow-2xl"
      >
        {children}
        <AssistantChat />
        <PageTransitions />
      </div>
    </div>
  );
}
