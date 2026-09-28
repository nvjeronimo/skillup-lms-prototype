"use client";

import * as React from "react";
import { Hand, LogOut, Mic, MicOff, MessageSquare, Video, VideoOff } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export type LiveControlState = "Live On Control Bar" | "Join Live Control Bar";

export interface LiveParticipant {
  name: string;
  /** Optional photo; the Avatar falls back to initials. */
  src?: string;
}

export interface LiveControlBarProps {
  state?: LiveControlState;
  onJoin?: () => void;
  onLeave?: () => void;
  /** Join state: "Test audio & video" action. */
  onTestAudioVideo?: () => void;
  /** Join state: avatars shown in the participants strip. */
  participants?: LiveParticipant[];
  /** Join state: learners already in the session. */
  joined?: number;
  /** Join state: learners invited to the session. */
  total?: number;
  className?: string;
}

const DEMO_PARTICIPANTS: LiveParticipant[] = [
  { name: "Marta Silva" },
  { name: "David Chen" },
  { name: "Ana Costa" },
  { name: "Rui Pereira" },
  { name: "Sofia Lopes" },
];

/** DS Avatar group Size=sm: 32px avatars overlapping by 8px, then a "+N" text avatar. */
function ParticipantsStrip({ participants, joined }: { participants: LiveParticipant[]; joined: number }) {
  const extra = Math.max(0, joined - participants.length);
  return (
    <div className="flex -space-x-2">
      {participants.map((p) => (
        <Avatar key={p.name} name={p.name} src={p.src} size="sm" />
      ))}
      {extra > 0 ? (
        <span
          className="sk-text-xs-semibold inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sko-bg-primary-soft text-sko-text-primary"
          aria-label={`${extra} more participants`}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

/** VILT control bar — Live On (mute/camera/hand/chat + leave) or the Join Live CTA state. */
export function LiveControlBar({
  state = "Live On Control Bar",
  onJoin,
  onLeave,
  onTestAudioVideo,
  participants = DEMO_PARTICIPANTS,
  joined = 8,
  total = 12,
  className,
}: LiveControlBarProps) {
  const [muted, setMuted] = React.useState(false);
  const [camOff, setCamOff] = React.useState(false);
  const [hand, setHand] = React.useState(false);

  if (state === "Join Live Control Bar") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 rounded-xl bg-sko-bg-subtle px-4 py-3",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <ParticipantsStrip participants={participants} joined={joined} />
            <span className="sk-text-sm-semibold text-sko-text-default">
              {joined} of {total} participants joined
            </span>
          </div>
          <p className="sk-text-xs-regular text-sko-text-default">
            Mute yourself by default · You can leave anytime
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="neutral" onClick={onTestAudioVideo}>
            Test audio &amp; video
          </Button>
          <Button variant="primary" onClick={onJoin}>
            Join session now
          </Button>
        </div>
      </div>
    );
  }

  // The labels change with the state, so the toggles do not also carry
  // aria-pressed (a changing label plus a pressed state reads twice).
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-y-3 rounded-xl bg-sko-bg-subtle px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" leftIcon={muted ? Mic : MicOff} onClick={() => setMuted((m) => !m)}>
          {muted ? "Unmute" : "Mute"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={camOff ? Video : VideoOff}
          onClick={() => setCamOff((c) => !c)}
        >
          {camOff ? "Camera on" : "Camera off"}
        </Button>
        <Button variant="secondary" size="sm" leftIcon={Hand} onClick={() => setHand((h) => !h)}>
          {hand ? "Lower hand" : "Raise hand"}
        </Button>
        <Button variant="secondary" size="sm" leftIcon={MessageSquare}>
          Open chat
        </Button>
      </div>
      {/* DS: Destructive Primary (fill bg/error). The Button atom has no filled
          destructive variant yet, so this stays the outline destructive until
          `destructive-primary` lands in components/atoms/Button.tsx. */}
      <Button variant="destructive" size="sm" leftIcon={LogOut} onClick={onLeave}>
        Leave session
      </Button>
    </div>
  );
}
