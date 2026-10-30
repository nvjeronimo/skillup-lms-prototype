"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { CoursePlayerTopbar, type TopbarSize } from "@/components/organisms/CoursePlayerTopbar";
import type { SearchScope } from "@/components/platform/harbor/HarborSearch";
import { courseProgressPct } from "@/lib/courses/outline";
import { Sidebar, type SidebarVariant } from "@/components/organisms/Sidebar";
import { navigateWithTransition } from "@/lib/motion/pageTransition";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { ResumeBanner } from "@/components/molecules/ResumeBanner";
import { ContentTabs } from "@/components/organisms/ContentTabs";
import { TopicHeader } from "@/components/molecules/TopicHeader";
import { TopicFooterMeta } from "@/components/molecules/TopicFooterMeta";
import { TopicActionBar, type TopicActionState } from "@/components/molecules/TopicActionBar";
import { TopicEndActionContext } from "@/lib/topicEndAction";
import { TopicFooterNav } from "@/components/organisms/TopicFooterNav";
import type { Milestone } from "@/components/organisms/CourseProgressionButton";
import { NotificationsPanel } from "@/components/organisms/NotificationsPanel";
import { SavedPanel, type SavedFilter } from "@/components/organisms/SavedPanel";
import { DiscussionsPanel } from "@/components/organisms/DiscussionsPanel";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Icon } from "@/lib/icons";
import { MessagesSquare } from "lucide-react";
import { NoteEditorModal } from "@/components/organisms/NoteEditorModal";
import { CourseCompleteModal } from "@/components/organisms/CourseCompleteModal";
import { CompletionQuestionModal } from "@/components/organisms/CompletionQuestionModal";
import { Toast } from "@/components/organisms/Toast";
import { getCatalogCourse, nextCourseInProgram, playerCourse } from "@/lib/platform/catalog";
import { coursePageHref } from "@/lib/platform/hrefs";
import { DASHBOARD_HREF, MY_LEARNING_HREF, courseHomeHref } from "@/lib/platform/routes";
import { useLmsStore, type TabSlug } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { CONTENT_MEASURE, CONTENT_PAD, CONTENT_PB, CONTENT_PT, CONTENT_PX } from "@/lib/contentPadding";
import { useDialog } from "@/lib/useDialog";
import { useExitTransition } from "@/lib/useExitTransition";
import { useSheetDrag } from "@/lib/useSheetDrag";
import { MOTION_MS } from "@/lib/motion/tokens";
import { isFreshCompletion } from "@/lib/motion/completion";
import { inertProps } from "@/lib/inert";
import {
  completesByHand,
  completionNoun,
  completionReason,
  getPartnerLab,
  getActivity,
  topicFamily,
  topicDescription,
  getDownloads,
  getCaptions,
  getMediaSeconds,
  getTranscript,
  isPlaybackMeasured,
  quizBadgeLabel,
  getDiscussionThreads,
  getByline,
  FOOTER_AUTHOR_FAMILIES,
  type TopicFamily,
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
  DEFAULT_USER,
} from "@/lib/data";
import { useHydrated } from "@/lib/persona-gate";
import { useEdxScope } from "@/lib/edx-scope";
import { courseSearchScope as searchScopeOf } from "@/lib/courseSearchScope";
import { DemoControlsMenu } from "@/components/molecules/DemoControlsMenu";
import { lineAt } from "@/lib/playback/lineAt";
import { usePlaybackRecorder } from "@/lib/playback/usePlaybackRecorder";
import { ArrivalContext, useArrivalController, useCourseArrival } from "@/lib/arrival/useArrival";
import { courseArrivalPath, topicArrivalPath } from "@/lib/arrival/visits";
import { TopicSkeleton } from "./TopicSkeleton";


export interface PlayerShellProps {
  courseSlug: string;
  topicId: string;
  children: React.ReactNode;
}

