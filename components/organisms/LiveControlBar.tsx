"use client";

import * as React from "react";
import { Hand, Mic, MicOff, MessageSquare, Video, VideoOff } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export type LiveControlState = "Live On Control Bar" | "Join Live Control Bar";

export interface LiveControlBarProps {
  state?: LiveControlState;
  onJoin?: () => void;
  onLeave?: () => void;
  className?: string;
}

function ControlButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Mic;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        active
          ? "bg-sko-bg-error-soft text-sko-text-error"
          : "bg-sko-bg-subtle text-sko-text-muted hover:bg-sko-bg-muted",
      )}
    >
      <Icon icon={icon} size={20} />
    </button>
  );
}

/** VILT control bar — Live On (mic/cam/hand/chat/leave) or Join Live CTA state. */
export function LiveControlBar({
  state = "Live On Control Bar",
  onJoin,
  onLeave,
  className,
}: LiveControlBarProps) {
  const [muted, setMuted] = React.useState(false);
  const [camOff, setCamOff] = React.useState(false);
  const [hand, setHand] = React.useState(false);

  if (state === "Join Live Control Bar") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-xl border border-sko-border-subtle bg-sko-bg-primary-soft px-5 py-3",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sko-bg-error-soft px-2 py-0.5">
            <span className="h-2 w-2 rounded-full bg-sko-bg-error" aria-hidden />
            <span className="sk-text-xs-semibold text-sko-text-error">LIVE</span>
          </span>
          <span className="sk-text-sm-medium text-sko-text-default">Office hours with Sarah</span>
        </div>
        <Button variant="primary" size="md" onClick={onJoin}>
          Join live
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-xl border border-sko-border-subtle bg-sko-bg-page px-5 py-3",
        className,
      )}
    >
      <ControlButton
        label={muted ? "Unmute" : "Mute"}
        icon={muted ? MicOff : Mic}
        active={muted}
        onClick={() => setMuted((m) => !m)}
      />
      <ControlButton
        label={camOff ? "Turn camera on" : "Turn camera off"}
        icon={camOff ? VideoOff : Video}
        active={camOff}
        onClick={() => setCamOff((c) => !c)}
      />
      <ControlButton label="Raise hand" icon={Hand} active={hand} onClick={() => setHand((h) => !h)} />
      <ControlButton label="Chat" icon={MessageSquare} />
      <Button variant="destructive" size="md" onClick={onLeave}>
        Leave
      </Button>
    </div>
  );
}
