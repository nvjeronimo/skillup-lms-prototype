"use client";

import * as React from "react";
import { Bookmark, Lock, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { CourseHeader } from "@/components/molecules/CourseHeader";
import { ModuleHeader } from "@/components/molecules/ModuleHeader";
import { Collapse } from "@/components/atoms/Collapse";
import { SidebarToggle } from "@/components/atoms/SidebarToggle";
import { BookmarkButton } from "@/components/atoms/Bookmark";
import { TopicTypeBadge } from "@/components/atoms/TopicTypeBadge";
import { TopicRow } from "@/components/molecules/TopicRow";
import { ProgressRing } from "@/components/molecules/OverallProgress";
import { cn } from "@/lib/utils";
import { inertProps } from "@/lib/inert";
import { HOVER_CLOSE_GRACE_MS, MOTION_MS } from "@/lib/motion/tokens";
import { useHasChanged } from "@/lib/motion/useHasChanged";
import { useExitTransition, useFrozenWhileClosed } from "@/lib/useExitTransition";
import { isFreshCompletion } from "@/lib/motion/completion";
import { coursePartners, moduleTopics } from "@/lib/data";
import { courseProgressPct } from "@/lib/courses/outline";
import type { Course, CompletionState, Topic } from "@/lib/types";
import type { SidebarProps } from "./Sidebar";

// Survive the per-topic remount of the player layout, like Sidebar's scroll.
let savedScrollTop = 0;
let savedOpen: { courseId: string; open: string[] } | null = null;

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const ROVING = "[data-roving]:not([data-collapse='closed'] *)";

/**
 * The Course Journey proposal (Impeccable critique of the ICP sidebar, 24 Oct 2026). Same props
 * and DS parts as Sidebar; behind `?journey=proposal` (lib/journeyProposal) so Nelson can compare
 * it with the current one in the real player. What changes, by the critique's numbering:
 * 2. Where am I, what's next: the open topic keeps the current look (brand row, empty ring: the
 *    In Progress ring was refused by the stakeholders, 24 Oct 2026),
 *    "Module N of M" is the module that holds the open topic (not modules done + 1, which read
 *    "Module 5 of 4" at 100%), "Course completed" at 100%, and a quiet "Up next" on the next topic.
 * 3. Locks: every locked row names the topic straight before it ("Unlocks after …"), read under
 *    the row instead of a 3 s tooltip; a module locked as a whole says so once, under its header.
 * 4. Structure: each module is a section with its toggle in a heading, topics are an ordered list,
 *    and the list is one tab stop (roving focus: ↑ ↓ Home End; → to a row's bookmark, ← back;
 *    → / ← open and close a module). (A "Jump to current topic" button was refused, 24 Oct 2026.)
 * 5. Disclosure: only the module of the open topic is open; completed modules close (Nelson:
 *    "Sim, fecham"), module headers stick while their topics scroll, and the open topic lands a
 *    third of the way down when it is out of view.
 * Minor: "Course journey" names the panel on desktop (the drawer drops the COURSE eyebrow under
 * its own title), Label styles instead of inline uppercase, Module Info says "topics" and
 * "Completed", lesson names are headings, the rail reads M2 / L1 with spoken groups and
 * bookmarks, meta lines wrap instead of truncating, and the bookmark keeps one name.
 */
export function SidebarProposal({
  course,
  currentTopicId,
  variant = "Expanded",
  bookmarks = new Set(),
  completed,
  lastCompleted = null,
  onToggleSidebar,
  onSelectTopic,
  onToggleBookmark,
  onCloseMobile,
  mobileTitleId,
  className,
}: SidebarProps) {
  const collapsed = variant === "Collapsed";
  const isMobile = variant === "Mobile";
  const headingId = React.useId();

  const isDone = (t: Topic) => (completed ? completed.has(t.id) : t.completed);
  const statusOf = (t: Topic): CompletionState =>
    t.locked ? "Locked" : isDone(t) ? "Done" : "Pending";

  const ordered = React.useMemo(() => course.modules.flatMap((m) => moduleTopics(m)), [course]);
  const modules = course.modules.filter((m) => !m.implicit);
  const currentModule = course.modules.find((m) => moduleTopics(m).some((t) => t.id === currentTopicId));
  const moduleDone = (m: Course["modules"][number]) => {
    const tops = moduleTopics(m);
    return tops.length > 0 && tops.every(isDone);
  };

  // The next topic to open: the first after the open one that is neither done nor locked.
  const currentIndex = ordered.findIndex((t) => t.id === currentTopicId);
  const upNextId = ordered.slice(currentIndex + 1).find((t) => !t.locked && !isDone(t))?.id;

  // What opens a locked row: the topic straight before it. A module locked as a whole also
  // says it once, under its header: what it waits for is the last topic before the module.
  const { rowHints, moduleHints } = React.useMemo(() => {
    const rowHints = new Map<string, string>();
    const moduleHints = new Map<string, string>();
    ordered.forEach((t, i) => {
      if (t.locked && i > 0) rowHints.set(t.id, `Unlocks after ${ordered[i - 1].title}`);
    });
    for (const m of course.modules) {
      const tops = moduleTopics(m);
      if (!tops.length || !tops.every((t) => t.locked)) continue;
      const before = ordered[ordered.indexOf(tops[0]) - 1];
      if (before) moduleHints.set(m.id, `Opens after ${before.title}`);
    }
    return { rowHints, moduleHints };
  }, [course, ordered]);

  const overallPct = courseProgressPct(course, completed);
  const doneCount = ordered.filter(isDone).length;
  const moduleNumber = currentModule && !currentModule.implicit ? modules.indexOf(currentModule) + 1 : 0;
  const progressLine =
    overallPct >= 100
      ? "Course completed"
      : moduleNumber
        ? `Module ${moduleNumber} of ${modules.length}`
        : `${doneCount} of ${ordered.length} topics`;
  const progressDetail = overallPct >= 100 || !moduleNumber ? null : `${doneCount} of ${ordered.length} topics done`;

  // ── Open modules: the module of the open topic; completed ones close as the learner moves on.
  const [open, setOpen] = React.useState<Set<string>>(() => {
    const start = savedOpen?.courseId === course.id ? new Set(savedOpen.open) : new Set<string>();
    if (currentModule) start.add(currentModule.id);
    for (const m of course.modules) if (m !== currentModule && moduleDone(m)) start.delete(m.id);
    return start;
  });
  const completedKey = completed ? [...completed].join(",") : "";
  React.useEffect(() => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (currentModule) next.add(currentModule.id);
      for (const m of course.modules) if (m !== currentModule && moduleDone(m)) next.delete(m.id);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopicId, completedKey]);
  React.useEffect(() => {
    savedOpen = { courseId: course.id, open: [...open] };
  }, [course.id, open]);
  const toggle = (id: string, to?: boolean) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (to ?? !next.has(id)) next.add(id);
      else next.delete(id);
      return next;
    });

  // ── Scroll: restore across the remount; the open topic a third of the way down when it is
  //    out of view (always in the drawer, which opens fresh each time).
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const placeCurrent = React.useCallback(
    (force: boolean, smooth = false) => {
      const box = scrollRef.current;
      const row = box?.querySelector<HTMLElement>('[aria-current="page"]:not([data-collapse="closed"] *)');
      if (!box || !row) return;
      const c = box.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      // A sticky module header covers the top of the list: count it out.
      const sticky = row.closest("section")?.querySelector("h3")?.getBoundingClientRect().height ?? 0;
      const hidden = r.top < c.top + sticky || r.bottom > c.bottom;
      if (!force && !hidden) return;
      box.scrollTo({ top: box.scrollTop + (r.top - c.top) - c.height / 3, behavior: smooth ? "smooth" : "instant" });
    },
    [],
  );
  useIsoLayoutEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    if (!isMobile) box.scrollTo({ top: savedScrollTop, behavior: "instant" });
    placeCurrent(isMobile);
    if (!isMobile) savedScrollTop = box.scrollTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopicId, collapsed]);


  // ── Roving focus: the list is one tab stop.
  const roving = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    const items = [...box.querySelectorAll<HTMLElement>(ROVING)];
    if (!items.length) return;
    if (!roving.current || !items.includes(roving.current)) {
      roving.current = items.find((el) => el.getAttribute("aria-current") === "page") ?? items[0];
    }
    for (const el of items) el.tabIndex = el === roving.current ? 0 : -1;
    // Bookmarks are reached with → from their row.
    box.querySelectorAll<HTMLElement>("li button[aria-pressed]").forEach((b) => (b.tabIndex = -1));
  });
  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const box = scrollRef.current;
    const target = e.target as HTMLElement;
    if (!box) return;
    const items = [...box.querySelectorAll<HTMLElement>(ROVING)];
    const move = (el: HTMLElement | undefined) => {
      if (!el) return;
      e.preventDefault();
      roving.current = el;
      for (const it of items) it.tabIndex = it === el ? 0 : -1;
      el.focus();
    };
    // From a bookmark, ← goes back to its row.
    if (target.matches("button[aria-pressed]")) {
      if (e.key === "ArrowLeft") move(target.closest("li")?.querySelector<HTMLElement>("[data-roving]") ?? undefined);
      return;
    }
    const i = items.indexOf(target);
    if (i < 0) return;
    const moduleId = target.dataset.module;
    switch (e.key) {
      case "ArrowDown":
        return move(items[i + 1]);
      case "ArrowUp":
        return move(items[i - 1]);
      case "Home":
        return move(items[0]);
      case "End":
        return move(items[items.length - 1]);
      case "ArrowRight":
        if (moduleId) {
          e.preventDefault();
          if (!open.has(moduleId)) toggle(moduleId, true);
          return;
        }
        return move(target.closest("li")?.querySelector<HTMLElement>("button[aria-pressed]") ?? undefined);
      case "ArrowLeft":
        if (moduleId && open.has(moduleId)) {
          e.preventDefault();
          toggle(moduleId, false);
        }
        return;
    }
  };

  // ── Collapsed rail flyout (as Sidebar).
  const [flyout, setFlyout] = React.useState<{ topic: Topic; top: number; left: number } | null>(null);
  const flyoutTimer = React.useRef<number | null>(null);
  const flyoutPresence = useExitTransition(flyout !== null, MOTION_MS.short2);
  const shownFlyout = useFrozenWhileClosed(flyout, flyout !== null);
  const flyoutClosing = flyout === null;
  const openFlyout = (topic: Topic, el: HTMLElement) => {
    if (flyoutTimer.current) window.clearTimeout(flyoutTimer.current);
    const r = el.getBoundingClientRect();
    setFlyout({ topic, top: r.top, left: r.right });
  };
  const scheduleClose = () => {
    if (flyoutTimer.current) window.clearTimeout(flyoutTimer.current);
    flyoutTimer.current = window.setTimeout(() => setFlyout(null), HOVER_CLOSE_GRACE_MS);
  };
  const keepOpen = () => {
    if (flyoutTimer.current) window.clearTimeout(flyoutTimer.current);
  };
  const flyoutRef = React.useRef<HTMLDivElement | null>(null);
  const flyoutRowRef = React.useRef<HTMLElement | null>(null);

  const variantFade = useHasChanged(collapsed) ? "sk-animate-fade sk-enter-only" : undefined;

  if (collapsed) {
    const Dot = (topic: Topic) => (
      <li
        key={topic.id}
        className="relative w-full"
        onMouseEnter={(e) => openFlyout(topic, e.currentTarget)}
        onMouseLeave={scheduleClose}
        onFocus={(e) => {
          flyoutRowRef.current = e.currentTarget;
          openFlyout(topic, e.currentTarget);
        }}
        onBlur={scheduleClose}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            keepOpen();
            flyoutRef.current?.querySelector<HTMLElement>("button")?.focus();
          } else if (e.key === "Escape") setFlyout(null);
        }}
      >
        <TopicRow
          collapsed
          refined
          type={topic.type}
          title={topic.title}
          duration={topic.duration}
          status={statusOf(topic)}
          animateStatus={isFreshCompletion(lastCompleted, topic.id, Date.now())}
          active={topic.id === currentTopicId}
          upNext={topic.id === upNextId}
          bookmarked={bookmarks.has(topic.id)}
          lockedHint={rowHints.get(topic.id)}
          onClick={() => onSelectTopic?.(topic.id)}
        />
        {bookmarks.has(topic.id) ? (
          <span aria-hidden className="pointer-events-none absolute right-1.5 top-1 text-sko-text-primary">
            <Bookmark size={12} fill="currentColor" strokeWidth={1} />
          </span>
        ) : null}
      </li>
    );
    return (
      <>
        <nav
          className={cn(
            "flex h-full w-[72px] flex-col items-center overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page py-4",
            variantFade,
            className,
          )}
          aria-label="Course Journey"
        >
          <div className="flex flex-col items-center gap-2 pb-3">
            <SidebarToggle expanded={false} onToggle={onToggleSidebar} />
            <ProgressRing pct={overallPct} />
            <span className="sr-only">{progressLine}</span>
          </div>
          <div ref={scrollRef} onScroll={(e) => (savedScrollTop = e.currentTarget.scrollTop)} className="sk-scroll w-full flex-1 overflow-y-auto">
            {course.modules.map((module) => {
              const n = modules.indexOf(module) + 1;
              return (
                <section
                  key={module.id}
                  aria-label={module.implicit ? course.title : `Module ${n}: ${module.title}`}
                  className="flex w-full flex-col items-center gap-1.5 border-t border-sko-border-subtle py-2"
                >
                  {module.implicit ? null : (
                    <p
                      aria-hidden
                      className={cn(
                        "sk-text-label-small-semibold",
                        moduleDone(module) ? "text-sko-text-success" : "text-sko-text-subtle",
                      )}
                    >
                      M{n}
                    </p>
                  )}
                  {module.lessons ? (
                    module.lessons.map((lesson, j) => (
                      <ol key={lesson.id} aria-label={`Lesson ${j + 1}: ${lesson.label}`} className="flex w-full flex-col items-center gap-1.5">
                        <li aria-hidden className="sk-text-label-small-medium text-sko-text-subtle">
                          L{j + 1}
                        </li>
                        {lesson.topics.map(Dot)}
                      </ol>
                    ))
                  ) : (
                    <ol className="w-full">{moduleTopics(module).map(Dot)}</ol>
                  )}
                </section>
              );
            })}
          </div>
        </nav>
        {flyoutPresence.mounted && shownFlyout ? (
          <div
            ref={flyoutRef}
            data-state={flyoutPresence.state}
            onTransitionEnd={flyoutPresence.onTransitionEnd}
            aria-hidden={flyoutClosing || undefined}
            {...inertProps(flyoutClosing)}
            className="sk-animate-flyout fixed z-[70]"
            style={{ top: shownFlyout.top, left: shownFlyout.left + 6 }}
            onMouseEnter={keepOpen}
            onMouseLeave={scheduleClose}
            onFocus={keepOpen}
            onBlur={scheduleClose}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "ArrowLeft") {
                e.preventDefault();
                flyoutRowRef.current?.querySelector<HTMLElement>("button")?.focus();
              }
            }}
          >
            <div className="flex items-center gap-2 rounded-control border border-sko-border-subtle bg-sko-bg-page py-1.5 pl-3 pr-1.5 shadow-sk-elevation-3">
              <button
                type="button"
                onClick={() => {
                  onSelectTopic?.(shownFlyout.topic.id);
                  setFlyout(null);
                }}
                className="flex min-w-0 flex-col items-start text-left"
              >
                <span className="sk-text-body-medium-medium whitespace-nowrap text-sko-text-default">
                  {shownFlyout.topic.title}
                </span>
                <TopicTypeBadge type={shownFlyout.topic.type} />
              </button>
              <BookmarkButton
                bookmarked={bookmarks.has(shownFlyout.topic.id)}
                onToggle={() => onToggleBookmark?.(shownFlyout.topic.id)}
                itemLabel={shownFlyout.topic.title}
                stableLabel
                size={16}
              />
            </div>
          </div>
        ) : null}
      </>
    );
  }

  const renderTopic = (topic: Topic) => (
    <li key={topic.id}>
      <TopicRow
        refined
        type={topic.type}
        title={topic.title}
        duration={topic.duration}
        status={statusOf(topic)}
        animateStatus={isFreshCompletion(lastCompleted, topic.id, Date.now())}
        active={topic.id === currentTopicId}
        upNext={topic.id === upNextId}
        showBookmark={bookmarks.has(topic.id)}
        bookmarked={bookmarks.has(topic.id)}
        lockedHint={rowHints.get(topic.id)}
        onClick={() => onSelectTopic?.(topic.id)}
        onToggleBookmark={() => onToggleBookmark?.(topic.id)}
      />
    </li>
  );

  return (
    <nav
      className={cn(
        "flex h-full flex-col overflow-hidden bg-sko-bg-page",
        isMobile ? "w-[320px]" : "w-[280px] rounded-control border border-sko-border-subtle",
        variantFade,
        className,
      )}
      aria-labelledby={isMobile ? mobileTitleId : headingId}
    >
      {isMobile && onCloseMobile ? (
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-sko-border-subtle pl-4 pr-2">
          <h2 id={mobileTitleId} className="sk-text-body-large-semibold text-sko-text-default">
            Course Journey
          </h2>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close Course Journey"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-sko-icon-subtle transition-colors hover:bg-sko-bg-hover"
          >
            <Icon icon={X} size={24} />
          </button>
        </div>
      ) : null}
      {/* Desktop: "Course journey" names the panel; in the drawer its title already does. */}
      <CourseHeader
        title={course.title}
        eyebrow={isMobile ? "" : "Course journey"}
        eyebrowStyle="label"
        partners={coursePartners(course)}
        expanded
        showToggle={!isMobile}
        onToggle={onToggleSidebar}
        showDivider={false}
      />
      {isMobile ? null : (
        <h2 id={headingId} className="sr-only">
          Course Journey
        </h2>
      )}

      <div className="flex items-center gap-3 border-b border-sko-border-subtle px-4 pb-3 pt-1">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="sk-text-label-small-semibold text-sko-text-subtle">Overall progress</span>
          <span
            className={cn(
              "sk-text-body-small-semibold",
              overallPct >= 100 ? "text-sko-text-success" : "text-sko-text-default",
            )}
          >
            {progressLine}
          </span>
          {progressDetail ? (
            <span className="sk-text-body-small-regular text-sko-text-subtle">{progressDetail}</span>
          ) : null}
        </div>
        <ProgressRing pct={overallPct} />
      </div>

      <div
        ref={scrollRef}
        onScroll={(e) => {
          if (!isMobile) savedScrollTop = e.currentTarget.scrollTop;
        }}
        onKeyDown={onListKeyDown}
        onFocus={(e) => {
          if ((e.target as HTMLElement).matches(ROVING)) roving.current = e.target as HTMLElement;
        }}
        className="sk-scroll flex-1 overflow-y-auto"
      >
        {course.modules.map((module) => {
          if (module.implicit) {
            return (
              <ol key={module.id} className="border-b border-sko-border-subtle py-2">
                {moduleTopics(module).map(renderTopic)}
              </ol>
            );
          }
          const isOpen = open.has(module.id);
          const tops = moduleTopics(module);
          const done = tops.filter(isDone).length;
          const complete = tops.length > 0 && done === tops.length;
          const bodyId = `${headingId}-${module.id}`;
          const moduleHint = moduleHints.get(module.id);
          return (
            <section key={module.id} aria-labelledby={`${bodyId}-h`}>
              {/* Sticks while its own topics scroll under it, then leaves with them. */}
              <h3 id={`${bodyId}-h`} className="sticky top-0 z-[1]">
                <ModuleHeader
                  label={module.label}
                  title={module.title}
                  topicsCompleted={done}
                  topicsTotal={tops.length}
                  isCompleted={complete}
                  progressText={`${done} of ${tops.length} topics`}
                  collapsed={!isOpen}
                  onToggle={() => toggle(module.id)}
                  buttonProps={{ "aria-controls": bodyId, "data-roving": true, "data-module": module.id }}
                />
              </h3>
              {moduleHint ? (
                <p className="sk-text-body-small-regular flex items-start gap-1.5 border-b border-sko-border-subtle bg-sko-bg-faint px-4 pb-3 text-sko-text-subtle">
                  <Icon icon={Lock} size={14} className="mt-0.5 shrink-0" />
                  {moduleHint}
                </p>
              ) : null}
              <Collapse open={isOpen} id={bodyId}>
                {module.lessons ? (
                  module.lessons.map((lesson) => (
                    <div key={lesson.id}>
                      <h4 className="sk-text-body-small-semibold px-4 pb-1 pt-4 text-sko-text-default">{lesson.label}</h4>
                      <ol>{lesson.topics.map(renderTopic)}</ol>
                    </div>
                  ))
                ) : (
                  <ol>{tops.map(renderTopic)}</ol>
                )}
              </Collapse>
            </section>
          );
        })}
      </div>
    </nav>
  );
}
