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
import { useRouter } from "next/navigation";
import { useLmsStore } from "@/lib/store";
import { AskQuestionModal } from "@/components/platform/forms/AskQuestionModal";
import { ReportMessageModal } from "@/components/platform/forms/ReportMessageModal";
import { NONE, sessionAdditions, useSessionAdditions } from "@/lib/platform/session-additions";
import { courseDetailHref, type CourseDetail, type QaMessage, type QaThread } from "@/lib/platform/course-detail";
import { staggerStyle } from "@/lib/motion/stagger";
import { cn } from "@/lib/utils";

type QaFilter = CourseDetail["qaTab"]["filters"][number]["id"];

/**
 * DS `LMS/Platform/Course-Detail/Thread-Row`: padding 12, a 1px rule under it. The flags
 * (Badge Outline sm), the title (body-medium/Semibold when selected or unread, Medium once
 * read), a one-line preview (body-small/Regular, text/muted) and the meta line (text/subtle),
 * 4 apart; an 8px dot on the right when unread. Selected is on bg/primary-soft.
 * The row opens its conversation, so it is a link.
 */
function ThreadRow({
  thread,
  href,
  selected,
  selectedFromTablet,
  className,
  style,
}: {
  thread: QaThread;
  href: string;
  /** Opened by the learner: selected on every breakpoint. */
  selected: boolean;
  /** Shown by default beside the list: selected from tablet up only (mobile shows the list alone). */
  selectedFromTablet: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const strong = selected || thread.unread;
  return (
    <li className={cn("border-b border-sko-border-subtle last:border-b-0", className)} style={style}>
      <Link
        href={href}
        scroll={false}
        aria-current={selected ? "true" : undefined}
        className={cn(
          // The DS stroke is inside the card: the side padding gives the 1px back, so the text keeps its drawn width.
          "flex items-start gap-2 px-[11px] py-3 transition-colors focus-visible:-outline-offset-2",
          selected && "bg-sko-bg-primary-soft",
          selectedFromTablet && "md:bg-sko-bg-primary-soft",
          !selected && "hover:bg-sko-bg-faint",
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-start gap-1">
            <Badge variant="outline" color="gray">
              Question
            </Badge>
            {thread.answered ? (
              <Badge variant="outline" color="success">
                Answered
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
            <span className="block size-2 rounded-pill bg-sko-bg-primary" />
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
 * sm, then the author line — name (body-small/Medium), `author_label` and "Accepted answer" (sentence case, as every Badge: Nelson, 22 Oct 2026)
 * as Badge Outline — over a bg/subtle bubble (radius 10, 2 on the bottom left), the time
 * and "Report". Bubbles hug their text up to 420px; on mobile they fill the column.
 */
export function Message({ message, report, onReport }: { message: QaMessage; report: string; onReport: () => void }) {
  if (message.from === "learner") {
    return (
      <li className="flex flex-col items-end gap-1">
        <p className="sk-text-body-small-medium text-sko-text-default">{message.author}</p>
        <p className="sk-text-body-medium-regular rounded-control rounded-br-inner bg-sko-bg-primary px-3 py-2 text-sko-text-on-primary max-md:self-stretch md:max-w-[420px]">
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
              Accepted answer
            </Badge>
          ) : null}
        </p>
        <p className="sk-text-body-medium-regular rounded-control rounded-bl-inner bg-sko-bg-subtle px-3 py-2 text-sko-text-default max-md:self-stretch md:max-w-[420px]">
          {message.body}
        </p>
        <p className="flex items-center gap-2">
          <span className="sk-text-body-small-regular text-sko-text-subtle">{message.time}</span>
          <button
            type="button"
            onClick={onReport}
            // The target is grown by the ::before band, so the 44px minimum of the larger-targets setting is not needed on the box.
            className="sk-text-body-small-regular relative text-sko-text-subtle underline underline-offset-2 transition-colors hover:text-sko-text-default before:absolute before:-inset-x-2 before:-inset-y-[13px] before:content-[''] [[data-large-targets]_&]:min-h-0 [[data-large-targets]_&]:min-w-0"
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
 * The list's search and its All / Unanswered filter work on the sample threads (no Following:
 * Kirti removed it, Nelson 29 Oct 2026).
 * Only the first thread is drawn with its messages. Ask a question and Report open their modals
 * (23 Oct 2026): an asked question opens at the top of the list for the session. Sending a
 * reply is not built: it says so in a toast.
 */
export function QaTab({ course, threadId }: { course: CourseDetail; threadId: string | null }) {
  const showToast = useLmsStore((s) => s.showToast);
  const tab = course.qaTab;
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<QaFilter>("all");
  // The list animates only right after the learner changes the filter, and the classes come off
  // when its last row has risen: showing the tab again, or coming back from a thread on mobile
  // (the list is display:none meanwhile, which would restart an animation), never replays it.
  const [filterChanged, setFilterChanged] = React.useState(false);
  const [reply, setReply] = React.useState("");
  const notInPrototype = (what: string) => showToast(`${what} is not part of this prototype yet`);
  const router = useRouter();
  const [asking, setAsking] = React.useState(false);
  const [reporting, setReporting] = React.useState(false);
  const asked = useSessionAdditions((s) => s.questions[course.slug] ?? NONE);
  const all = React.useMemo(() => [...asked, ...tab.threads], [asked, tab.threads]);

  const explicit = all.find((t) => t.id === threadId);
  const current = explicit ?? all[0];
  const needle = query.trim().toLowerCase();
  const threads = all.filter(
    (t) =>
      (filter === "all" || !t.answered) &&
      (!needle || t.title.toLowerCase().includes(needle) || t.preview.toLowerCase().includes(needle)),
  );

  return (
    <div className="flex flex-col gap-layout-stack">
      <div className={cn("flex flex-col gap-1", explicit && "max-md:sr-only")}>
        <h2 className="sk-text-headline-medium-bold text-sko-text-default">{tab.title}</h2>
        {/* Nelson, 28 Oct 2026: Open edX has no private messages, so Q&A is the learner's question
            posts in the course discussions, public to the course and answered by its mentors
            (LMS-HANDOFF/edx-mentorship-qa.md, option D). It replaces "Private between you and your
            mentor" (21 Oct 2026). */}
        <p className="sk-text-body-medium-regular text-sko-text-muted">
          Your questions to the course mentors. They are posts in the course discussions, so everyone in the
          course can read them and the answers. For open conversations, use{" "}
          <Link href="/platform/discussion" className="text-sko-text-primary underline underline-offset-2">
            Discussion
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <section
          aria-labelledby="qa-list-title"
          className={cn(
            "overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page md:w-[320px] md:shrink-0 lg:w-[360px]",
            explicit && "max-md:hidden",
          )}
        >
          <div className="flex items-center justify-between gap-2 bg-sko-bg-subtle px-[11px] py-3">
            <h3 id="qa-list-title" className="sk-text-body-medium-semibold text-sko-text-default">
              {tab.listTitle}
            </h3>
            <Button hierarchy="secondary" size="sm" onClick={() => setAsking(true)} className="max-md:h-11">
              {tab.ask}
            </Button>
          </div>
          <div className="px-[11px] py-3">
            <SearchField value={query} onChange={setQuery} label={tab.search} />
          </div>
          <div className="px-[11px] pb-3">
            {/* DS `Button group` v2.0 (11 Oct 2026): a bg/muted track, padding 4, gap 2, radius 8; the pressed
                segment is a pill on bg/page with 1px border/subtle and text/primary. Until then the segments
                were joined and the pressed one sat on bg/primary. */}
            <div
              role="group"
              aria-label="Filter questions"
              className="inline-flex gap-0.5 rounded-track bg-sko-bg-track p-1"
            >
              {tab.filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => {
                    if (item.id !== filter) setFilterChanged(true);
                    setFilter(item.id);
                  }}
                  className={cn(
                    "sk-text-body-medium-semibold h-8 rounded-control border px-4 transition-colors max-md:h-11",
                    filter === item.id
                      ? "border-sko-border-subtle bg-sko-bg-page text-sko-text-primary"
                      : "border-transparent text-sko-text-subtle hover:bg-sko-bg-subtle hover:text-sko-text-default",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {/* A new filter cross-fades the list; up to eight rows rise one after the other (as My Learning). */}
          <div
            key={filter}
            className={filterChanged ? "sk-animate-fade sk-enter-only" : undefined}
            onAnimationEnd={(e) => {
              const last = e.currentTarget.querySelector("li:last-child");
              if (e.target === (last ?? e.currentTarget)) setFilterChanged(false);
            }}
          >
            {threads.length ? (
              <ul className="border-t border-sko-border-subtle">
                {threads.map((thread, i) => (
                  <ThreadRow
                    key={thread.id}
                    thread={thread}
                    href={courseDetailHref(course.slug, "qa", thread.id)}
                    selected={explicit?.id === thread.id}
                    selectedFromTablet={!explicit && current.id === thread.id}
                    className={filterChanged ? "sk-animate-rise sk-rise-nudge sk-enter-only" : undefined}
                    style={filterChanged ? staggerStyle(i, threads.length) : undefined}
                  />
                ))}
              </ul>
            ) : (
              <p role="status" className="sk-text-body-medium-regular border-t border-sko-border-subtle p-3 text-sko-text-subtle">
                No questions match.
              </p>
            )}
          </div>
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
            className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page"
          >
            <div className="flex items-start gap-2 bg-sko-bg-subtle p-3 md:items-center">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* The DS texts are 307 and 316 wide inside the header, so both wrap as drawn. */}
                <h3 id="qa-thread-title" className="sk-text-body-medium-semibold text-sko-text-default md:max-w-[307px]">
                  {current.title}
                </h3>
                <p className="sk-text-body-small-regular text-sko-text-subtle md:max-w-[316px]">
                  {/* The mentor and the Staff label Open edX shows on a course-team answer; no reply time,
                      which the platform does not know. */}
                  {`${tab.mentorLine.split(" · ")[0]} · Staff · question post, visible to the course`}
                </p>
              </div>
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
                    onReport={() => setReporting(true)}
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
                <label className="flex h-11 min-w-0 flex-1 items-center rounded-control border border-sko-border-default bg-sko-bg-page px-3 shadow-sm transition-[border-color,box-shadow] focus-within:border-sko-border-primary focus-within:ring-1 focus-within:ring-sko-border-primary md:h-10">
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
                <input type="checkbox" className="size-[13px] rounded-inner accent-[var(--color-bg-primary)]" />
                {tab.anonymous}
              </label>
            </form>
          </section>
        </div>
      </div>

      <AskQuestionModal
        course={course}
        open={asking}
        onClose={() => setAsking(false)}
        onAsked={(thread) => {
          sessionAdditions.addQuestion(course.slug, thread);
          setAsking(false);
          setFilter("all");
          setQuery("");
          router.replace(courseDetailHref(course.slug, "qa", thread.id), { scroll: false });
          showToast("Question posted in the course discussions.");
        }}
      />
      <ReportMessageModal
        open={reporting}
        onClose={() => setReporting(false)}
        onReported={() => {
          setReporting(false);
          showToast("Thanks. The course team will review this message.");
        }}
      />
    </div>
  );
}
