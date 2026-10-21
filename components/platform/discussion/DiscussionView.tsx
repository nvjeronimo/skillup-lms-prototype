"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MessageSquare, Plus } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { SelectField } from "@/components/atoms/SelectField";
import { Button } from "@/components/atoms/Button";
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
import { cn } from "@/lib/utils";

const COURSES = [...new Map(discussionThreads.map((t) => [t.courseSlug, t.course])).entries()];

/**
 * One conversation in the inbox, after the DS Thread-Row: the course and its topic on top, the
 * flags (Question / Discussion, Answered, Following), the title (Semibold while unread), a
 * one-line preview and the meta with the replies; the unread count on the right.
 */
function InboxRow({ thread, selected, selectedFromTablet }: { thread: DiscussionThread; selected: boolean; selectedFromTablet: boolean }) {
  const unread = thread.unread > 0;
  return (
    <li className="border-b border-sko-border-subtle last:border-b-0">
      <Link
        href={discussionHref(thread.id)}
        scroll={false}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex items-start gap-2 px-[11px] py-3 transition-colors focus-visible:-outline-offset-2",
          selected && "bg-sko-bg-primary-soft",
          selectedFromTablet && "md:bg-sko-bg-primary-soft",
          !selected && "hover:bg-sko-bg-faint",
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="sk-text-body-small-medium truncate text-sko-text-subtle">{thread.course}</span>
          <span className="flex flex-wrap items-start gap-1">
            <Badge variant="outline" color="gray">
              {thread.kind === "question" ? "QUESTION" : "DISCUSSION"}
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
          <span className={cn("text-sko-text-default", unread || selected ? "sk-text-body-medium-semibold" : "sk-text-body-medium-medium")}>
            {thread.title}
          </span>
          <span className="sk-text-body-small-regular truncate text-sko-text-muted">{thread.preview}</span>
          <span className="sk-text-body-small-regular text-sko-text-subtle">
            {thread.meta} · {thread.replies} {thread.replies === 1 ? "reply" : "replies"}
          </span>
        </span>
        {unread ? (
          <span className="sk-text-body-small-semibold mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-sko-bg-primary px-1.5 text-sko-text-on-primary">
            {thread.unread}
            <span className="sr-only"> unread</span>
          </span>
        ) : null}
      </Link>
    </li>
  );
}

