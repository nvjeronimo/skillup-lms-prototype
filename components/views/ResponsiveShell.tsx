"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { GripVertical, Monitor, MonitorSmartphone, Smartphone, Tablet } from "lucide-react";
import { Icon } from "@/lib/icons";
import { useLmsStore, type DeviceMode, type Skin as SkinId } from "@/lib/store";
import { track } from "@/lib/analytics";
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

// Each shape is a real, navigable course (slug + its active topic to land on).
const SHAPES: { id: string; slug: string; topicId: string; label: string; title: string }[] = [
  { id: "5", slug: "six-sigma", topicId: "m3-t1", label: "5L", title: "5-level course (Course → Module → Lesson → Topics)" },
  { id: "4", slug: "capstone", topicId: "cap-t5", label: "4L", title: "4-level course (Course → Module → Topics, no Lesson)" },
  { id: "3", slug: "quick-start", topicId: "qs-t2", label: "3L", title: "3-level course (Course → Topics, no Module)" },
];

// Brand skins — recombinations within the SkillUp palette. `swatch` is the
// light-mode brand colour shown on the picker.
const SKINS: { skin: SkinId; label: string; swatch: string }[] = [
  { skin: "teal", label: "Teal (default)", swatch: "#26708e" },
  { skin: "ink", label: "Ink — deep teal", swatch: "#044150" },
  { skin: "sky", label: "Sky — bright blue", swatch: "#0086c9" },
  { skin: "forest", label: "Forest — green", swatch: "#1f7643" },
];

/**
 * Wraps the whole app. Mirrors the selected responsive mode by forcing the
 * breakpoint (via the store, read in useBreakpoint) AND constraining the width
 * for tablet/mobile, with a draggable switcher to flip between modes + reposition.
 */
export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const mode = useLmsStore((s) => s.deviceMode);
  const setMode = useLmsStore((s) => s.setDeviceMode);
  const theme = useLmsStore((s) => s.theme);
  const skin = useLmsStore((s) => s.skin);
  const setSkin = useLmsStore((s) => s.setSkin);
  const width = FRAME_WIDTH[mode];
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug = pathname?.match(/^\/course\/([^/]+)/)?.[1];

  // Keep <html data-theme> + data-skin in sync so every --sk-* token flips.
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

  // Draggable position. null = default anchor (bottom-center).
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<{ dx: number; dy: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    const rect = barRef.current!.getBoundingClientRect();
    drag.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    setPos({ x: rect.left, y: rect.top });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore — capture is best-effort */
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current || !barRef.current) return;
    const w = barRef.current.offsetWidth;
    const h = barRef.current.offsetHeight;
    const x = Math.max(8, Math.min(window.innerWidth - w - 8, e.clientX - drag.current.dx));
    const y = Math.max(8, Math.min(window.innerHeight - h - 8, e.clientY - drag.current.dy));
    setPos({ x, y });
  }
  function onPointerUp(e: React.PointerEvent) {
    drag.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

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

      {/* Draggable responsive-mode switcher (demo tool). */}
      <div
        ref={barRef}
        className={cn(
          "fixed z-[80] flex items-center gap-0.5 rounded-full border border-sk-border-secondary bg-sk-bg-primary p-1 shadow-lg",
          !pos && "bottom-4 left-1/2 -translate-x-1/2",
        )}
        style={pos ? { left: pos.x, top: pos.y } : undefined}
      >
        <button
          type="button"
          aria-label="Drag to move"
          title="Drag to move"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="inline-flex h-8 w-5 cursor-grab touch-none items-center justify-center text-sk-text-tertiary hover:text-sk-text-primary active:cursor-grabbing"
        >
          <Icon icon={GripVertical} size={16} />
        </button>
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

        <span className="mx-1 h-5 w-px bg-sk-border-secondary" aria-hidden />

        {/* Sidebar content-shape — navigates to a real course of each shape (5/4/3-level). */}
        {SHAPES.map((s) => {
          const active = activeSlug === s.slug;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                track("sidebar_shape_change", { shape: s.id });
                router.push(`/course/${s.slug}/topic/${s.topicId}`);
              }}
              aria-pressed={active}
              aria-label={s.title}
              title={s.title}
              className={cn(
                "sk-text-xs-semibold inline-flex h-8 w-9 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-sk-bg-brand-solid text-sk-text-primary-on-brand"
                  : "text-sk-text-tertiary hover:bg-sk-bg-secondary hover:text-sk-text-primary",
              )}
            >
              {s.label}
            </button>
          );
        })}

        <span className="mx-1 h-5 w-px bg-sk-border-secondary" aria-hidden />

        {/* Brand skins — swatch picker (SkillUp palette recombinations). */}
        {SKINS.map((s) => {
          const active = skin === s.skin;
          return (
            <button
              key={s.skin}
              type="button"
              onClick={() => setSkin(s.skin)}
              aria-pressed={active}
              aria-label={`Skin: ${s.label}`}
              title={`Skin: ${s.label}`}
              className="inline-flex h-8 w-7 items-center justify-center rounded-full"
            >
              <span
                className={cn(
                  "size-4 rounded-full ring-offset-1 ring-offset-sk-bg-primary transition-all",
                  active ? "ring-2 ring-sk-text-primary" : "ring-1 ring-sk-border-secondary",
                )}
                style={{ backgroundColor: s.swatch }}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
