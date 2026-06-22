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
import { TranscriptControls } from "@/components/molecules/TranscriptControls";
import { TopicFooterNav } from "@/components/organisms/TopicFooterNav";
import { NotificationsPanel } from "@/components/organisms/NotificationsPanel";
import { SavedPanel, type SavedFilter } from "@/components/organisms/SavedPanel";
import { NoteEditorModal } from "@/components/organisms/NoteEditorModal";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore, type TabSlug } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { topicFamily, topicDescription, getDownloads } from "@/lib/content";
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
  const editorLine =
    noteEditor.lineId && topic.transcript
      ? topic.transcript.find((l) => l.id === noteEditor.lineId)
      : undefined;

  const durationSeconds = 200;

  return (
    <div className="flex h-[100dvh] flex-col bg-lms-bg-secondary">
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
            onToggleSidebar={toggleSidebar}
            onToggleModule={toggleModule}
            onSelectTopic={navigateTopic}
            onToggleBookmark={toggleBookmark}
          />
        ) : null}

        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-lms-bg-primary",
            showInlineSidebar && "rounded-xl border border-lms-border-secondary",
          )}
        >
          <div className="lms-scroll flex-1 overflow-y-auto">
            <div className="w-full p-4">
              {isLocked ? (
                children
              ) : isVideo ? (
                <>
                  <VideoPlayer
                    durationSeconds={durationSeconds}
                    currentTime={currentVideoTimestamp}
                    onSeek={(s) => {
                      seekVideoTo(s);
                      track("video_seek", { to: s });
                    }}
                  />
                  {/* Topic title below the player (ICP Phase 1 canonical layout). */}
                  <h1 className="lms-text-display-xs-semibold mt-5 text-lms-text-primary">
                    {topic.title}
                  </h1>
                  <div className="mt-4">
                    <ContentTabs
                      tabs={tabs}
                      active={activeTab}
                      variant={bp === "mobile" ? "select" : "tabs"}
                      rightSlot={
                        activeTab === "transcript" ? (
                          <TranscriptControls
                            showLanguage={bp !== "mobile"}
                            showDownload={bp !== "mobile"}
                            onLanguageChange={(c) => track("video_language_change", { language: c })}
                            onDownload={() => {
                              track("download_transcript", { format: "txt" });
                              showToast("Downloading transcript…");
                            }}
                            onAddNote={() =>
                              openNoteEditor({ lineId: activeLineId ?? topic.transcript?.[0]?.id })
                            }
                          />
                        ) : undefined
                      }
                    />
                    {children}
                  </div>
                </>
              ) : (
                <>
                  <TopicHeader
                    type={topic.type}
                    title={topic.title}
                    duration={topic.duration}
                    description={topicDescription(topic)}
                  />
                  <div className="mt-5">
                    <ContentTabs tabs={tabs} active={activeTab} />
                    {children}
                  </div>
                </>
              )}
            </div>
          </div>

          <TopicFooterNav
            position={position}
            total={total}
            title={topic.title}
            previousDisabled={!previous}
            nextDisabled={!next}
            compact={bp === "mobile"}
            onPrevious={() => previous && navigateTopic(previous.id)}
            onNext={() => next && navigateTopic(next.id)}
          />
        </main>
      </div>

      {/* Mobile drawer */}
      {bp === "mobile" && mobileDrawerOpen ? (
        <div className="fixed inset-0 z-40">
          <div
            className="lms-backdrop lms-animate-fade absolute inset-0"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden
          />
          <div className="lms-animate-slide-left absolute left-0 top-0 h-full">
            {/* Drawer goes straight to the course header; a floating X closes it. */}
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-lms-text-tertiary hover:bg-lms-bg-secondary"
              >
                <Icon icon={X} size={20} />
              </button>
              <Sidebar
                course={course}
                currentTopicId={topicId}
                variant="Mobile"
                collapsedModules={collapsedModules}
                bookmarks={bookmarks}
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

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
