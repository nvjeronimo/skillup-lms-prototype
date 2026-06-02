"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
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

/** Modal editor for a transcript-anchored note. Esc cancels, Cmd/Ctrl+Enter saves. */
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

  // Reset fields whenever the modal (re)opens with new content.
  React.useEffect(() => {
    if (open) {
      setText(initialText);
      setTags(initialTags);
      setTagDraft("");
      const t = window.setTimeout(() => textRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, noteId, lineId]);

  function commitSave() {
    if (!text.trim()) return;
    onSave({ noteId, lineId, text: text.trim(), tags });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onKeyDown={handleKeyDown}>
      <div className="lms-backdrop lms-animate-fade absolute inset-0" onClick={onCancel} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[560px] overflow-hidden rounded-xl border border-lms-border-secondary bg-lms-bg-primary shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-lms-border-secondary px-5 py-4">
          <h2 id={titleId} className="lms-text-md-semibold text-lms-text-primary">
            {noteId ? "Edit note" : "Add note"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-lms-text-tertiary hover:bg-lms-bg-secondary"
          >
            <Icon icon={X} size={20} />
          </button>
        </header>

        <div className="flex flex-col gap-5 px-6 py-5">
          {anchorQuote ? (
            <div>
              <p className="lms-text-2xs-medium mb-2 text-lms-text-tertiary">
                Anchored to{" "}
                <span className="text-lms-text-brand-secondary">{anchorTs}</span>
              </p>
              <p className="lms-text-sm-italic rounded-lg bg-lms-bg-secondary border-l-[3px] border-lms-border-brand px-4 py-3 text-lms-text-tertiary">
                {anchorQuote}
              </p>
            </div>
          ) : null}

          <label className="block">
            <span className="lms-text-sm-medium mb-1.5 block text-lms-text-secondary">Your note</span>
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write your note…"
              className="lms-text-sm-regular w-full resize-none rounded-lg border border-lms-border-primary bg-lms-bg-primary px-3 py-2 text-lms-text-primary outline-none focus:border-lms-border-brand"
            />
          </label>

          <div>
            <span className="lms-text-sm-medium mb-1.5 block text-lms-text-secondary">
              Tags (optional)
            </span>
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-lms-border-primary px-2 py-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="lms-text-xs-medium inline-flex items-center gap-1 rounded bg-lms-bg-secondary px-2 py-0.5 text-lms-text-tertiary"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    aria-label={`Remove ${t}`}
                    className="hover:text-lms-text-error-primary"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}
              <input
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
                  "lms-text-sm-regular min-w-24 flex-1 bg-transparent px-1 py-0.5 text-lms-text-primary outline-none",
                )}
              />
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-lms-border-secondary px-5 py-4">
          <Button variant="tertiary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={commitSave} disabled={!text.trim()}>
            Save note
          </Button>
        </footer>
      </div>
    </div>
  );
}
