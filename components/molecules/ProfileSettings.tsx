"use client";

import * as React from "react";
import Link from "next/link";
import { Award, ExternalLink, LogOut, RotateCcw, UserPen } from "lucide-react";
import { Icon } from "@/lib/icons";
import { useLargeTargets, useLmsStore, type Skin } from "@/lib/store";
import { restartFirstSteps } from "@/lib/first-steps/useFirstSteps";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/molecules/ThemeSwitch";

/*
 * The profile menu, one standard for the platform pages and the player (Nelson, 16 Oct 2026;
 * DS `LMS / Profile Menu`). Same Profile section first (Edit profile, Certificates), same
 * Appearance (brand skin), same Accessibility standards, SkillUp Online and the same footer everywhere; the player adds its
 * preview sections between SkillUp Online and the footer. No learner header since 19 Oct 2026
 * (Nelson): the trigger already shows who is signed in.
 */

/** The brand skins: SKO, Gold (tokens/colors.css), Studio (tokens/direction-studio.css), Harbor
 *  (tokens/skin-harbor.css) and Fluent (tokens/skin-fluent.css). Red went on 26 Oct 2026. */
export const PROFILE_SKINS: { skin: Skin; label: string; dot: string }[] = [
  // token-lint-disable-next-line DS _Dot (Icon=Dot) binds icon/primary
  { skin: "teal", label: "SKO", dot: "bg-sko-icon-primary" },
  // token-lint-disable-next-line DS _Dot (Icon=Dot) binds icon/accent-yellow
  { skin: "gold", label: "Gold", dot: "bg-sko-icon-accent-yellow" },
  // Studio (experimental, Nelson 22 Oct 2026): took Sea's place; its dot is Studio's own primary, the logo's deep teal.
  { skin: "studio", label: "Studio", dot: "bg-sko-bg-primary" },
  // Harbor (Nelson, 25 Oct 2026): a hosting-panel look; its dot is its own primary, black.
  { skin: "harbor", label: "Harbor", dot: "bg-sko-bg-primary" },
  // Fluent (Nelson, 25 Oct 2026): Fluent 2 web; its dot is its own brand blue.
  { skin: "fluent", label: "Fluent", dot: "bg-sko-bg-primary" },
];

/**
 * DS Profile Menu 1.2 (Nelson, 17 Oct 2026): each Brand skin segment is the Button group base
 * Icon=Dot, a 10px dot in the skin's colour before the name. SKO is icon/primary held on the SKO
 * skin (`data-skin="teal"`), so it stays blue whichever skin is on; Gold is the accent icon.
 */
function SkinDot({ skin, dot }: { skin: Skin; dot: string }) {
  const theme = useLmsStore((s) => s.theme);
  return (
    <span
      aria-hidden
      data-skin={skin === "teal" || skin === "harbor" || skin === "fluent" ? skin : undefined}
      data-direction={skin === "studio" ? "studio" : undefined}
      data-theme={skin === "teal" && theme === "dark" ? "dark" : undefined}
      className={cn("size-2.5 shrink-0 rounded-pill", dot)}
    />
  );
}

/**
 * The menu's panel: 288 wide, scrolls inside when the window is short. It hangs under the
 * avatar and grows out of the trigger's corner (top right).
 */
export const PROFILE_PANEL =
  "sk-animate-menu origin-top-right absolute right-0 top-[calc(100%+8px)] z-50 flex max-h-[calc(100dvh-88px)] w-72 flex-col overflow-y-auto overflow-x-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page shadow-xl";

export function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-sko-border-subtle px-4 py-3 first:border-t-0">
      <p className="sk-text-label-small-medium mb-2 text-sko-text-subtle">{title}</p>
      {children}
    </div>
  );
}

/** The public site of SkillUp Online, opened in a new tab from the profile menu. */
export const SKILLUP_ONLINE_URL = "https://skillup.online";

