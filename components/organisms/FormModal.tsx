"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SelectField } from "@/components/atoms/SelectField";
import { Icon } from "@/lib/icons";
import { inertProps } from "@/lib/inert";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition } from "@/lib/useExitTransition";
import { useRovingRadio } from "@/lib/useRovingRadio";
import { cn } from "@/lib/utils";

/* DS Input field, Size=md with a label (as EditProfileView and NoteEditorModal): bg/page, 1px
   border/default, Radius/control, padding 10/14, body-large/Regular, 44 tall; focus border/primary. */
export const FIELD =
  "sk-text-body-large-regular min-h-11 w-full rounded-control border border-sko-border-default bg-sko-bg-page px-3.5 py-2.5 text-sko-text-default shadow-sm placeholder:text-sko-text-placeholder transition-[border-color,box-shadow] focus:border-sko-border-primary focus:outline-none focus:ring-1 focus:ring-sko-border-primary";

/** A labelled field: the label (body-medium/Medium, text/muted), the control, an optional hint. */
export function FormField({
  id,
  label,
  optional,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="sk-text-body-medium-medium text-sko-text-muted">
        {label}
        {optional ? <span className="text-sko-text-subtle"> (optional)</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="sk-text-body-small-regular text-sko-text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** DS `Select` Size=md in a FormField. Options are `[value, label]` or plain strings. */
export function FormSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<string | readonly [string, string]>;
  placeholder?: string;
}) {
  return (
    <SelectField id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(FIELD, !value && "text-sko-text-placeholder")}>
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((o) => {
        const [v, l] = typeof o === "string" ? [o, o] : o;
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
    </SelectField>
  );
}

/**
 * Choice cards: a radio group drawn as the Report-issue rows (Radius/control, 1px border/subtle;
 * the checked one on bg/primary-soft with border/primary and a check). One Tab stop, arrows move
 * and check (useRovingRadio). `columns` lays them out side by side from tablet up.
 */
export function ChoiceGroup<T extends string>({
  legend,
  value,
  onChange,
  options,
  columns = 1,
}: {
  legend: string;
  value: T | null;
  onChange: (value: T) => void;
  options: ReadonlyArray<{ value: T; label: string; hint?: string }>;
  columns?: 1 | 2 | 3;
}) {
  const legendId = React.useId();
  const index = options.findIndex((o) => o.value === value);
  const roving = useRovingRadio(options.length, index, (i) => onChange(options[i].value));
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend id={legendId} className="sk-text-body-medium-medium mb-1.5 text-sko-text-muted">
        {legend}
      </legend>
      <div
        role="radiogroup"
        aria-labelledby={legendId}
        className={cn("grid gap-1.5", columns === 2 && "md:grid-cols-2", columns === 3 && "grid-cols-3")}
      >
        {options.map((o, i) => {
          const checked = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={checked}
              {...roving.itemProps(i)}
              onClick={() => onChange(o.value)}
              className={cn(
                "flex min-h-11 items-center justify-between gap-2 rounded-control border px-3 py-2.5 text-left transition-colors",
                checked
                  ? "border-sko-border-primary bg-sko-bg-primary-soft text-sko-text-default"
                  : "border-sko-border-subtle text-sko-text-muted hover:bg-sko-bg-hover",
              )}
            >
              <span className="flex min-w-0 flex-col">
                <span className="sk-text-body-medium-medium">{o.label}</span>
                {o.hint ? <span className="sk-text-body-small-regular text-sko-text-subtle">{o.hint}</span> : null}
              </span>
              {checked ? <Icon icon={Check} size={18} className="shrink-0 text-sko-icon-primary" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** One line under the title: what happens to what the learner writes. */
  description?: React.ReactNode;
  /** The primary action's label ("Post question", "Send"). */
  submitLabel: string;
  /** Called with the form valid; the caller closes the modal and confirms in a toast. */
  onSubmit: () => void;
  /** Keeps the primary action disabled until the required fields are filled. */
  canSubmit: boolean;
  /** Omit the form's own actions (an informational modal, e.g. Calendar sync): one "Done". */
  doneOnly?: boolean;
  /** Marks the body as sample data (the page's mock outline). */
  mock?: string;
  /**
   * A Secondary action in place of Cancel (Nelson, 25 Oct 2026: the synthetic personas' Clear).
   * Esc, the backdrop and the close button still cancel.
   */
  secondaryAction?: { label: string; onClick: () => void; disabled?: boolean };
  children: React.ReactNode;
}

/**
 * The prototype's form modal (Nelson, 23 Oct 2026: "implement the missing modals"), built on the
 * Program quick view's frame: centred, 560 wide, at most 720 tall (full screen on a phone); a
 * header with the title (title-medium/Semibold), an optional line under it and the Secondary
 * icon close; a body that scrolls; a footer with Cancel (Tertiary) and the primary action, which
 * stays disabled until the required fields are filled. Esc and the backdrop cancel (useDialog
 * traps the focus and gives it back); it pops in and fades out like the other dialogs.
 * Every modal built on it sends nothing: the result is kept in the page's state for the session
 * and confirmed in a toast.
 */
export function FormModal({
  open,
  onClose,
  title,
  description,
  submitLabel,
  onSubmit,
  canSubmit,
  doneOnly,
  mock,
  secondaryAction,
  children,
}: FormModalProps) {
  const titleId = React.useId();
  const descId = React.useId();
  const dialogRef = useDialog(open, onClose);
  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short3);

  if (!mounted) return null;
  const closed = state === "closed";

  return (
    <div
      ref={dialogRef}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn("fixed inset-0 z-[60] flex items-center justify-center md:p-6", closed && "pointer-events-none")}
    >
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} onAnimationEnd={onAnimationEnd} aria-hidden />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (doneOnly) onClose();
          else if (canSubmit) onSubmit();
        }}
        className="sk-animate-pop relative flex h-full w-full origin-center flex-col overflow-hidden bg-sko-bg-page shadow-xl md:h-auto md:max-h-[min(720px,calc(100dvh-48px))] md:max-w-[560px] md:rounded-surface md:border md:border-sko-border-subtle"
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-sko-border-subtle p-4 md:px-6">
          <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1.5">
            <h2 id={titleId} className="sk-text-title-medium-semibold text-sko-text-default">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="sk-text-body-medium-regular text-sko-text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <Button hierarchy="secondary" size="md" iconOnly leftIcon={X} type="button" onClick={onClose} aria-label="Close" className="shrink-0" />
        </header>

        <div data-mock={mock} className="sk-scroll flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 md:p-6">
          {children}
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-sko-border-subtle p-4 md:flex-row md:items-center md:justify-end md:px-6">
          {doneOnly ? (
            <Button type="submit" hierarchy="primary" size="md" className="max-md:w-full">
              {submitLabel}
            </Button>
          ) : (
            <>
              {secondaryAction ? (
                <Button
                  type="button"
                  hierarchy="secondary"
                  size="md"
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                  className="max-md:w-full"
                >
                  {secondaryAction.label}
                </Button>
              ) : (
                <Button type="button" hierarchy="tertiary" size="md" onClick={onClose} className="max-md:w-full">
                  Cancel
                </Button>
              )}
              <Button type="submit" hierarchy="primary" size="md" disabled={!canSubmit} className="max-md:w-full">
                {submitLabel}
              </Button>
            </>
          )}
        </footer>
      </form>
    </div>
  );
}
