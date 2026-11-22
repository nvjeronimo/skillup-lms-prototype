import * as React from "react";
import Link from "@/lib/router";
import { useRouter, useSearchParams } from "@/lib/router";
import { ArrowLeft, MessageSquare, Plus, Search } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { EmptyState } from "@/components/atoms/EmptyState";
import { SelectField } from "@/components/atoms/SelectField";
import { Button } from "@/components/atoms/Button";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Message } from "@/components/platform/course/QaTab";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import { PlatformSegmented } from "@/components/platform/PlatformSegmented";
import {
  discussionFilters,
  discussionHref,
  discussionThreads,
  type DiscussionFilter,
  type DiscussionThread,
} from "@/lib/platform/discussion";
import { coursePageHref } from "@/lib/platform/hrefs";
import { Icon } from "@/lib/icons";
import { useLmsStore } from "@/lib/store";
import { NewPostModal } from "@/components/platform/forms/NewPostModal";
import { ReportMessageModal } from "@/components/platform/forms/ReportMessageModal";
import { sessionAdditions, useSessionAdditions } from "@/lib/platform/session-additions";
import { cn } from "@/lib/utils";
import styles from "./DiscussionView.module.css";

const COURSES = [...new Map(discussionThreads.map((t) => [t.courseSlug, t.course])).entries()];

/**
 * One conversation in the inbox, after the DS Thread-Row: the course and its topic on top, the
 * flags (Question / Discussion, Answered), the title (Semibold while unread), a
 * one-line preview and the meta with the replies; the unread count on the right.
 */
