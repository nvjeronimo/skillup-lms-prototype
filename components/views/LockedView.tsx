import * as React from "react";
import { Lock } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { getTopic } from "@/lib/data";
import styles from "./LockedView.module.css";

export function LockedView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  return (
    <div className={styles.root}>
      {/* LMS / Empty State has no Locked kind: drop its card border and radius here. */}
      <EmptyState
        className={styles.emptyState}
        icon={Lock}
        titleAs="h1"
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
