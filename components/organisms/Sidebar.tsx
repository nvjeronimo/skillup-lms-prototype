"use client";

import * as React from "react";
import { Bookmark, X } from "lucide-react";
import { CourseHeader } from "@/components/molecules/CourseHeader";
import { ModuleHeader } from "@/components/molecules/ModuleHeader";
import { LessonHeader } from "@/components/atoms/LessonHeader";
import { SidebarToggle } from "@/components/atoms/SidebarToggle";
import { BookmarkButton } from "@/components/atoms/Bookmark";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { TopicRow } from "@/components/molecules/TopicRow";
import { OverallProgress } from "@/components/molecules/OverallProgress";
import { cn } from "@/lib/utils";
import { moduleTopics } from "@/lib/data";
import type { Course, CompletionState, Topic } from "@/lib/types";

export type SidebarVariant = "Expanded" | "Collapsed" | "Mobile";

// Persisted across the per-topic remount of the player layout (module scope
// survives component unmount). Keeps the desktop/tablet sidebar scroll in place.
let savedScrollTop = 0;

// useLayoutEffect on the client (no scroll flicker), useEffect on the server (no SSR warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface SidebarProps {
  course: Course;
  currentTopicId: string;
  variant?: SidebarVariant;
  /** Module IDs that are collapsed. */
  collapsedModules?: Set<string>;
  bookmarks?: Set<string>;
  /** Runtime completion (store). When provided, drives the row checks + progress
   *  live; when omitted (e.g. Storybook), the static `topic.completed` is used. */
  completed?: Set<string>;
  onToggleSidebar?: () => void;
  onToggleModule?: (moduleId: string) => void;
  onSelectTopic?: (topicId: string) => void;
  onToggleBookmark?: (topicId: string) => void;
  /** Mobile drawer close — rendered in the course-header trailing slot. */
  onCloseMobile?: () => void;
  className?: string;
}

function topicStatus(topic: Topic, completed?: Set<string>): CompletionState {
  if (topic.locked) return "Locked";
  const done = completed ? completed.has(topic.id) : topic.completed;
  if (done) return "Done";
  // Active/current topics show an empty ring; the brand highlight marks "current".
  return "Pending";
}

const WIDTH: Record<SidebarVariant, string> = {
  Expanded: "w-[280px]",
  Collapsed: "w-[72px]",
  Mobile: "w-[320px]",
};

/**
 * Course navigation sidebar. Five logical states: Expanded · Collapsed · Mobile
 * (+ the two `noLesson` variants are simply courses whose modules have no lesson
 * sub-grouping — handled automatically by the data shape).
 */
