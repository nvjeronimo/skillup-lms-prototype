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

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden bg-lms-bg-primary",
        // Floating card on desktop/tablet; Mobile drawer fills its container.
        isMobile ? "" : "rounded-xl border border-lms-border-secondary",
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
        <div className="border-b border-lms-border-secondary px-4 py-3">
          <OverallProgress
            pct={course.overallProgressPct}
            moduleCurrent={course.modulesCompleted + 1}
            moduleTotal={course.modulesTotal}
          />
        </div>
      ) : null}

      <div className="lms-scroll flex-1 overflow-y-auto pb-4">
        {course.modules.map((module) => {
          const moduleCollapsed = collapsedModules.has(module.id);
          if (collapsed) {
            // Collapsed rail: just status dots for each topic.
            return (
              <div key={module.id} className="border-b border-lms-border-secondary py-2">
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
            <div key={module.id} className="border-b border-lms-border-secondary">
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
        <div className="flex items-center gap-3 border-t border-lms-border-secondary px-4 py-3">
          <OverallProgress
            device="Mobile"
            pct={course.overallProgressPct}
            moduleCurrent={course.modulesCompleted + 1}
            moduleTotal={course.modulesTotal}
          />
          <div>
            <p className="lms-text-sm-semibold text-lms-text-primary">{course.overallProgressPct}% complete</p>
            <p className="lms-text-xs-regular text-lms-text-tertiary">
              Module {course.modulesCompleted + 1} of {course.modulesTotal}
            </p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
