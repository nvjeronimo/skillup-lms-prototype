"use client";

import { Button } from "@/components/atoms/Button";
import { SkillUpWordmark } from "@/components/atoms/SkillUpLogo";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** The legal and help pages: SkillUp's own, not the platform's; no URLs yet. */
const LINKS = ["Terms of use", "Privacy", "Cookie settings", "Accessibility", "Help center"] as const;

/**
 * DS `LMS/Platform/Navigation/Footer` (Nelson, 23 Oct 2026): a micro footer at the end of every
 * platform page, never in the player (the player keeps only the content). One line on desktop,
 * centred lines below it: the copyright, the legal and help links, and "Powered by" with the Open edX
 * logo, small (the Open edX trademark policy's usual credit). body-small, text/subtle, a 1px border/subtle rule
 * above, inside the pages' 1200 column. Open edX's MFEs already ship a footer slot
 * (frontend-component-footer); this is how it looks here. The links point to SkillUp pages that
 * have no URL yet, so they say so (and carry the sample-data mark).
 * Footer 1.1 (Nelson, 23 Oct 2026): the links are DS Link Buttons (Brand, Secondary: the grey link
 * with its 1px rule), centred in the row, 16 apart and 8 between rows when they wrap; the Open edX
 * logo is 14 tall, 6 after "Powered by".
 * Footer 1.2 (Nelson, 23 Oct 2026): the SkillUp name (monotone wordmark, 24 tall) leads, the
 * copyright after a divider; the links sit on the right with the Open edX logo after a divider,
 * without the "Powered by" words (its alt keeps them). Phones: the links first, then one centred
 * row of name | copyright | Open edX, 24 apart. The dividers are border/subtle (the DS draws them
 * as black at 30%, 0.5 px, unbound).
 * Footer 1.3 (Nelson, 23 Oct 2026): the name 18 tall (61 × 18); the Open edX logo moves next to it: name | Open edX |
 * copyright on the left (12 apart, a divider before each), the links alone on the right. Phones:
 * the links, then that same row, centred.
 * Footer 1.4 (Nelson, 25 Oct 2026): name, copyright, then the Open edX logo after the only divider
 * (12 of padding, 8 on phones); no divider between the name and the copyright. The DS divider is now
 * 1px border/subtle too.
 */
export function PlatformFooter({ className }: { className?: string }) {
  const showToast = useLmsStore((s) => s.showToast);
  return (
    <footer aria-label="Site" className={cn("sk-no-print px-layout-page-x", className)}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 border-t border-sko-border-subtle py-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-3 max-md:order-last">
          <SkillUpWordmark className="h-[18px]" />
          <p className="sk-text-body-small-regular text-sko-text-subtle">© 2026 SkillUp Online</p>
          {/* Open edX's own logo file (Nelson, 23 Oct 2026), 14 tall. It carries its own navy and
              magenta fills, so it reads on light and dark pages alike. */}
          <span className="flex border-l border-sko-border-subtle pl-2 md:pl-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/open-edx-logo.svg" alt="Powered by Open edX" width={48} height={14} className="h-3.5 w-auto" />
          </span>
        </div>
        <ul
          aria-label="Legal and help"
          data-mock="SkillUp's legal and help pages are not linked yet"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end"
        >
          {LINKS.map((label) => (
            <li key={label} className="flex">
              <Button
                hierarchy="link-subtle"
                size="sm"
                onClick={() => showToast(`${label} is not part of this prototype yet`)}
              >
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