export function Sidebar({
  course,
  currentTopicId,
  variant = "Expanded",
  collapsedModules = new Set(),
  bookmarks = new Set(),
  completed,
  onToggleSidebar,
  onToggleModule,
  onSelectTopic,
  onToggleBookmark,
  onCloseMobile,
  className,
}: SidebarProps) {
  const collapsed = variant === "Collapsed";
  const isMobile = variant === "Mobile";

  // When the store drives completion, recompute per-module + overall progress live
  // so the checks, "x / y" counts and progress ring all move as topics complete.
  const moduleStats = (module: Course["modules"][number]) => {
    if (!completed) {
      return {
        topicsCompleted: module.topicsCompleted,
        topicsTotal: module.topicsTotal,
        isCompleted: module.isCompleted,
      };
    }
    const tops = moduleTopics(module);
    const done = tops.filter((t) => completed.has(t.id)).length;
    return { topicsCompleted: done, topicsTotal: tops.length, isCompleted: tops.length > 0 && done === tops.length };
  };

  const allTopics = course.modules.flatMap(moduleTopics);
  const overallPct = completed
    ? Math.round((allTopics.filter((t) => completed.has(t.id)).length / Math.max(allTopics.length, 1)) * 100)
    : course.overallProgressPct;
  const modulesDone = completed
    ? course.modules.filter((m) => moduleStats(m).isCompleted).length
    : course.modulesCompleted;

  // The player lives in [topicId]/layout, so navigating between topics REMOUNTS
  // this sidebar and resets its scroll. We persist the scroll position across the
  // remount (module-level, survives unmount) and restore it before paint, so the
  // topic the user just clicked stays exactly where it was. We only auto-scroll
  // when the active row would otherwise be off-screen (e.g. a deep link).
  const scrollRef = React.useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (!isMobile) container.scrollTop = savedScrollTop; // restore persisted position

    const active = container.querySelector<HTMLElement>('[aria-current="true"]');
    if (active) {
      const c = container.getBoundingClientRect();
      const a = active.getBoundingClientRect();
      const margin = 8;
      if (a.top < c.top + margin) {
        container.scrollTop -= c.top + margin - a.top;
      } else if (a.bottom > c.bottom - margin) {
        container.scrollTop += a.bottom - (c.bottom - margin);
      }
    }
    if (!isMobile) savedScrollTop = container.scrollTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopicId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isMobile) savedScrollTop = e.currentTarget.scrollTop;
  };

  // Collapsed rail: a hover flyout surfaces the topic title + bookmark toggle
  // (there's no room for them on the 72px rail itself).
  const [flyout, setFlyout] = React.useState<{ topic: Topic; top: number; left: number } | null>(
    null,
  );
  const flyoutTimer = React.useRef<number | null>(null);
  const openFlyout = (topic: Topic, el: HTMLElement) => {
    if (flyoutTimer.current) window.clearTimeout(flyoutTimer.current);
    const r = el.getBoundingClientRect();
    setFlyout({ topic, top: r.top, left: r.right });
  };
  const scheduleClose = () => {
    if (flyoutTimer.current) window.clearTimeout(flyoutTimer.current);
    flyoutTimer.current = window.setTimeout(() => setFlyout(null), 140);
  };
  const keepOpen = () => {
    if (flyoutTimer.current) window.clearTimeout(flyoutTimer.current);
  };

  // ── Collapsed rail (DS: LMS / Sidebar v2 · State=Collapsed) ──────────────────
  // 72px rail: toggle + progress ring, then per-module groups separated by 40px
  // dividers — module number (green when complete), lesson labels (L1/L2, brand on
  // the active lesson) and status dots, with the active topic highlighted.
  if (collapsed) {
    const Divider = () => <div className="my-1 h-px w-full bg-sk-border-secondary" />;
    const Dot = (topic: Topic) => (
      <div
        key={topic.id}
        className="relative w-full"
        onMouseEnter={(e) => openFlyout(topic, e.currentTarget)}
        onMouseLeave={scheduleClose}
      >
        <TopicRow
          collapsed
          type={topic.type}
          title={topic.title}
          duration={topic.duration}
          status={topicStatus(topic, completed)}
          active={topic.id === currentTopicId}
          onClick={() => onSelectTopic?.(topic.id)}
        />
        {/* Saved topics carry a small bookmark mark on the rail. */}
        {bookmarks.has(topic.id) ? (
          <span className="pointer-events-none absolute right-1.5 top-1 text-sk-text-brand-secondary">
            <Bookmark size={11} fill="currentColor" strokeWidth={1} />
          </span>
        ) : null}
      </div>
    );
    return (
      <>
      <aside
        className={cn(
          "flex h-full w-[72px] flex-col items-center overflow-hidden rounded-xl border border-sk-border-secondary bg-sk-bg-primary py-4",
          className,
        )}
        aria-label="Course navigation"
      >
        <div className="flex flex-col items-center gap-2 pb-3">
          <SidebarToggle expanded={false} onToggle={onToggleSidebar} />
          <OverallProgress
            device="Mobile"
            pct={overallPct}
            moduleCurrent={modulesDone + 1}
            moduleTotal={course.modulesTotal}
          />
        </div>

        <div ref={scrollRef} onScroll={handleScroll} className="sk-scroll w-full flex-1 overflow-y-auto">
          {course.modules.map((module, i) => {
            const moduleDone = moduleStats(module).isCompleted;
            return (
              <React.Fragment key={module.id}>
                <Divider />
                <div className="flex w-full flex-col items-center gap-1.5 py-2">
                  {/* 3-level (implicit module) has no module number. */}
                  {module.implicit ? null : (
                    <p
                      className={cn(
                        "sk-text-xs-semibold",
                        moduleDone ? "text-sk-text-success-primary" : "text-sk-text-tertiary",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  )}
                  {module.lessons
                    ? module.lessons.map((lesson, j) => {
                        const lessonActive = lesson.topics.some((t) => t.id === currentTopicId);
                        return (
                          <React.Fragment key={lesson.id}>
                            <p
                              className={cn(
                                "sk-text-xs-semibold",
                                lessonActive ? "text-sk-text-brand-primary" : "text-sk-text-tertiary",
                              )}
                            >
                              {`L${j + 1}`}
                            </p>
                            {lesson.topics.map(Dot)}
                          </React.Fragment>
                        );
                      })
                    : moduleTopics(module).map(Dot)}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </aside>

      {/* Hover flyout — title + bookmark toggle for the rail's icon-only rows. */}
      {flyout ? (
        <div
          className="fixed z-[70]"
          style={{ top: flyout.top, left: flyout.left + 6 }}
          onMouseEnter={keepOpen}
          onMouseLeave={scheduleClose}
        >
          <div className="flex items-center gap-2 rounded-lg border border-sk-border-secondary bg-sk-bg-primary py-1.5 pl-3 pr-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => {
                onSelectTopic?.(flyout.topic.id);
                setFlyout(null);
              }}
              className="flex min-w-0 flex-col items-start text-left"
            >
              <span className="sk-text-sm-medium whitespace-nowrap text-sk-text-primary">
                {flyout.topic.title}
              </span>
              <TopicTypeBadge type={flyout.topic.type} />
            </button>
            <BookmarkButton
              bookmarked={bookmarks.has(flyout.topic.id)}
              onToggle={() => onToggleBookmark?.(flyout.topic.id)}
              itemLabel={flyout.topic.title}
              size={16}
            />
          </div>
        </div>
      ) : null}
      </>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden bg-sk-bg-primary",
        // Floating card on desktop/tablet; Mobile drawer fills its container.
        isMobile ? "" : "rounded-xl border border-sk-border-secondary",
        WIDTH[variant],
        className,
      )}
      aria-label="Course navigation"
    >
      {isMobile ? (
        /* Mobile (DS Sidebar v2 · Mobile): the progress ring sits in the course
           header's trailing slot — no full-width progress block, no footer. */
        <CourseHeader
          title={course.title}
          eyebrow="Course"
          showToggle={false}
          rightSlot={
            <div className="flex items-center gap-2">
              {onCloseMobile ? (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sk-text-tertiary hover:bg-sk-bg-secondary"
                >
                  <X size={20} />
                </button>
              ) : null}
              <OverallProgress
                device="Mobile"
                pct={overallPct}
                moduleCurrent={modulesDone + 1}
                moduleTotal={course.modulesTotal}
              />
            </div>
          }
        />
      ) : (
        <>
          <CourseHeader
            title={course.title}
            eyebrow="Course"
            expanded
            showToggle
            onToggle={onToggleSidebar}
          />
          <OverallProgress
            pct={overallPct}
            moduleCurrent={modulesDone + 1}
            moduleTotal={course.modulesTotal}
          />
        </>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="sk-scroll flex-1 overflow-y-auto pb-4"
      >
        {course.modules.map((module) => {
          const moduleCollapsed = collapsedModules.has(module.id);
          const renderTopic = (topic: Topic) => (
            <TopicRow
              key={topic.id}
              type={topic.type}
              title={topic.title}
              duration={topic.duration}
              status={topicStatus(topic, completed)}
              active={topic.id === currentTopicId}
              showBookmark={bookmarks.has(topic.id)}
              bookmarked={bookmarks.has(topic.id)}
              onClick={() => onSelectTopic?.(topic.id)}
              onToggleBookmark={() => onToggleBookmark?.(topic.id)}
            />
          );

          // 3-level (implicit module): topic rows directly under the Course Header.
          if (module.implicit) {
            return (
              <div key={module.id} className="border-b border-sk-border-secondary py-2">
                {moduleTopics(module).map(renderTopic)}
              </div>
            );
          }

          return (
            <div key={module.id} className="border-b border-sk-border-secondary">
              <ModuleHeader
                label={module.label}
                title={module.title}
                {...moduleStats(module)}
                collapsed={moduleCollapsed}
                onToggle={() => onToggleModule?.(module.id)}
              />
              {!moduleCollapsed ? (
                <div className="pb-2">
                  {module.lessons
                    ? module.lessons.map((lesson) => (
                        <div key={lesson.id}>
                          <LessonHeader label={lesson.label} />
                          {lesson.topics.map(renderTopic)}
                        </div>
                      ))
                    : moduleTopics(module).map(renderTopic)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
