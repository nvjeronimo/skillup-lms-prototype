"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { CoursePlayerTopbar, type TopbarSize } from "@/components/organisms/CoursePlayerTopbar";
import { Sidebar, type SidebarVariant } from "@/components/organisms/Sidebar";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { ResumeBanner } from "@/components/molecules/ResumeBanner";
import { ContentTabs } from "@/components/organisms/ContentTabs";
import { TopicHeader } from "@/components/molecules/TopicHeader";
import { TopicFooterMeta } from "@/components/molecules/TopicFooterMeta";
import { TopicActionBar, type TopicActionState } from "@/components/molecules/TopicActionBar";
import { TopicFooterNav } from "@/components/organisms/TopicFooterNav";
import type { Milestone } from "@/components/organisms/CourseProgressionButton";
import { NotificationsPanel } from "@/components/organisms/NotificationsPanel";
import { SavedPanel, type SavedFilter } from "@/components/organisms/SavedPanel";
import { DiscussionsPanel } from "@/components/organisms/DiscussionsPanel";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/lib/icons";
import { MessagesSquare } from "lucide-react";
import { NoteEditorModal } from "@/components/organisms/NoteEditorModal";
import { CourseCompleteModal } from "@/components/organisms/CourseCompleteModal";
import { Toast } from "@/components/organisms/Toast";
import { nextCourseInProgram, playerCourse } from "@/lib/platform/catalog";
import { coursePageHref } from "@/lib/platform/hrefs";
import { MY_LEARNING_HREF, courseHomeHref } from "@/lib/platform/routes";
import { useLmsStore, type TabSlug } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useDialog } from "@/lib/useDialog";
import {
  getPartnerLab,
  topicFamily,
  topicDescription,
  getDownloads,
  getTranscript,
  getDiscussionThreads,
  getByline,
  FOOTER_AUTHOR_FAMILIES,
} from "@/lib/content";
import {
  getCourseBySlug,
  getTopic,
  getAdjacentTopics,
  getCourseForTopic,
  flatTopics,
  notifications,
  savedNotes,
  savedTopics,
  topicNotes,
  user,
} from "@/lib/data";
import { DemoControlsMenu } from "@/components/molecules/DemoControlsMenu";

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
  const resumePositions = useLmsStore((s) => s.resumePositions);
  const saveResumePosition = useLmsStore((s) => s.saveResumePosition);
  const clearResumePosition = useLmsStore((s) => s.clearResumePosition);
  /** Dismissed for this visit once the learner resumes or restarts. */
  const [resumeHandled, setResumeHandled] = React.useState(false);
  const storedResume = resumePositions[topicId];
  const showResume = !resumeHandled && typeof storedResume === "number" && storedResume > 0;
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const activeLineId = useLmsStore((s) => s.activeLineId);
  const collapsedModules = useLmsStore((s) => s.collapsedModules);
  const toggleModule = useLmsStore((s) => s.toggleModule);
  const bookmarks = useLmsStore((s) => s.bookmarks);
  const toggleBookmark = useLmsStore((s) => s.toggleBookmark);
  const completedTopics = useLmsStore((s) => s.completedTopics);
  const submittedTopics = useLmsStore((s) => s.submittedTopics);
  const markComplete = useLmsStore((s) => s.markComplete);
  const theme = useLmsStore((s) => s.theme);
  const toggleTheme = useLmsStore((s) => s.toggleTheme);
  const discussionsPreview = useLmsStore((s) => s.discussionsPreview);
  // A catalogue course plays the sample content under its own slug and title.
  const activeCourse = playerCourse(courseSlug);
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
  // (start/submit a quiz, upload an assignment, tick activity steps, download a
  // lab, finish the ORA journey), so they get no Mark-as-Complete bar — it would
  // duplicate the action they already own. Passive content (video / reading /
  // podcast / discussion) gets the completion action in the FOOTER only.
  // A partner lab (Google, Microsoft) is the exception among labs: its content has no
  // action of its own. Microsoft sends nothing back, so the learner marks it complete;
  // Google sends a score, so there is nothing to mark and only the status shows once done.
  const partnerLab = getPartnerLab(topic);
  const hasInFrameAction =
    family === "assessment" ||
    family === "graded" ||
    family === "activity" ||
    (family === "lab" && !partnerLab) ||
    family === "ora";
  // VILT never exposes a manual "Mark as complete". Completion comes from one of
  // two paths, whichever happens first: attendance on the live (join + ≥50%,
  // automatic) or watching the recording (Video ≥90%). A manual button would
  // imply the live is optional homework and would double-count against the
  // recording's ≥90% rule — the completion note lives inside the VILT lane
  // instead. See topic-types-inventory.md §3.
  const isVilt = family === "vilt";
  // Blocked types can't be completed — no manual action, ever.
  const isBlocked = family === "blocked";
  const isCompleted = completedTopics.has(topicId);
  const actionState: TopicActionState = isCompleted ? "completed" : "incomplete";
  const renderAction = () => (
    <TopicActionBar
      state={actionState}
      onComplete={() => markComplete(topicId)}
      // Quiz, ORA and VILT have no manual completion, and Video completes on its own at 90%
      // watched (reading-screen-matrix §4): their badge reads "Completed".
      manual={
        !(
          family === "assessment" ||
          family === "graded" ||
          family === "ora" ||
          family === "vilt" ||
          family === "video"
        )
      }
    />
  );
  const showAction =
    !isLocked && !hasInFrameAction && !isVilt && !isBlocked && !(partnerLab?.scored && !isCompleted);
  // DS shared-shell rule (§5): the manual "Mark as complete" ACTION renders only
  // in the footer, never in the header — a header CTA invites premature
  // completion. The header's top-right slot carries the ✓ "Marked as completed"
  // STATUS badge, and only once the topic is complete (any type).
  const headerStatus = isCompleted ? renderAction() : null;
  // The end-of-content action only belongs at the end of the CONTENT. The
  // Downloads and Notes tabs are short lists, so a second button there sits
  // in the same viewport as the header one and just reads as duplication.
  const bottomAction = showAction && activeTab === "transcript" ? (
    <div className="mt-6 flex justify-end border-t border-sko-border-subtle pt-5">
      {renderAction()}
    </div>
  ) : null;

  // Optional in-context discussion footer (Jul 29 decision): Discussion is no
  // longer a topic type — instead, a "Discuss this topic" region deep-links into
  // the course-level Discussions panel on this topic's thread. Off for locked and
  // blocked topics, and only on the primary tab.
  const discussFooter =
    discussionsPreview && !isLocked && !isBlocked && activeTab === "transcript" ? (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-subtle px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Icon icon={MessagesSquare} size={18} className="text-sko-text-primary" />
          <div className="flex flex-col">
            <span className="sk-text-body-medium-semibold text-sko-text-default">Discuss this topic</span>
            <span className="sk-text-body-small-regular text-sko-text-subtle">
              Join the conversation with your cohort.
            </span>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => openOverlayPanel("discussions")}>
          Open discussion
        </Button>
      </div>
    ) : null;

  // Shared footer-meta contract (§175): the feedback row (Like/Dislike/Report)
  // renders on every content type; the Author & Updated row only on authored
  // types. Video is excluded — it carries its own chrome footer (license etc.).
  const footerMeta =
    !isLocked && !isBlocked && family !== "video" && activeTab === "transcript" ? (
      <TopicFooterMeta
        byline={FOOTER_AUTHOR_FAMILIES.includes(family) ? getByline(topic) : undefined}
        onReport={() => showToast("Thanks, we'll take a look.")}
      />
    ) : null;

  // Footer progression: Next normally, but "Go to next Module" at a module boundary
  // and "Go to next Course" at the final topic. The milestone ("MODULE COMPLETED") only
  // shows once this topic is done: on an unfinished last topic the footer stays a plain Next.
  // The course counts as complete when every topic the learner can finish in the prototype
  // is finished. Left out: locked topics, types not available yet and VILT (completes by
  // attendance). A quiz completes when it is submitted; a graded assignment counts once it
  // is submitted, since its review happens outside the prototype.
  const courseDone = flatTopics(getCourseForTopic(topicId)).every((t) => {
    const f = topicFamily(t.type);
    return (
      t.locked ||
      f === "blocked" ||
      f === "vilt" ||
      completedTopics.has(t.id) ||
      (f === "graded" && submittedTopics.has(t.id))
    );
  });
  const milestone: Milestone = !next
    ? courseDone
      ? "Course"
      : "Topic"
    : isCompleted && next.moduleId !== topic.moduleId
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
    lab: "Lab",
    ora: "Project",
    lessonPage: "Lesson",
    podcast: "Episode",
    vilt: topic.type === "VILT-Recording" ? "Recording" : "Session",
    blocked: "About",
  };

  // Reading has no Downloads tab (17 Sep decision): its files are linked in the body, and
  // with one option left the tab bar is hidden.
  const tabs = isVideo
    ? [{ ...transcriptTab, label: "Transcript" }, notesTab, downloadsTab]
    : family === "reading" || partnerLab
      ? // Same rule for a partner lab: it has no files of ours, so no Downloads tab.
        [{ ...transcriptTab, label: PRIMARY_LABEL[family] }]
      : [{ ...transcriptTab, label: PRIMARY_LABEL[family] }, downloadsTab];
  const showTabs = tabs.length > 1;

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
    <div className="flex h-[100dvh] flex-col bg-sko-bg-subtle">
      <CoursePlayerTopbar
        size={topbarSize}
        showNotifications
        notificationsCount={notifications.filter((n) => n.unread && !notificationsRead.has(n.id)).length}
        onMenu={() => {
          track("mobile_drawer_open");
          setMobileDrawerOpen(true);
        }}
        menuExpanded={bp === "mobile" && mobileDrawerOpen}
        menuControls={COURSE_DRAWER_ID}
        onBookmark={() => openOverlayPanel("saved")}
        onNotifications={() => openOverlayPanel("notifications")}
        showDiscussions={discussionsPreview}
        onDiscussions={() => openOverlayPanel("discussions")}
        showTheme
        theme={theme === "dark" ? "Dark" : "Light"}
        onTheme={toggleTheme}
        // Leaving the player goes back to the page of the course it was opened for.
        onClose={() => router.push(courseHomeHref(courseSlug))}
        accountMenu={
          <DemoControlsMenu
            userName={user.name}
            userAvatarUrl={user.avatarUrl}
            compact={topbarSize === "Mobile"}
          />
        }
      />

      {/* Body — floating white card(s) on a secondary-tint surface. Desktop/tablet
          add the sidebar + a 16px gutter; mobile keeps a smaller gutter so the
          tinted body shows around the single content card. */}
      <div className={cn("flex min-h-0 flex-1", showInlineSidebar ? "gap-4 p-4" : "p-3")}>
        {showInlineSidebar ? (
          <Sidebar
            course={activeCourse}
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
          id="main"
          tabIndex={-1}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-sko-border-subtle bg-sko-bg-page outline-none"
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
                    "sticky top-0 z-20 bg-sko-bg-page transition-[padding] duration-200 ease-out",
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
                      saveResumePosition(topicId, s);
                      track("video_seek", { to: s });
                    }}
                  />
                </div>
                {showResume ? (
                  <div className="px-4 pb-1 pt-1">
                    <ResumeBanner
                      seconds={storedResume}
                      onResume={() => {
                        seekVideoTo(storedResume);
                        track("video_resume", { topicId, from: storedResume });
                        setResumeHandled(true);
                      }}
                      onStartOver={() => {
                        seekVideoTo(0);
                        clearResumePosition(topicId);
                        track("video_restart", { topicId });
                        setResumeHandled(true);
                      }}
                    />
                  </div>
                ) : null}
                <div className="px-4 pb-4">
                  {/* Topic title below the player (ICP Phase 1 canonical layout).
                      The top-right action is hidden on mobile — it lives only at
                      the end of the content there. */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="sk-text-headline-small-semibold min-w-0 text-sko-text-default">
                      {topic.title}
                    </h1>
                    {headerStatus && bp !== "mobile" ? (
                      <div className="shrink-0">{headerStatus}</div>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    {showTabs ? (
                      <ContentTabs
                        tabs={tabs}
                        active={activeTab}
                        variant={bp === "mobile" ? "select" : "tabs"}
                      />
                    ) : null}
                    {children}
                  </div>
                  {bottomAction}
                  {discussFooter}
                </div>
              </>
            ) : (
              <div className="w-full p-4">
                {/* Completion action lives on the meta row (right-aligned), so the
                    title keeps the full content width. */}
                {/* Phase 1 quiz handoff §7: on a quiz the header carries title,
                    type and duration only. The description is off, and the
                    author row is off because assessment types have no single
                    author — a shared-shell rule, not a preference. The status
                    badge turns on by completion state. */}
                <TopicHeader
                  type={topic.type}
                  title={topic.title}
                  duration={topic.duration}
                  showDescription={family !== "assessment"}
                  description={topicDescription(topic)}
                  rightSlot={headerStatus ?? undefined}
                />
                {/* A partner lab opens with the divider Reading uses, 12 under the header. */}
                <div className={partnerLab ? "mt-3" : "mt-5"}>
                  {showTabs ? (
                    <ContentTabs
                      tabs={tabs}
                      active={activeTab}
                      variant={bp === "mobile" ? "select" : "tabs"}
                    />
                  ) : null}
                  {children}
                </div>
                {footerMeta}
                {bottomAction}
                {discussFooter}
              </div>
            )}
          </div>

          <TopicFooterNav
            position={position}
            total={total}
            title={topic.title}
            milestone={milestone}
            previousDisabled={!previous}
            // On the last topic, Next opens the course-complete dialog: only once the course is done.
            nextDisabled={!next && !courseDone}
            compact={bp === "mobile"}
            onPrevious={() => previous && navigateTopic(previous.id)}
            onNext={() => {
              if (next) navigateTopic(next.id);
              else if (courseDone) setCompleteOpen(true);
            }}
          />
        </main>
      </div>

      {/* Mobile drawer — a modal dialog (focus moves in, is trapped, the page
          behind is inert, Esc / backdrop / Close dismiss, focus returns to the
          "Open course menu" trigger). */}
      <MobileCourseDrawer
        open={bp === "mobile" && mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        {(titleId) => (
          <Sidebar
            course={activeCourse}
            currentTopicId={topicId}
            variant="Mobile"
            collapsedModules={collapsedModules}
            bookmarks={bookmarks}
            completed={completedTopics}
            onToggleModule={toggleModule}
            onSelectTopic={navigateTopic}
            onToggleBookmark={toggleBookmark}
            onCloseMobile={() => setMobileDrawerOpen(false)}
            mobileTitleId={titleId}
          />
        )}
      </MobileCourseDrawer>

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

      <DiscussionsPanel
        open={openPanel === "discussions"}
        onClose={closeOverlayPanel}
        topicTitle={topic.title}
        topicDuration={topic.duration}
        threads={getDiscussionThreads(topic)}
        onPost={() => showToast("Reply posted to the discussion.")}
        onOpenThread={() => showToast("Opening thread…")}
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
        courseTitle={activeCourse.title}
        onClose={() => setCompleteOpen(false)}
        onNextCourse={() => {
          setCompleteOpen(false);
          // The next course of the program, on its page; a course of no program, or the last
          // one, goes back to My Learning.
          const nextCourse = nextCourseInProgram(courseSlug);
          router.push(nextCourse ? coursePageHref(nextCourse.slug) : MY_LEARNING_HREF);
        }}
        onViewCertificate={() => {
          setCompleteOpen(false);
          track("certificate_view", { from: "complete_modal" });
          router.push(`/course/${courseSlug}/certificate`);
        }}
        onBackToCourse={() => {
          setCompleteOpen(false);
          router.push(courseHomeHref(courseSlug));
        }}
      />

      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}

const COURSE_DRAWER_ID = "course-drawer";

/** The mobile course drawer as a modal dialog (see useDialog). */
function MobileCourseDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: (titleId: string) => React.ReactNode;
}) {
  const titleId = React.useId();
  const ref = useDialog(open, onClose);
  if (!open) return null;
  return (
    <div ref={ref} className="fixed inset-0 z-40">
      <div className="sk-backdrop sk-animate-fade absolute inset-0" onClick={onClose} aria-hidden />
      <div
        id={COURSE_DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="sk-animate-slide-left absolute left-0 top-0 h-full"
      >
        {children(titleId)}
      </div>
    </div>
  );
}
