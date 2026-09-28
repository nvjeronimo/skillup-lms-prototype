"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { cn, durationToSeconds } from "@/lib/utils";
import { LiveControlBar } from "@/components/organisms/LiveControlBar";
import { LiveAttendance } from "@/components/molecules/LiveAttendance";
import { getViltSession, type ViltSession, type ViltStage } from "@/lib/content";
import { useLmsStore } from "@/lib/store";
import { getTopic } from "@/lib/data";

/**
 * VILT — one Topic Content Type, three stages. The underlying asset changes as
 * the session moves through time: pre-live has no asset (scheduling metadata
 * only), live is an external stream, and the recording is a Video asset. The
 * learner sees one row that changes state, not three separate topics.
 */
export function ViltView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const showToast = useLmsStore((s) => s.showToast);
  const session = React.useMemo(() => (topic ? getViltSession(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps

  // The pre-live stage can be advanced to "live" so the whole journey is
  // demonstrable without waiting for the clock.
  const [stage, setStage] = React.useState<ViltStage | null>(null);
  if (!topic || !session) return null;
  const current: ViltStage = stage ?? session.stage;

  return (
    <div className="flex flex-col gap-4 py-4">
      <StageStepper current={current} />

      {current === "pre-live" ? (
        <PreLive
          session={session}
          onAddToCalendar={() => showToast("Session added to your calendar.")}
          onSimulateLive={() => setStage("live")}
        />
      ) : current === "live" ? (
        <LiveStage
          session={session}
          onJoin={() => showToast("Joining the live session…")}
          onLeave={() => {
            showToast("You left the session.");
            setStage("pre-live");
          }}
        />
      ) : (
        <RecordingStage session={session} />
      )}

      {/* Lane-level completion note — VILT never has a manual "Mark as complete".
          Full-width amber note: completion is one of two paths, whichever first
          (live attendance, or watching the recording). See topic-types-inventory §3. */}
      <InlineAlert
        tone="warning"
        title="Completion is automatic once you attend"
        description="This session completes on its own by whichever comes first: attending the live (join + at least 50% of the session), or watching the recording to 90%."
      />
    </div>
  );
}

/* ---- DS VILT · Stage Stepper: one topic, three stages (Scheduled → Live → Recording) ---- */
const STAGES: { stage: ViltStage; label: string }[] = [
  { stage: "pre-live", label: "Scheduled" },
  { stage: "live", label: "Live" },
  { stage: "recording", label: "Recording" },
];

function StageStepper({ current }: { current: ViltStage }) {
  const currentIdx = STAGES.findIndex((s) => s.stage === current);
  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Session stage">
      {STAGES.map((s, i) => {
        const isCurrent = i === currentIdx;
        const isPast = i < currentIdx;
        return (
          <React.Fragment key={s.stage}>
            {i > 0 ? (
              <li aria-hidden className="sk-text-xs-regular text-sko-text-subtle">
                →
              </li>
            ) : null}
            <li
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "sk-text-xs-medium inline-flex items-center rounded-full px-2 py-1 ring-1 ring-inset",
                isCurrent
                  ? s.stage === "live"
                    ? "bg-sko-bg-error-soft text-sko-text-error ring-sko-border-error"
                    : "bg-sko-bg-primary-soft text-sko-text-primary ring-sko-border-primary"
                  : isPast
                    ? "bg-sko-bg-subtle text-sko-text-subtle ring-sko-border-subtle"
                    : "text-sko-text-subtle ring-sko-border-default",
              )}
            >
              {s.label}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}

/* DS VILT · Session Meta: fields 32px apart with a 1px border/subtle rule between them.
   The rule is the next field's left border so the <dl> keeps valid dt/dd groups. */
function SessionMeta({ session }: { session: ViltSession }) {
  return (
    <dl className="flex flex-wrap items-stretch gap-8">
      {[
        ["When", session.whenLabel],
        ["Duration", session.durationLabel],
        ["Host", session.host],
        ["Platform", session.platform],
      ].map(([k, v], i) => (
        <div key={k} className={cn("flex flex-col gap-0.5", i > 0 && "border-l border-sko-border-subtle pl-8")}>
          <dt className="sk-text-xs-medium uppercase text-sko-text-subtle">{k}</dt>
          <dd className="sk-text-sm-medium text-sko-text-default">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Agenda({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-sko-border-subtle px-4 py-6">
      <span className="sk-text-xs-medium uppercase text-sko-text-subtle">
        What we&rsquo;ll cover
      </span>
      <ul className="sk-text-sm-regular list-disc pl-5 text-sko-text-muted">
        {items.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---- Stage 1 · Pre-live: no asset yet — scheduling metadata only ---- */
function PreLive({
  session,
  onAddToCalendar,
  onSimulateLive,
}: {
  session: ViltSession;
  onAddToCalendar: () => void;
  onSimulateLive: () => void;
}) {
  const locked = session.minutesUntilStart > session.joinUnlocksMinutesBefore;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-page shadow-sk-card p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">Live session</Badge>
        <Badge tone="neutral">Scheduled</Badge>
      </div>

      <h3 className="sk-text-lg-semibold text-sko-text-default">{session.title}</h3>

      {/* Countdown — the learner's primary orientation before the session. */}
      <div className="flex flex-col items-center gap-1 rounded-lg bg-sko-bg-primary-soft px-4 py-6">
        <span className="sk-text-display-xs-semibold text-sko-text-primary">
          Your class starts in {session.minutesUntilStart} minutes
        </span>
        {/* Say what happens next, not what is missing: the learner is waiting on
            the host, and the sentence should carry them to the join rather than
            report an absence. */}
        <span className="sk-text-xs-regular text-sko-text-primary">
          {locked ? (
            <>
              Once your instructor opens the session, you&rsquo;ll be able to join. The button
              unlocks {session.joinUnlocksMinutesBefore} minutes before the start.
            </>
          ) : (
            "You can join now"
          )}
        </span>
      </div>

      <SessionMeta session={session} />
      <Agenda items={session.agenda} />

      <div className="flex flex-wrap items-center gap-2 border-t border-sko-border-subtle pt-4">
        <Button variant="primary" size="lg" disabled={locked} onClick={onSimulateLive}>
          {locked ? "Join opens soon" : "Join session"}
        </Button>
        <Button variant="secondary" size="lg" onClick={onAddToCalendar}>
          Add to calendar
        </Button>
      </div>

      <p className="sk-text-xs-regular text-sko-text-subtle">
        {locked
          ? "Prefer to catch up later? A recording is published here afterwards and counts for completion just the same."
          : "Attendance is tracked. Stay for at least half the session for it to count towards completion."}
      </p>
    </section>
  );
}

/* ---- Stage 2 · Live: the external stream ---- */
function LiveStage({
  session,
  onJoin,
  onLeave,
}: {
  session: ViltSession;
  onJoin: () => void;
  onLeave: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      {/* DS VILT · Stage Surface, Stage=Live: solid bg/primary, pad 0/32, gap 6. */}
      <div className="relative flex aspect-video max-h-[42vh] w-full items-center justify-center overflow-hidden rounded-xl bg-sko-bg-primary px-8">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <Icon icon={Users} size={28} className="text-sko-text-on-primary" />
          <div className="flex flex-col items-center gap-1.5">
            <span className="sk-text-md-semibold text-sko-text-on-primary">
              Live session in progress
            </span>
            <span className="sk-text-xs-regular text-sko-text-on-primary">
              Hosted on {session.platform}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <LiveAttendance live={session.attendees.live} total={session.attendees.total} recording />
      </div>

      <LiveControlBar state="Live On Control Bar" onJoin={onJoin} onLeave={onLeave} />

      <InlineAlert
        tone="info"
        title="Attendance is being tracked"
        description="Stay for at least half the session for it to count towards completion."
      />
    </section>
  );
}

/* ---- Stage 3 · Recording: now a Video asset ---- */
function RecordingStage({ session }: { session: ViltSession }) {
  return (
    <section className="flex flex-col gap-4">
      <span className="sk-text-xs-regular text-sko-text-subtle">{session.whenLabel}</span>

      {/* DS VILT · Stage Surface, Stage=Recording: bg/muted surface, the player, then the
          RECORDING pill. The recording IS a Video asset — same player as any Video topic. */}
      <div className="flex flex-col items-center gap-1.5 rounded-xl bg-sko-bg-muted px-8">
        <VideoPlayer durationSeconds={durationToSeconds(session.durationLabel)} />
        <span className="sk-text-xs-medium inline-flex items-center rounded-full bg-sko-bg-subtle px-2 py-1 uppercase text-sko-text-muted ring-1 ring-inset ring-sko-border-default">
          Recording
        </span>
      </div>

      <InlineAlert
        tone="info"
        title="This is a Video asset"
        description="Transcript, speed, captions and downloads behave the same as any Video topic."
      />

      <Agenda items={session.agenda} />
    </section>
  );
}
