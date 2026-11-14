import * as React from "react";
import { ImageIcon, Download, Check, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { YouTubeEmbed } from "@/components/molecules/YouTubeEmbed";
import { useLmsStore } from "@/lib/store";
import { cn, durationToSeconds } from "@/lib/utils";
import type { LessonBlock, QuizOption } from "@/lib/content";
import styles from "./LessonBlocks.module.css";

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
        "sk-text-body-small-semibold",
        styles.chip,
        tone === "success" ? styles.chipSuccess : tone === "subtle" ? styles.chipSubtle : styles.chipPrimary,
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
        styles.radio,
        checked ? styles.radioChecked : disabled ? styles.radioDisabled : styles.radioIdle,
      )}
    >
      {/* The dot is a glyph, so it takes the icon token through currentColor. */}
      {checked ? <span className={styles.radioDot} /> : null}
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
    <div className={styles.blocks}>
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
        <section className={styles.text}>
          {block.heading ? (
            // title-large/Bold under the topic title, as the Reading's sections (Nelson, 28 Oct 2026).
            <h2 className={`sk-text-title-large-bold ${styles.heading}`}>{block.heading}</h2>
          ) : null}
          {block.paragraphs.map((p, i) => (
            // Running text stops at DS Container/text-max-width, for now 1200 (Nelson, 27 Oct 2026).
            <p key={i} className={`sk-text-body-large-regular ${styles.paragraph}`}>
              {p}
            </p>
          ))}
        </section>
      );

    case "video":
      return (
        <figure className={styles.figure}>
          {/* Video unit/asset — same player component as any Video topic; a YouTube embed keeps
              YouTube's own player, untouched (decision 041). */}
          {block.youtubeId ? (
            <YouTubeEmbed videoId={block.youtubeId} title={block.title} />
          ) : (
            <EmbeddedVideo block={block} />
          )}
          <figcaption className={`sk-text-body-small-regular ${styles.caption}`}>
            {block.youtubeId
              ? `YouTube video · ${block.durationLabel} · progress not tracked`
              : `Video · ${block.durationLabel}${block.transcript?.length ? " · transcript available" : ""}`}
          </figcaption>
        </figure>
      );

    case "image":
      return (
        <figure className={styles.figure}>
          <div
            className={styles.image}
            role="img"
            aria-label={block.alt}
          >
            <Icon icon={ImageIcon} size={24} className={styles.imageIcon} />
          </div>
          <figcaption className={`sk-text-body-small-regular ${styles.caption}`}>
            {block.caption}
          </figcaption>
        </figure>
      );

    case "file":
      return (
        <div
          data-invented="files: no file card, size or Download button in an Open edX HTML component"
          className={styles.file}
        >
          <div className={styles.fileInfo}>
            <FileTypeChip label={fileExtension(block.name, block.fileKind)} tone="primary" />
            <div className={styles.fileText}>
              {/* DS body-medium/Bold — semibold until .sk-text-body-medium-bold exists (CT-22). */}
              <span className={`sk-text-body-medium-semibold ${styles.fileName}`}>
                {block.name}
              </span>
              <span className={`sk-text-body-small-regular ${styles.fileSize}`}>{block.size}</span>
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
/**
 * The player of a video block. It keeps its own time, apart from the topic video's time in
 * the store, so the caption follows the scrubber (10 Oct 2026). No transcript: no caption.
 */
function EmbeddedVideo({ block }: { block: Extract<LessonBlock, { kind: "video" }> }) {
  const [time, setTime] = React.useState(0);
  return (
    <VideoPlayer
      durationSeconds={durationToSeconds(block.durationLabel)}
      captions={block.transcript}
      currentTime={time}
      onSeek={setTime}
      onPlaybackAdvance={(_, to) => setTime(to)}
    />
  );
}

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
    <section className={styles.check}>
      <span className={`sk-text-body-small-medium ${styles.checkLabel}`}>
        Quick check · not graded
      </span>
      {/* DS body-large/Bold — semibold until .sk-text-body-large-bold exists (CT-22). */}
      <h3 className={`sk-text-body-large-semibold ${styles.checkQuestion}`}>{question}</h3>

      <ul className={styles.options}>
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
                  "sk-text-body-medium-regular",
                  styles.option,
                  markRight
                    ? styles.optionRight
                    : markWrong
                      ? styles.optionWrong
                      : cn(styles.optionIdle, !answered && styles.optionOpen),
                )}
              >
                <OptionRadio checked={isPicked} disabled={answered && !isPicked && !o.correct} />
                <span className={styles.optionLabel}>{o.label}</span>
                {missed ? <span className={`sk-text-body-small-medium ${styles.optionMissed}`}>This should be selected</span> : null}
                {markRight && isPicked ? (
                  <Icon icon={Check} size={24} className={styles.optionIconRight} />
                ) : null}
                {markWrong ? <Icon icon={X} size={24} className={styles.optionIconWrong} /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && chosen?.feedback ? (
        <p
          className={cn("sk-text-body-medium-regular", isCorrect ? styles.feedbackRight : styles.feedbackWrong)}
        >
          {chosen.feedback}
        </p>
      ) : null}
    </section>
  );
}
