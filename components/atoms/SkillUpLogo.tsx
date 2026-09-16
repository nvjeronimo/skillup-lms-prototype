import { cn } from "@/lib/utils";

/**
 * SkillUp wordmark. Theme-aware: the brand-ink parts ("Skill" + icon marks,
 * dark teal in light) become white in dark mode — the dark ink is unreadable
 * on a dark background. The light-blue "Up" + icon circle stay the same in both.
 *
 * Implemented as two <img>s toggled by [data-theme] in CSS (see globals.css).
 * No flash: data-theme is set pre-paint by the theme init script in layout.tsx.
 * (An external <img> SVG can't recolour via CSS, so we swap the asset instead.)
 */
export function SkillUpLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/skillup-logo.svg" alt="SkillUp" className="sk-logo-light block h-full w-auto" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/skillup-logo-dark.svg" alt="" aria-hidden className="sk-logo-dark h-full w-auto" />
    </span>
  );
}
