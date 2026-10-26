"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLargeTargets, useLmsStore, type DeviceMode } from "@/lib/store";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { PageTransitions } from "@/components/views/PageTransitions";
import { SyntheticPersonasHost } from "@/components/molecules/SyntheticPersonas";

/** Frame width per device. Auto/Desktop fill the window; tablet/mobile are framed. */
const FRAME_WIDTH: Record<DeviceMode, number | null> = {
  auto: null,
  desktop: null,
  tablet: 834,
  // DS mobile canvas: the Mobile topbar variant is 375 wide.
  mobile: 375,
};

/** Messages between the preview frame and the window around it (same origin only). */
const FRAME_URL = "sk-preview-url";
const FRAME_DEVICE = "sk-preview-device";

/** This document is the tablet/mobile preview inside the window's own frame. */
function inPreviewFrame(): boolean {
  try {
    return window.self !== window.top && window.frameElement?.hasAttribute("data-preview-device") === true;
  } catch {
    return false;
  }
}

/**
 * Wraps the whole app. Shows the tablet/mobile preview modes in a frame of that width and keeps
 * <html data-theme> + data-skin in sync with the store, so every `--sk-*` token flips. The
 * device/shape/skin controls themselves live in the top-bar profile menu (DemoControlsMenu).
 *
 * The preview is an iframe of the same page, not a narrower box (Nelson, 26 Oct 2026: the
 * platform pages did not adapt): every layout answers to media queries, which read the viewport,
 * and only a frame gives the page a 375 or 834 viewport. Inside it the page runs as usual; it
 * reports its URL (kept in the address bar) and a device change from its own profile menu; the
 * window reloads the shared settings when the frame writes them.
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
  const setDeviceMode = useLmsStore((s) => s.setDeviceMode);
  const largeTargets = useLargeTargets();
  const router = useRouter();

  // The frame is chosen after mount (the server renders the page itself), and never inside the
  // preview: there the page is the device.
  const [mounted, setMounted] = React.useState(false);
  const [framed, setFramed] = React.useState(false);
  React.useEffect(() => {
    setFramed(inPreviewFrame());
    setMounted(true);
  }, []);
  const width = mounted && !framed ? FRAME_WIDTH[mode] : null;

  // The page the frame opens on: where the window was when the preview started. A change of
  // device keeps the same frame (and page); leaving the preview returns the window to the
  // frame's page.
  const [frameSrc, setFrameSrc] = React.useState<string | null>(null);
  const frameUrl = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (width && !frameSrc) {
      const here = window.location.pathname + window.location.search + window.location.hash;
      frameUrl.current = here;
      setFrameSrc(here);
    }
    if (!width && frameSrc) {
      const last = frameUrl.current;
      setFrameSrc(null);
      if (last && last !== window.location.pathname + window.location.search) router.replace(last);
    }
  }, [width, frameSrc, router]);

  // Window side: follow the frame's URL and device changes, and reload the shared settings
  // (theme, skin, progress) the frame writes to storage.
  React.useEffect(() => {
    if (!width) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || !e.data || typeof e.data !== "object") return;
      if (e.data.type === FRAME_URL && typeof e.data.url === "string") {
        frameUrl.current = e.data.url;
        window.history.replaceState(window.history.state, "", e.data.url);
        if (typeof e.data.title === "string") document.title = e.data.title;
      }
      if (e.data.type === FRAME_DEVICE && e.data.mode in FRAME_WIDTH) setDeviceMode(e.data.mode as DeviceMode);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sk-lms-demo") void useLmsStore.persist.rehydrate();
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, [width, setDeviceMode]);

  // Frame side: take the device from the frame, then report URL and device changes.
  const frameDevice = React.useRef<DeviceMode | null>(null);
  React.useEffect(() => {
    if (!framed) return;
    const device = window.frameElement?.getAttribute("data-preview-device") as DeviceMode | null;
    if (device && device in FRAME_WIDTH) {
      frameDevice.current = device;
      setDeviceMode(device);
    }
  }, [framed, setDeviceMode]);
  // Report only a change made inside the frame: until the frame's store holds the frame's device,
  // its first renders still say "auto", which must not reach the window.
  const deviceSynced = React.useRef(false);
  React.useEffect(() => {
    if (!framed || !frameDevice.current) return;
    if (!deviceSynced.current) {
      if (mode === frameDevice.current) deviceSynced.current = true;
      return;
    }
    if (mode === frameDevice.current) return;
    frameDevice.current = mode;
    window.parent.postMessage({ type: FRAME_DEVICE, mode }, window.location.origin);
  }, [framed, mode]);
  // Every client navigation goes through the History API: report the URL after each one.
  React.useEffect(() => {
    if (!framed) return;
    // The title is read a frame later, once the new page has set it.
    const report = () =>
      window.requestAnimationFrame(() => {
        const url = window.location.pathname + window.location.search + window.location.hash;
        window.parent.postMessage({ type: FRAME_URL, url, title: document.title }, window.location.origin);
      });
    const { pushState, replaceState } = window.history;
    window.history.pushState = function (...args: Parameters<History["pushState"]>) {
      pushState.apply(this, args);
      report();
    };
    window.history.replaceState = function (...args: Parameters<History["replaceState"]>) {
      replaceState.apply(this, args);
      report();
    };
    window.addEventListener("popstate", report);
    report();
    return () => {
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
      window.removeEventListener("popstate", report);
    };
  }, [framed]);

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
  // ?direction=studio / harbor / fluent / classic picks the Studio, Harbor or Fluent skin, or SKO (a shareable link).
  React.useEffect(() => {
    const dq = new URLSearchParams(window.location.search).get("direction");
    if (dq === "studio") setSkin("studio");
    else if (dq === "harbor") setSkin("harbor");
    else if (dq === "fluent") setSkin("fluent");
    else if (dq === "classic") setSkin("teal");
  }, [setSkin]);
  React.useEffect(() => flag("data-large-targets", largeTargets), [largeTargets]);

  // The assistant is mounted once, for every page (it shows on platform and player pages only);
  // so is the synthetic personas' modal (Nelson, 25 Oct 2026), opened from the profile menu.
  if (!width)
    return (
      <>
        {children}
        <AssistantChat />
        <PageTransitions />
        <SyntheticPersonasHost />
      </>
    );

  return (
    <div className="flex h-[100dvh] justify-center overflow-hidden bg-sko-bg-subtle">
      {frameSrc ? (
        <iframe
          key="preview"
          src={frameSrc}
          title={`Preview at ${width} px (${mode})`}
          data-preview-device={mode}
          style={{ width }}
          // box-content: the border sits outside, so the page inside gets the full 375 / 834.
          className="box-content h-full shrink-0 border-x border-sko-border-subtle bg-sko-bg-page shadow-2xl"
        />
      ) : null}
    </div>
  );
}
