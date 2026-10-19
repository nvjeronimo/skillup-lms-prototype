"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { useLargeTargets, useLmsStore, type Skin } from "@/lib/store";
import { restartFirstSteps } from "@/lib/first-steps/useFirstSteps";
import { cn } from "@/lib/utils";

/*
 * The profile menu, one standard for the platform pages and the player (Nelson, 16 Oct 2026;
 * DS `LMS / Profile Menu`). Same header, same Appearance (brand skin), same
 * Accessibility standards and the same footer everywhere; the player adds its preview
 * sections between Accessibility and the footer.
 */

/** The three brand skins the tokens define (tokens/colors.css): SKO, Gold, Red. */
export const PROFILE_SKINS: { skin: Skin; label: string; dot: string }[] = [
  // token-lint-disable-next-line DS _Dot (Icon=Dot) binds icon/primary
  { skin: "teal", label: "SKO", dot: "bg-sko-icon-primary" },
  // token-lint-disable-next-line DS _Dot (Icon=Dot) binds icon/accent-yellow
  { skin: "gold", label: "Gold", dot: "bg-sko-icon-accent-yellow" },
  // token-lint-disable-next-line DS _Dot (Icon=Dot) binds icon/accent-red
  { skin: "red", label: "Red", dot: "bg-sko-icon-accent-red" },
  // Maré (proposal, Nelson 19 Oct 2026): the SKO brand with a deep-teal chrome and a yellow spark.
  { skin: "mare", label: "Maré", dot: "bg-sko-bg-chrome" },
];

/**
 * DS Profile Menu 1.2 (Nelson, 17 Oct 2026): each Brand skin segment is the Button group base
 * Icon=Dot, a 10px dot in the skin's colour before the name. SKO is icon/primary held on the SKO
 * skin (`data-skin="teal"`), so it stays blue whichever skin is on; Gold and Red are the accent icons.
 */
function SkinDot({ skin, dot }: { skin: Skin; dot: string }) {
  const theme = useLmsStore((s) => s.theme);
  return (
    <span
      aria-hidden
      data-skin={skin === "teal" ? "teal" : undefined}
      data-theme={skin === "teal" && theme === "dark" ? "dark" : undefined}
      className={cn("size-2.5 shrink-0 rounded-full", dot)}
    />
  );
}

/** The menu's panel: 288 wide, scrolls inside when the window is short. */
export const PROFILE_PANEL =
  "absolute right-0 top-[calc(100%+8px)] z-50 flex max-h-[calc(100dvh-88px)] w-72 flex-col overflow-y-auto overflow-x-hidden rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-xl";

export function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-sko-border-subtle px-4 py-3">
      <p className="sk-text-label-small-medium mb-2 text-sko-text-subtle">{title}</p>
      {children}
    </div>
  );
}

/** The learner: avatar, name and role. */
export function ProfileHeader({ name, role, avatarUrl }: { name: string; role: string; avatarUrl?: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3">
      <Avatar name={name} src={avatarUrl} size="sm" shape="square" />
      <div className="min-w-0">
        <p className="sk-text-body-medium-semibold truncate text-sko-text-default">{name}</p>
        <p className="sk-text-label-small-regular text-sko-text-subtle">{role}</p>
      </div>
    </div>
  );
}

/**
 * A labelled on/off row rendered as an accessible switch. Mirrors the DS Toggle
 * (1102:4208) Type=Default, Size=sm, Text=True: a 36×20 track (padding 2) with a
 * 16px knob, gap 8 to the label, top-aligned.
 */
export function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-2 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-sko-bg-subtle"
    >
      {/* Track: bg/primary on, bg/muted off; the knob sits right when on. The off track
          adds a 1px inset border/default ring: the DS bg/muted track and white knob are
          about 1.25:1 against bg/page, below WCAG 1.4.11's 3:1 (DS defect BA-11 on the
          Accessibility Standards switches). The ring is inset, so the box stays 36×20. */}
      <span
        aria-hidden
        className={cn(
          "inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
          checked
            ? "justify-end bg-sko-bg-primary"
            : "justify-start bg-sko-bg-muted ring-1 ring-inset ring-sko-border-default",
        )}
      >
        {/* Knob: 16px, Elevation/level2 (= Tailwind `shadow`). */}
        <span
          className={cn(
            "size-4 rounded-full shadow",
            checked
              ? // token-lint-disable-next-line DS toggle knob binds icon/on-primary
                "bg-sko-icon-on-primary"
              : "bg-sko-bg-on-media",
          )}
        />
      </span>
      <span className="flex flex-col">
        <span className="sk-text-body-medium-medium text-sko-text-muted">{label}</span>
        {hint ? <span className="sk-text-body-medium-regular text-sko-text-subtle">{hint}</span> : null}
      </span>
    </button>
  );
}

