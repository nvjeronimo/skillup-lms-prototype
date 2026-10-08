"use client";

import * as React from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { useDialog } from "@/lib/useDialog";

export interface LabModalProps {
  open: boolean;
  title: string;
  /** The lab address, framed in the modal. */
  src: string;
  /** The same lab in a tab of its own. */
  newTabHref: string;
  /** Mobile: "Open in a new tab" becomes an icon button. */
  compact?: boolean;
  onOpenNewTab?: () => void;
  onClose: () => void;
}

/**
 * The LTI component's "Open tool in: Modal": the lab in a frame over the page, 80% of the
 * window on each axis by default (`modal_width`, `modal_height`).
 *
 * A sketch, like its Figma source: there is no DS component until the content team's test in
 * Studio says the provider accepts being framed (lab-third-party-platforms.md §2).
 */
export function LabModal({ open, title, src, newTabHref, compact, onOpenNewTab, onClose }: LabModalProps) {
  const titleId = React.useId();
  const dialogRef = useDialog(open, onClose);

  if (!open) return null;
  return (
    <div ref={dialogRef} className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[80%] w-[80%] flex-col overflow-hidden rounded-[10px] bg-sko-bg-page shadow-xl"
      >
        <div
          className={
            compact
              ? "flex items-center justify-between gap-3 border-b border-sko-border-default py-3 pl-4 pr-2"
              : "flex items-center justify-between gap-3 border-b border-sko-border-default py-3 pl-6 pr-3"
          }
        >
          <h2 id={titleId} className="sk-text-title-large-bold min-w-0 text-sko-text-default">
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <ButtonLink
              href={newTabHref}
              target="_blank"
              rel="noopener"
              hierarchy="tertiary"
              size="sm"
              rightIcon={ExternalLink}
              aria-label={compact ? "Open in a new tab" : undefined}
              onClick={onOpenNewTab}
            >
              {compact ? null : "Open in a new tab"}
            </ButtonLink>
            <Button hierarchy="tertiary" size="sm" iconOnly leftIcon={X} aria-label="Close" onClick={onClose} />
          </div>
        </div>
        <iframe title={title} src={src} className="min-h-0 w-full flex-1 bg-sko-bg-subtle" />
      </div>
    </div>
  );
}
