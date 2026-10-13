"use client";

import * as React from "react";
import { RotateCcw, Send, Sparkles, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import type { ChatMessage } from "@/lib/assistant/types";
import { useDialog } from "@/lib/useDialog";
import { cn } from "@/lib/utils";

export interface AssistantWindowProps {
  id: string;
  messages: ChatMessage[];
  /** The reply still arriving (model mode), or null. */
  streaming: string | null;
  status: "idle" | "answering";
  suggestions: string[];
  firstName: string;
  onAsk: (question: string) => void;
  /** Empties the conversation and brings the suggestions back. */
  onClear: () => void;
  onClose: () => void;
  /** A full-screen sheet (phones): focus stays inside and the page behind is inert. */
  modal: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MAX_QUESTION = 500;
const CAPTION = {
  model: "AI-generated. Check important details.",
  script: "Prototype: scripted answer.",
} as const;

/**
 * The assistant's chat: a floating card above its launcher, a full-screen sheet on a phone.
 * Presentational: the conversation comes from lib/assistant/useAssistant.
 */
export function AssistantWindow({
  id,
  messages,
  streaming,
  status,
  suggestions,
  firstName,
  onAsk,
  onClear,
  onClose,
  modal,
  className,
  style,
}: AssistantWindowProps) {
  const inputId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLDivElement>(null);
  const [draft, setDraft] = React.useState("");
  // Focus trap, inert page and Esc for the sheet. The floating card is not modal: the page
  // behind stays usable, so it only takes the focus on open and closes on its own Esc.
  const dialogRef = useDialog(modal, onClose, { initialFocusRef: inputRef });
  React.useEffect(() => {
    if (!modal) inputRef.current?.focus();
  }, [modal]);

  const answering = status === "answering";
  const last = messages[messages.length - 1];
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, streaming, answering]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (answering || !draft.trim()) return;
    onAsk(draft);
    setDraft("");
  };

  return (
    <div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-label="SkillUp Assistant"
      aria-modal={modal || undefined}
      style={style}
      onKeyDown={(event) => {
        if (!modal && event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
      className={cn(
        "sk-animate-fade flex flex-col overflow-hidden bg-sko-bg-page",
        modal ? "" : "rounded-xl border border-sko-border-subtle shadow-xl",
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-sko-border-subtle py-3 pl-5 pr-3">
        <h2 className="sk-text-body-large-medium inline-flex items-center gap-2 text-sko-text-default">
          <Icon icon={Sparkles} size={20} className="text-sko-icon-primary" />
          SkillUp Assistant
        </h2>
        <div className="flex items-center">
          {messages.length ? (
            <button
              type="button"
              onClick={() => {
                onClear();
                inputRef.current?.focus();
              }}
              aria-label="Start a new conversation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-sko-text-subtle hover:bg-sko-bg-subtle"
            >
              <Icon icon={RotateCcw} size={20} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the assistant"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-sko-text-subtle hover:bg-sko-bg-subtle"
          >
            <Icon icon={X} size={20} />
          </button>
        </div>
      </header>

      <div role="log" aria-live="off" aria-label="Conversation" className="sk-scroll flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <>
            <p className="sk-text-body-medium-regular text-sko-text-default">
              Hi {firstName}. Ask me about the platform or your courses.
            </p>
            <ul className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => onAsk(s)}
                    disabled={answering}
                    className="sk-text-body-small-medium min-h-11 rounded-full bg-sko-bg-primary-soft px-3 py-1.5 text-left text-sko-text-primary"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {messages.map((m) =>
          m.role === "user" ? (
            <p
              key={m.id}
              className="sk-text-body-medium-regular max-w-[85%] self-end whitespace-pre-line rounded-lg bg-sko-bg-primary-soft px-4 py-3 text-sko-text-default"
            >
              <span className="sr-only">You: </span>
              {m.text}
            </p>
          ) : (
            <div key={m.id} className="flex max-w-[92%] flex-col gap-3 self-start">
              <p className="sk-text-body-medium-regular whitespace-pre-line rounded-lg border border-sko-border-subtle bg-sko-bg-subtle px-4 py-3 text-sko-text-default">
                <span className="sr-only">Assistant: </span>
                {m.text}
              </p>
              {m.actions?.length ? (
                <ul className="flex flex-col items-start gap-2">
                  {m.actions.map((a) => (
                    <li key={a.id}>
                      <ButtonLink href={a.href} hierarchy="secondary" size="sm">
                        {a.label}
                      </ButtonLink>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="sk-text-body-small-regular text-sko-text-subtle">{CAPTION[m.source ?? "script"]}</p>
            </div>
          ),
        )}

        {answering ? (
          <p className="sk-text-body-medium-regular max-w-[92%] self-start whitespace-pre-line rounded-lg border border-sko-border-subtle bg-sko-bg-subtle px-4 py-3 text-sko-text-muted">
            {streaming || "Thinking…"}
          </p>
        ) : null}
        <div ref={endRef} />
      </div>

      {/* What a screen reader hears: the status, then the finished answer once. */}
      <p aria-live="polite" className="sr-only">
        {answering ? "Thinking…" : last?.role === "assistant" ? last.text : ""}
      </p>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-sko-border-subtle p-3">
        <label htmlFor={inputId} className="sr-only">
          Your question
        </label>
        <input
          ref={inputRef}
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_QUESTION}
          autoComplete="off"
          placeholder="Ask about the platform or your courses…"
          className="sk-text-body-medium-regular h-11 min-w-0 flex-1 rounded-lg border border-sko-border-subtle bg-sko-bg-subtle px-4 text-sko-text-default outline-none placeholder:text-sko-text-placeholder focus:border-sko-border-primary"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={answering || !draft.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sko-bg-primary text-sko-text-on-primary hover:bg-sko-bg-primary-hover hover:text-sko-text-on-primary-hover disabled:bg-sko-bg-muted disabled:text-sko-text-disabled"
        >
          <Icon icon={Send} size={20} />
        </button>
      </form>
    </div>
  );
}
