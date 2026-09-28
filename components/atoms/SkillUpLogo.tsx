import { cn } from "@/lib/utils";

/**
 * SkillUp wordmark. Theme-aware, following the DS Skillup_logo (19617:36654):
 * - Light: Property 1=color: dark-teal "Skill" and icon marks, light-blue "Up" and icon disc.
 * - Dark: Property 1=Monotone_Light, as in the Dark topbar (19975:537713). The whole
 *   mark is white: "Skill", "Up", and the icon marks, with a white ring (with a gap)
 *   in place of the light-blue disc. The disc is hidden. The asset keeps the
 *   598×173 geometry, so the same height class sizes both.
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
