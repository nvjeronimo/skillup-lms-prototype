"use client";

import * as React from "react";
import { ImageIcon, Download, Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { useLmsStore } from "@/lib/store";
import { cn, durationToSeconds } from "@/lib/utils";
import type { LessonBlock, QuizOption } from "@/lib/content";

/** The upper-cased extension of a file name ("Lab.ipynb" → "IPYNB"), or the fallback. */
export function fileExtension(name: string, fallback = "FILE"): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 && dot < name.length - 1 ? name.slice(dot + 1).toUpperCase() : fallback.toUpperCase();
}

/**
 * The file-type chip that leads DS `LMS / Lab · File Row` and Lesson Block
 * `Kind=HTML (File)` (20328:3330): the extension in body-small/Bold, 1px
 * stroke, radius 6, padding 4/6. Tone: `primary` (Lesson Block File),
 * `subtle` (Lab file, Available), `success` (Lab file, Downloaded).
 */
export function FileTypeChip({
  label,
  tone = "primary",
}: {
  label: string;
  tone?: "primary" | "subtle" | "success";
}) {
  return (
    // DS body-small/Bold — sk-text-body-small-semibold until .sk-text-body-small-bold exists (CT-22).
    <span
      className={cn(
        "sk-text-body-small-semibold shrink-0 rounded-md border px-1.5 py-1",
        tone === "success"
          ? "border-sko-border-success text-sko-text-success"
          : tone === "subtle"
            ? "border-sko-border-subtle text-sko-text-primary"
            : "border-sko-border-primary text-sko-text-primary",
      )}
    >
      {label}
    </span>
  );
}

/**
 * The 16px radio that leads DS `LMS / Quiz · Option Row` (Checkbox Type=Radio,
 * Size=sm). Checked: bg/primary with a 6px icon/on-primary dot. Unchecked:
 * bg/page + border/default. Disabled (not picked once the answer is locked):
 * bg/faint + border/disabled at 40% opacity.
 */
export function OptionRadio({ checked, disabled = false }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
        checked
          ? "bg-sko-bg-primary"
          : disabled
            ? "border border-sko-border-disabled bg-sko-bg-faint opacity-40"
            : "border border-sko-border-default bg-sko-bg-page",
      )}
    >
      {/* The dot is a glyph, so it takes the icon token through currentColor. */}
      {checked ? <span className="h-1.5 w-1.5 rounded-full bg-current text-sko-icon-on-primary" /> : null}
    </span>
  );
}

/**
 * Renders a stack of lesson blocks. Deliberately not tied to the Lesson Page
 * type: an Open edX unit can hold several components whatever its dominant
 * asset is, so a Video topic with an intro and a recap uses this too.
 */
