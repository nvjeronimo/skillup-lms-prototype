"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { getTopic } from "@/lib/data";

export function LockedView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  return (
    <div className="py-10">
      <EmptyState
        icon={Lock}
        title="This topic is locked"
        description={
          topic
            ? `“${topic.title}” unlocks once you complete the earlier topics in ${topic.moduleTitle}.`
            : "Complete the earlier topics to unlock this one."
        }
      />
    </div>
  );
}
