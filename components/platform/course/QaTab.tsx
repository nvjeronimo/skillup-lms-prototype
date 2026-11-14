import * as React from "react";
import Link from "@/lib/router";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import { CONTENT_PENDING } from "@/lib/platform/program";
import { useRouter } from "@/lib/router";
import { useLmsStore } from "@/lib/store";
import { AskQuestionModal } from "@/components/platform/forms/AskQuestionModal";
import { ReportMessageModal } from "@/components/platform/forms/ReportMessageModal";
import { NONE, sessionAdditions, useSessionAdditions } from "@/lib/platform/session-additions";
import { courseDetailHref, type CourseDetail, type QaMessage, type QaThread } from "@/lib/platform/course-detail";
import { staggerStyle } from "@/lib/motion/stagger";
import { cn } from "@/lib/utils";
import styles from "./QaTab.module.css";

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
    <li className={cn(styles.thread, className)} style={style}>
      <Link
        href={href}
        scroll={false}
        aria-current={selected ? "true" : undefined}
        className={cn(
          // The DS stroke is inside the card: the side padding gives the 1px back, so the text keeps its drawn width.
          styles.threadLink,
          selected && styles.selected,
          selectedFromTablet && styles.selectedFromTablet,
          !selected && styles.hoverable,
        )}
      >
        <span className={styles.threadText}>
          <span className={styles.flags}>
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
              <span className={`sk-text-body-medium-medium ${styles.default} ${styles.phoneOnly}`}>{thread.title}</span>
              <span aria-hidden className={`sk-text-body-medium-semibold ${styles.wideInline} ${styles.default}`}>
                {thread.title}
              </span>
            </>
          ) : (
            <span
              className={cn(styles.default, strong ? "sk-text-body-medium-semibold" : "sk-text-body-medium-medium")}
            >
              {thread.title}
            </span>
          )}
          <span className={`sk-text-body-small-regular ${styles.preview}`}>{thread.preview}</span>
          <span className={`sk-text-body-small-regular ${styles.subtle}`}>{thread.meta}</span>
        </span>
        {thread.unread ? (
          <span className={styles.unreadWrap}>
            <span className={styles.unreadDot} />
            <span className="sk-sr-only">Unread</span>
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
      <li className={styles.learner}>
        <p className={`sk-text-body-small-medium ${styles.default}`}>{message.author}</p>
        <p className={`sk-text-body-medium-regular ${styles.bubble} ${styles.bubbleLearner}`}>
          {message.body}
        </p>
        <p className={`sk-text-body-small-regular ${styles.subtle}`}>{message.time}</p>
      </li>
    );
  }
  return (
    <li className={styles.mentor}>
      <Avatar name={message.author} size="sm" />
      <div className={styles.mentorBody}>
        <p className={styles.authorLine}>
          <span className={`sk-text-body-small-medium ${styles.default}`}>{message.author}</span>
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
        <p className={`sk-text-body-medium-regular ${styles.bubble} ${styles.bubbleMentor}`}>
          {message.body}
        </p>
        <p className={styles.messageFoot}>
          <span className={`sk-text-body-small-regular ${styles.subtle}`}>{message.time}</span>
          <button
            type="button"
            onClick={onReport}
            // The target is grown by the ::before band, so the 44px minimum of the larger-targets setting is not needed on the box.
            className={`sk-text-body-small-regular ${styles.report}`}
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
    <div className={styles.tab}>
      <div className={cn(styles.intro, explicit && styles.introHidden)}>
        <h2 className={`sk-text-headline-medium-bold ${styles.default}`}>{tab.title}</h2>
        {/* Nelson, 28 Oct 2026: Open edX has no private messages, so Q&A is the learner's question
            posts in the course discussions, public to the course and answered by its mentors
            (LMS-HANDOFF/edx-mentorship-qa.md, option D). It replaces "Private between you and your
            mentor" (21 Oct 2026). */}
        <p className={`sk-text-body-medium-regular ${styles.muted}`}>
          Your questions to the course mentors. They are posts in the course discussions, so everyone in the
          course can read them and the answers. For open conversations, use{" "}
          <Link href="/platform/discussion" className={styles.inlineLink}>
            Discussion
          </Link>
          .
        </p>
      </div>

      <div className={styles.layout}>
        <section
          aria-labelledby="qa-list-title"
          className={cn(
            styles.list,
            explicit && styles.hideOnPhone,
          )}
        >
          <div className={styles.listHead}>
            <h3 id="qa-list-title" className={`sk-text-body-medium-semibold ${styles.default}`}>
              {tab.listTitle}
            </h3>
            <Button hierarchy="secondary" size="sm" onClick={() => setAsking(true)} className={styles.touchHeight}>
              {tab.ask}
            </Button>
          </div>
          <div className={styles.listSearch}>
            <SearchField value={query} onChange={setQuery} label={tab.search} />
          </div>
          <div className={styles.listFilters}>
            {/* DS `Button group` v2.0 (11 Oct 2026): a bg/muted track, padding 4, gap 2, radius 8; the pressed
                segment is a pill on bg/page with 1px border/subtle and text/primary. Until then the segments
                were joined and the pressed one sat on bg/primary. */}
            <div
              role="group"
              aria-label="Filter questions"
              className={styles.segments}
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
                    "sk-text-body-medium-semibold",
                    styles.segment,
                    filter === item.id ? styles.segmentOn : styles.segmentOff,
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
              <ul className={styles.threads}>
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
              <p role="status" className={`sk-text-body-medium-regular ${styles.empty}`}>
                No questions match.
              </p>
            )}
          </div>
        </section>

        <div className={cn(styles.conversation, explicit ? styles.shown : styles.shownFromTablet)}>
          <ButtonLink
            href={courseDetailHref(course.slug, "qa")}
            scroll={false}
            hierarchy="link-subtle"
            size="sm"
            leftIcon={ArrowLeft}
            className={styles.back}
          >
            {tab.back}
          </ButtonLink>

          <section
            aria-labelledby="qa-thread-title"
            className={styles.threadCard}
          >
            <div className={styles.threadHead}>
              <div className={styles.threadHeading}>
                {/* Title and meta fill the header up to the menu button (Nelson, 3 Nov 2026; the DS
                    texts were 307 and 316 wide, which wrapped short titles with room to spare). */}
                <h3 id="qa-thread-title" className={`sk-text-body-medium-semibold ${styles.default}`}>
                  {current.title}
                </h3>
                <p className={`sk-text-body-small-regular ${styles.subtle}`}>
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
                className={styles.menuButton}
              >
                <MoreHorizontal size={20} aria-hidden />
              </Button>
            </div>

            {current.messages?.length ? (
              <ol aria-label="Messages" className={styles.messages}>
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
              <p className={`sk-text-body-medium-regular ${styles.pending}`}>{CONTENT_PENDING}</p>
            )}

            <form
              className={styles.reply}
              onSubmit={(event) => {
                event.preventDefault();
                notInPrototype("Sending a reply");
              }}
            >
              <div className={styles.replyRow}>
                <label className={styles.replyField}>
                  <span className="sk-sr-only">{tab.replyPlaceholder}</span>
                  <input
                    type="text"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder={tab.replyPlaceholder}
                    autoComplete="off"
                    className={`sk-text-body-large-regular ${styles.replyInput}`}
                  />
                </label>
                <Button type="submit" size="sm" className={styles.send}>
                  {tab.send}
                </Button>
              </div>
              <label className={`sk-text-body-small-regular ${styles.anonymous}`}>
                <input type="checkbox" className={styles.checkbox} />
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