/**
 * Discussion (proposal, 17 Oct 2026; no Figma screen yet): every course's discussions in one
 * inbox, laid out as the course's Q&A tab (list 360 / 320 beside the open conversation; mobile
 * shows one at a time, `?thread=` opens one). The list filters by state and by course and
 * searches titles and previews. "New post" starts in a course; replying, following and
 * reporting are not built and say so.
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

  const explicit = discussionThreads.find((t) => t.id === threadId);
  const needle = query.trim().toLowerCase();
  const threads = discussionThreads.filter(
    (t) =>
      (course === "all" || t.courseSlug === course) &&
      (filter === "all" ||
        (filter === "unread" && t.unread > 0) ||
        (filter === "following" && t.following) ||
        (filter === "mine" && t.mine)) &&
      (!needle || `${t.title} ${t.preview}`.toLowerCase().includes(needle)),
  );
  const current = explicit ?? threads[0] ?? discussionThreads[0];

  return (
    <div className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        <div className={cn("flex flex-wrap items-end justify-between gap-4", explicit && "max-md:hidden")}>
          <div className="flex flex-col gap-1">
            <h1 className="sk-text-headline-large-bold text-sko-text-default">
              Discussion <span data-heading-em="" className="text-sko-text-subtle">across your courses.</span>
            </h1>
            {/* Nelson, 21 Oct 2026: Discussion is the cohort's forum; Mentorship Q&A is private. */}
            <p className="sk-text-body-medium-regular text-sko-text-muted">
              Talk with your cohort. For a private question to your mentor, use Mentorship Q&amp;A in the course.
            </p>
          </div>
          <Button hierarchy="secondary" size="md" leftIcon={Plus} onClick={() => notInPrototype("New post (choose a course, then a topic)")} className="max-md:h-11">
            New post
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start" data-mock="Discussions come one course at a time (Discussions API); this inbox merges them">
          <section
            aria-labelledby="discussion-list-title"
            className={cn(
              "overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page md:w-[340px] md:shrink-0 lg:w-[380px]",
              explicit && "max-md:hidden",
            )}
          >
            <h2 id="discussion-list-title" className="sr-only">
              Conversations
            </h2>
            <div className="flex flex-col gap-3 bg-sko-bg-subtle px-[11px] py-3">
              <SearchField value={query} onChange={setQuery} label="Search discussions" />
              <label className="flex flex-col gap-1">
                <span className="sk-text-body-small-medium text-sko-text-subtle">Course</span>
                <SelectField
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="sk-text-body-medium-regular h-11 rounded-control border border-sko-border-default bg-sko-bg-page pl-3.5 text-sko-text-default transition-colors focus:border-sko-border-primary focus:outline-none md:h-10"
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
              <ul className="border-t border-sko-border-subtle">
                {threads.map((t) => (
                  <InboxRow key={t.id} thread={t} selected={explicit?.id === t.id} selectedFromTablet={!explicit && current.id === t.id} />
                ))}
              </ul>
            ) : (
              <p role="status" className="sk-text-body-medium-regular border-t border-sko-border-subtle p-3 text-sko-text-subtle">
                No conversations match.
              </p>
            )}
          </section>

          <div className={cn("min-w-0 flex-1 flex-col gap-4", explicit ? "flex" : "hidden md:flex")}>
            <ButtonLink
              href={discussionHref()}
              scroll={false}
              hierarchy="link-subtle"
              size="sm"
              leftIcon={ArrowLeft}
              className="self-start !border-b-0 max-md:min-h-11 md:hidden"
            >
              All conversations
            </ButtonLink>
            <section aria-labelledby="discussion-thread-title" className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
              <div className="flex flex-col gap-3 bg-sko-bg-subtle p-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="sk-text-body-small-medium text-sko-text-subtle">
                    <Link href={coursePageHref(current.courseSlug)} className="hover:underline">
                      {current.course}
                    </Link>{" "}
                    · {current.topic}
                  </p>
                  <h2 id="discussion-thread-title" className="sk-text-title-medium-semibold text-sko-text-default">
                    {current.title}
                  </h2>
                </div>
                <Button
                  hierarchy="secondary"
                  size="sm"
                  aria-pressed={!!current.following}
                  onClick={() => notInPrototype("Following a conversation")}
                  className="shrink-0 self-start max-md:h-11"
                >
                  {current.following ? "Following" : "Follow"}
                </Button>
              </div>
              <ol aria-label="Messages" className="flex flex-col gap-4 p-4 md:p-5 lg:p-6">
                {current.messages.map((m) => (
                  <Message key={m.id} message={m} report="Report" onReport={() => notInPrototype("Reporting a message")} />
                ))}
              </ol>
              {current.replies > current.messages.length - 1 ? (
                // The sample draws the first replies only.
                <p className="sk-text-body-small-regular flex items-center gap-1.5 px-4 pb-4 text-sko-text-subtle md:px-5 lg:px-6">
                  <Icon icon={MessageSquare} size={16} />
                  {current.replies - (current.messages.length - 1)} more{" "}
                  {current.replies - (current.messages.length - 1) === 1 ? "reply" : "replies"} in the course discussion.
                </p>
              ) : null}
              <form
                className="flex items-center gap-2 border-t border-sko-border-subtle p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  notInPrototype("Sending a reply");
                }}
              >
                <label className="flex h-11 min-w-0 flex-1 items-center rounded-control border border-sko-border-default bg-sko-bg-page px-3 shadow-sm transition-[border-color,box-shadow] focus-within:border-sko-border-primary focus-within:ring-1 focus-within:ring-sko-border-primary md:h-10">
                  <span className="sr-only">Write a reply</span>
                  <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write a reply…"
                    autoComplete="off"
                    className="sk-text-body-large-regular min-w-0 flex-1 bg-transparent text-sko-text-default placeholder:text-sko-text-placeholder focus:outline-none"
                  />
                </label>
                <Button type="submit" size="sm" className="shrink-0 max-md:h-11">
                  Reply
                </Button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
