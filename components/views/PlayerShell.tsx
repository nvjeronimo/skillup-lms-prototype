"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { CoursePlayerTopbar, type TopbarSize } from "@/components/organisms/CoursePlayerTopbar";
import { Sidebar, type SidebarVariant } from "@/components/organisms/Sidebar";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { TopicHeader } from "@/components/molecules/TopicHeader";
import { ContentTabs } from "@/components/organisms/ContentTabs";
import { TopicFooterNav } from "@/components/organisms/TopicFooterNav";
import { NotificationsPanel } from "@/components/organisms/NotificationsPanel";
import { SavedPanel, type SavedFilter } from "@/components/organisms/SavedPanel";
import { NoteEditorModal } from "@/components/organisms/NoteEditorModal";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore, type TabSlug } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import {
  course,
  getTopic,
  getAdjacentTopics,
  notifications,
  savedNotes,
  savedTopics,
  topicNotes,
  topicDownloads,
} from "@/lib/data";

export interface PlayerShellProps {
  courseSlug: string;
  topicId: string;
  children: React.ReactNode;
}

const DESC =
  "In this lesson we walk through the DMAIC methodology end-to-end and how each phase builds on the last.";

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
  const closeNoteEditor = useLmsStore((s) => s.closeNoteEditor);
  const saveNote = useLmsStore((s) => s.saveNote);
  const allNotes = useLmsStore((s) => s.notes);
  const toast = useLmsStore((s) => s.toast);
  const showToast = useLmsStore((s) => s.showToast);
  const clearToast = useLmsStore((s) => s.clearToast);

  const [savedFilter, setSavedFilter] = React.useState<SavedFilter>("all");

  // Keep currentTopicId in sync with the route.
  React.useEffect(() => {
    setCurrentTopic(topicId);
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
  const sidebarVariant: SidebarVariant =
    bp === "tablet" ? "Collapsed" : sidebarExpanded ? "Expanded" : "Collapsed";
  const showInlineSidebar = bp !== "mobile";

  const notesCount = topicNotes(topicId, allNotes).length;
  const downloadsCount = topicDownloads(topicId).length;

  const tabs = [
    { slug: "transcript" as TabSlug, label: "Transcript", href: `/course/${courseSlug}/topic/${topicId}` },
    { slug: "notes" as TabSlug, label: "Notes", count: notesCount, href: `/course/${courseSlug}/topic/${topicId}/notes` },
    { slug: "downloads" as TabSlug, label: "Downloads", count: downloadsCount, href: `/course/${courseSlug}/topic/${topicId}/downloads` },
  ];

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
    <div className="flex h-[100dvh] flex-col bg-lms-bg-secondary-subtle">
      <CoursePlayerTopbar
        size={topbarSize}
        breadcrumb={[course.title, topic.moduleTitle, topic.title]}
        showNotifications
        onMenu={() => setMobileDrawerOpen(true)}
        onAi={() => showToast("AI assistant is out of scope for this prototype.")}
        onBookmark={() => openOverlayPanel("saved")}
        onNotifications={() => openOverlayPanel("notifications")}
        onTheme={() => showToast("Single light theme in this prototype.")}
        onClose={() => showToast("Exit player → Course Hub (out of scope).")}
      />

      <div className="flex min-h-0 flex-1">
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

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="lms-scroll flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-4xl px-4 py-4 md:px-6 md:py-6">
              <VideoPlayer
                durationSeconds={durationSeconds}
                currentTime={currentVideoTimestamp}
                onSeek={(s) => seekVideoTo(s)}
              />

              <div className="mt-5">
                <TopicHeader
                  type={topic.type}
                  title={topic.title}
                  duration={topic.duration}
                  description={DESC}
                />
              </div>

              <div className="mt-5">
                <ContentTabs tabs={tabs} active={activeTab} />
                {children}
              </div>
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
            className="lms-animate-fade absolute inset-0"
            style={{ background: "color-mix(in srgb, var(--lms-text-primary) 50%, transparent)" }}
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden
          />
          <div className="lms-animate-slide-left absolute left-0 top-0 h-full">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-lms-border-secondary bg-lms-bg-primary px-4 py-3">
                <span className="lms-text-md-semibold text-lms-text-primary">Course menu</span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-lms-text-tertiary hover:bg-lms-bg-secondary"
                >
                  <Icon icon={X} size={20} />
                </button>
              </div>
              <div className="min-h-0 flex-1">
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

      <Toast message={toast} onDone={clearToast} />
    </div>
  );
}