export function PlayerShell({ courseSlug, topicId, children }: PlayerShellProps) {
  const router = useRouter();
  // The learner, or the synthetic persona once hydrated (Nelson, 25 Oct 2026; lib/persona-gate).
  const hydrated = useHydrated();
  const learner = hydrated ? user : DEFAULT_USER;
  const pathname = usePathname();
  const bp = useBreakpoint();
  // Open edX scope (decision 035): Next never asks, and the topic has no Notes or Downloads tab.
  const edx = useEdxScope();

  const topic = getTopic(topicId);
  const { previous, next, total, position } = getAdjacentTopics(topicId);

  // Arrival (motion-matrix §7.9): the first visit of a topic in the session shows the body's
  // skeleton for the simulated load, then the body's sections rise in order and the rings
  // sweep. Keyed by the topic (its Notes / Downloads tabs are the same visit); the shell
  // (top bar, sidebar, footer) stays put. A revisit has the template's page fade only.
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const arrival = useArrivalController(topicArrivalPath(pathname) ?? pathname, bodyRef);
  // The shell's rings (top bar, both sidebars) sweep on the course's first visit only.
  const courseArrival = useCourseArrival(courseArrivalPath(courseSlug), arrival);

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
  const syncPlayhead = useLmsStore((s) => s.syncPlayhead);
  const setActiveLine = useLmsStore((s) => s.setActiveLine);
  const seekSeq = useLmsStore((s) => s.seekSeq);
  // Played time goes to the store in a few writes, not on every tick (usePlaybackRecorder).
  const playback = usePlaybackRecorder(topicId, topic ? getMediaSeconds(topic) : 0);
  const activeLineId = useLmsStore((s) => s.activeLineId);
  const bookmarks = useLmsStore((s) => s.bookmarks);
  const toggleBookmark = useLmsStore((s) => s.toggleBookmark);
  const completedTopics = useLmsStore((s) => s.completedTopics);
  const lastCompleted = useLmsStore((s) => s.lastCompleted);
  const submittedTopics = useLmsStore((s) => s.submittedTopics);
  const markComplete = useLmsStore((s) => s.markComplete);
  const theme = useLmsStore((s) => s.theme);
  const toggleTheme = useLmsStore((s) => s.toggleTheme);
  const discussionsPreview = useLmsStore((s) => s.discussionsPreview);
  // A catalogue course plays the sample content under its own slug and title.
  const activeCourse = playerCourse(courseSlug);
  // The player's search + Assistant is about this course (Nelson, 26 Oct 2026): its topics.
  const courseSearchScope = React.useMemo<SearchScope>(
    () => searchScopeOf(activeCourse, courseSlug),
    [activeCourse, courseSlug],
  );
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
  const completionFlow = useLmsStore((s) => s.completionFlow);
  const labLaunch = useLmsStore((s) => s.labLaunch);
  /** The question Next asks on a topic the platform cannot measure (the rule since 12 Oct 2026). */
  const [askOpen, setAskOpen] = React.useState(false);
  // Sticky video: docks (shrinks) once the content scrolls past the top.
  const [videoDocked, setVideoDocked] = React.useState(false);
  // Docking shrinks the band by up to ~210 px. Without help the browser's scroll anchoring pulled
  // scrollTop back to 0 as it shrank, the band undocked and grew, and the page jumped back up
  // (Nelson, 23 Oct 2026). So: no scroll anchoring on the body, undock only at the very top, and
  // while docked a spacer at the end gives back the height the band lost, so the scroll range
  // does not shrink under the finger.
  const bandRef = React.useRef<HTMLDivElement>(null);
  const dockedRef = React.useRef(false);
  const fullBandHeight = React.useRef(0);
  const [dockGap, setDockGap] = React.useState(0);
  React.useEffect(() => {
    dockedRef.current = videoDocked;
  }, [videoDocked]);
  React.useEffect(() => {
    const band = bandRef.current;
    if (!band || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      const h = band.getBoundingClientRect().height;
      if (!dockedRef.current) fullBandHeight.current = h;
      setDockGap(dockedRef.current ? Math.max(0, Math.round(fullBandHeight.current - h)) : 0);
    });
    ro.observe(band);
    return () => ro.disconnect();
  });

  // Keep currentTopicId in sync with the route + emit topic_enter.
  React.useEffect(() => {
    setCurrentTopic(topicId);
    setAskOpen(false);
    // A topic opens at 00:00 (the resume banner offers the stored position): the playhead of the
    // previous video must not carry over, or its time would count as played here.
    seekVideoTo(0);
    track("topic_enter", { topicId });
  }, [topicId, setCurrentTopic, seekVideoTo]);

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
    // A topic id the course does not have (an old link, a typo): say so, and give the two ways
    // back, as the app's own 404 does (app/not-found.tsx).
    return (
      <main
        id="main"
        tabIndex={-1}
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-sko-bg-faint px-4 py-12 text-center outline-none"
      >
        <div className="flex max-w-[480px] flex-col gap-2">
          <h1 className="sk-text-headline-small-semibold text-sko-text-default">This topic is not in the course</h1>
          <p className="sk-text-body-large-regular text-sko-text-muted">
            The link may be old or mistyped. The course page lists every topic and where you left off.
          </p>
        </div>
        <div className="flex w-full max-w-[480px] flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href={courseHomeHref(courseSlug)} hierarchy="primary" size="lg">
            Go to the course
          </ButtonLink>
          <ButtonLink href={DASHBOARD_HREF} hierarchy="secondary" size="lg">
            Dashboard
          </ButtonLink>
        </div>
      </main>
    );
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


  // Sticky video heights per viewport (DS Phase-1 §0): full hero → docked band. From tablet up the
  // player opens at half the viewport and docks only once the learner scrolls to the transcript
  // (Nelson, 22 Oct 2026), never taller than the 16:9 picture at its width (56.25cqi of the band,
  // which is a size container): a portrait tablet would otherwise show a player taller than wide.
  // On a phone it stays 16:9.
  const VIDEO_FULL = { mobile: 211, tablet: "min(50dvh, 56.25cqi)", desktop: "min(50dvh, 56.25cqi)" } as const;
  const VIDEO_DOCK = { mobile: 160, tablet: 180, desktop: 240 } as const;
  const videoHeight = videoDocked ? VIDEO_DOCK[bp] : VIDEO_FULL[bp];

  // Option A — Nav in footer · action in content.
  // Quiz / Practice / Activity carry their OWN action inside the content frame
  // (start/submit a quiz, upload an assignment, tick activity steps, download a
  // lab, finish the ORA journey), so they get no Mark-as-Complete bar — it would
  // duplicate the action they already own. Passive content (video / reading /
  // podcast / discussion) gets the completion action in the FOOTER only.
  // A partner lab (Google, Microsoft) is the exception among labs: its content has no
  // action of its own and nothing comes back from the partner, so the learner marks it
  // complete here, like a Reading.
  const partnerLab = getPartnerLab(topic);
  // A SCORM activity plays its package in the page, with no tabs (Figma Activity Row A, 28 Oct 2026).
  const scormActivity = family === "activity" && getActivity(topic).kind === "scorm";
  // A lab running inside the page has no launch card, so Mark as Complete is the primary action.
  const labInPage = Boolean(partnerLab?.inPage) && labLaunch === "inline";
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
  // A video or podcast whose playback is measured completes by itself at 90% (BR-01, P1-46):
  // no Mark as Complete for it, and Next does not ask (Nelson, 21 Oct 2026). Once it is
  // completed, the status badge shows as for any topic.
  const measuredMedia = isPlaybackMeasured(topic);
  const actionState: TopicActionState = isCompleted ? "completed" : "incomplete";
  const renderAction = () => (
    <TopicActionBar
      state={actionState}
      // The first beat of the completion chain: the badge pops when the topic was completed now.
      fresh={isFreshCompletion(lastCompleted, topicId, Date.now())}
      onComplete={() => markComplete(topicId)}
      // On a partner lab the launch button is the primary action. SkillUp cannot tell whether the
      // lab has been opened, so Mark as Complete stays Secondary (19 Oct 2026).
      secondary={Boolean(partnerLab) && !labInPage}
    />
  );
  // The rule since 12 Oct 2026 (lab-third-party-platforms.md §4, after Navdeep's comments): on a
  // topic the platform cannot measure, Mark as Complete stays at the end of the content, and Next
  // asks whether the learner has completed it when they move on without the button. The demo
  // menu can switch the question off, which leaves the button alone as it was before.
  const asksOnNext = completionFlow === "ask-on-next" && completesByHand(topic) && !isLocked && !edx;
  const showAction =
    !isLocked && !hasInFrameAction && !isVilt && !isBlocked;
  // DS shared-shell rule (§5): the manual "Mark as complete" ACTION renders only
  // in the footer, never in the header — a header CTA invites premature
  // completion. The header's top-right slot carries the ✓ "Marked as completed"
  // STATUS badge, and only once the topic is complete (any type).
  const headerStatus = isCompleted ? renderAction() : null;
  // The end-of-content action only belongs at the end of the CONTENT. The
  // Downloads and Notes tabs are short lists, so a second button there sits
  // in the same viewport as the header one and just reads as duplication.
  // Since 13 Oct 2026 (Figma `Feedback-Mark`) it sits in the feedback row, on the right, and
  // drops under the feedback on a phone: no row of its own. Once the topic is completed the row
  // is feedback only, because the status is in the header (a video on a phone too, since 30 Oct 2026).
  const endAction =
    showAction && activeTab === "transcript" && !isCompleted && !measuredMedia
      ? renderAction()
      : null;

  // Optional in-context discussion footer (Jul 29 decision): Discussion is no
  // longer a topic type — instead, a "Discuss this topic" region deep-links into
  // the course-level Discussions panel on this topic's thread. Off for locked and
  // blocked topics, and only on the primary tab.
  const discussFooter =
    discussionsPreview && !isLocked && !isBlocked && activeTab === "transcript" ? (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-sko-border-subtle bg-sko-bg-subtle px-4 py-3">
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
        // No author on a partner lab (Lab screens, 19 Oct 2026).
        byline={FOOTER_AUTHOR_FAMILIES.includes(family) && !partnerLab ? getByline(topic) : undefined}
        onReport={() => showToast("Thanks, we'll take a look.")}
        action={endAction ?? undefined}
      />
    ) : null;

  // Footer progression: Next normally, but "Go to next Module" at a module boundary
  // and "Go to next Course" at the final topic. The milestone ("MODULE COMPLETED") only
  // shows once this topic is done: on an unfinished last topic the footer stays a plain Next.
  // The course counts as complete when every topic the learner can finish in the prototype
  // is finished. Left out: locked topics, types not available yet and VILT (completes by
  // attendance). A quiz completes when it is submitted; a graded assignment counts once it
  // is submitted, since its review happens outside the prototype.
  const courseTopics = flatTopics(getCourseForTopic(topicId));
  const countsAsDone = (t: (typeof courseTopics)[number]) => {
    const f = topicFamily(t.type);
    return (
      t.locked ||
      f === "blocked" ||
      f === "vilt" ||
      completedTopics.has(t.id) ||
      (f === "graded" && submittedTopics.has(t.id))
    );
  };
  const courseDone = courseTopics.every(countsAsDone);
  // What the course would be once this topic is completed: on the last topic, "Yes, I've
  // finished" can be the answer that finishes the course.
  const courseDoneAfterThis = courseTopics.every((t) => t.id === topicId || countsAsDone(t));
  const asksNow = asksOnNext && !isCompleted;
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
  // with one option left the tab bar is hidden. A quiz has no tab bar either (Figma A-1 and A-2
  // quiz screens; Nelson's SKO match review, 28 Oct 2026).
  const tabs = edx
    ? [{ ...transcriptTab, label: PRIMARY_LABEL[family] }]
    : isVideo
    ? [{ ...transcriptTab, label: "Transcript" }, notesTab, downloadsTab]
    : family === "reading" || family === "assessment" || scormActivity || partnerLab
      ? // Same rule for a partner lab: it has no files of ours, so no Downloads tab.
        [{ ...transcriptTab, label: PRIMARY_LABEL[family] }]
      : [{ ...transcriptTab, label: PRIMARY_LABEL[family] }, downloadsTab];
  const showTabs = tabs.length > 1;

  function navigateTopic(id: string) {
    setCurrentTopic(id);
    // The body cross-fades to the next topic while the shell holds still (lib/motion/pageTransition).
    navigateWithTransition(() => router.push(`/course/${courseSlug}/topic/${id}`));
  }

  // Note editor derived content
  const editorNote = noteEditor.noteId
    ? allNotes.find((n) => n.id === noteEditor.noteId)
    : undefined;
  const editorLine = noteEditor.lineId
    ? getTranscript(topic).find((l) => l.id === noteEditor.lineId)
    : undefined;

  const durationSeconds = getMediaSeconds(topic);

  return (
    <div className="flex h-[100dvh] flex-col bg-sko-bg-subtle">
      <ArrivalContext.Provider value={courseArrival}>
      <CoursePlayerTopbar
        // Chrome that holds still through a page transition (globals.css). Its view-transition-name
        // makes it a stacking context, so without a z-index the body painted over the profile menu
        // (Nelson, 25 Oct 2026); z-30 as the platform top bar, under the drawer (40) and modals.
        className="sk-vt-player-topbar relative z-30"
        size={topbarSize}
        showNotifications
        notificationsCount={notifications.filter((n) => n.unread && !notificationsRead.has(n.id)).length}
        onMenu={() => {
          track("mobile_drawer_open");
          setMobileDrawerOpen(true);
        }}
        menuExpanded={bp === "mobile" && mobileDrawerOpen}
        progressPct={courseProgressPct(activeCourse, completedTopics)}
        searchScope={courseSearchScope}
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
            userName={learner.name}
            userAvatarUrl={learner.avatarUrl}
            compact={topbarSize === "Mobile"}
          />
        }
      />
      </ArrivalContext.Provider>

      {/* Body — floating white card(s) on a secondary-tint surface. Desktop/tablet
          add the sidebar, 24 from the content (16 until Nelson, 25 Oct 2026: more space
          between columns); mobile keeps a smaller gutter so the
          tinted body shows around the single content card. */}
      <div className={cn("flex min-h-0 flex-1", showInlineSidebar ? "gap-6 p-4" : "p-3")}>
        {showInlineSidebar ? (
          <ArrivalContext.Provider value={courseArrival}>
          <Sidebar
            className="sk-vt-player-sidebar"
            course={activeCourse}
            currentTopicId={topicId}
            variant={sidebarVariant}
            bookmarks={bookmarks}
            completed={completedTopics}
            lastCompleted={lastCompleted}
            onToggleSidebar={toggleSidebar}
            onSelectTopic={navigateTopic}
            onToggleBookmark={toggleBookmark}
          />
          </ArrivalContext.Provider>
        ) : null}

        {/* The body's arrival (its skeleton, its cascade; the template reads it). */}
        <ArrivalContext.Provider value={arrival}>
        <main
          id="main"
          tabIndex={-1}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page outline-none"
        >
          <div
            ref={bodyRef}
            className="sk-scroll sk-scroll-instant flex-1 overflow-y-auto [overflow-anchor:none]"
            onScroll={(e) => {
              const top = e.currentTarget.scrollTop;
              // Dock past 8 px, undock only back at the top (hysteresis).
              setVideoDocked((prev) => (prev ? top > 0 : top > 8));
            }}
          >
            {/* Only under data-arrival="pending" (lib/arrival): the topic-shaped skeleton. */}
            {!arrival.decided || !arrival.released ? (
              <div {...inertProps(true)} className="sk-arrival-skeleton">
                <TopicSkeleton
                  bp={bp}
                  video={isVideo && !isLocked}
                  videoHeight={videoHeight}
                  tabs={showTabs && !isLocked}
                  title={topic.title}
                  completed={Boolean(headerStatus)}
                  description={!isLocked && !edx && family !== "assessment" ? topicDescription(topic) : undefined}
                />
              </div>
            ) : null}
            <div data-arrival-content="">
            {isLocked ? (
              <div data-arrive={0} className={cn(CONTENT_PAD[bp], CONTENT_MEASURE)}>{children}</div>
            ) : isVideo ? (
              <>
                {/* Sticky player band — the video stays visible at the top and
                    docks (shrinks) once the content scrolls past the top. */}
                <div
                  ref={bandRef}
                  data-arrive={0}
                  data-video-band=""
                  className={cn(
                    "sticky top-0 z-20 bg-sko-bg-page transition-[padding] duration-short4 ease-standard-decelerate [container-type:inline-size]",
                    videoDocked ? "px-0 pb-2 pt-0" : cn(CONTENT_PX[bp], CONTENT_PT[bp], "pb-3"),
                  )}
                >
                  <VideoPlayer
                    key={topicId}
                    // The course picture as the poster (Figma Video Cards 1–3 and 7); Six Sigma's own.
                    poster={getCatalogCourse(courseSlug)?.imageSrc ?? "/platform/course-six-sigma.jpg"}
                    durationSeconds={durationSeconds}
                    captions={getCaptions(topic)}
                    currentTime={currentVideoTimestamp}
                    seekKey={seekSeq}
                    heightPx={videoHeight}
                    docked={videoDocked}
                    onSeek={(s) => {
                      seekVideoTo(s);
                      saveResumePosition(topicId, s);
                      track("video_seek", { to: s });
                    }}
                    // Played time: no seek event. The player shows the running time itself; the
                    // store gets the coverage and resume position every few seconds, and the
                    // transcript line only when it changes.
                    onPlaybackAdvance={(from, to) => {
                      playback.advance(from, to);
                      const line = lineAt(getTranscript(topic), to);
                      if (line && line !== useLmsStore.getState().activeLineId) setActiveLine(line);
                    }}
                    onPlay={(at) => {
                      // Pressing Play answers the resume banner: it must not reappear as the position saves.
                      setResumeHandled(true);
                      track("video_play", { topicId, topicType: family, at });
                    }}
                    onPause={(at, reason) => {
                      playback.flush();
                      syncPlayhead(at);
                      // At the end there is nothing to resume: the next visit starts at 00:00.
                      if (reason === "end") clearResumePosition(topicId);
                      else saveResumePosition(topicId, at);
                      track(reason === "end" ? "video_complete" : "video_pause", { topicId, topicType: family, at });
                    }}
                    onRestart={() => {
                      syncPlayhead(0);
                      track("video_restart", { topicId, from: durationSeconds });
                    }}
                  />
                </div>
                {showResume ? (
                  <div className={cn(CONTENT_PX[bp], CONTENT_MEASURE, "pb-1 pt-1")}>
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
                <div className={cn(CONTENT_PX[bp], CONTENT_PB[bp], CONTENT_MEASURE)}>
                  {/* Topic header below the player: the type · duration meta row with the completed
                      status on the right, then the title, on every breakpoint (Nelson, 30 Oct 2026;
                      ICP Video Topic-Header with the meta row on). No description, as in the ICP. */}
                  <div data-arrive={1}>
                    <TopicHeader
                      type={topic.type}
                      title={topic.title}
                      duration={topic.duration}
                      durationInvented={
                        NO_EFFORT_FAMILIES.includes(family) ? "duration: no time estimate for this type in Open edX" : undefined
                      }
                      showDescription={false}
                      rightSlot={headerStatus ?? undefined}
                    />
                  </div>
                  <div data-arrive={2} className="mt-6">
                    {showTabs ? (
                      <ContentTabs
                        tabs={tabs}
                        active={activeTab}
                        // Tabs on every breakpoint, as on desktop (Nelson, 22 Oct 2026: no dropdown on phones).
                        variant="tabs"
                      />
                    ) : null}
                    {/* The transcript tab owns the feedback row, so it receives the action. */}
                    <TopicEndActionContext.Provider value={endAction}>
                      {children}
                    </TopicEndActionContext.Provider>
                  </div>
                  {discussFooter ? <div data-arrive={3}>{discussFooter}</div> : null}
                </div>
                <div aria-hidden="true" style={{ height: dockGap }} />
              </>
            ) : (
              <div className={cn(CONTENT_PAD[bp], CONTENT_MEASURE)}>
                {/* Completion action lives on the meta row (right-aligned), so the
                    title keeps the full content width. */}
                {/* Phase 1 quiz handoff §7: on a quiz the header carries title,
                    type and duration only. The description is off, and the
                    author row is off because assessment types have no single
                    author — a shared-shell rule, not a preference. The status
                    badge turns on by completion state. */}
                <div data-arrive={0}>
                  <TopicHeader
                    type={topic.type}
                    // A quiz names its assignment type, or "Practice" (QZ3, 28 Oct 2026).
                    typeLabel={family === "assessment" ? quizBadgeLabel(topic) : undefined}
                    title={topic.title}
                    duration={topic.duration}
                    // The effort estimate counts text and video only: no time on these types in Open edX.
                    durationInvented={
                      NO_EFFORT_FAMILIES.includes(family) ? "duration: no time estimate for this type in Open edX" : undefined
                    }
                    showDescription={family !== "assessment"}
                    description={topicDescription(topic)}
                    rightSlot={headerStatus ?? undefined}
                  />
                </div>
                {/* A partner lab opens with the divider Reading uses, 12 under the header. A Reading
                    has a 1px rule 32 under the header and 32 above the text (Figma 5685:170897, r4
                    12 Oct; Nelson's SKO match review, 28 Oct 2026): the article's own 24 plus 8. */}
                <div
                  data-arrive={1}
                  className={
                    partnerLab
                      ? "mt-3"
                      : family === "reading" || scormActivity
                        ? "mt-8 border-t border-sko-border-subtle pt-2"
                        : "mt-6"
                  }
                >
                  {showTabs ? (
                    <ContentTabs
                      tabs={tabs}
                      active={activeTab}
                      // Tabs on every breakpoint, as on desktop (Nelson, 22 Oct 2026: no dropdown on phones).
                      variant="tabs"
                    />
                  ) : null}
                  {children}
                </div>
                {footerMeta ? <div data-arrive={2}>{footerMeta}</div> : null}
                {discussFooter ? <div data-arrive={3}>{discussFooter}</div> : null}
              </div>
            )}
            </div>
          </div>

          <TopicFooterNav
            className="sk-vt-player-footer"
            courseSlug={courseSlug}
            position={position}
            total={total}
            title={topic.title}
            milestone={milestone}
            previousDisabled={!previous}
            // On the last topic, Next opens the course-complete dialog: only once the course is done.
            // A topic that asks keeps Next enabled on the last topic too: the answer may finish the course.
            nextDisabled={!next && !courseDone && !asksNow}
            topicComplete={isCompleted}
            compact={bp === "mobile"}
            onPrevious={() => previous && navigateTopic(previous.id)}
            onNext={() => {
              if (asksNow) setAskOpen(true);
              else if (next) navigateTopic(next.id);
              else if (courseDone) setCompleteOpen(true);
            }}
          />
        </main>
        </ArrivalContext.Provider>
      </div>

      {/* Mobile drawer — a modal dialog (focus moves in, is trapped, the page
          behind is inert, Esc / backdrop / Close dismiss, focus returns to the
          "Open Course Journey" trigger). */}
      <MobileCourseDrawer
        open={bp === "mobile" && mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        {(titleId) => (
          <ArrivalContext.Provider value={courseArrival}>
          <Sidebar
            course={activeCourse}
            currentTopicId={topicId}
            variant="Mobile"
            bookmarks={bookmarks}
            completed={completedTopics}
            lastCompleted={lastCompleted}
            onSelectTopic={navigateTopic}
            onToggleBookmark={toggleBookmark}
            onCloseMobile={() => setMobileDrawerOpen(false)}
            mobileTitleId={titleId}
          />
          </ArrivalContext.Provider>
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

      <CompletionQuestionModal
        open={askOpen}
        noun={completionNoun(topic)}
        reason={completionReason(topic)}
        hasNext={Boolean(next)}
        onYes={() => {
          setAskOpen(false);
          track("completion_question", { topicId, answer: "yes" });
          markComplete(topicId);
          if (next) navigateTopic(next.id);
          else if (courseDoneAfterThis) setCompleteOpen(true);
        }}
        onNotYet={() => {
          setAskOpen(false);
          track("completion_question", { topicId, answer: "not_yet" });
          if (next) navigateTopic(next.id);
        }}
        onClose={() => setAskOpen(false)}
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

      {/* The body's load, announced once: "Loading…" while its skeleton shows. */}
      <p role="status" className="sr-only">
        {arrival.decided && arrival.first && !arrival.released ? "Loading…" : ""}
      </p>
      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}

const COURSE_DRAWER_ID = "course-drawer";

/** Types the Open edX effort estimate gives no time (problems, LTI, SCORM, ORA, live sessions). */
const NO_EFFORT_FAMILIES: TopicFamily[] = ["assessment", "graded", "activity", "lab", "ora", "vilt"];

/** The mobile course drawer as a modal dialog (see useDialog). It slides back out to the left on close. */
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
  const { mounted, state, onAnimationEnd } = useExitTransition(open, MOTION_MS.short4);
  // Swipe the drawer back to the left to close it (Apple, 22 Oct 2026); its list still scrolls.
  const panelRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const drag = useSheetDrag({ panelRef, backdropRef, axis: "x", dir: -1, onDismiss: onClose, enabled: open });
  if (!mounted) return null;
  const closed = state === "closed";
  return (
    <div
      ref={ref}
      data-state={state}
      aria-hidden={closed || undefined}
      {...inertProps(closed)}
      className={cn("fixed inset-0 z-40", closed && "pointer-events-none")}
    >
      <div ref={backdropRef} className="sk-backdrop sk-animate-fade sk-backdrop-panel absolute inset-0" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        onPointerDown={drag.onPointerDown}
        id={COURSE_DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onAnimationEnd={onAnimationEnd}
        className="sk-animate-slide-left absolute left-0 top-0 h-full touch-pan-y"
      >
        {children(titleId)}
      </div>
    </div>
  );
}