function InboxRow({ thread, selected, selectedFromTablet }: { thread: DiscussionThread; selected: boolean; selectedFromTablet: boolean }) {
  const unread = thread.unread > 0;
  return (
    <li className={styles.inboxItem}>
      <Link
        href={discussionHref(thread.id)}
        scroll={false}
        aria-current={selected ? "true" : undefined}
        className={cn(
          styles.inboxRow,
          selected && styles.inboxRowSelected,
          selectedFromTablet && styles.inboxRowSelectedFromTablet,
          !selected && styles.inboxRowIdle,
        )}
      >
        <span className={styles.rowText}>
          <span className={cn("sk-text-body-small-medium", styles.oneLine, styles.subtle)}>{thread.course}</span>
          <span className={styles.flags}>
            <Badge variant="outline" color="gray">
              {thread.kind === "question" ? "Question" : "Discussion"}
            </Badge>
            {thread.answered ? (
              <Badge variant="outline" color="success">
                Answered
              </Badge>
            ) : null}
          </span>
          <span className={cn(styles.ink, unread || selected ? "sk-text-body-medium-semibold" : "sk-text-body-medium-medium")}>
            {thread.title}
          </span>
          <span className={cn("sk-text-body-small-regular", styles.oneLine, styles.muted)}>{thread.preview}</span>
          <span className={cn("sk-text-body-small-regular", styles.subtle)}>
            {thread.meta} · {thread.replies} {thread.replies === 1 ? "reply" : "replies"}
          </span>
        </span>
        {unread ? (
          <span className={cn("sk-text-body-small-semibold", styles.unread)}>
            {thread.unread}
            <span className="sk-sr-only"> unread</span>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/** A message bubble while it loads: the author line, the bubble with its ghost text, the time line. */
function MessageSkeleton({ message }: { message: DiscussionThread["messages"][number] }) {
  const bubble = (
    <div className={cn("sk-text-body-medium-regular", styles.bubbleGhost)}>
      {message.body}
    </div>
  );
  if (message.from === "learner") {
    return (
      <div aria-hidden="true" className={styles.mineSkeleton}>
        <Skeleton variant="ghost" text="body-small-medium">{message.author}</Skeleton>
        {bubble}
        <Skeleton variant="ghost" text="body-small-regular">{message.time}</Skeleton>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={styles.theirsSkeleton}>
      <Skeleton variant="circle" size={32} />
      <div className={styles.theirsSkeletonText}>
        <div className={styles.authorLine}>
          <Skeleton variant="ghost" text="body-small-medium">{message.author}</Skeleton>
          {message.label ? <SkeletonPill>{message.label}</SkeletonPill> : null}
          {message.accepted ? <SkeletonPill>Accepted answer</SkeletonPill> : null}
        </div>
        {bubble}
        <Skeleton variant="ghost" text="body-small-regular">{`${message.time}  Report`}</Skeleton>
      </div>
    </div>
  );
}

/**
 * Discussion while it loads (motion-matrix §7.9): DiscussionView's layout from the same data,
 * so it has the page's geometry: the title, its lead and New post; the inbox (search, course,
 * filter, the conversation rows as ghost lines); the open conversation (tablet up, or the one
 * in ?thread=, which on a phone is shown alone).
 */
export function DiscussionSkeleton() {
  const [threadId, setThreadId] = React.useState<string | null>(null);
  React.useEffect(() => setThreadId(new URLSearchParams(window.location.search).get("thread")), []);
  const explicit = discussionThreads.find((t) => t.id === threadId);
  const current = explicit ?? discussionThreads[0];
  return (
    <div className={styles.page}>
      <div className={cn("sk-page-stack", styles.stack)}>
        <div className={cn(styles.head, explicit && styles.phoneHidden)}>
          <div className={styles.stack1}>
            <Skeleton variant="ghost" text="headline-large-bold">Discussion across your courses.</Skeleton>
          </div>
          <SkeletonPill size="button-md" icon className={styles.newPostGhost}>New post</SkeletonPill>
        </div>
        <div className={styles.columns}>
          <div
            className={cn(
              styles.card,
              styles.listCard,
              explicit && styles.phoneHidden,
            )}
          >
            <div className={styles.tools}>
              <Skeleton variant="block" radius="control" className={styles.fieldGhost} />
              <div className={styles.stack1}>
                <Skeleton variant="ghost" text="body-small-medium">Course</Skeleton>
                <Skeleton variant="block" radius="control" className={styles.fieldGhost} />
              </div>
              <div className={styles.segmentTrack}>
                {discussionFilters.map((f) => (
                  <SkeletonPill key={f.id} size="segment" className={styles.segmentGhost}>{f.label}</SkeletonPill>
                ))}
              </div>
            </div>
            <div className={styles.rows}>
              {discussionThreads.map((t) => (
                <div key={t.id} className={styles.rowGhost}>
                  <div className={styles.rowText}>
                    <Skeleton variant="ghost" text="body-small-medium" className={styles.oneLine}>{t.course}</Skeleton>
                    <div className={styles.flags}>
                      <SkeletonPill>{t.kind === "question" ? "Question" : "Discussion"}</SkeletonPill>
                      {t.answered ? <SkeletonPill>Answered</SkeletonPill> : null}
                    </div>
                    <Skeleton variant="ghost" text={t.unread > 0 ? "body-medium-semibold" : "body-medium-medium"}>{t.title}</Skeleton>
                    <Skeleton variant="ghost" text="body-small-regular" className={styles.oneLine}>{t.preview}</Skeleton>
                    <Skeleton variant="ghost" text="body-small-regular">
                      {`${t.meta} · ${t.replies} ${t.replies === 1 ? "reply" : "replies"}`}
                    </Skeleton>
                  </div>
                  {t.unread > 0 ? <Skeleton variant="block" width={20} height={20} radius="pill" className={styles.unreadGhost} /> : null}
                </div>
              ))}
            </div>
          </div>
          <div className={cn(styles.threadColumn, explicit ? styles.threadColumnShown : styles.threadColumnFromTablet)}>
            <SkeletonPill size="button-sm" icon className={styles.backGhost}>All conversations</SkeletonPill>
            <div className={cn(styles.card, styles.threadCard)}>
              <div className={styles.threadHead}>
                <div className={styles.threadTitle}>
                  <Skeleton variant="ghost" text="body-small-medium">{`${current.course} · ${current.topic}`}</Skeleton>
                  <Skeleton variant="ghost" text="title-medium-semibold">{current.title}</Skeleton>
                </div>
              </div>
              <div className={styles.messages}>
                {current.messages.map((m) => (
                  <MessageSkeleton key={m.id} message={m} />
                ))}
              </div>
              {current.replies > current.messages.length - 1 ? (
                <div className={styles.moreReplies}>
                  <Skeleton text="body-small-regular" width="60%" />
                </div>
              ) : null}
              <div className={styles.replyBar}>
                <Skeleton variant="block" radius="control" className={cn(styles.fieldGhost, styles.fill)} />
                <SkeletonPill size="button-sm" className={styles.phoneTall}>Reply</SkeletonPill>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Discussion (proposal, 17 Oct 2026; no Figma screen yet): every course's discussions in one
 * inbox, laid out as the course's Q&A tab (list 360 / 320 beside the open conversation; mobile
 * shows one at a time, `?thread=` opens one). The list filters by state and by course and
 * searches titles and previews. "New post" and "Report" open their modals (23 Oct 2026): a new
 * post opens at the top of the inbox for the session. Replying is not built and says so. No
 * Follow / Following (Kirti removed it; Nelson, 28 Oct 2026).
 */
export function DiscussionView() {
  const params = useSearchParams();
  const threadId = params.get("thread");
  const showToast = useLmsStore((s) => s.showToast);
  const notInPrototype = (what: string) => showToast(`${what} is not part of this prototype yet`);
  const [filter, setFilter] = React.useState<DiscussionFilter>("all");
  const [course, setCourse] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [posting, setPosting] = React.useState(false);
  const [reporting, setReporting] = React.useState(false);
  const router = useRouter();
  const posted = useSessionAdditions((s) => s.posts);
  const all = React.useMemo(() => [...posted, ...discussionThreads], [posted]);

  const explicit = all.find((t) => t.id === threadId);
  const needle = query.trim().toLowerCase();
  const threads = all.filter(
    (t) =>
      (course === "all" || t.courseSlug === course) &&
      (filter === "all" ||
        (filter === "unread" && t.unread > 0) ||
        (filter === "mine" && t.mine)) &&
      (!needle || `${t.title} ${t.preview}`.toLowerCase().includes(needle)),
  );
  const current = explicit ?? threads[0] ?? all[0];

  return (
    <div className={styles.page}>
      <div className={cn("sk-page-stack", styles.stack)}>
        <div data-arrive={0} className={cn(styles.head, explicit && styles.phoneHidden)}>
          <div className={styles.stack1}>
            <h1 className={cn("sk-text-headline-large-bold", styles.ink)}>
              Discussion <span data-heading-em="" className={styles.subtle}>across your courses.</span>
            </h1>
            {/* No subtitle: there is no private learner-to-mentor channel, and Mentorship Q&A is on hold
                (Nelson, 28 Oct 2026). */}
          </div>
          <Button hierarchy="secondary" size="md" leftIcon={Plus} onClick={() => setPosting(true)} className={styles.phoneTall}>
            New post
          </Button>
        </div>

        <div className={styles.columns} data-mock="Discussions come one course at a time (Discussions API); this inbox merges them">
          <section
            data-arrive={1}
            aria-labelledby="discussion-list-title"
            className={cn(
              styles.card,
              styles.listCard,
              explicit && styles.phoneHidden,
            )}
          >
            <h2 id="discussion-list-title" className="sk-sr-only">
              Conversations
            </h2>
            <div className={styles.tools}>
              <SearchField value={query} onChange={setQuery} label="Search discussions" />
              <label className={styles.stack1}>
                <span className={cn("sk-text-body-small-medium", styles.subtle)}>Course</span>
                <SelectField
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className={cn("sk-text-body-medium-regular", styles.courseSelect)}
                >
                  <option value="all">All courses</option>
                  {COURSES.map(([slug, title]) => (
                    <option key={slug} value={slug}>
                      {title}
                    </option>
                  ))}
                </SelectField>
              </label>
              <PlatformSegmented label="Filter conversations" options={[...discussionFilters]} value={filter} onChange={setFilter} />
            </div>
            {threads.length ? (
              <ul className={styles.rows}>
                {threads.map((t) => (
                  <InboxRow key={t.id} thread={t} selected={explicit?.id === t.id} selectedFromTablet={!explicit && current.id === t.id} />
                ))}
              </ul>
            ) : (
              // The empty search or filter says what was asked and gives the way back (as My Learning).
              <div role="status">
                <EmptyState
                  icon={Search}
                  title={query.trim() ? `No conversations match “${query.trim()}”` : "No conversations here"}
                  description={
                    query.trim()
                      ? "Check the spelling or search for other words."
                      : "None of the conversations fit this course and filter."
                  }
                  action={
                    <Button
                      hierarchy="secondary"
                      size="md"
                      onClick={() => {
                        setQuery("");
                        setFilter("all");
                        setCourse("all");
                      }}
                    >
                      {query.trim() ? "Clear search" : "Show all conversations"}
                    </Button>
                  }
                  className={styles.empty}
                />
              </div>
            )}
          </section>

          <div data-arrive={2} className={cn(styles.threadColumn, explicit ? styles.threadColumnShown : styles.threadColumnFromTablet)}>
            <ButtonLink
              href={discussionHref()}
              scroll={false}
              hierarchy="link-subtle"
              size="sm"
              leftIcon={ArrowLeft}
              className={styles.back}
            >
              All conversations
            </ButtonLink>
            <section aria-labelledby="discussion-thread-title" className={cn(styles.card, styles.threadCard)}>
              <div className={styles.threadHead}>
                <div className={styles.threadTitle}>
                  <p className={cn("sk-text-body-small-medium", styles.subtle)}>
                    <Link href={coursePageHref(current.courseSlug)} className={styles.courseLink}>
                      {current.course}
                    </Link>{" "}
                    · {current.topic}
                  </p>
                  <h2 id="discussion-thread-title" className={cn("sk-text-title-medium-semibold", styles.ink)}>
                    {current.title}
                  </h2>
                </div>
              </div>
              <ol aria-label="Messages" className={styles.messages}>
                {current.messages.map((m) => (
                  <Message key={m.id} message={m} report="Report" onReport={() => setReporting(true)} />
                ))}
              </ol>
              {current.replies > current.messages.length - 1 ? (
                // The sample draws the first replies only.
                <p className={cn("sk-text-body-medium-regular", styles.moreReplies, styles.moreRepliesNote)}>
                  <Icon icon={MessageSquare} size={16} />
                  {current.replies - (current.messages.length - 1)} more{" "}
                  {current.replies - (current.messages.length - 1) === 1 ? "reply" : "replies"} in the course discussion.
                </p>
              ) : null}
              <form
                className={styles.replyBar}
                onSubmit={(e) => {
                  e.preventDefault();
                  notInPrototype("Sending a reply");
                }}
              >
                <label className={styles.replyField}>
                  <span className="sk-sr-only">Write a reply</span>
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write a reply…"
                    autoComplete="off"
                    className={cn("sk-text-body-large-regular", styles.replyInput)}
                  />
                </label>
                <Button type="submit" size="sm" className={styles.replyButton}>
                  Reply
                </Button>
              </form>
            </section>
          </div>
        </div>
      </div>

      <NewPostModal
        open={posting}
        onClose={() => setPosting(false)}
        defaultCourse={course === "all" ? undefined : course}
        onPosted={(thread) => {
          sessionAdditions.addPost(thread);
          setPosting(false);
          setFilter("all");
          setQuery("");
          setCourse("all");
          router.replace(discussionHref(thread.id), { scroll: false });
          showToast("Posted. Your cohort can reply now.");
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
