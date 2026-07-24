"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Monitor, MonitorSmartphone, RotateCcw, Smartphone, Tablet } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { useLmsStore, type DeviceMode, type Skin as SkinId } from "@/lib/store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const MODES: { mode: DeviceMode; label: string; icon: typeof Monitor }[] = [
  { mode: "auto", label: "Responsive (follow window)", icon: MonitorSmartphone },
  { mode: "desktop", label: "Desktop", icon: Monitor },
  { mode: "tablet", label: "Tablet", icon: Tablet },
  { mode: "mobile", label: "Mobile", icon: Smartphone },
];

// Each shape is a real, navigable course (slug + the active topic to land on).
const SHAPES: { id: string; slug: string; topicId: string; label: string; title: string }[] = [
  { id: "5", slug: "six-sigma", topicId: "m3-t1", label: "5-level", title: "5-level course (Course → Module → Lesson → Topics)" },
  { id: "4", slug: "capstone", topicId: "cap-t5", label: "4-level · no Lesson", title: "4-level course (Course → Module → Topics, no Lesson)" },
  { id: "3", slug: "quick-start", topicId: "qs-t2", label: "3-level · no Module, no Lesson", title: "3-level course (Course → Topics, no Module, no Lesson)" },
];

// Brand skins — one per skin in the DS "2. Skins" variable collection.
// Label code = each skin's brand anchor (bg-brand-solid, light) in the DS ramp.
// Only SKO carries a legacy brand code (P03); the rest are their own ramps.
const SKINS: { skin: SkinId; label: string }[] = [
  { skin: "teal", label: "Teal — default (P03)" },
  { skin: "ink", label: "Ink (Ink/900)" },
  { skin: "sky", label: "Sky (Sky/600)" },
  { skin: "violet", label: "Violet (Violet/600)" },
  { skin: "gold", label: "Gold (Gold/600)" },
  { skin: "red", label: "Red (Red/600)" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-sk-border-secondary px-4 py-3">
      <p className="sk-text-2xs-medium mb-2 text-sk-text-tertiary">{title}</p>
      {children}
    </div>
  );
}

export interface DemoControlsMenuProps {
  userName?: string;
  userAvatarUrl?: string;
  /** Mobile topbar: hide the name next to the avatar. */
  compact?: boolean;
}

/**
 * Profile button that opens a demo-settings menu (preview device · content shape
 * · brand skin). Replaces the old floating widget — same controls, tucked into
 * the top-bar account menu so it no longer crowds the viewport.
 */
export function DemoControlsMenu({
  userName = "Olivia Rhye",
  userAvatarUrl,
  compact = false,
}: DemoControlsMenuProps) {
  const [open, setOpen] = React.useState(false);
  const mode = useLmsStore((s) => s.deviceMode);
  const setMode = useLmsStore((s) => s.setDeviceMode);
  const skin = useLmsStore((s) => s.skin);
  const setSkin = useLmsStore((s) => s.setSkin);
  const resetDemo = useLmsStore((s) => s.resetDemo);
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug = pathname?.match(/^\/course\/([^/]+)/)?.[1];
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pill =
    "sk-text-xs-semibold inline-flex h-8 flex-1 items-center justify-center rounded-md transition-colors";
  const pillOn = "bg-sk-bg-brand-solid text-sk-text-primary-on-brand";
  const pillOff = "text-sk-text-tertiary hover:bg-sk-bg-secondary hover:text-sk-text-primary";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account and demo settings"
        onClick={() => setOpen((o) => !o)}
        className="ml-1 flex items-center gap-2 rounded-lg p-1 hover:bg-sk-bg-secondary"
      >
        <Avatar name={userName} src={userAvatarUrl} size="sm" />
        {!compact ? (
          <span className="sk-text-sm-medium pr-1 text-sk-text-primary">{userName}</span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-72 overflow-hidden rounded-xl border border-sk-border-secondary bg-sk-bg-primary shadow-xl"
        >
          <div className="flex items-center gap-2.5 px-4 py-3">
            <Avatar name={userName} src={userAvatarUrl} size="sm" />
            <div className="min-w-0">
              <p className="sk-text-sm-semibold truncate text-sk-text-primary">{userName}</p>
              <p className="sk-text-xs-regular text-sk-text-tertiary">Demo preview settings</p>
            </div>
          </div>

          <Section title="Preview device">
            <div className="flex gap-1">
              {MODES.map((m) => {
                const active = mode === m.mode;
                return (
                  <button
                    key={m.mode}
                    type="button"
                    onClick={() => {
                      setMode(m.mode);
                      setOpen(false);
                    }}
                    aria-pressed={active}
                    aria-label={m.label}
                    title={m.label}
                    className={cn(pill, active ? pillOn : pillOff)}
                  >
                    <Icon icon={m.icon} size={16} />
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Content Shape Levels">
            <div className="flex flex-col gap-1">
              {SHAPES.map((s) => {
                const active = activeSlug === s.slug;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      track("sidebar_shape_change", { shape: s.id });
                      router.push(`/course/${s.slug}/topic/${s.topicId}`);
                      setOpen(false);
                    }}
                    aria-pressed={active}
                    title={s.title}
                    className={cn(
                      "sk-text-sm-medium flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left transition-colors",
                      active
                        ? "bg-sk-bg-brand-section text-sk-text-brand-secondary"
                        : "text-sk-text-secondary hover:bg-sk-bg-secondary",
                    )}
                  >
                    {s.label}
                    {active ? <Icon icon={Check} size={16} className="shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Brand skin">
            <div className="flex items-center gap-2.5">
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
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                  >
                    {/* Swatch reads the live brand-solid token for this skin (no hardcoded hex):
                        data-skin re-resolves --sk-bg-brand-solid to the skin's value. */}
                    <span
                      data-skin={s.skin === "teal" ? undefined : s.skin}
                      className={cn(
                        "size-5 rounded-full bg-sk-bg-brand-solid ring-offset-2 ring-offset-sk-bg-primary transition-all",
                        active ? "ring-2 ring-sk-text-primary" : "ring-1 ring-sk-border-secondary",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </Section>

          <div className="border-t border-sk-border-secondary p-1.5">
            <button
              type="button"
              onClick={() => {
                resetDemo();
                setOpen(false);
              }}
              className="sk-text-sm-medium flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sk-text-secondary transition-colors hover:bg-sk-bg-secondary hover:text-sk-text-primary"
            >
              <Icon icon={RotateCcw} size={16} />
              Reset demo
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
