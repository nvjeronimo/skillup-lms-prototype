"use client";

import * as React from "react";
import { LiveControlBar } from "@/components/organisms/LiveControlBar";
import { LiveAttendance } from "@/components/molecules/LiveAttendance";
import { useLmsStore } from "@/lib/store";
import { getTopic } from "@/lib/data";

export function ViltView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const showToast = useLmsStore((s) => s.showToast);
  if (!topic) return null;
  const isRecording = topic.type === "VILT-Recording";

  return (
    <div className="flex flex-col gap-4 py-4">
      <div
        className="relative flex aspect-video max-h-[42vh] w-full items-center justify-center overflow-hidden rounded-xl"
        style={{
          background: "linear-gradient(135deg, var(--sk-bg-brand-solid), var(--sk-text-brand-primary))",
        }}
      >
        <span className="sk-text-md-semibold text-sk-text-primary-on-brand">
          {isRecording ? "Session recording" : "Live session stage"}
        </span>
      </div>

      {isRecording ? null : (
        <div className="flex items-center justify-between gap-4">
          <LiveAttendance live={24} total={30} recording />
        </div>
      )}

      <LiveControlBar
        state={isRecording ? "Join Live Control Bar" : "Live On Control Bar"}
        onJoin={() => showToast("Joining the live session…")}
        onLeave={() => showToast("You left the session.")}
      />
    </div>
  );
}
