import * as React from "react";
import { FlaskConical, RotateCcw } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { ScormContainer, type ScormState } from "@/components/molecules/ScormContainer";
import { useLmsStore } from "@/lib/store";
import { DEFAULT_USER, flatTopics, getCourseForTopic } from "@/lib/data";
import {
  SCORM_DONE,
  clearScormData,
  installScormApi,
  readScormData,
  type ScormCall,
  type ScormLessonStatus,
} from "@/lib/scorm-runtime";
import styles from "./ScormPackageActivity.module.css";

/** "John Smith" as SCORM 1.2 writes a learner: "Smith, John". */
function scormName(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[parts.length - 1]}, ${parts.slice(0, -1).join(" ")}` : name;
}

/**
 * An Activity that plays a real SCORM 1.2 package from `public/scorm/` (the SCORM test course,
 * 4 Nov 2026). The package runs in an iframe and talks to `lib/scorm-runtime`, as it would talk to
 * the Open edX SCORM XBlock: it reports its status and score, and resumes from its suspend data.
 * The chrome around it is the Figma Activity model (ICP page 7428:1069, Row A in the page, Row B
 * new window), as for the sample package in ActivityView.
 *
 * Completion is the package's report and stays once given: the XBlock never takes a completion
 * back, even when a package writes "incomplete" again on its next launch. A package that never
 * reports (`reportsCompletion: false`, card C1) is completed by hand: Mark as Complete, and Next asks.
 *
 * A course package (Activity group D: the course is this one topic, and the package brings its own
 * menu) plays at window height: the frame fills the player's scroll area, so the package's own
 * navigation is in view once the learner scrolls to it (Figma group D; Nelson, 9 Nov 2026).
 *
 * Below the package, a test panel shows what the package reported and its last calls. It is a
 * testing aid for this course, not part of the design: a dashed yellow border (accent yellow) and a line saying so.
 */

/** The player's scroll area (or the window): what "window height" means for the frame. */
function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p);
    if (overflowY === "auto" || overflowY === "scroll") return p;
  }
  return null;
}
export function ScormPackageActivity({
  topicId,
  title,
  packageUrl,
  durationLabel,
  reportsCompletion = true,
}: {
  topicId: string;
  title: string;
  packageUrl: string;
  durationLabel: string;
  reportsCompletion?: boolean;
}) {
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const markComplete = useLmsStore((s) => s.markComplete);
  const showToast = useLmsStore((s) => s.showToast);

  // Whether the package had stored a visit when this one started: it decides the "picking up" note.
  // Read after mount, not during render: the server has no localStorage, and a stored visit would
  // otherwise render an alert the server HTML does not have (a hydration error).
  const [arrivedLaunched, setArrivedLaunched] = React.useState(false);
  const [status, setStatus] = React.useState<ScormLessonStatus | undefined>();
  const [score, setScore] = React.useState<number | undefined>();
  React.useEffect(() => {
    const arrived = readScormData(topicId);
    setArrivedLaunched(arrived.launched);
    setStatus(arrived.cmi["cmi.core.lesson_status"] as ScormLessonStatus | undefined);
    const raw = arrived.cmi["cmi.core.score.raw"];
    setScore(raw ? Number(raw) : undefined);
  }, [topicId]);
  const [calls, setCalls] = React.useState<ScormCall[]>([]);
  const [state, setState] = React.useState<ScormState>("loading");
  const [openedAt, setOpenedAt] = React.useState<string>();
  // Bumped by Reset: remounts the iframe so the package starts from nothing.
  const [run, setRun] = React.useState(0);

  // Course package: the frame takes the whole content area, the height of the player's scroll
  // area (never below 360 px), with nothing of ours above it (Nelson, 11 Nov 2026).
  const coursePackage = React.useMemo(() => flatTopics(getCourseForTopic(topicId)).length === 1, [topicId]);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [frameHeight, setFrameHeight] = React.useState<number>();
  React.useEffect(() => {
    if (!coursePackage) return;
    const area = scrollParent(rootRef.current);
    const measure = () => setFrameHeight(Math.max(360, area ? area.clientHeight : window.innerHeight));
    measure();
    const ro = area ? new ResizeObserver(measure) : null;
    if (area) ro?.observe(area);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [coursePackage]);

  const completedRef = React.useRef(isCompleted);
  completedRef.current = isCompleted;

  // The API goes on the window before the iframe loads: a package looks for it once, on start.
  React.useEffect(() => {
    const remove = installScormApi(topicId, scormName(DEFAULT_USER.name), {
      onCall: (call) => setCalls((prev) => [call, ...prev].slice(0, 8)),
      onStatus: (next) => {
        setStatus(next);
        if (SCORM_DONE.includes(next) && !completedRef.current) {
          markComplete(topicId);
          showToast("The activity reported that it is complete.");
        }
      },
      onScore: setScore,
    });
    setState("loading");
    const t = window.setTimeout(() => setState((s) => (s === "loading" ? "running" : s)), 600);
    return () => {
      window.clearTimeout(t);
      remove();
    };
  }, [topicId, run, markComplete, showToast]);

  function launchWindow() {
    window.open(packageUrl, `scorm-${topicId}`, "popup,width=1280,height=860");
    setState("window");
    setOpenedAt(`today at ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`);
  }
  function reset() {
    clearScormData(topicId);
    setStatus(undefined);
    setScore(undefined);
    setCalls([]);
    setRun((n) => n + 1);
    showToast("The package's stored data is cleared. It starts from the beginning.");
  }

  const resuming = arrivedLaunched && !isCompleted && state !== "window";

  /* Test panel: what the package told the platform. A testing aid, not part of the design:
      dashed yellow border (accent yellow) and a line saying it is for testing and development only (Nelson, 9 Nov 2026). */
  const testPanel = (
    <section
      aria-label="SCORM test panel"
      className={styles.testPanel}
    >
      <div className={styles.testPanelHeader}>
        <span className={`sk-text-body-medium-semibold ${styles.testPanelTitle}`}>Test panel · what the package reported</span>
        <Button variant="secondary" size="sm" leftIcon={RotateCcw} onClick={reset}>
          Reset this package
        </Button>
      </div>
      <p className={`sk-text-body-small-regular ${styles.testPanelNote}`}>
        <FlaskConical aria-hidden className={styles.testPanelNoteIcon} />
        For testing and development purposes only. Not part of the design, and not in the platform.
      </p>
      <dl className={styles.report}>
        <dt className={`sk-text-body-small-regular ${styles.reportTerm}`}>lesson_status</dt>
        <dd className={`sk-text-body-small-regular ${styles.reportValue}`}>{status ?? "nothing reported"}</dd>
        <dt className={`sk-text-body-small-regular ${styles.reportTerm}`}>score.raw</dt>
        <dd className={`sk-text-body-small-regular ${styles.reportValue}`}>{score ?? "none"}</dd>
        <dt className={`sk-text-body-small-regular ${styles.reportTerm}`}>Topic</dt>
        <dd className={`sk-text-body-small-regular ${styles.reportValue}`}>
          {isCompleted ? "complete" : reportsCompletion ? "not complete yet" : "completes by hand (package never reports)"}
        </dd>
      </dl>
      {calls.length ? (
        <ol className={`sk-text-body-small-regular ${styles.calls}`}>
          {calls.map((c, i) => (
            <li key={i} className={styles.call}>
              {c.fn}({c.args.map((a) => JSON.stringify(a)).join(", ")}) → {JSON.stringify(c.result)}
            </li>
          ))}
        </ol>
      ) : (
        <p className={`sk-text-body-small-regular ${styles.noCalls}`}>No calls from the package yet.</p>
      )}
    </section>
  );

  if (coursePackage) {
    return (
      <div ref={rootRef} className={styles.packageRoot}>
        <ScormContainer bare title={title} state={state} onRetry={() => setRun((n) => n + 1)} frameHeight={frameHeight}>
          <iframe key={run} src={packageUrl} title={title} className={styles.frame} />
        </ScormContainer>
        <div className={styles.packagePanel}>{testPanel}</div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <p className={`sk-text-body-large-regular ${styles.intro}`}>
        {state === "window"
          ? "This activity opens in its own window. Your progress is saved as you go, and your completion comes back to this page when you finish."
          : reportsCompletion
            ? "This activity plays below. Your progress is saved as you go, and it reports your completion to the course when you finish."
            : "This activity plays below. When you have finished it, select Mark as Complete."}
      </p>

      {/* The XBlock's status, above the package (Figma A4, A5, A6). */}
      {isCompleted && score !== undefined ? (
        status === "failed" ? (
          <InlineAlert
            tone="warning"
            title={`Not passed · ${score} points out of 100`}
            description="The topic is complete. Start the activity again to improve your score."
          />
        ) : (
          <InlineAlert
            tone="success"
            title={`Completed · ${score} points out of 100`}
            description="Your score is in the Progress tab. You can go through the activity again."
          />
        )
      ) : isCompleted ? (
        <InlineAlert
          tone="success"
          title="Completed"
          description={
            reportsCompletion
              ? "The activity reported its completion to the course. You can go through it again."
              : "You marked this activity as complete. You can go through it again."
          }
        />
      ) : resuming ? (
        <InlineAlert
          tone="info"
          title="Picking up where you left off"
          description="The activity saved your place last time."
        />
      ) : null}

      <ScormContainer
        title={title}
        state={state}
        openedAt={openedAt}
        durationLabel={durationLabel}
        onRetry={() => setRun((n) => n + 1)}
        onSkip={() => showToast("Skipped. You can come back to this activity anytime.")}
        onLaunchWindow={launchWindow}
        onPlayInPage={() => setRun((n) => n + 1)}
      >
        <iframe key={run} src={packageUrl} title={title} className={styles.frame} />
      </ScormContainer>

      {testPanel}
    </div>
  );
}
