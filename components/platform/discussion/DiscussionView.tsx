"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

/** A message bubble while it loads: the author line, the bubble with its ghost text, the time line. */
function MessageSkeleton({ message }: { message: DiscussionThread["messages"][number] }) {
  const bubble = (
    <div className="sk-text-body-medium-regular select-none rounded-control bg-sko-bg-muted px-3 py-2 text-transparent max-md:self-stretch md:max-w-[420px]">
      {message.body}
    </div>
  );
  if (message.from === "learner") {
    return (
      <div aria-hidden="true" className="flex flex-col items-end gap-1">
        <Skeleton variant="ghost" text="body-small-medium">{message.author}</Skeleton>
        {bubble}
        <Skeleton variant="ghost" text="body-small-regular">{message.time}</Skeleton>
      </div>
    );
  }
  return (
    <div aria-hidden="true" className="flex items-start gap-2">
      <Skeleton variant="circle" size={32} />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <div className="flex flex-wrap items-center gap-1">
          <Skeleton variant="ghost" text="body-small-medium">{message.author}</Skeleton>
          {message.label ? <SkeletonPill>{message.label}</SkeletonPill> : null}
          {message.accepted ? <SkeletonPill>ACCEPTED ANSWER</SkeletonPill> : null}
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
    <div className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        <div className={cn("flex flex-wrap items-end justify-between gap-4", explicit && "max-md:hidden")}>
          <div className="flex flex-col gap-1">
            <Skeleton variant="ghost" text="headline-large-bold">Discussion across your courses.</Skeleton>
            <Skeleton variant="ghost" text="body-medium-regular">
              Talk with your cohort. For a private question to your mentor, use Mentorship Q&amp;A in the course.
            </Skeleton>
          </div>
          <SkeletonPill size="button-md" icon className="md:h-11">New post</SkeletonPill>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div
            className={cn(
              "overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page md:w-[340px] md:shrink-0 lg:w-[380px]",
              explicit && "max-md:hidden",
            )}
          >
            <div className="flex flex-col gap-3 bg-sko-bg-subtle px-[11px] py-3">
              <Skeleton variant="block" radius="control" className="h-11 md:h-10" />
              <div className="flex flex-col gap-1">
                <Skeleton variant="ghost" text="body-small-medium">Course</Skeleton>
                <Skeleton variant="block" radius="control" className="h-11 md:h-10" />
              </div>
              <div className="inline-flex max-w-full gap-0.5 self-start overflow-hidden rounded-track bg-sko-bg-track p-1">
                {discussionFilters.map((f) => (
                  <SkeletonPill key={f.id} size="segment" className="bg-transparent">{f.label}</SkeletonPill>
                ))}
              </div>
            </div>
            <div className="border-t border-sko-border-subtle">
              {discussionThreads.map((t) => (
                <div key={t.id} className="flex items-start gap-2 border-b border-sko-border-subtle px-[11px] py-3 last:border-b-0">
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Skeleton variant="ghost" text="body-small-medium" className="truncate">{t.course}</Skeleton>
                    <div className="flex flex-wrap items-start gap-1">
                      <SkeletonPill>{t.kind === "question" ? "QUESTION" : "DISCUSSION"}</SkeletonPill>
                      {t.answered ? <SkeletonPill>ANSWERED</SkeletonPill> : null}
                      {t.following ? <SkeletonPill>FOLLOWING</SkeletonPill> : null}
                    </div>
                    <Skeleton variant="ghost" text={t.unread > 0 ? "body-medium-semibold" : "body-medium-medium"}>{t.title}</Skeleton>
                    <Skeleton variant="ghost" text="body-small-regular" className="truncate">{t.preview}</Skeleton>
                    <Skeleton variant="ghost" text="body-small-regular">
                      {`${t.meta} · ${t.replies} ${t.replies === 1 ? "reply" : "replies"}`}
                    </Skeleton>
                  </div>
                  {t.unread > 0 ? <Skeleton variant="block" width={20} height={20} radius="pill" className="mt-0.5" /> : null}
                </div>
              ))}
            </div>
          </div>
          <div className={cn("min-w-0 flex-1 flex-col gap-4", explicit ? "flex" : "hidden md:flex")}>
            <SkeletonPill size="button-sm" icon className="self-start max-md:h-11 md:hidden">All conversations</SkeletonPill>
            <div className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
              <div className="flex flex-col gap-3 bg-sko-bg-subtle p-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <Skeleton variant="ghost" text="body-small-medium">{`${current.course} · ${current.topic}`}</Skeleton>
                  <Skeleton variant="ghost" text="title-medium-semibold">{current.title}</Skeleton>
                </div>
                <SkeletonPill size="button-sm" className="self-start max-md:h-11">{current.following ? "Following" : "Follow"}</SkeletonPill>
              </div>
              <div className="flex flex-col gap-4 p-4 md:p-5 lg:p-6">
                {current.messages.map((m) => (
                  <MessageSkeleton key={m.id} message={m} />
                ))}
              </div>
              {current.replies > current.messages.length - 1 ? (
                <div className="px-4 pb-4 md:px-5 lg:px-6">
                  <Skeleton text="body-small-regular" width="60%" />
                </div>
              ) : null}
              <div className="flex items-center gap-2 border-t border-sko-border-subtle p-3">
                <Skeleton variant="block" radius="control" className="h-11 min-w-0 flex-1 md:h-10" />
                <SkeletonPill size="button-sm" className="max-md:h-11">Reply</SkeletonPill>
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
        <div data-arrive={0} className={cn("flex flex-wrap items-end justify-between gap-4", explicit && "max-md:hidden")}>
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
            data-arrive={1}
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
                  className="rounded-none border-0 border-t px-4 py-8"
                />
              </div>
            )}
          </section>

          <div data-arrive={2} className={cn("min-w-0 flex-1 flex-col gap-4", explicit ? "flex" : "hidden md:flex")}>
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
