"use client";

import * as React from "react";
import { CalendarPlus, Lock, Play, Users, Video as VideoIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { LiveControlBar } from "@/components/organisms/LiveControlBar";
import { LiveAttendance } from "@/components/molecules/LiveAttendance";
import { getViltSession, type ViltSession, type ViltStage } from "@/lib/content";
import { useLmsStore } from "@/lib/store";
import { getTopic } from "@/lib/data";
import { cn } from "@/lib/utils";

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

      <p className="sk-text-xs-regular text-sk-text-tertiary">{session.completionRule}</p>
    </div>
  );
}

/* ---- Stage indicator: makes the three-stage model visible to the learner --- */
function StageStepper({ current }: { current: ViltStage }) {
  const stages: { id: ViltStage; label: string }[] = [
    { id: "pre-live", label: "Scheduled" },
    { id: "live", label: "Live" },
    { id: "recording", label: "Recording" },
  ];
  const activeIndex = stages.findIndex((s) => s.id === current);

  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Session stage">
      {stages.map((s, i) => {
        const isCurrent = i === activeIndex;
        const isPast = i < activeIndex;
        return (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={cn(
                "sk-text-xs-medium rounded-full border px-2.5 py-1",
                isCurrent
                  ? s.id === "live"
                    ? "border-sk-text-error-primary bg-sk-bg-error-primary text-sk-text-error-primary"
                    : "border-sk-border-brand bg-sk-bg-brand-section text-sk-text-brand-secondary"
                  : isPast
                    ? "border-sk-border-secondary bg-sk-bg-secondary text-sk-text-tertiary"
                    : "border-sk-border-primary text-sk-text-tertiary",
              )}
            >
              {s.label}
            </span>
            {i < stages.length - 1 ? (
              <span aria-hidden className="sk-text-xs-regular text-sk-text-tertiary">
                →
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
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
          Starts in {session.minutesUntilStart} minutes
        </span>
        <span className="sk-text-xs-regular text-sk-text-brand-secondary">
          The Join button unlocks {session.joinUnlocksMinutesBefore} minutes before the session
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
          Can&rsquo;t make it live? A recording is published here afterwards and also counts for
          completion.
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

      <div className="relative flex aspect-video max-h-[42vh] w-full items-center justify-center overflow-hidden rounded-xl bg-sk-bg-tertiary">
        <div className="flex flex-col items-center gap-2">
          <Icon icon={Play} size={30} className="text-sk-text-secondary" />
          <span className="sk-text-sm-medium text-sk-text-secondary">
            Session recording · {session.durationLabel}
          </span>
        </div>
      </div>

      <InlineAlert
        tone="info"
        title="This is a Video asset"
        description="The recording reuses the standard video player — transcript, speed, captions and downloads all behave the same as any Video topic."
      />

      <Agenda items={session.agenda} />
    </section>
  );
}
