"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { CoursePlayerTopbar, type TopbarSize } from "@/components/organisms/CoursePlayerTopbar";
import { Sidebar, type SidebarVariant } from "@/components/organisms/Sidebar";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { ContentTabs } from "@/components/organisms/ContentTabs";
import { TopicHeader } from "@/components/molecules/TopicHeader";
import { TopicActionBar, type TopicActionState } from "@/components/molecules/TopicActionBar";
import { TopicFooterNav } from "@/components/organisms/TopicFooterNav";
import type { Milestone } from "@/components/organisms/CourseProgressionButton";
import { NotificationsPanel } from "@/components/organisms/NotificationsPanel";
import { SavedPanel, type SavedFilter } from "@/components/organisms/SavedPanel";
import { NoteEditorModal } from "@/components/organisms/NoteEditorModal";
import { CourseCompleteModal } from "@/components/organisms/CourseCompleteModal";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore, type TabSlug } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { topicFamily, topicDescription, getDownloads, getTranscript } from "@/lib/content";
import {
  course,
  getTopic,
  getAdjacentTopics,
  notifications,
  savedNotes,
  savedTopics,
  topicNotes,
} from "@/lib/data";

export interface PlayerShellProps {
  courseSlug: string;
  topicId: string;
  children: React.ReactNode;
}

