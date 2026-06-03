"use client";

import * as React from "react";
import { DiscussionPrompt } from "@/components/molecules/DiscussionPrompt";
import { ThreadItem } from "@/components/molecules/ThreadItem";
import { getDiscussionThreads } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";

export function DiscussionView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const showToast = useLmsStore((s) => s.showToast);
  if (!topic) return null;
  const threads = getDiscussionThreads(topic);

  return (
    <div className="flex flex-col gap-5 py-4">
      <DiscussionPrompt
        prompt={`${topic.title}: what's your take?`}
        duration={topic.duration}
        onSubmit={() => showToast("Reply posted to the discussion.")}
      />

      <section className="flex flex-col gap-2">
        <p className="lms-text-2xs-medium text-lms-text-tertiary">
          {threads.length} responses from your cohort
        </p>
        {threads.map((t, i) => (
          <ThreadItem
            key={i}
            author={t.author}
            timestamp={t.timestamp}
            content={t.content}
            replies={t.replies}
            upvotes={t.upvotes}
            onClick={() => showToast("Opening thread…")}
          />
        ))}
      </section>
    </div>
  );
}
