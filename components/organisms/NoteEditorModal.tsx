import * as React from "react";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { TranscriptLine } from "@/components/molecules/TranscriptLine";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { MOTION_MS } from "@/lib/motion/tokens";
import { inertProps } from "@/lib/inert";
import type { NotePayload } from "@/lib/types";
import styles from "./NoteEditorModal.module.css";

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
  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short3);
  // Closing clears the note from the store; keep the heading and anchor as they were for the exit.
  const shown = useFrozenWhileClosed({ noteId, anchorTs, anchorQuote }, open);

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

  if (!mounted) return null;
  const closed = state === "closed";

  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      // DS `LMS / Note Editor`: a bottom sheet on mobile, a centred 560 modal from tablet up.
      className={cn(
        styles.root,
        closed && styles.closed,
      )}
      onKeyDown={handleKeyDown}
    >
      {/* The backdrop's fade-out (short4) outlasts the dialog's pop-out (short3), so it ends the exit. */}
      <div
        className={`sk-backdrop sk-animate-fade ${styles.backdrop}`}
        onClick={onCancel}
        onAnimationEnd={onAnimationEnd}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`sk-animate-pop ${styles.dialog}`}
      >
        {/* Mobile grabber (DS: 36 x 4, fully rounded). Decorative: the sheet closes with Cancel, X or Escape. */}
        <div aria-hidden className={styles.grabber}>
          <span className={styles.grabberBar} />
        </div>
        {/* Padding is the DS Spacing/2xl and 3xl: 16 on mobile, 20 on tablet, 20/24 on desktop. */}
        <header className={styles.header}>
          <h2 id={titleId} className={`sk-text-body-large-semibold ${styles.title}`}>
            {shown.noteId ? "Edit note" : "Add note"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className={styles.close}
          >
            <Icon icon={X} size={20} />
          </button>
        </header>

        <div className={styles.body}>
          {shown.anchorQuote ? (
            <div>
              <p className={`sk-text-label-small-semibold ${styles.anchorLabel}`}>
                Anchored to{" "}
                <span className={styles.anchorTs}>{shown.anchorTs}</span>
              </p>
              <p className={`sk-text-body-medium-regular ${styles.anchorQuote}`}>
                {shown.anchorQuote}
              </p>
            </div>
          ) : null}

          <label className={styles.field}>
            <span className={`sk-text-body-medium-medium ${styles.label}`}>Your note</span>
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write your note…"
              className={`sk-text-body-medium-regular ${styles.textarea}`}
            />
          </label>

          <div>
            <label htmlFor={tagInputId} className={`sk-text-body-medium-medium ${styles.label}`}>
              Tags (optional)
            </label>
            <div className={styles.tags}>
              {tags.map((t) => (
                // DS Input field Type=Tags chip = `Tag` md Gray (r6, border/default, bg/page, X in icon-faint).
                <span
                  key={t}
                  className={`sk-text-body-medium-medium ${styles.tag}`}
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                    aria-label={`Remove ${t}`}
                    className={styles.removeTag}
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
                className={`sk-text-body-medium-regular ${styles.tagInput}`}
              />
            </div>
          </div>
        </div>

        {/* DS footer: bg/subtle, Cancel Secondary + Save Primary; full width and clear of the home bar on mobile. */}
        <footer className={styles.footer}>
          <Button hierarchy="secondary" onClick={onCancel} className={styles.action}>
            Cancel
          </Button>
          <Button hierarchy="primary" onClick={commitSave} disabled={!text.trim()} className={styles.action}>
            Save note
          </Button>
        </footer>
      </div>
    </div>
  );
}