/** A menu row: 44 tall, 16px icon, body-medium/Medium text/muted (as the footer rows). */
const MENU_ROW =
  "sk-text-body-medium-medium flex min-h-11 w-full items-center gap-2 rounded-control px-3 text-left text-sko-text-muted transition-colors hover:bg-sko-bg-subtle hover:text-sko-text-default";

/**
 * DS Profile Menu 1.8 (Nelson, 24 Oct 2026): the Profile section (Edit profile, Certificates)
 * opens the menu; then Appearance and Accessibility standards (1.7 had them first); then
 * Sign out in a group of its own, its icon icon/error; then SkillUp Online, the public site in a
 * new tab; then the demo footer. Every group has the section padding (12 / 16) and a rule
 * above; the rows keep their own 12 inside.
 */
export function ProfileLinks({ onDone }: { onDone?: () => void }) {
  return (
    <ProfileSection title="Profile">
      <div className="flex flex-col gap-2">
        <Link href="/platform/profile" className={MENU_ROW} onClick={onDone}>
          <Icon icon={UserPen} size={16} />
          Edit profile
        </Link>
        <Link href="/platform/certificates" className={MENU_ROW} onClick={onDone}>
          <Icon icon={Award} size={16} />
          {/* "My Certificates" (Nelson, 26 Oct 2026), as the page's title. */}
          My Certificates
        </Link>
      </div>
    </ProfileSection>
  );
}

/** Sign out, a group of its own after Accessibility standards (Open edX's user menu has it, /logout); the learner must always find it. */
export function SignOutLink({ onDone }: { onDone?: () => void }) {
  const showToast = useLmsStore((s) => s.showToast);
  return (
    <div className="flex flex-col gap-2 border-t border-sko-border-subtle px-4 py-3">
      <button
        type="button"
        className={MENU_ROW}
        onClick={() => {
          showToast("Signed out. In this prototype you stay signed in.");
          onDone?.();
        }}
      >
        <Icon icon={LogOut} size={16} className="text-sko-icon-error" />
        Sign out
      </button>
    </div>
  );
}

