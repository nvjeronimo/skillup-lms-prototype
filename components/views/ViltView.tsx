"use client";

import * as React from "react";
import { CalendarPlus, Lock, Users, Video as VideoIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { VideoPlayer } from "@/components/organisms/VideoPlayer";
import { durationToSeconds } from "@/lib/utils";
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
        title="Completion is automatic — attending is enough"
        description="This session completes on its own by whichever comes first: attending the live (join + at least 50% of the session), or watching the recording to 90%."
      />
    </div>
  );
}

function SessionMeta({ session }: { session: ViltSession }) {
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2">
      {[
        ["When", session.whenLabel],
        ["Duration", session.durationLabel],
        ["Host", session.host],
        ["Platform", session.platform],
      ].map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="sk-text-2xs-medium uppercase tracking-wide text-sk-text-tertiary">{k}</dt>
          <dd className="sk-text-sm-medium text-sk-text-primary">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Agenda({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="sk-text-2xs-medium uppercase tracking-wide text-sk-text-tertiary">
        What we&rsquo;ll cover
      </span>
      <ul className="sk-text-sm-regular list-disc pl-5 text-sk-text-secondary">
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
    <section className="flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">Live session</Badge>
        <Badge tone="neutral">Scheduled</Badge>
      </div>

      <h3 className="sk-text-lg-semibold text-sk-text-primary">{session.title}</h3>

      {/* Countdown — the learner's primary orientation before the session. */}
      <div className="flex flex-col items-center gap-1 rounded-lg bg-sk-bg-brand-section px-4 py-6">
        <span className="sk-text-display-xs-semibold text-sk-text-brand-secondary">
          Your class starts in {session.minutesUntilStart} minutes
        </span>
        {/* Say what happens next, not what is missing: the learner is waiting on
            the host, and the sentence should carry them to the join rather than
            report an absence. */}
        <span className="sk-text-xs-regular text-sk-text-brand-secondary">
          Once your instructor opens the session, you&rsquo;ll be able to join — the button unlocks{" "}
          {session.joinUnlocksMinutesBefore} minutes before the start.
        </span>
      </div>

      <SessionMeta session={session} />
      <Agenda items={session.agenda} />

      <div className="flex flex-wrap items-center gap-2 border-t border-sk-border-secondary pt-4">
        <Button variant="primary" size="lg" leftIcon={locked ? Lock : undefined} disabled={locked} onClick={onSimulateLive}>
          {locked ? "Join opens soon" : "Join session"}
        </Button>
        <Button variant="secondary" leftIcon={CalendarPlus} onClick={onAddToCalendar}>
          Add to calendar
        </Button>
      </div>

      {locked ? (
        <p className="sk-text-xs-regular text-sk-text-tertiary">
          Prefer to catch up later? A recording is published here afterwards and counts for
          completion just the same.
        </p>
      ) : null}
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
      <div
        className="relative flex aspect-video max-h-[42vh] w-full items-center justify-center overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(135deg, var(--sk-bg-brand-solid), var(--sk-bg-brand-stage))",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <Icon icon={Users} size={28} className="text-sk-text-primary-on-brand" />
          <span className="sk-text-md-semibold text-sk-text-primary-on-brand">
            Live session in progress
          </span>
          <span className="sk-text-xs-regular text-sk-text-primary-on-brand opacity-80">
            Hosted on {session.platform}
          </span>
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
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral" leftIcon={VideoIcon}>
          Recording
        </Badge>
        <span className="sk-text-xs-regular text-sk-text-tertiary">{session.whenLabel}</span>
      </div>

      {/* The recording IS a Video asset — same player as any Video topic. */}
      <VideoPlayer durationSeconds={durationToSeconds(session.durationLabel)} />

      <InlineAlert
        tone="info"
        title="This is a Video asset"
        description="Transcript, speed, captions and downloads behave the same as any Video topic."
      />

      <Agenda items={session.agenda} />
    </section>
  );
}
