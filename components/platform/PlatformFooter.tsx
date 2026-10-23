"use client";

import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/** The legal and help pages: SkillUp's own, not the platform's; no URLs yet. */
const LINKS = ["Terms of use", "Privacy", "Cookie settings", "Accessibility", "Help center"] as const;

const LINK =
  "sk-text-body-small-medium inline-flex min-h-11 items-center text-sko-text-subtle underline-offset-2 transition-colors hover:text-sko-text-default hover:underline md:min-h-0";

/**
 * DS `LMS/Platform/Navigation/Footer` (Nelson, 23 Oct 2026): a micro footer at the end of every
 * platform page, never in the player (the player keeps only the content). One line on desktop,
 * centred lines below it: the copyright, the legal and help links, and "Powered by Open edX" (the
 * Open edX trademark policy's usual credit). body-small, text/subtle, a 1px border/subtle rule
 * above, inside the pages' 1200 column. Open edX's MFEs already ship a footer slot
 * (frontend-component-footer); this is how it looks here. The links point to SkillUp pages that
 * have no URL yet, so they say so (and carry the sample-data mark).
 */
export function PlatformFooter({ className }: { className?: string }) {
  const showToast = useLmsStore((s) => s.showToast);
  return (
    <footer aria-label="Site" className={cn("sk-no-print px-6 md:px-8 lg:px-10", className)}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-x-6 gap-y-2 border-t border-sko-border-subtle py-6 text-center md:flex-row md:flex-wrap md:justify-between md:text-left">
        <p className="sk-text-body-small-regular text-sko-text-subtle">© 2026 SkillUp Online</p>
        <ul
          aria-label="Legal and help"
          data-mock="SkillUp's legal and help pages are not linked yet"
          className="flex flex-wrap items-center justify-center gap-x-4"
        >
          {LINKS.map((label) => (
            <li key={label} className="flex">
              <button type="button" className={LINK} onClick={() => showToast(`${label} is not part of this prototype yet`)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
        <p className="sk-text-body-small-regular text-sko-text-subtle">Powered by Open edX</p>
      </div>
    </footer>
  );
}
