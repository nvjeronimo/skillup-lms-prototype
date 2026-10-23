"use client";

import { Button } from "@/components/atoms/Button";
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
 */
export function PlatformFooter({ className }: { className?: string }) {
  const showToast = useLmsStore((s) => s.showToast);
  return (
    <footer aria-label="Site" className={cn("sk-no-print px-6 md:px-8 lg:px-10", className)}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-x-6 gap-y-4 border-t border-sko-border-subtle py-6 text-center md:flex-row md:flex-wrap md:justify-between md:text-left">
        <p className="sk-text-body-small-regular text-sko-text-subtle">© 2026 SkillUp Online</p>
        <ul
          aria-label="Legal and help"
          data-mock="SkillUp's legal and help pages are not linked yet"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:flex-1"
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
        <p className="sk-text-body-small-regular flex items-center gap-1.5 text-sko-text-subtle">
          Powered by
          {/* Open edX's own logo file (Nelson, 23 Oct 2026), small: 14 tall (Footer 1.1). It carries its own
              navy and magenta fills, so it reads on light and dark pages alike. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/open-edx-logo.svg" alt="Open edX" width={48} height={14} className="h-3.5 w-auto" />
        </p>
      </div>
    </footer>
  );
}
