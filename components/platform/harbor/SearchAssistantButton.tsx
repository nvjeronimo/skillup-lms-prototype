"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { useDialog } from "@/lib/useDialog";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn } from "@/lib/utils";
import { AssistantGlyph } from "@/components/assistant/AssistantGlyph";
import { HarborSearch, type SearchScope } from "./HarborSearch";

/**
 * The search + Assistant where the pill does not fit (Nelson, 26 Oct 2026): the compact bars of
 * the platform and the player, and the tabs bar between desktop and 1280. A button with the
 * assistant's mark opens a full-screen sheet: the same field and palette (Go to · Your courses ·
 * Help, or In this course · Ask about this course in the player) with the Assistant button inside
 * the field. It also anchors the assistant's window on a tablet (`data-assistant-anchor`).
 */
export function SearchAssistantButton({
  scope,
  size = "md",
  className,
}: {
  scope?: SearchScope;
  /** "md": 44. "sm": 32 with an invisible band that keeps a 44 target, for the desktop bars'
   * utility row and, since 26 Oct 2026, the compact bars (Nelson: the phone row has to fit; as the
   * DS Compact Topbar, Search-Assistant-Button sm). */
  size?: "sm" | "md";
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  const dialogRef = useDialog(open, close);
  const presence = useExitTransition(open, MOTION_MS.short4);
  const titleId = React.useId();
  const course = scope?.kind === "course";
  // The halo's glint starts at a random point of its cycle and turns either way (after mount,
  // so server and client render the same).
  const [halo, setHalo] = React.useState<React.CSSProperties>();
  React.useEffect(() => {
    setHalo({
      ["--sk-halo-delay" as string]: `${(-Math.random() * 9.6).toFixed(2)}s`,
      ["--sk-halo-direction" as string]: Math.random() < 0.5 ? "normal" : "reverse",
    });
  }, []);
  return (
    <>
      <button
        type="button"
        data-assistant-anchor=""
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={course ? "Search this course or ask the assistant" : "Search or ask the assistant"}
        onClick={() => setOpen(true)}
        data-hit-band={size === "sm" ? "" : undefined}
        style={halo}
        className={cn(
          "sk-assistant-halo inline-flex shrink-0 items-center justify-center rounded-pill text-sko-icon-primary transition-colors hover:bg-sko-bg-hover",
          size === "md"
            ? "size-11"
            : "size-8 before:absolute before:-inset-1.5 before:content-['']",
          className,
        )}
      >
        <AssistantGlyph size={size === "md" ? 20 : 18} />
      </button>
      {presence.mounted ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-state={presence.state}
          onAnimationEnd={presence.onAnimationEnd}
          className="sk-animate-sheet fixed inset-0 z-50 flex flex-col bg-sko-bg-page"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-sko-border-subtle pl-4 pr-2">
            <h2 id={titleId} className="sk-text-title-medium-semibold inline-flex items-center gap-2 text-sko-text-default">
              <AssistantGlyph size={20} className="text-sko-icon-primary" />
              {course ? "Search this course" : "Search"}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="inline-flex size-11 items-center justify-center rounded-control text-sko-icon-default transition-colors hover:bg-sko-bg-hover"
            >
              <Icon icon={X} size={24} />
            </button>
          </div>
          <div className="sk-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4">
            <HarborSearch scope={scope} layout="sheet" onDone={close} />
          </div>
        </div>
      ) : null}
    </>
  );
}
