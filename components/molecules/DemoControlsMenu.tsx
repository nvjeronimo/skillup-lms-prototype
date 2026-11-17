import * as React from "react";
import { usePathname, useRouter } from "@/lib/router";
import { Check, Monitor, MonitorSmartphone, Smartphone, Tablet } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/atoms/Avatar";
import { getTopic } from "@/lib/data";
import { DEFAULT_PLATFORM_USER } from "@/lib/platform/user";
import {
  completesByHand,
  getMediaSeconds,
  getPartnerLab,
  getTranscript,
  isPlaybackMeasured,
  topicFamily,
} from "@/lib/content";
import { watchedFraction } from "@/lib/playback/coverage";
import { lineAt } from "@/lib/playback/lineAt";
import { useLmsStore, type CompletionFlow, type DeviceMode, type LabLaunch } from "@/lib/store";
import {
  AccessibilitySection,
  AppearanceSection,
  PROFILE_PANEL,
  ProfileFooter,
  ProfileLinks,
  SignOutLink,
  SkillUpOnlineLink,
  ProfileSection as Section,
  ToggleRow,
} from "@/components/molecules/ProfileSettings";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/lib/useDisclosure";
import { useDemoMode } from "@/lib/demo";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PersonasMenuRow } from "@/components/molecules/SyntheticPersonas";
import styles from "./DemoControlsMenu.module.css";

const MODES: { mode: DeviceMode; label: string; icon: typeof Monitor }[] = [
  { mode: "auto", label: "Responsive (follow window)", icon: MonitorSmartphone },
  { mode: "desktop", label: "Desktop", icon: Monitor },
  { mode: "tablet", label: "Tablet", icon: Tablet },
  { mode: "mobile", label: "Mobile", icon: Smartphone },
];

// Each shape is a real, navigable course (slug + the active topic to land on).
const SHAPES: { id: string; slug: string; topicId: string; label: string; title: string }[] = [
  {
    id: "5",
    slug: "six-sigma",
    topicId: "m3-t1",
    label: "5-level",
    title: "5-level course (Course → Module → Lesson → Topics)",
  },
  {
    id: "4",
    slug: "capstone",
    topicId: "cap-t5",
    label: "4-level · no Lesson",
    title: "4-level course (Course → Module → Topics, no Lesson)",
  },
  {
    id: "3",
    slug: "quick-start",
    topicId: "qs-t2",
    label: "3-level · no Module, no Lesson",
    title: "3-level course (Course → Topics, no Module, no Lesson)",
  },
];

const LAB_LAUNCHES: { value: LabLaunch; label: string }[] = [
  { value: "new-tab", label: "New tab" },
  { value: "inline", label: "In the page" },
  { value: "refused", label: "Not loading" },
];

const COMPLETION_FLOWS: { value: CompletionFlow; label: string }[] = [
  { value: "ask-on-next", label: "Button + Next asks" },
  { value: "mark-as-complete", label: "Button only" },
];

/**
 * Demo: the preview device (the page in a desktop, tablet or phone frame, or following the window).
 * One stored choice for the player and the platform pages: switching it in one menu shows in the
 * other (Nelson, 25 Oct 2026: the platform profile menu has it too, before Loading, as in the player).
 */
export function PreviewDeviceSection({ onDone }: { onDone: () => void }) {
  const mode = useLmsStore((s) => s.deviceMode);
  const setMode = useLmsStore((s) => s.setDeviceMode);
  const pill = `sk-text-body-small-semibold ${styles.pill}`;
  return (
    <Section title="Preview device">
      <div className={styles.pills}>
        {MODES.map((m) => {
          const active = mode === m.mode;
          return (
            <button
              key={m.mode}
              type="button"
              onClick={() => {
                setMode(m.mode);
                onDone();
              }}
              aria-pressed={active}
              aria-label={m.label}
              title={m.label}
              className={cn(
                pill,
                active ? styles.pillOn : styles.pillOff,
              )}
            >
              <Icon icon={m.icon} size={16} />
            </button>
          );
        })}
      </div>
    </Section>
  );
}

export interface DemoControlsMenuProps {
  userName?: string;
  userAvatarUrl?: string;
  /** The line under the name (DS Topbar v1.8 `Avatar label group`): "Learner · Pro". */
  userRole?: string;
  /** Mobile topbar: hide the name next to the avatar. */
  compact?: boolean;
}

/**
 * Profile button that opens the standard profile menu plus the player's demo settings
 * (preview device · content shape). Replaces the old floating widget — same controls, tucked into
 * the top-bar account menu so it no longer crowds the viewport.
 *
 * A disclosure panel, not an ARIA menu: it holds switches, pressed buttons and
 * a segmented control, which a role="menu" cannot contain. Tab moves through
 * it; Escape closes it and returns focus to the profile button (useDisclosure).
 */
