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
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onCancel} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[560px] overflow-hidden rounded-xl border border-sk-border-secondary bg-sk-bg-primary shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-sk-border-secondary px-5 py-4">
          <h2 id={titleId} className="sk-text-md-semibold text-sk-text-primary">
            {noteId ? "Edit note" : "Add note"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sk-text-tertiary hover:bg-sk-bg-secondary"
          >
            <Icon icon={X} size={20} />
          </button>
        </header>

        <div className="flex flex-col gap-5 px-6 py-5">
          {anchorQuote ? (
            <div>
              <p className="sk-text-2xs-medium mb-2 text-sk-text-tertiary">
                Anchored to{" "}
                <span className="text-sk-text-brand-secondary">{anchorTs}</span>
              </p>
              <p className="sk-text-sm-italic rounded-lg bg-sk-bg-secondary border-l-[3px] border-sk-border-brand px-4 py-3 text-sk-text-tertiary">
                {anchorQuote}
              </p>
            </div>
          ) : null}

          <label className="block">
            <span className="sk-text-sm-medium mb-1.5 block text-sk-text-secondary">Your note</span>
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write your note…"
              className="sk-text-sm-regular w-full resize-none rounded-lg border border-sk-border-primary bg-sk-bg-primary px-3 py-2 text-sk-text-primary outline-none focus:border-sk-border-brand"
            />
          </label>

          <div>
            <span className="sk-text-sm-medium mb-1.5 block text-sk-text-secondary">
              Tags (optional)
            </span>
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-sk-border-primary px-2 py-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="sk-text-xs-medium inline-flex items-center gap-1 rounded bg-sk-bg-secondary px-2 py-0.5 text-sk-text-tertiary"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    aria-label={`Remove ${t}`}
                    className="hover:text-sk-text-error-primary"
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
                  "sk-text-sm-regular min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sk-text-primary outline-none",
                )}
              />
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-sk-border-secondary px-5 py-4">
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
