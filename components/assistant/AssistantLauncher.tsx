"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface AssistantLauncherProps {
  open: boolean;
  onToggle: () => void;
  /** The id of the window it opens. */
  controls: string;
  /** First steps still to do: shown as a count on the launcher and said in its name. */
  badge?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The button that opens the assistant, 48 px: bottom left of every platform page and of the
 * player, bottom right on a phone.
 * Closed, it is the assistant mark: the SkillUp ball and paper plane with AI sparkles in place
 * of the trail lines (Nelson, 13 Oct 2026; DS `LMS/Platform/Assistant/Assistant-Launcher`).
 * Like the logo, the mark keeps its own colours and swaps its ink to white on a dark page
 * (two assets toggled by [data-theme], see SkillUpLogo). Open, it is a round close button.
 * Since 15 Oct 2026 the ball wears a 2px gradient ring in the logo's blues (DS: a linear
 * gradient stroke outside the ball), and the gradient turns slowly round it (Nelson asked
 * for it to move). Reduced motion holds it still (`.sk-assistant-ring`, globals.css).
 * The count of first steps: the DS draws it on bg/info, but its 12px number on that blue is
 * 4.0:1 (white) in light and 4.2:1 in dark, under AA; WCAG wins over the DS (PRODUCT.md), so
 * it takes bg/primary, the nearest blue that holds AA, until the DS settles it.
 */
export const AssistantLauncher = React.forwardRef<HTMLButtonElement, AssistantLauncherProps>(
  function AssistantLauncher({ open, onToggle, controls, badge = 0, className, style }, ref) {
    // The badge pops when its count changes (shown at once, or on the next close if the
    // window was open), never merely because it is shown again when the window closes.
    const [lastBadge, setLastBadge] = React.useState(badge);
    const [popping, setPopping] = React.useState<number | null>(null);
    if (badge !== lastBadge) {
      setLastBadge(badge);
      setPopping(badge);
    }
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-label={
          open
            ? "Close the assistant"
            : badge > 0
              ? `Ask the assistant, ${badge} first ${badge === 1 ? "step" : "steps"} left`
              : "Ask the assistant"
        }
        aria-expanded={open}
        aria-controls={controls}
        style={style}
        className={cn(
          // Hover lifts it a little, a press pushes it in (faster); the colour of the open state
          // eases with it. Reduced motion keeps only the colour (the transition guard; sk-press-scale
          // drops the scale itself, which would otherwise snap).
          "sk-press-scale inline-flex h-12 w-12 items-center justify-center rounded-pill transition-[transform,box-shadow,background-color,color] duration-short3 ease-standard hover:scale-[1.04] active:scale-[.96] active:duration-short2",
          // The badge needs a positioned button. "relative" only when the caller does not place it:
          // with both, the stylesheet order made "relative" win over "fixed", and the launcher
          // stopped following the viewport (14 Oct 2026).
          !/\b(fixed|absolute|sticky)\b/.test(className ?? "") && "relative",
          open
            ? "bg-sko-bg-primary text-sko-text-on-primary shadow-lg hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover"
            : "drop-shadow-lg",
          className,
        )}
      >
        {/* Both faces are always there: the mark and the close cross cross-fade and turn a
            quarter, so the button reads as one thing changing, not two swapped. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 transition-[opacity,transform] duration-short4 ease-standard",
            open ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
          )}
        >
          {/* The ring sits under the mark: the ball covers its middle, so only its 2px edge shows. */}
          {/* The ring turns only while first steps are left (audit 16 Oct 2026, D3): with nothing to
              do, a moving ring would pull the eye from the page for no reason. */}
          <span className={cn("sk-assistant-ring", badge === 0 && "sk-assistant-ring--still")} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assistant-mark.svg" alt="" className="sk-logo-light relative block h-12 w-12" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assistant-mark-dark.svg" alt="" className="sk-logo-dark relative h-12 w-12" />
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 inline-flex items-center justify-center transition-[opacity,transform] duration-short4 ease-standard",
            open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
          )}
        >
          <Icon icon={X} size={24} />
        </span>
        {!open && badge > 0 ? (
          // Keyed on the count, so a change pops the new number in.
          <span
            key={badge}
            aria-hidden
            onAnimationEnd={() => setPopping(null)}
            className={cn(
              popping === badge && "sk-animate-badge-pop",
              "sk-text-body-small-semibold absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-sko-bg-primary px-1 text-sko-text-on-primary",
            )}
          >
            {badge}
          </span>
        ) : null}
      </button>
    );
  },
);
