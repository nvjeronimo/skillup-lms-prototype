"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { CompletionStatus } from "@/components/atoms/CompletionStatus";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { CONTENT_PENDING } from "@/lib/platform/program";
import type { CourseModule, CourseTopic } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";

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
        "sk-text-body-medium-semibold flex size-8 shrink-0 items-center justify-center rounded-full",
        mod.state === "complete" && "bg-sko-bg-success text-sko-icon-on-success",
        mod.state === "incomplete" && "bg-sko-bg-primary-soft text-sko-text-on-primary-soft",
        mod.state === "locked" && "bg-sko-bg-subtle text-sko-text-subtle",
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
        "flex items-start gap-2 py-3 md:items-center md:py-4",
        // The DS rule is inside the row: the 1px comes off the bottom padding.
        !last && "border-b border-dashed border-sko-border-subtle pb-[11px] md:pb-[15px]",
      )}
    >
      <span className="flex h-6 shrink-0 items-center">
        <CompletionStatus state={topic.state} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1 md:flex-row md:items-center md:gap-2">
        {locked ? (
          <span className="sk-text-body-large-medium min-w-0 text-sko-text-subtle md:flex-1">{topic.title}</span>
        ) : (
          <span className="min-w-0 md:flex-1">
            <Link
              href={href}
              className="sk-text-body-large-medium text-sko-text-on-primary-soft underline underline-offset-2 hover:text-sko-text-primary"
            >
              {topic.title}
            </Link>
          </span>
        )}
        <span className="flex shrink-0 items-center gap-2">
          <TopicTypeBadge type={topic.type} />
          <span className="sk-text-body-small-regular text-sko-text-subtle">{topic.duration}</span>
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
  topicHref: string;
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
    <li className="rounded-[10px] border border-sko-border-subtle bg-sko-bg-page">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            // The DS stroke is inside the row and the CSS border is outside the padding: 15 + 1 = the DS 16.
            "group flex w-full items-center gap-3 rounded-[9px] p-[15px] text-left focus-visible:-outline-offset-2",
            open && "rounded-b-none border-b border-sko-border-subtle",
          )}
        >
          <ModuleNumber mod={mod} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="sk-text-body-large-semibold text-sko-text-default">{mod.title}</span>
            <span className="sk-text-body-small-regular flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sko-text-subtle">
              <span>{mod.topicCount}</span>
              <span aria-hidden>·</span>
              <span>{mod.duration}</span>
            </span>
            {locked && mod.lockReason ? (
              <span className="sk-text-body-small-regular text-sko-text-subtle lg:sr-only">{mod.lockReason}</span>
            ) : null}
          </span>
          <span className="flex shrink-0 items-center gap-0.5">
            {locked ? (
              <span className="relative flex size-8 items-center justify-center rounded-full bg-sko-bg-muted text-sko-icon-muted">
                <Icon icon={Lock} size={13} aria-hidden />
                {mod.lockReason ? (
                  <span
                    aria-hidden
                    className="sk-text-body-small-semibold pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-max max-w-[300px] -translate-x-1/2 rounded-lg bg-sko-bg-inverse px-3 py-2 text-center text-sko-text-on-inverse lg:group-hover:block lg:group-focus-visible:block"
                  >
                    <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[1px] bg-sko-bg-inverse" />
                    {mod.lockReason}
                  </span>
                ) : null}
              </span>
            ) : null}
            <Icon
              icon={ChevronDown}
              size={20}
              aria-hidden
              className={cn("text-sko-icon-faint transition-transform", open && "rotate-180")}
            />
          </span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="px-[15px] py-1 md:px-[19px]">
        {mod.lessons?.length ? (
          mod.lessons.map((lesson) => (
            <React.Fragment key={lesson.id}>
              {/* DS `LMS / Lesson Header`: 26px on desktop and tablet, 34px on mobile. */}
              <h4 className="sk-text-body-small-medium px-3 py-2 text-sko-text-muted md:pb-0 md:pr-0">{lesson.label}</h4>
              <ul>
                {lesson.topics.map((topic) => (
                  <TopicRow key={topic.id} topic={topic} href={topicHref} last={topic.id === lastTopicId} />
                ))}
              </ul>
            </React.Fragment>
          ))
        ) : (
          <p className="sk-text-body-medium-regular py-3 text-sko-text-subtle">{CONTENT_PENDING}</p>
        )}
      </div>
    </li>
  );
}

/**
 * The syllabus of the Course tab (Modules, 6406:39271): the module rows, 12 apart, as an
 * ordered list. Each row is an independent accordion; the module in progress opens with the
 * page, as drawn. The screens draw the other three closed and give them no topics.
 */
export function ModuleList({ modules, topicHref }: { modules: CourseModule[]; topicHref: string }) {
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
      className="flex flex-col gap-3"
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
