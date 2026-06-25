"use client";

import * as React from "react";
import { CourseHeader } from "@/components/molecules/CourseHeader";
import { ModuleHeader } from "@/components/molecules/ModuleHeader";
import { LessonHeader } from "@/components/atoms/LessonHeader";
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
  onToggleSidebar?: () => void;
  onToggleModule?: (moduleId: string) => void;
  onSelectTopic?: (topicId: string) => void;
  onToggleBookmark?: (topicId: string) => void;
  className?: string;
}

function topicStatus(topic: Topic): CompletionState {
  if (topic.locked) return "Locked";
  if (topic.completed) return "Done";
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
  onToggleSidebar,
  onToggleModule,
  onSelectTopic,
  onToggleBookmark,
  className,
}: SidebarProps) {
  const collapsed = variant === "Collapsed";
  const isMobile = variant === "Mobile";

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
      <CourseHeader
        title={course.title}
        eyebrow="Course"
        expanded={!collapsed}
        compact={collapsed}
        showToggle={!isMobile}
        onToggle={onToggleSidebar}
      />

      {!collapsed ? (
        <div className="border-b border-sk-border-secondary px-4 py-3">
          <OverallProgress
            pct={course.overallProgressPct}
            moduleCurrent={course.modulesCompleted + 1}
            moduleTotal={course.modulesTotal}
          />
        </div>
      ) : null}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="sk-scroll flex-1 overflow-y-auto pb-4"
      >
        {course.modules.map((module) => {
          const moduleCollapsed = collapsedModules.has(module.id);
          if (collapsed) {
            // Collapsed rail: just status dots for each topic.
            return (
              <div key={module.id} className="border-b border-sk-border-secondary py-2">
                {moduleTopics(module).map((topic) => (
                  <TopicRow
                    key={topic.id}
                    collapsed
                    type={topic.type}
                    title={topic.title}
                    duration={topic.duration}
                    status={topicStatus(topic)}
                    active={topic.id === currentTopicId}
                    onClick={() => onSelectTopic?.(topic.id)}
                  />
                ))}
              </div>
            );
          }
          return (
            <div key={module.id} className="border-b border-sk-border-secondary">
              <ModuleHeader
                label={module.label}
                title={module.title}
                topicsCompleted={module.topicsCompleted}
                topicsTotal={module.topicsTotal}
                isCompleted={module.isCompleted}
                collapsed={moduleCollapsed}
                onToggle={() => onToggleModule?.(module.id)}
              />
              {!moduleCollapsed ? (
                <div className="pb-2">
                  {module.lessons
                    ? module.lessons.map((lesson) => (
                        <div key={lesson.id}>
                          <LessonHeader label={lesson.label} />
                          {lesson.topics.map((topic) => (
                            <TopicRow
                              key={topic.id}
                              type={topic.type}
                              title={topic.title}
                              duration={topic.duration}
                              status={topicStatus(topic)}
                              active={topic.id === currentTopicId}
                              showBookmark={bookmarks.has(topic.id)}
                              bookmarked={bookmarks.has(topic.id)}
                              onClick={() => onSelectTopic?.(topic.id)}
                              onToggleBookmark={() => onToggleBookmark?.(topic.id)}
                            />
                          ))}
                        </div>
                      ))
                    : moduleTopics(module).map((topic) => (
                        <TopicRow
                          key={topic.id}
                          type={topic.type}
                          title={topic.title}
                          duration={topic.duration}
                          status={topicStatus(topic)}
                          active={topic.id === currentTopicId}
                          showBookmark={bookmarks.has(topic.id)}
                          bookmarked={bookmarks.has(topic.id)}
                          onClick={() => onSelectTopic?.(topic.id)}
                          onToggleBookmark={() => onToggleBookmark?.(topic.id)}
                        />
                      ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Mobile shows a compact progress ring pinned at the bottom. */}
      {isMobile ? (
        <div className="flex items-center gap-3 border-t border-sk-border-secondary px-4 py-3">
          <OverallProgress
            device="Mobile"
            pct={course.overallProgressPct}
            moduleCurrent={course.modulesCompleted + 1}
            moduleTotal={course.modulesTotal}
          />
          <div>
            <p className="sk-text-sm-semibold text-sk-text-primary">{course.overallProgressPct}% complete</p>
            <p className="sk-text-xs-regular text-sk-text-tertiary">
              Module {course.modulesCompleted + 1} of {course.modulesTotal}
            </p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