export function PlayerShell({ courseSlug, topicId, children }: PlayerShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const bp = useBreakpoint();

  const topic = getTopic(topicId);
  const { previous, next, total, position } = getAdjacentTopics(topicId);

  // Store wiring
  const sidebarExpanded = useLmsStore((s) => s.sidebarExpanded);
  const toggleSidebar = useLmsStore((s) => s.toggleSidebar);
  const mobileDrawerOpen = useLmsStore((s) => s.mobileDrawerOpen);
  const setMobileDrawerOpen = useLmsStore((s) => s.setMobileDrawerOpen);
  const setCurrentTopic = useLmsStore((s) => s.setCurrentTopic);
  const setCurrentTab = useLmsStore((s) => s.setCurrentTab);
  const currentVideoTimestamp = useLmsStore((s) => s.currentVideoTimestamp);
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const activeLineId = useLmsStore((s) => s.activeLineId);
  const collapsedModules = useLmsStore((s) => s.collapsedModules);
  const toggleModule = useLmsStore((s) => s.toggleModule);
  const bookmarks = useLmsStore((s) => s.bookmarks);
  const toggleBookmark = useLmsStore((s) => s.toggleBookmark);
  const completedTopics = useLmsStore((s) => s.completedTopics);
  const markComplete = useLmsStore((s) => s.markComplete);
  const resetDemo = useLmsStore((s) => s.resetDemo);
  const openPanel = useLmsStore((s) => s.openPanel);
  const openOverlayPanel = useLmsStore((s) => s.openOverlayPanel);
  const closeOverlayPanel = useLmsStore((s) => s.closeOverlayPanel);
  const notificationsRead = useLmsStore((s) => s.notificationsRead);
  const markAllNotificationsRead = useLmsStore((s) => s.markAllNotificationsRead);
  const noteEditor = useLmsStore((s) => s.noteEditor);
  const openNoteEditor = useLmsStore((s) => s.openNoteEditor);
  const closeNoteEditor = useLmsStore((s) => s.closeNoteEditor);
  const saveNote = useLmsStore((s) => s.saveNote);
  const allNotes = useLmsStore((s) => s.notes);
  const toast = useLmsStore((s) => s.toast);
  const showToast = useLmsStore((s) => s.showToast);
  const clearToast = useLmsStore((s) => s.clearToast);

  const [savedFilter, setSavedFilter] = React.useState<SavedFilter>("all");
  const [completeOpen, setCompleteOpen] = React.useState(false);
  // Sticky video: docks (shrinks) once the content scrolls past the top.
  const [videoDocked, setVideoDocked] = React.useState(false);

  // Keep currentTopicId in sync with the route + emit topic_enter.
  React.useEffect(() => {
    setCurrentTopic(topicId);
    track("topic_enter", { topicId });
  }, [topicId, setCurrentTopic]);

  // Derive active tab from the URL.
  const activeTab: TabSlug = pathname.endsWith("/notes")
    ? "notes"
    : pathname.endsWith("/downloads")
      ? "downloads"
      : "transcript";

  React.useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab, setCurrentTab]);

  if (!topic) {
    return <div className="p-8">Topic not found.</div>;
  }

  const topbarSize: TopbarSize =
    bp === "mobile" ? "Mobile" : bp === "tablet" ? "Tablet" : "Desktop";
  // Tablet now uses the expanded sidebar by default (ICP Phase 1 decision), same
  // as desktop — the user can still collapse it.
  const sidebarVariant: SidebarVariant = sidebarExpanded ? "Expanded" : "Collapsed";
  const showInlineSidebar = bp !== "mobile";

  const family = topicFamily(topic.type);
  const isVideo = family === "video";
  const isLocked = Boolean(topic.locked);

  // Sticky video heights per viewport (DS Phase-1 §0): full hero → docked band.
  const VIDEO_FULL = { mobile: 211, tablet: 315, desktop: 405 } as const;
  const VIDEO_DOCK = { mobile: 160, tablet: 180, desktop: 240 } as const;
  const videoHeight = videoDocked ? VIDEO_DOCK[bp] : VIDEO_FULL[bp];

  // Option A — Nav in footer · action in content.
  // Quiz / Practice / Activity carry their OWN action inside the content frame
  // (start/submit a quiz, upload an assignment, tick activity steps), so they get
  // no Mark-as-Complete bar. Passive content (video/reading/discussion/VILT) gets
  // the completion action at the top AND bottom of the content.
  const hasInFrameAction =
    family === "assessment" || family === "graded" || family === "activity";
  const isCompleted = completedTopics.has(topicId);
  const actionState: TopicActionState = isCompleted ? "completed" : "incomplete";
  const renderAction = () => (
    <TopicActionBar state={actionState} onComplete={() => markComplete(topicId)} />
  );
  const showAction = !isLocked && !hasInFrameAction;
  const bottomAction = showAction ? (
    <div className="mt-6 flex justify-end border-t border-sk-border-secondary pt-5">
      {renderAction()}
    </div>
  ) : null;

  // Footer progression: Next normally, but "Go to next Module" at a module boundary
  // and "Go to next Course" at the final topic.
  const milestone: Milestone = !next
    ? "Course"
    : next.moduleId !== topic.moduleId
      ? "Module"
      : "Topic";

  const notesCount = topicNotes(topicId, allNotes).length;
  const downloadsCount = getDownloads(topic).length;

  const base = `/course/${courseSlug}/topic/${topicId}`;
  const transcriptTab = { slug: "transcript" as TabSlug, href: base };
  const notesTab = { slug: "notes" as TabSlug, label: "Notes", count: notesCount, href: `${base}/notes` };
  const downloadsTab = {
    slug: "downloads" as TabSlug,
    label: "Downloads",
    count: downloadsCount,
    href: `${base}/downloads`,
  };

  const PRIMARY_LABEL: Record<string, string> = {
    video: "Transcript",
    reading: "Article",
    assessment: "Quiz",
    graded: "Assignment",
    activity: "Activity",
    discussion: "Discussion",
    vilt: topic.type === "VILT-Recording" ? "Recording" : "Session",
  };

  const tabs = isVideo
    ? [{ ...transcriptTab, label: "Transcript" }, notesTab, downloadsTab]
    : [{ ...transcriptTab, label: PRIMARY_LABEL[family] }, downloadsTab];

  function navigateTopic(id: string) {
    setCurrentTopic(id);
    router.push(`/course/${courseSlug}/topic/${id}`);
  }

  // Note editor derived content
  const editorNote = noteEditor.noteId
    ? allNotes.find((n) => n.id === noteEditor.noteId)
    : undefined;
  const editorLine = noteEditor.lineId
    ? getTranscript(topic).find((l) => l.id === noteEditor.lineId)
    : undefined;

  const durationSeconds = 200;

  return (
    <div className="flex h-[100dvh] flex-col bg-sk-bg-secondary">
      <CoursePlayerTopbar
        size={topbarSize}
        showNotifications
        notificationsCount={notifications.filter((n) => n.unread && !notificationsRead.has(n.id)).length}
        onMenu={() => {
          track("mobile_drawer_open");
          setMobileDrawerOpen(true);
        }}
        onBookmark={() => openOverlayPanel("saved")}
        onNotifications={() => openOverlayPanel("notifications")}
        onResetDemo={resetDemo}
        onClose={() => showToast("Exit player → Course Hub (out of scope).")}
      />

      {/* Body — floating white cards on a secondary-tint surface (16px gutter). */}
      <div className={cn("flex min-h-0 flex-1", showInlineSidebar && "gap-4 p-4")}>
        {showInlineSidebar ? (
          <Sidebar
            course={course}
            currentTopicId={topicId}
            variant={sidebarVariant}
            collapsedModules={collapsedModules}
            bookmarks={bookmarks}

            completed={completedTopics}
            onToggleSidebar={toggleSidebar}
            onToggleModule={toggleModule}
            onSelectTopic={navigateTopic}
            onToggleBookmark={toggleBookmark}
          />
        ) : null}

        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-sk-bg-primary",
            showInlineSidebar && "rounded-xl border border-sk-border-secondary",
          )}
        >
          <div
            className="sk-scroll flex-1 overflow-y-auto"
            onScroll={(e) => {
              const next = e.currentTarget.scrollTop > 8;
              setVideoDocked((prev) => (prev === next ? prev : next));
            }}
          >
            {isLocked ? (
              <div className="w-full p-4">{children}</div>
            ) : isVideo ? (
              <>
                {/* Sticky player band — the video stays visible at the top and
                    docks (shrinks) once the content scrolls past the top. */}
                <div
                  className={cn(
                    "sticky top-0 z-20 bg-sk-bg-primary transition-[padding] duration-200 ease-out",
                    videoDocked ? "px-0 pb-2 pt-0" : "px-4 pb-3 pt-4",
                  )}
                >
                  <VideoPlayer
                    durationSeconds={durationSeconds}
                    currentTime={currentVideoTimestamp}
                    heightPx={videoHeight}
                    docked={videoDocked}
                    onSeek={(s) => {
                      seekVideoTo(s);
                      track("video_seek", { to: s });
                    }}
                  />
                </div>
                <div className="px-4 pb-4">
                  {/* Topic title below the player (ICP Phase 1 canonical layout).
                      Primary action sits at the top-right of the content (Option A). */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="sk-text-display-xs-semibold min-w-0 text-sk-text-primary">
                      {topic.title}
                    </h1>
                    {showAction ? <div className="shrink-0">{renderAction()}</div> : null}
                  </div>
                  <div className="mt-4">
                    <ContentTabs
                      tabs={tabs}
                      active={activeTab}
                      variant={bp === "mobile" ? "select" : "tabs"}
                    />
                    {children}
                  </div>
                  {bottomAction}
                </div>
              </>
            ) : (
              <div className="w-full p-4">
                {/* Completion action lives on the meta row (right-aligned), so the
                    title keeps the full content width. */}
                <TopicHeader
                  type={topic.type}
                  title={topic.title}
                  duration={topic.duration}
                  description={topicDescription(topic)}
                  rightSlot={showAction ? renderAction() : undefined}
                />
                <div className="mt-5">
                  <ContentTabs tabs={tabs} active={activeTab} />
                  {children}
                </div>
                {bottomAction}
              </div>
            )}
          </div>

          <TopicFooterNav
            position={position}
            total={total}
            title={topic.title}
            milestone={milestone}
            previousDisabled={!previous}
            nextDisabled={false}
            compact={bp === "mobile"}
            onPrevious={() => previous && navigateTopic(previous.id)}
            onNext={() => (next ? navigateTopic(next.id) : setCompleteOpen(true))}
          />
        </main>
      </div>

      {/* Mobile drawer */}
      {bp === "mobile" && mobileDrawerOpen ? (
        <div className="fixed inset-0 z-40">
          <div
            className="sk-backdrop sk-animate-fade absolute inset-0"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden
          />
          <div className="sk-animate-slide-left absolute left-0 top-0 h-full">
            {/* Drawer goes straight to the course header; a floating X closes it. */}
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-sk-text-tertiary hover:bg-sk-bg-secondary"
              >
                <Icon icon={X} size={20} />
              </button>
              <Sidebar
                course={course}
                currentTopicId={topicId}
                variant="Mobile"
                collapsedModules={collapsedModules}
                bookmarks={bookmarks}

                completed={completedTopics}
                onToggleModule={toggleModule}
                onSelectTopic={navigateTopic}
                onToggleBookmark={toggleBookmark}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Overlay panels — mutually exclusive */}
      <NotificationsPanel
        open={openPanel === "notifications"}
        onClose={closeOverlayPanel}
        notifications={notifications}
        readIds={notificationsRead}
        onMarkAllRead={() => markAllNotificationsRead(notifications.map((n) => n.id))}
        onSelect={(n) => {
          closeOverlayPanel();
          track("notification_click", { notifId: n.id, type: n.type });
          router.push(n.href);
        }}
      />

      <SavedPanel
        open={openPanel === "saved"}
        onClose={closeOverlayPanel}
        savedTopics={savedTopics}
        savedNotes={savedNotes}
        filter={savedFilter}
        onFilterChange={setSavedFilter}
        onSelectTopic={(t) => {
          closeOverlayPanel();
          navigateTopic(t.topicId);
        }}
        onSelectNote={(n) => {
          closeOverlayPanel();
          setCurrentTab("notes");
          router.push(`/course/${courseSlug}/topic/${n.topicId}/notes`);
        }}
      />

      <NoteEditorModal
        open={noteEditor.open}
        noteId={noteEditor.noteId}
        lineId={noteEditor.lineId}
        anchorTs={editorNote?.ts ?? editorLine?.ts}
        anchorQuote={editorNote?.anchorQuote ?? editorLine?.text}
        initialText={editorNote?.text ?? ""}
        initialTags={editorNote?.tags ?? []}
        onCancel={closeNoteEditor}
        onSave={saveNote}
      />

      <CourseCompleteModal
        open={completeOpen}
        courseTitle={course.title}
        onClose={() => setCompleteOpen(false)}
        onNextCourse={() => {
          setCompleteOpen(false);
          showToast("Next course → Course Hub (out of scope).");
        }}
        onViewCertificate={() => {
          setCompleteOpen(false);
          track("certificate_view", { from: "complete_modal" });
          router.push(`/course/${courseSlug}/certificate`);
        }}
        onBackToCourse={() => setCompleteOpen(false)}
      />

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
