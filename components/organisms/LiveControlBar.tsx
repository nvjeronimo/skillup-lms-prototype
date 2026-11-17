import * as React from "react";
import { Hand, LogOut, Mic, MicOff, MessageSquare, Video, VideoOff } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import styles from "./LiveControlBar.module.css";

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

/**
 * DS Avatar group, Size=sm: 32px avatars overlapping by 8px, each with a 1.5px bg/page
 * outer ring, then the group's "+N" text avatar (bg/muted, 0.75px border/subtle inside
 * stroke, body-medium Semibold in text/subtle). The strip is decorative: the
 * "N of M participants joined" sentence next to it carries the information, so it is
 * hidden from assistive tech rather than read out initial by initial.
 */
function ParticipantsStrip({ participants, joined }: { participants: LiveParticipant[]; joined: number }) {
  const extra = Math.max(0, joined - participants.length);
  return (
    <div className={styles.strip} aria-hidden="true">
      {participants.map((p) => (
        <Avatar
          key={p.name}
          name={p.name}
          src={p.src}
          size="sm"
          className={styles.avatar}
        />
      ))}
      {extra > 0 ? (
        <span className={`sk-text-body-medium-semibold ${styles.extra}`}>
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
          styles.bar,
          styles.barJoin,
          className,
        )}
      >
        <div className={styles.info}>
          <div className={styles.joinedRow}>
            <ParticipantsStrip participants={participants} joined={joined} />
            <span className={`sk-text-body-medium-semibold ${styles.ink}`}>
              {joined} of {total} participants joined
            </span>
          </div>
          <p className={`sk-text-body-medium-regular ${styles.ink}`}>
            Mute yourself by default · You can leave anytime
          </p>
        </div>
        <div className={styles.joinActions}>
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
        styles.bar,
        styles.barLive,
        className,
      )}
    >
      {/* DS Live On buttons are all 44px: the default md size, same as the Join state. */}
      <div className={styles.controls}>
        <Button variant="secondary" leftIcon={muted ? Mic : MicOff} onClick={() => setMuted((m) => !m)}>
          {muted ? "Unmute" : "Mute"}
        </Button>
        <Button variant="secondary" leftIcon={camOff ? Video : VideoOff} onClick={() => setCamOff((c) => !c)}>
          {camOff ? "Camera on" : "Camera off"}
        </Button>
        <Button variant="secondary" leftIcon={Hand} onClick={() => setHand((h) => !h)}>
          {hand ? "Lower hand" : "Raise hand"}
        </Button>
        <Button variant="secondary" leftIcon={MessageSquare}>
          Open chat
        </Button>
      </div>
      {/* Leave uses the legacy grey destructive (decision 003) until the V2 filled
          Destructive/Primary is approved. */}
      <Button variant="destructive" leftIcon={LogOut} onClick={onLeave}>
        Leave session
      </Button>
    </div>
  );
}