/**
 * DS `Button group` (1046:10171), as in the My Learning status filter: a bg/muted track
 * (padding 4, gap 2, radius 8); the pressed segment is a pill on bg/page with 1px
 * border/subtle and text/primary, the others text/subtle.
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: React.ReactNode; aria?: string; className?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-0.5 rounded-lg bg-sko-bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          aria-label={o.aria}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-8 flex-1 items-center justify-center rounded-md border transition-colors",
            // An option can set its own padding and gap (the four brand skins need tighter ones).
            o.className?.includes("px-") ? null : "gap-2 px-2.5",
            o.className ?? "sk-text-body-medium-semibold",
            value === o.value
              ? "border-sko-border-subtle bg-sko-bg-page text-sko-text-primary"
              : "border-transparent text-sko-text-subtle hover:bg-sko-bg-subtle hover:text-sko-text-default",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Appearance: the brand skin (the same three skins everywhere). The light / dark switch is in
 * the top bar of both shells since 17 Oct 2026 (Nelson; DS Topbar), not here.
 */
export function AppearanceSection() {
  const skin = useLmsStore((s) => s.skin);
  const setSkin = useLmsStore((s) => s.setSkin);
  return (
    <ProfileSection title="Appearance">
      <div className="flex flex-col gap-1.5 px-1">
        <span className="sk-text-body-medium-medium text-sko-text-muted">Brand skin</span>
        <Segmented
          label="Brand skin"
          options={PROFILE_SKINS.map((s) => ({
            value: s.skin,
            // Four skins in the 288 panel: tighter segments so none is cut.
            className: "sk-text-body-medium-semibold gap-1.5 px-1.5",
            label: (
              <>
                <SkinDot skin={s.skin} dot={s.dot} />
                {s.label}
              </>
            ),
          }))}
          value={PROFILE_SKINS.some((s) => s.skin === skin) ? skin : "teal"}
          onChange={setSkin}
        />
      </div>
    </ProfileSection>
  );
}

/** Accessibility standards: text size and the four switches (the same everywhere). */
export function AccessibilitySection() {
  const vision = useLmsStore((s) => s.vision);
  const setVision = useLmsStore((s) => s.setVision);
  const textSize = useLmsStore((s) => s.textSize);
  const setTextSize = useLmsStore((s) => s.setTextSize);
  const reduceMotion = useLmsStore((s) => s.reduceMotion);
  const setReduceMotion = useLmsStore((s) => s.setReduceMotion);
  const underlineLinks = useLmsStore((s) => s.underlineLinks);
  const setUnderlineLinks = useLmsStore((s) => s.setUnderlineLinks);
  const largeTargets = useLargeTargets();
  const setLargeTargets = useLmsStore((s) => s.setLargeTargets);
  const sizes = ["md", "lg", "xl"] as const;
  return (
    <ProfileSection title="Accessibility standards">
      <div className="flex flex-col gap-0.5">
        <div className="mb-1 flex flex-col gap-1.5 px-1">
          <span className="sk-text-body-medium-medium text-sko-text-muted">Text size</span>
          <Segmented
            label="Text size"
            options={sizes.map((sz, i) => ({
              value: sz,
              label: "A",
              aria: `Text size ${["normal", "large", "extra large"][i]}`,
              className: ["sk-text-body-small-semibold", "sk-text-body-medium-semibold", "sk-text-body-large-semibold"][i],
            }))}
            value={textSize}
            onChange={setTextSize}
          />
        </div>
        <ToggleRow
          label="Colourblind-safe states"
          hint="Red–green safe (deuter + protan)"
          checked={vision === "cvd"}
          onChange={(v) => setVision(v ? "cvd" : "default")}
        />
        <ToggleRow label="Reduce motion" hint="Turn off animations and transitions" checked={reduceMotion} onChange={setReduceMotion} />
        <ToggleRow label="Underline links" hint="Don’t rely on colour alone" checked={underlineLinks} onChange={setUnderlineLinks} />
        <ToggleRow
          label="Larger touch targets"
          hint="Minimum 44×44 px controls · on by default on mobile"
          checked={largeTargets}
          onChange={setLargeTargets}
        />
      </div>
    </ProfileSection>
  );
}

/** The footer: Reset demo and Restart first steps (prototype only). */
export function ProfileFooter({ onDone }: { onDone?: () => void }) {
  const resetDemo = useLmsStore((s) => s.resetDemo);
  const row =
    "sk-text-body-medium-medium flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sko-text-muted transition-colors hover:bg-sko-bg-subtle hover:text-sko-text-default";
  return (
    <div className="border-t border-sko-border-subtle p-1.5">
      <button
        type="button"
        className={row}
        onClick={() => {
          resetDemo();
          // Reset demo puts the seeded completion back: the first steps start from it.
          restartFirstSteps(Array.from(useLmsStore.getState().completedTopics));
          onDone?.();
        }}
      >
        <Icon icon={RotateCcw} size={16} />
        Reset demo
      </button>
      <button
        type="button"
        className={row}
        onClick={() => {
          restartFirstSteps(Array.from(useLmsStore.getState().completedTopics));
          onDone?.();
        }}
      >
        <Icon icon={RotateCcw} size={16} />
        Restart first steps
      </button>
    </div>
  );
}
