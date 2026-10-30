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
  action?: { label: string; href?: string; onClick?: () => void; invented?: string };
  /** The heading level: h2 by default, h3 inside a section that already has its h2. */
  as?: "h2" | "h3";
  className?: string;
}

/* DS Action (Nelson, 13 Oct 2026): DS `Link Button`, Type=Brand, Hierarchy=Secondary:
   body-medium/Semibold in text/subtle with a 16 arrow-right, 4 apart, padding 4 / 2, on a 1px
   icon/subtle rule under the whole button (the rule is the link's underline). 28 tall as
   drawn; the target grows to 44 on mobile, and the negative margin keeps the header at the
   title's height. */
const ACTION =
  "sk-text-body-medium-semibold inline-flex shrink-0 items-center justify-center gap-1 border-b border-sko-icon-subtle px-0.5 py-1 text-sko-text-subtle transition-colors md:h-7 hover:border-sko-text-default hover:text-sko-text-default max-md:-my-2 max-md:min-h-11";

/**
 * DS `LMS / Platform / Section header` (6382:3172): section title for the platform pages.
 * Title in text/default + Emphasis in text/subtle, both headline-small/Bold (24/32, 20/30 on
 * mobile), 6 between them; they wrap as two blocks. Optional Action on the right, gap 16,
 * aligned with the top of the title.
 * The rule under the header, tried on 13 Oct 2026, was withdrawn by Nelson the same day: the
 * header has no padding and no line.
 */
export function PlatformSectionHeader({
  id,
  title,
  emphasis,
  action,
  as: Heading = "h2",
  className,
}: PlatformSectionHeaderProps) {
  const actionContent = action ? (
    <>
      {action.label}
      <Icon icon={ArrowRight} size={16} className="text-sko-icon-subtle" aria-hidden="true" />
    </>
  ) : null;

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <Heading
        id={id}
        className="sk-text-headline-small-bold flex min-w-0 flex-1 flex-wrap items-start gap-x-1.5"
      >
        <span className="whitespace-nowrap text-sko-text-default">{title}</span>
        {emphasis ? (
          <>
            {" "}
            <span data-heading-em="" className="whitespace-nowrap text-sko-text-subtle">
              {emphasis}
            </span>
          </>
        ) : null}
      </Heading>
      {action ? (
        action.href ? (
          <Link href={action.href} data-invented={action.invented} className={ACTION}>
            {actionContent}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            data-invented={action.invented}
            className={ACTION}
          >
            {actionContent}
          </button>
        )
      ) : null}
    </div>
  );
}