export function LessonBlocks({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

function Block({ block }: { block: LessonBlock }) {
  const showToast = useLmsStore((s) => s.showToast);

  switch (block.kind) {
    case "text":
      return (
        <section className="flex flex-col gap-2">
          {block.heading ? (
            <h2 className="sk-text-headline-small-semibold text-sko-text-default">{block.heading}</h2>
          ) : null}
          {block.paragraphs.map((p, i) => (
            <p key={i} className="sk-text-body-large-regular text-sko-text-muted">
              {p}
            </p>
          ))}
        </section>
      );

    case "video":
      return (
        <figure className="flex flex-col gap-2">
          {/* Video unit/asset — same player component as any Video topic. */}
          <VideoPlayer durationSeconds={durationToSeconds(block.durationLabel)} />
          <figcaption className="sk-text-body-small-regular text-sko-text-subtle">
            Video · {block.durationLabel} · transcript available
          </figcaption>
        </figure>
      );

    case "image":
      return (
        <figure className="flex flex-col gap-2">
          <div
            className="flex aspect-[16/7] w-full items-center justify-center rounded-xl bg-sko-bg-subtle"
            role="img"
            aria-label={block.alt}
          >
            <Icon icon={ImageIcon} size={24} className="text-sko-text-subtle" />
          </div>
          <figcaption className="sk-text-body-small-regular text-sko-text-subtle">
            {block.caption}
          </figcaption>
        </figure>
      );

    case "file":
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sko-border-subtle bg-sko-bg-page px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <FileTypeChip label={fileExtension(block.name, block.fileKind)} tone="primary" />
            <div className="flex min-w-0 flex-col gap-0.5">
              {/* DS body-medium/Bold — semibold until .sk-text-body-medium-bold exists (CT-22). */}
              <span className="sk-text-body-medium-semibold truncate text-sko-text-default">
                {block.name}
              </span>
              <span className="sk-text-body-small-regular text-sko-text-subtle">{block.size}</span>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={Download}
            onClick={() => showToast(`Downloading ${block.name}…`)}
          >
            Download
          </Button>
        </div>
      );

    case "callout":
      return <InlineAlert tone={block.tone} title={block.title} description={block.body} />;

    case "knowledge-check":
      return <KnowledgeCheck question={block.question} options={block.options} />;
  }
}

/**
 * An inline knowledge check. Ungraded and single-question — it exists to break
 * up reading, not to assess, so it has no attempts counter or results summary.
 */
function KnowledgeCheck({
  question,
  options,
}: {
  question: string;
  options: QuizOption[];
}) {
  const [picked, setPicked] = React.useState<string | undefined>();
  const chosen = options.find((o) => o.id === picked);
  const answered = Boolean(picked);
  const isCorrect = Boolean(chosen?.correct);

  return (
    <section className="flex flex-col gap-2 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-5 shadow-sk-card">
      <span className="sk-text-body-small-medium uppercase text-sko-text-primary">
        Quick check · not graded
      </span>
      {/* DS body-large/Bold — semibold until .sk-text-body-large-bold exists (CT-22). */}
      <h3 className="sk-text-body-large-semibold text-sko-text-default">{question}</h3>

      <ul className="flex flex-col gap-2">
        {options.map((o) => {
          const isPicked = o.id === picked;
          const markRight = answered && o.correct;
          const markWrong = answered && isPicked && !o.correct;
          // The right answer the learner did not pick: green to show where it
          // was, but no tick — a tick belongs only to what they earned.
          const missed = markRight && !isPicked;
          return (
            <li key={o.id}>
              {/* DS LMS / Quiz · Option Row (20318:705157): p 12/16/12/12, gap 12,
                  r8, border/subtle, body-medium/Regular, leading 16px radio. */}
              <button
                type="button"
                onClick={() => !answered && setPicked(o.id)}
                disabled={answered}
                aria-pressed={isPicked}
                className={cn(
                  "sk-text-body-medium-regular flex w-full items-center gap-3 rounded-lg border border-sko-border-subtle py-3 pl-3 pr-4 text-left transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sko-border-primary",
                  markRight
                    ? "bg-sko-bg-success-soft text-sko-text-success"
                    : markWrong
                      ? "bg-sko-bg-error-soft text-sko-text-error"
                      : cn("bg-sko-bg-page text-sko-text-default", !answered && "hover:bg-sko-bg-subtle"),
                )}
              >
                <OptionRadio checked={isPicked} disabled={answered && !isPicked && !o.correct} />
                <span className="flex-1">{o.label}</span>
                {missed ? <span className="sk-text-body-small-medium shrink-0">This should be selected</span> : null}
                {markRight && isPicked ? (
                  <Icon icon={Check} size={24} className="shrink-0 text-sko-icon-success" />
                ) : null}
                {markWrong ? <Icon icon={X} size={24} className="shrink-0 text-sko-icon-error" /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && chosen?.feedback ? (
        <p
          className={cn(
            "sk-text-body-medium-regular",
            isCorrect ? "text-sko-text-success" : "text-sko-text-error",
          )}
        >
          {chosen.feedback}
        </p>
      ) : null}
    </section>
  );
}