export function SkillUpOnlineLink({ onDone }: { onDone?: () => void }) {
  return (
    <div className="flex flex-col gap-2 border-t border-sko-border-subtle px-4 py-3">
      <a href={SKILLUP_ONLINE_URL} target="_blank" rel="noopener noreferrer" className={MENU_ROW} onClick={onDone}>
        <Icon icon={ExternalLink} size={16} />
        SkillUp Online
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
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
      className="flex w-full items-start gap-2 rounded-control px-1 py-1.5 text-left transition-colors hover:bg-sko-bg-subtle"
    >
      {/* Track: bg/primary on, bg/muted off; the knob sits right when on. The off track
          adds a 1px inset border/default ring: the DS bg/muted track and white knob are
          about 1.25:1 against bg/page, below WCAG 1.4.11's 3:1 (DS defect BA-11 on the
          Accessibility Standards switches). The ring is inset, so the box stays 36×20. */}
      <span
        aria-hidden
        className={cn(
          "inline-flex h-5 w-9 shrink-0 items-center rounded-pill p-0.5 transition-colors",
          checked
            ? "justify-end bg-sko-bg-primary"
            : "justify-start bg-sko-bg-muted ring-1 ring-inset ring-sko-border-default",
        )}
      >
        {/* Knob: 16px, Elevation/level2 (= Tailwind `shadow`). */}
        <span
          className={cn(
            "size-4 rounded-pill shadow",
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
  scroll = false,
}: {
  label: string;
  options: { value: T; label: React.ReactNode; aria?: string; className?: string }[];
  value: T;
  onChange: (v: T) => void;
  /**
   * One row that scrolls sideways, segments at their natural width (the five brand skins do not fit
   * the 288 panel; Nelson, 25 Oct 2026: scrollable, like the My Learning filters on a phone). The
   * selected segment is scrolled into view.
   */
  scroll?: boolean;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const track = trackRef.current;
    if (!scroll || !track) return;
    const on = track.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!on) return;
    const left = on.offsetLeft - track.clientWidth / 2 + on.offsetWidth / 2;
    track.scrollLeft = Math.max(0, left);
  }, [scroll, value]);
  return (
    <div
      ref={trackRef}
      role="group"
      aria-label={label}
      className={cn(
        "flex gap-0.5 rounded-track bg-sko-bg-track p-1",
        scroll && "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          aria-label={o.aria}
          onClick={() => onChange(o.value)}
          className={cn(
            // min-w-0: a segment may shrink below its text, which then ends with an ellipsis (Nelson,
            // 23 Oct 2026: the four brand skins overflowed the 288 panel in Studio).
            "inline-flex h-8 items-center justify-center rounded-control border transition-colors",
            scroll ? "shrink-0" : "min-w-0 flex-1",
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
export function AppearanceSection({ showTheme = false }: { showTheme?: boolean }) {
  const skin = useLmsStore((s) => s.skin);
  const setSkin = useLmsStore((s) => s.setSkin);
  const theme = useLmsStore((s) => s.theme);
  const setTheme = useLmsStore((s) => s.setTheme);
  const squareCorners = useLmsStore((s) => s.squareCorners);
  const setSquareCorners = useLmsStore((s) => s.setSquareCorners);
  return (
    <ProfileSection title="Appearance">
      <div className="flex flex-col gap-1.5 px-1">
        <span className="sk-text-body-medium-medium text-sko-text-muted">Brand skin</span>
        <Segmented
          label="Brand skin"
          options={PROFILE_SKINS.map((s) => ({
            value: s.skin,
            // Five skins in the 288 panel: one row that scrolls, each name in full.
            className: "sk-text-body-medium-semibold gap-1.5 px-3",
            label: (
              <>
                <SkinDot skin={s.skin} dot={s.dot} />
                <span className="whitespace-nowrap">{s.label}</span>
              </>
            ),
          }))}
          value={PROFILE_SKINS.some((s) => s.skin === skin) ? skin : "teal"}
          onChange={setSkin}
          scroll
        />
      </div>
      {/* Experiment (Nelson, 21 Oct 2026): square corners everywhere except buttons. */}
      <ToggleRow
        label="Square corners"
        hint="Experimental · buttons keep their corners"
        checked={squareCorners}
        onChange={setSquareCorners}
      />
      {/* On a phone the theme is set here too, with the top bar's own control (Nelson, 27 Oct 2026;
          DS Profile Menu 1.10): label on the left, Theme-Switch md on the right. */}
      {showTheme ? (
        <div className="flex items-center justify-between gap-3 px-1">
          <span className="sk-text-body-medium-medium text-sko-text-muted">Theme</span>
          <ThemeSwitch value={theme} onChange={setTheme} size="md" />
        </div>
      ) : null}
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
          label="Colorblind-safe states"
          hint="Red–green safe (deuter + protan)"
          checked={vision === "cvd"}
          onChange={(v) => setVision(v ? "cvd" : "default")}
        />
        <ToggleRow label="Reduce motion" hint="Turn off animations and transitions" checked={reduceMotion} onChange={setReduceMotion} />
        <ToggleRow label="Underline links" hint="Don’t rely on color alone" checked={underlineLinks} onChange={setUnderlineLinks} />
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

/**
 * The footer (DS "Footer demo purposes only"): Reset demo and Restart first steps, prototype only.
 * Shown without `?demo=1` again (Nelson, 21 Oct 2026): testers need it to run the assistant's
 * first steps from the start.
 */
export function ProfileFooter({ onDone }: { onDone?: () => void }) {
  const resetDemo = useLmsStore((s) => s.resetDemo);
  const row = MENU_ROW;
  return (
    <div className="flex flex-col gap-2 border-t border-sko-border-subtle px-4 py-3">
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
