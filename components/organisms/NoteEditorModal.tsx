"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";
import type { NotePayload } from "@/lib/types";

export interface NoteEditorModalProps {
  open: boolean;
  /** Transcript line this note is anchored to (read-only preview). */
  anchorTs?: string;
  anchorQuote?: string;
  /** Pre-filled values when editing. */
  initialText?: string;
  initialTags?: string[];
  /** Identifiers passed straight back to the save handler. */
  noteId?: string;
  lineId?: string;
  onCancel: () => void;
  onSave: (payload: NotePayload) => void;
}

/**
 * Modal editor for a transcript-anchored note. Esc cancels, Cmd/Ctrl+Enter saves.
 * Focus starts in the note field, is trapped while open and returns to the
 * trigger on close (useDialog).
 */
export function NoteEditorModal({
  open,
  anchorTs,
  anchorQuote,
  initialText = "",
  initialTags = [],
  noteId,
  lineId,
  onCancel,
  onSave,
}: NoteEditorModalProps) {
  const [text, setText] = React.useState(initialText);
  const [tags, setTags] = React.useState<string[]>(initialTags);
  const [tagDraft, setTagDraft] = React.useState("");
  const textRef = React.useRef<HTMLTextAreaElement>(null);
  const titleId = React.useId();
  const tagInputId = React.useId();
  const dialogRef = useDialog(open, onCancel, { initialFocusRef: textRef });

  // Reset fields whenever the modal (re)opens with new content.
  React.useEffect(() => {
    if (open) {
      setText(initialText);
      setTags(initialTags);
      setTagDraft("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, noteId, lineId]);

  function commitSave() {
    if (!text.trim()) return;
    onSave({ noteId, lineId, text: text.trim(), tags });
  }

  // Escape is handled by useDialog.
  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      commitSave();
    }
  }

  function addTag() {
    const t = tagDraft.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagDraft("");
  }

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      // DS `LMS / Note Editor`: a bottom sheet on mobile, a centred 560 modal from tablet up.
      className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onCancel} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-xl border-t border-sko-border-subtle bg-sko-bg-page shadow-xl md:max-w-[560px] md:rounded-lg md:border"
      >
        {/* Mobile grabber (DS: 36 x 4, fully rounded). Decorative: the sheet closes with Cancel, X or Escape. */}
        <div aria-hidden className="flex justify-center pt-2 md:hidden">
          <span className="h-1 w-9 rounded-full bg-sko-bg-strong" />
        </div>
        {/* Padding is the DS Spacing/2xl and 3xl: 16 on mobile, 20 on tablet, 20/24 on desktop. */}
        <header className="flex items-center justify-between gap-3 p-4 md:p-5 lg:px-6">
          <h2 id={titleId} className="sk-text-md-semibold text-sko-text-default">
            {noteId ? "Edit note" : "Add note"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="-m-2.5 inline-flex h-11 w-11 items-center justify-center rounded-md text-sko-text-subtle hover:bg-sko-bg-subtle md:-m-1 md:h-8 md:w-8"
          >
            <Icon icon={X} size={20} />
          </button>
        </header>

        <div className="flex flex-col gap-4 p-4 md:gap-5 md:p-5 lg:p-6">
          {anchorQuote ? (
            <div>
              <p className="sk-text-2xs-semibold mb-2 text-sko-text-subtle">
                Anchored to{" "}
                <span className="text-sko-text-primary">{anchorTs}</span>
              </p>
              <p className="sk-text-sm-regular rounded-md bg-sko-bg-subtle border-l-[3px] border-sko-border-primary px-4 py-3 text-sko-text-subtle">
                {anchorQuote}
              </p>
            </div>
          ) : null}

          <label className="block">
            <span className="sk-text-sm-medium mb-1.5 block text-sko-text-muted">Your note</span>
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write your note…"
              className="sk-text-sm-regular w-full resize-none rounded-lg border border-sko-border-default bg-sko-bg-page px-3 py-2 text-sko-text-default outline-none focus:border-sko-border-primary"
            />
          </label>

          <div>
            <label htmlFor={tagInputId} className="sk-text-sm-medium mb-1.5 block text-sko-text-muted">
              Tags (optional)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-sko-border-default px-2 py-1.5">
              {tags.map((t) => (
                // DS Input field Type=Tags chip = `Tag` md Gray (r6, border/default, bg/page, X in icon-faint).
                <span
                  key={t}
                  className="sk-text-sm-medium inline-flex items-center gap-1 rounded-md border border-sko-border-default bg-sko-bg-page py-0.5 pl-[5px] pr-1 text-sko-text-muted"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    aria-label={`Remove ${t}`}
                    className="text-sko-icon-faint hover:text-sko-text-error"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}
              <input
                id={tagInputId}
                value={tagDraft}
                onChange={(e) => setTagDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag…"
                className={cn(
                  "sk-text-sm-regular min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sko-text-default outline-none",
                )}
              />
            </div>
          </div>
        </div>

        {/* DS footer: bg/subtle, Cancel Secondary + Save Primary; full width and clear of the home bar on mobile. */}
        <footer className="flex items-center justify-end gap-3 bg-sko-bg-subtle px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-4 md:p-5 lg:px-6">
          <Button hierarchy="secondary" onClick={onCancel} className="flex-1 md:flex-none">
            Cancel
          </Button>
          <Button hierarchy="primary" onClick={commitSave} disabled={!text.trim()} className="flex-1 md:flex-none">
            Save note
          </Button>
        </footer>
      </div>
    </div>
  );
}
