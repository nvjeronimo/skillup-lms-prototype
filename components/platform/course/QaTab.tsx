"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import { CONTENT_PENDING } from "@/lib/platform/program";
import { useLmsStore } from "@/lib/store";
import { courseDetailHref, type CourseDetail, type QaMessage, type QaThread } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";

type QaFilter = CourseDetail["qaTab"]["filters"][number]["id"];

/**
 * DS `LMS/Platform/Course-Detail/Thread-Row`: padding 12, a 1px rule under it. The flags
 * (Badge v2 Outline sm), the title (body-medium/Semibold when selected or unread, Medium once
 * read), a one-line preview (body-small/Regular, text/muted) and the meta line (text/subtle),
 * 4 apart; an 8px dot on the right when unread. Selected is on bg/primary-soft.
 * The row opens its conversation, so it is a link.
 */
function ThreadRow({
  thread,
  href,
  selected,
  selectedFromTablet,
}: {
  thread: QaThread;
  href: string;
  /** Opened by the learner: selected on every breakpoint. */
  selected: boolean;
  /** Shown by default beside the list: selected from tablet up only (mobile shows the list alone). */
  selectedFromTablet: boolean;
}) {
  const strong = selected || thread.unread;
  return (
    <li className="border-b border-sko-border-subtle last:border-b-0">
      <Link
        href={href}
        scroll={false}
        aria-current={selected ? "true" : undefined}
        className={cn(
          // The DS stroke is inside the card: the side padding gives the 1px back, so the text keeps its drawn width.
          "flex items-start gap-2 px-[11px] py-3 focus-visible:-outline-offset-2",
          selected && "bg-sko-bg-primary-soft",
          selectedFromTablet && "md:bg-sko-bg-primary-soft",
          !selected && "hover:bg-sko-bg-faint",
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-start gap-1">
            <Badge variant="outline" color="gray">
              QUESTION
            </Badge>
            {thread.answered ? (
              <Badge variant="outline" color="success">
                ANSWERED
              </Badge>
            ) : null}
            {thread.following ? (
              <Badge variant="outline" color="gray">
                FOLLOWING
              </Badge>
            ) : null}
          </span>
          {/* The DS text styles are not responsive: the default-open row is Medium on mobile, Semibold beside its conversation. */}
          {selectedFromTablet && !strong ? (
            <>
              <span className="sk-text-body-medium-medium text-sko-text-default md:hidden">{thread.title}</span>
              <span aria-hidden className="sk-text-body-medium-semibold hidden text-sko-text-default md:inline">
                {thread.title}
              </span>
            </>
          ) : (
            <span
              className={cn("text-sko-text-default", strong ? "sk-text-body-medium-semibold" : "sk-text-body-medium-medium")}
            >
              {thread.title}
            </span>
          )}
          <span className="sk-text-body-small-regular truncate text-sko-text-muted">{thread.preview}</span>
          <span className="sk-text-body-small-regular text-sko-text-subtle">{thread.meta}</span>
        </span>
        {thread.unread ? (
          <span className="pt-2">
            <span className="block size-2 rounded-full bg-sko-bg-primary" />
            <span className="sr-only">Unread</span>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Message`. Learner: right-aligned, "You" over a bg/primary
 * bubble (text/on-primary; radius 10, 2 on the bottom right) and the time. Mentor: DS Avatar
 * sm, then the author line — name (body-small/Medium), `author_label` and "ACCEPTED ANSWER"
 * as Badge v2 Outline — over a bg/subtle bubble (radius 10, 2 on the bottom left), the time
 * and "Report". Bubbles hug their text up to 420px; on mobile they fill the column.
 */
function Message({ message, report, onReport }: { message: QaMessage; report: string; onReport: () => void }) {
  if (message.from === "learner") {
    return (
      <li className="flex flex-col items-end gap-1">
        <p className="sk-text-body-small-medium text-sko-text-default">{message.author}</p>
        <p className="sk-text-body-medium-regular rounded-[10px] rounded-br-sm bg-sko-bg-primary px-3 py-2 text-sko-text-on-primary max-md:self-stretch md:max-w-[420px]">
          {message.body}
        </p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">{message.time}</p>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2">
      <Avatar name={message.author} size="sm" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="flex flex-wrap items-center gap-1">
          <span className="sk-text-body-small-medium text-sko-text-default">{message.author}</span>
          {message.label ? (
            <Badge variant="outline" color="gray">
              {message.label}
            </Badge>
          ) : null}
          {message.accepted ? (
            <Badge variant="outline" color="success">
              ACCEPTED ANSWER
            </Badge>
          ) : null}
        </p>
        <p className="sk-text-body-medium-regular rounded-[10px] rounded-bl-sm bg-sko-bg-subtle px-3 py-2 text-sko-text-default max-md:self-stretch md:max-w-[420px]">
          {message.body}
        </p>
        <p className="flex items-center gap-2">
          <span className="sk-text-body-small-regular text-sko-text-subtle">{message.time}</span>
          <button
            type="button"
            onClick={onReport}
            // The target is grown by the ::before band, so the 44px minimum of the larger-targets setting is not needed on the box.
            className="sk-text-body-small-regular relative text-sko-text-subtle underline underline-offset-2 hover:text-sko-text-default before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] [[data-large-targets]_&]:min-h-0 [[data-large-targets]_&]:min-w-0"
          >
            {report}
          </button>
        </p>
      </div>
    </li>
  );
}

/**
 * Mentorship Q&A tab (desktop 6406:44434, tablet 6406:44986, mobile list 6406:45459 and
 * mobile conversation 6418:127007): the heading, then the list of the learner's questions
 * (360 wide on desktop, 320 on tablet) beside the open conversation, 16 apart.
 * Mobile shows one at a time: the list, and — once a question is opened (`?thread=`) — the
 * conversation alone under a "Your questions" back link; the page hides the course header
 * and the tab bar for that view, as drawn.
 *
 * The list's search and its All / Unanswered / Following filter work on the sample threads.
 * Only the first thread is drawn with its messages. Sending a reply, asking a question,
 * following and reporting are not built: they say so in a toast.
 */
export function QaTab({ course, threadId }: { course: CourseDetail; threadId: string | null }) {
  const showToast = useLmsStore((s) => s.showToast);
  const tab = course.qaTab;
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<QaFilter>("all");
  const [reply, setReply] = React.useState("");
  const notInPrototype = (what: string) => showToast(`${what} is not part of this prototype yet`);

  const explicit = tab.threads.find((t) => t.id === threadId);
  const current = explicit ?? tab.threads[0];
  const needle = query.trim().toLowerCase();
  const threads = tab.threads.filter(
    (t) =>
      (filter === "all" || (filter === "unanswered" ? !t.answered : t.following)) &&
      (!needle || t.title.toLowerCase().includes(needle) || t.preview.toLowerCase().includes(needle)),
  );

  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <h2 className={cn("sk-text-headline-medium-bold text-sko-text-default", explicit && "max-md:sr-only")}>
        {tab.title}
      </h2>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <section
          aria-labelledby="qa-list-title"
          className={cn(
            "overflow-hidden rounded-[10px] border border-sko-border-subtle bg-sko-bg-page md:w-[320px] md:shrink-0 lg:w-[360px]",
            explicit && "max-md:hidden",
          )}
        >
          <div className="flex items-center justify-between gap-2 bg-sko-bg-subtle px-[11px] py-3">
            <h3 id="qa-list-title" className="sk-text-body-medium-semibold text-sko-text-default">
              {tab.listTitle}
            </h3>
            <Button hierarchy="secondary" size="sm" onClick={() => notInPrototype(tab.ask)} className="max-md:h-11">
              {tab.ask}
            </Button>
          </div>
          <div className="px-[11px] py-3">
            <SearchField value={query} onChange={setQuery} label={tab.search} />
          </div>
          <div className="px-[11px] pb-3">
            {/* DS `Button group`: 40px segments, 1px border/default, radius 8; the pressed one on bg/primary
                with text/on-primary (DS change of 10 Oct 2026; it was bg/subtle, hard to tell apart). */}
            <div
              role="group"
              aria-label="Filter questions"
              className="inline-flex overflow-hidden rounded-lg border border-sko-border-default shadow-sm"
            >
              {tab.filters.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "sk-text-body-medium-semibold h-10 px-4 focus-visible:-outline-offset-2 max-md:h-11",
                    index > 0 && "border-l border-sko-border-default",
                    filter === item.id
                      ? "bg-sko-bg-primary text-sko-text-on-primary"
                      : "bg-sko-bg-page text-sko-text-muted hover:bg-sko-bg-faint hover:text-sko-text-default",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {threads.length ? (
            <ul className="border-t border-sko-border-subtle">
              {threads.map((thread) => (
                <ThreadRow
                  key={thread.id}
                  thread={thread}
                  href={courseDetailHref(course.slug, "qa", thread.id)}
                  selected={explicit?.id === thread.id}
                  selectedFromTablet={!explicit && current.id === thread.id}
                />
              ))}
            </ul>
          ) : (
            <p role="status" className="sk-text-body-medium-regular border-t border-sko-border-subtle p-3 text-sko-text-subtle">
              No questions match.
            </p>
          )}
        </section>

        <div className={cn("min-w-0 flex-1 flex-col gap-4", explicit ? "flex" : "hidden md:flex")}>
          <ButtonLink
            href={courseDetailHref(course.slug, "qa")}
            scroll={false}
            hierarchy="link-subtle"
            size="sm"
            leftIcon={ArrowLeft}
            className="self-start !border-b-0 max-md:min-h-11 md:hidden"
          >
            {tab.back}
          </ButtonLink>

          <section
            aria-labelledby="qa-thread-title"
            className="overflow-hidden rounded-[10px] border border-sko-border-subtle bg-sko-bg-page"
          >
            <div className="flex items-start gap-2 bg-sko-bg-subtle p-3 md:items-center">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* The DS texts are 307 and 316 wide inside the header, so both wrap as drawn. */}
                <h3 id="qa-thread-title" className="sk-text-body-medium-semibold text-sko-text-default md:max-w-[307px]">
                  {current.title}
                </h3>
                <p className="sk-text-body-small-regular text-sko-text-subtle md:max-w-[316px]">{tab.mentorLine}</p>
              </div>
              <Button
                hierarchy="secondary"
                size="sm"
                aria-pressed={current.following}
                onClick={() => notInPrototype("Following a question")}
                className="shrink-0 max-md:h-11"
              >
                {current.following ? tab.following : "Follow"}
              </Button>
              <Button
                hierarchy="tertiary"
                size="sm"
                iconOnly
                aria-label="More actions: copy link, report"
                onClick={() => notInPrototype("The question menu")}
                className="shrink-0 ring-1 ring-inset ring-sko-border-default max-md:size-11"
              >
                <MoreHorizontal size={20} aria-hidden />
              </Button>
            </div>

            {current.messages?.length ? (
              <ol aria-label="Messages" className="flex flex-col gap-4 p-4 md:p-5 lg:p-6">
                {current.messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    report={tab.report}
                    onReport={() => notInPrototype("Reporting a message")}
                  />
                ))}
              </ol>
            ) : (
              <p className="sk-text-body-medium-regular p-4 text-sko-text-subtle md:p-5 lg:p-6">{CONTENT_PENDING}</p>
            )}

            <form
              className="flex flex-col gap-2 border-t border-sko-border-subtle p-3"
              onSubmit={(event) => {
                event.preventDefault();
                notInPrototype("Sending a reply");
              }}
            >
              <div className="flex items-center gap-2">
                <label className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-sko-border-default bg-sko-bg-page px-3 shadow-sm focus-within:border-sko-border-primary focus-within:ring-1 focus-within:ring-sko-border-primary md:h-10">
                  <span className="sr-only">{tab.replyPlaceholder}</span>
                  <input
                    type="text"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder={tab.replyPlaceholder}
                    autoComplete="off"
                    className="sk-text-body-large-regular min-w-0 flex-1 bg-transparent text-sko-text-default placeholder:text-sko-text-placeholder focus:outline-none"
                  />
                </label>
                <Button type="submit" size="sm" className="shrink-0 max-md:h-11">
                  {tab.send}
                </Button>
              </div>
              <label className="sk-text-body-small-regular flex items-center gap-1 self-start text-sko-text-subtle max-md:min-h-11">
                <input type="checkbox" className="size-[13px] rounded-sm accent-[var(--color-bg-primary)]" />
                {tab.anonymous}
              </label>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