export function DemoControlsMenu({
  userName = "John Smith",
  userAvatarUrl,
  userRole = DEFAULT_PLATFORM_USER.role,
  compact = false,
}: DemoControlsMenuProps) {
  const { mounted, setOpen, containerRef, triggerProps, panelProps } = useDisclosure();
  const mode = useLmsStore((s) => s.deviceMode);
  const setMode = useLmsStore((s) => s.setDeviceMode);
  const demo = useDemoMode();
  const bp = useBreakpoint();
  const discussionsPreview = useLmsStore((s) => s.discussionsPreview);
  const setDiscussionsPreview = useLmsStore((s) => s.setDiscussionsPreview);
  const quizMode = useLmsStore((s) => s.quizMode);
  const setQuizMode = useLmsStore((s) => s.setQuizMode);
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug = pathname?.match(/^\/course\/([^/]+)/)?.[1];

  // The A/B switch is quiz-only, so it appears only when the topic on screen
  // is one. Assessment covers Quiz and Practice Assignment; the graded family
  // is a file submission, which has no modes.
  const activeTopicId = pathname?.match(/^\/course\/[^/]+\/topic\/([^/]+)/)?.[1];
  const activeTopic = activeTopicId ? getTopic(activeTopicId) : undefined;
  const onQuiz = activeTopic ? topicFamily(activeTopic.type) === "assessment" : false;
  // Same rule for the lab launch: only a lab whose component can open inside the page has it.
  const onLtiLab = activeTopic ? Boolean(getPartnerLab(activeTopic)?.inPage) : false;
  const labLaunch = useLmsStore((s) => s.labLaunch);
  const setLabLaunch = useLmsStore((s) => s.setLabLaunch);
  // The completion test shows on the topics it changes: the ones the learner completes by hand.
  const onHandCompleted = activeTopic ? completesByHand(activeTopic) : false;
  const completionFlow = useLmsStore((s) => s.completionFlow);
  const setCompletionFlow = useLmsStore((s) => s.setCompletionFlow);
  // A video or podcast that completes at 90% played (BR-01): the shortcuts to test it.
  const onMeasuredMedia = activeTopic ? isPlaybackMeasured(activeTopic) : false;
  const watched = useLmsStore((s) => (activeTopicId ? s.watched[activeTopicId] : undefined));
  const setWatched = useLmsStore((s) => s.setWatched);
  const resetWatched = useLmsStore((s) => s.resetWatched);
  const seekVideoTo = useLmsStore((s) => s.seekVideoTo);
  const mediaSeconds = activeTopic ? getMediaSeconds(activeTopic) : 0;
  const watchedPct = Math.floor(watchedFraction(watched ?? [], mediaSeconds) * 100);

  const pill = `sk-text-body-small-semibold ${styles.pill}`;
  const pillOn = styles.pillOn;
  const pillOff = styles.pillOff;

  return (
    <div ref={containerRef} className={styles.root}>
      <button
        type="button"
        {...triggerProps}
        aria-label={demo ? "Account and demo settings" : "Account"}
        data-hit-band={compact ? "" : undefined}
        className={cn(
          styles.trigger,
          // DS topbar Mobile: a bare 24px avatar. Desktop/Tablet: a 32px avatar + name. Every
          // learner avatar is a rounded square, never a circle (Nelson, 19 Oct 2026).
          // Compact: the button stays the 24px avatar and draws a 44-tall hit band, 3 past each side
          // (the bar's buttons sit 6 apart); a 44 square pushed the phone bar onto the logo
          // (Nelson, 28 Oct 2026).
          compact ? styles.triggerCompact : styles.triggerFull,
        )}
      >
        {compact ? (
          <Avatar name={userName} src={userAvatarUrl} size="xs" shape="square" />
        ) : (
          <Avatar name={userName} src={userAvatarUrl} size="sm" shape="square" />
        )}
        {!compact ? (
          // DS Topbar v1.8 `Avatar label group`: the name over the role, as on the platform bar
          // (Nelson's SKO match review, 28 Oct 2026).
          <span className={styles.who}>
            <span className={`sk-text-body-small-semibold ${styles.name}`}>{userName}</span>
            <span data-invented="personal: no learner role or plan in Open edX" className={`sk-text-label-small-regular ${styles.role}`}>{userRole}</span>
          </span>
        ) : null}
      </button>

      {mounted ? (
        <div
          {...panelProps}
          role="group"
          aria-label={demo ? "Account and demo settings" : "Account"}
          className={PROFILE_PANEL}
        >
          {/* The standard profile menu (DS LMS / Profile Menu 1.5): Appearance, Accessibility, Profile,
              SkillUp Online;
              then the player's preview sections; the footer last. */}
          {/* On a phone the top bar has no room for the theme button (audit, 21 Oct 2026): it lives here. */}
          <ProfileLinks onDone={() => setOpen(false)} />
          <AppearanceSection showTheme={bp === "mobile"} />
          <AccessibilitySection />
          <SignOutLink onDone={() => setOpen(false)} />
          <SkillUpOnlineLink onDone={() => setOpen(false)} />
          {demo ? (
            <>
              <PreviewDeviceSection onDone={() => setOpen(false)} />

              <Section title="Content Shape Levels">
                <div className={styles.stack}>
                  {SHAPES.map((s) => {
                    const active = activeSlug === s.slug;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          track("sidebar_shape_change", { shape: s.id });
                          router.push(`/course/${s.slug}/topic/${s.topicId}`);
                          setOpen(false);
                        }}
                        aria-pressed={active}
                        title={s.title}
                        className={cn(
                          "sk-text-body-medium-medium",
                          styles.option,
                          active ? styles.optionOn : styles.optionOff,
                        )}
                      >
                        {s.label}
                        {active ? <Icon icon={Check} size={16} className={styles.check} /> : null}
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Only on a quiz, and only in here. The mode must be visible to
              whoever runs a session and invisible to whoever is being tested,
              so it never appears on the page itself. */}
              {onQuiz ? (
                <Section title="Quiz mode">
                  <div className={styles.stackLoose}>
                    <div className={styles.labelled}>
                      <span className={`sk-text-body-medium-medium ${styles.fieldLabel}`}>
                        Experience
                      </span>
                      <div className={styles.switch}>
                        {(["A", "B"] as const).map((value) => (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={quizMode === value}
                            onClick={() => setQuizMode(value)}
                            className={cn(
                              "sk-text-body-small-semibold",
                              styles.switchOption,
                              styles.switchAB,
                              quizMode === value ? styles.switchOn : styles.switchOff,
                            )}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className={`sk-text-body-small-regular ${styles.note}`}>
                      A is how the platform behaves today, and where every quiz starts. B is the
                      proposal.
                    </p>
                  </div>
                </Section>
              ) : null}

              {onLtiLab ? (
                <Section title="Lab launch">
                  <div className={styles.stackLoose}>
                    <div className={styles.switch}>
                      {LAB_LAUNCHES.map((l) => (
                        <button
                          key={l.value}
                          type="button"
                          aria-pressed={labLaunch === l.value}
                          onClick={() => setLabLaunch(l.value)}
                          className={cn(
                            "sk-text-body-small-semibold",
                            styles.switchOption,
                            styles.switchFill,
                            labLaunch === l.value ? styles.switchOn : styles.switchOff,
                          )}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    <p className={`sk-text-body-small-regular ${styles.note}`}>
                      New tab is the default for every lab. In the page is the option for the few
                      courses whose lab already loads there (two Microsoft courses); Not loading is
                      what those courses show today, with the way out to a new tab.
                    </p>
                  </div>
                </Section>
              ) : null}

              {onHandCompleted ? (
                <Section title="Completion">
                  <div className={styles.stackLoose}>
                    <div className={styles.switch}>
                      {COMPLETION_FLOWS.map((f) => (
                        <button
                          key={f.value}
                          type="button"
                          aria-pressed={completionFlow === f.value}
                          onClick={() => setCompletionFlow(f.value)}
                          className={cn(
                            "sk-text-body-small-semibold",
                            styles.switchOption,
                            styles.switchFill,
                            completionFlow === f.value ? styles.switchOn : styles.switchOff,
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                    <p className={`sk-text-body-small-regular ${styles.note}`}>
                      The rule since 12 Oct: Mark as Complete at the end of the content, and Next
                      asks whether you have completed the topic if you move on without it. Button
                      only switches the question off, as it was before.
                    </p>
                  </div>
                </Section>
              ) : null}

              {onMeasuredMedia && activeTopic ? (
                <Section title="Playback">
                  <div className={styles.stack}>
                    {[
                      {
                        label: "Mark 85% watched",
                        run: () => {
                          // Coverage and playhead at 85%: a short play (5% of the length) reaches the 90%.
                          const at = 0.85 * mediaSeconds;
                          setWatched(activeTopic.id, [[0, at]]);
                          seekVideoTo(at, lineAt(getTranscript(activeTopic), at));
                        },
                      },
                      { label: "Reset watched", run: () => resetWatched(activeTopic.id) },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          track("preview_toggle", { feature: "playback", value: item.label });
                          item.run();
                          setOpen(false);
                        }}
                        className={`sk-text-body-medium-medium ${styles.option} ${styles.optionOff}`}
                      >
                        {item.label}
                      </button>
                    ))}
                    <p className={`sk-text-body-small-regular ${styles.note}`}>
                      {`Watched ${watchedPct}%. This topic completes by itself once 90% has been played; a seek does not count. Mark 85% watched, then press Play: the last 5% takes under a minute, less at 2×.`}
                    </p>
                  </div>
                </Section>
              ) : null}

              <Section title="Preview features">
                <div className={styles.stack}>
                  <ToggleRow
                    label="Discuss this topic"
                    hint="In discussion, hidden by default"
                    checked={discussionsPreview}
                    onChange={setDiscussionsPreview}
                  />
                </div>
              </Section>
            </>
          ) : null}

          <PersonasMenuRow onDone={() => setOpen(false)} />
          <ProfileFooter onDone={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
