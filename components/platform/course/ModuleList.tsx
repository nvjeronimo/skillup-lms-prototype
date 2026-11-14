import * as React from "react";
import Link from "@/lib/router";
import { Check, ChevronDown, Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { CONTENT_PENDING } from "@/lib/platform/program";
import type { CourseModule, CourseTopic } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";
import { Collapse } from "@/components/atoms/Collapse";
import styles from "./ModuleList.module.css";

/**
 * DS `LMS/Platform/Course-Detail/Module-Number`: a 32px circle with the position — bg/primary-soft
 * + text/on-primary-soft, bg/subtle + text/subtle when locked — or a 16px check on bg/success
 * once the module is complete.
 */
function ModuleNumber({ mod }: { mod: CourseModule }) {
  return (
    <span
      aria-hidden
      className={cn(
        "sk-text-body-medium-semibold",
        styles.number,
        mod.state === "complete" && styles.numberComplete,
        mod.state === "incomplete" && styles.numberIncomplete,
        mod.state === "locked" && styles.numberLocked,
      )}
    >
      {mod.state === "complete" ? <Icon icon={Check} size={16} /> : mod.number}
    </span>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Topic-Row`. Desktop and tablet (Breakpoint=Desktop): one
 * 56px line — status, title, type badge, duration, 8 apart, padding 16/0. Mobile: the title
 * on its own line with the type and the duration under it, padding 12/0.
 * The title (body-large/Medium) is an underlined link on text/on-primary-soft; a locked topic
 * is plain text on text/subtle. Rows are split by a 1px dashed rule.
 */
function TopicRow({ topic, href, last }: { topic: CourseTopic; href: string; last: boolean }) {
  const locked = topic.state === "Locked";
  return (
    <li
      className={cn(
        // relative: the topic link's ::after stretches over the row, so the whole row is the target
        // (72–96 px tall on mobile) and not only the title's 20 px line.
        "sk-press-card",
        styles.topic,
        // The DS rule is inside the row: the 1px comes off the bottom padding.
        !last && styles.topicRuled,
      )}
    >
      <span className={styles.status}>
        <CompletionStatus state={topic.state} />
      </span>
      <div className={styles.topicBody}>
        {locked ? (
          <span className={`sk-text-body-large-medium ${styles.topicTitle} ${styles.subtle}`}>{topic.title}</span>
        ) : (
          <span className={styles.topicTitle}>
            <Link
              href={href}
              className={`sk-text-body-large-medium ${styles.topicLink}`}
            >
              {topic.title}
            </Link>
          </span>
        )}
        <span className={styles.topicMeta}>
          <TopicTypeBadge type={topic.type} />
          <span className={`sk-text-body-small-regular ${styles.subtle}`}>{topic.duration}</span>
        </span>
      </div>
    </li>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Module-Row` (6406:39271): one bordered card (bg/page,
 * border/subtle, radius 10) with the Header — Module number, title (body-large/Semibold)
 * over the Meta line (body-small/Regular, text/subtle), 20px chevron — and, when open, the
 * Topics slot under a 1px rule: an `LMS / Lesson Header` per lesson and its topic rows.
 * A locked module shows the DS Lock (32px, bg/muted) before the chevron. Its reason is text
 * under the meta line on tablet and mobile (touch) and a tooltip under the lock on desktop,
 * shown on hover and on keyboard focus; the sentence stays in the button's name either way.
 */
function ModuleRow({
  mod,
  topicHref,
  open,
  onToggle,
}: {
  mod: CourseModule;
  topicHref: (topicId: string) => string;
  open: boolean;
  onToggle: () => void;
}) {
  const uid = React.useId();
  const buttonId = `${uid}-header`;
  const panelId = `${uid}-panel`;
  const locked = mod.state === "locked";
  const topics = mod.lessons?.flatMap((lesson) => lesson.topics) ?? [];
  const lastTopicId = topics[topics.length - 1]?.id;

  return (
    <li className={styles.module}>
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            // The DS stroke is inside the row and the CSS border is outside the padding: 15 + 1 = the DS 16.
            styles.header,
            open && styles.headerOpen,
          )}
        >
          <ModuleNumber mod={mod} />
          <span className={styles.heading}>
            <span className={`sk-text-body-large-semibold ${styles.default}`}>{mod.title}</span>
            <span className={`sk-text-body-small-regular ${styles.meta}`}>
              <span>{mod.topicCount}</span>
              <span aria-hidden data-invented="effort: no module durations authored in Open edX">·</span>
              <span data-invented="effort: no module durations authored in Open edX">{mod.duration}</span>
            </span>
            {locked && mod.lockReason ? (
              <span className={`sk-text-body-small-regular ${styles.subtle} ${styles.lockReason}`}>{mod.lockReason}</span>
            ) : null}
          </span>
          <span className={styles.trailing}>
            {locked ? (
              <span className={styles.lock}>
                <Icon icon={Lock} size={13} aria-hidden />
                {mod.lockReason ? (
                  <span
                    aria-hidden
                    className={`sk-text-body-small-semibold ${styles.tooltip}`}
                  >
                    <span className={styles.arrow} />
                    {mod.lockReason}
                  </span>
                ) : null}
              </span>
            ) : null}
            <Icon
              icon={ChevronDown}
              size={20}
              aria-hidden
              className={cn(styles.chevron, open && styles.chevronOpen)}
            />
          </span>
        </button>
      </h3>
      <Collapse open={open} id={panelId} role="region" aria-labelledby={buttonId}>
        <div className={styles.topics}>
          {mod.lessons?.length ? (
            mod.lessons.map((lesson) => (
              <React.Fragment key={lesson.id}>
                {/* DS `LMS / Lesson Header`: 26px on desktop and tablet, 34px on mobile. */}
                {lesson.label ? (
                  <h4 className={`sk-text-body-small-medium ${styles.lesson}`}>{lesson.label}</h4>
                ) : null}
                <ul>
                  {lesson.topics.map((topic) => (
                    <TopicRow key={topic.id} topic={topic} href={topicHref(topic.id)} last={topic.id === lastTopicId} />
                  ))}
                </ul>
              </React.Fragment>
            ))
          ) : (
            <p className={`sk-text-body-medium-regular ${styles.pending}`}>{CONTENT_PENDING}</p>
          )}
        </div>
      </Collapse>
    </li>
  );
}

/**
 * The syllabus of the Course tab (Modules, 6406:39271): the module rows, 12 apart, as an
 * ordered list. Each row is an independent accordion; the module in progress opens with the
 * page, as drawn. The screens draw the other three closed and give them no topics.
 */
export function ModuleList({
  modules,
  topicHref,
}: {
  modules: CourseModule[];
  /** The player address of a topic (each row opens its own topic). */
  topicHref: (topicId: string) => string;
}) {
  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(modules.filter((m) => m.defaultOpen).map((m) => m.id)),
  );
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ol
      data-mock="Module and topic durations are null in every payload; the unlock reason is not sent by the outline"
      className={styles.list}
    >
      {modules.map((mod) => (
        <ModuleRow
          key={mod.id}
          mod={mod}
          topicHref={topicHref}
          open={open.has(mod.id)}
          onToggle={() => toggle(mod.id)}
        />
      ))}
    </ol>
  );
}
