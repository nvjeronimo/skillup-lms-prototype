"use client";

import * as React from "react";
import { Play, ImageIcon, FileText, Table2, Download, Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { LessonBlock, QuizOption } from "@/lib/content";

const FILE_ICON = { pdf: FileText, doc: FileText, data: Table2 } as const;

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
            <h2 className="sk-text-display-xs-semibold text-sk-text-primary">{block.heading}</h2>
          ) : null}
          {block.paragraphs.map((p, i) => (
            <p key={i} className="sk-text-md-regular text-sk-text-secondary">
              {p}
            </p>
          ))}
        </section>
      );

    case "video":
      return (
        <figure className="flex flex-col gap-2">
          <div
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, var(--sk-bg-brand-solid), var(--sk-bg-brand-stage))",
            }}
          >
            <Icon icon={Play} size={26} className="text-sk-text-primary-on-brand" />
            <span className="sk-text-sm-medium text-sk-text-primary-on-brand">{block.title}</span>
          </div>
          <figcaption className="sk-text-xs-regular text-sk-text-tertiary">
            Video · {block.durationLabel} · transcript available
          </figcaption>
        </figure>
      );

    case "image":
      return (
        <figure className="flex flex-col gap-2">
          <div
            className="flex aspect-[16/7] w-full items-center justify-center rounded-xl bg-sk-bg-secondary"
            role="img"
            aria-label={block.alt}
          >
            <Icon icon={ImageIcon} size={24} className="text-sk-text-tertiary" />
          </div>
          <figcaption className="sk-text-xs-regular text-sk-text-tertiary">
            {block.caption}
          </figcaption>
        </figure>
      );

    case "file":
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sk-border-secondary bg-sk-bg-primary p-3">
          <div className="flex min-w-0 items-center gap-3">
            <Icon
              icon={FILE_ICON[block.fileKind]}
              size={18}
              className="text-sk-text-brand-secondary"
            />
            <div className="flex min-w-0 flex-col">
              <span className="sk-text-sm-semibold truncate text-sk-text-primary">
                {block.name}
              </span>
              <span className="sk-text-xs-regular text-sk-text-tertiary">{block.size}</span>
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
    <section className="flex flex-col gap-3 rounded-xl border border-sk-border-secondary bg-sk-bg-secondary p-5">
      <span className="sk-text-2xs-medium uppercase tracking-wide text-sk-text-brand-secondary">
        Quick check · not graded
      </span>
      <h3 className="sk-text-md-semibold text-sk-text-primary">{question}</h3>

      <ul className="flex flex-col gap-2">
        {options.map((o) => {
          const isPicked = o.id === picked;
          const markRight = answered && o.correct;
          const markWrong = answered && isPicked && !o.correct;
          return (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => !answered && setPicked(o.id)}
                disabled={answered}
                aria-pressed={isPicked}
                className={cn(
                  "sk-text-sm-medium flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sk-border-brand",
                  markRight
                    ? "border-sk-text-success-primary bg-sk-bg-success-primary text-sk-text-success-primary"
                    : markWrong
                      ? "border-sk-text-error-primary bg-sk-bg-error-primary text-sk-text-error-primary"
                      : cn(
                          "border-sk-border-primary bg-sk-bg-primary text-sk-text-primary",
                          answered ? "opacity-60" : "hover:bg-sk-bg-secondary",
                        ),
                )}
              >
                <span>{o.label}</span>
                {markRight ? <Icon icon={Check} size={16} /> : null}
                {markWrong ? <Icon icon={X} size={16} /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && chosen?.feedback ? (
        <p
          className={cn(
            "sk-text-sm-regular",
            isCorrect ? "text-sk-text-success-primary" : "text-sk-text-error-primary",
          )}
        >
          {chosen.feedback}
        </p>
      ) : null}
    </section>
  );
}
