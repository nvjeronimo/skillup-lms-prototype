import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface PlatformSectionHeaderProps {
  /** id of the <h2>, so the section can point at it with aria-labelledby. */
  id?: string;
  /** First words, in text/default. */
  title: string;
  /** The rest of the title, in text/subtle. */
  emphasis?: string;
  /** Optional action on the right: a link when `href` is set, a button otherwise. */
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

/* DS Action: Buttons/Button sm · Link gray with arrow-right — body-medium/Semibold in
   text/subtle, 4 gap, 20 icon, radius 4, no underline. 20px tall as drawn; the target grows
   to 44px on mobile and to 24px from tablet up (WCAG 2.5.8), and the negative margin keeps
   the header at the title's height. */
const ACTION =
  "sk-text-sm-semibold inline-flex shrink-0 items-center justify-center gap-1 rounded text-sko-text-subtle transition-colors hover:text-sko-text-default max-md:-my-[7px] max-md:min-h-11 md:-my-0.5 md:min-h-6";

/**
 * DS `LMS / Platform / Section header` (6382:3172): section title for the platform pages.
 * Title in text/default + Emphasis in text/subtle, both headline-small/Bold (24/32, 20/30 on
 * mobile), 6 between them; they wrap as two blocks. Optional Action on the right, gap 16.
 */
export function PlatformSectionHeader({ id, title, emphasis, action, className }: PlatformSectionHeaderProps) {
  const actionContent = action ? (
    <>
      {action.label}
      <Icon icon={ArrowRight} size={20} className="text-sko-icon-subtle" aria-hidden="true" />
    </>
  ) : null;

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 id={id} className="sk-text-display-xs-bold flex min-w-0 flex-1 flex-wrap items-start gap-x-1.5">
        <span className="whitespace-nowrap text-sko-text-default">{title}</span>
        {emphasis ? (
          <>
            {" "}
            <span className="whitespace-nowrap text-sko-text-subtle">{emphasis}</span>
          </>
        ) : null}
      </h2>
      {action ? (
        action.href ? (
          <Link href={action.href} className={ACTION}>
            {actionContent}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={ACTION}>
            {actionContent}
          </button>
        )
      ) : null}
    </div>
  );
}
