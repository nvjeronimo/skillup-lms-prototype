"use client";

import * as React from "react";
import { Layers } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { LessonBlocks } from "./LessonBlocks";
import { getLessonPage } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useEdxScope } from "@/lib/edx-scope";

/**
 * Lesson Page — a topic with no single dominant asset, composed of stacked
 * blocks. Naming it explicitly stops it being mislabelled as "Video" in the
 * outline just because a video happens to be the first thing on the page.
 */
export function LessonPageView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  // Open edX scope: the file cards are hidden, so the summary does not count them.
  const edx = useEdxScope();
  const page = React.useMemo(() => (topic ? getLessonPage(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!topic || !page) return null;

  const counts = page.blocks.reduce<Record<string, number>>((acc, b) => {
    acc[b.kind] = (acc[b.kind] ?? 0) + 1;
    return acc;
  }, {});
  const summary = [
    counts.video ? `${counts.video} video` : null,
    counts.image ? `${counts.image} diagram` : null,
    counts.file && !edx ? `${counts.file} download` : null,
    counts["knowledge-check"] ? "1 quick check" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand" leftIcon={Layers}>
          Lesson page
        </Badge>
        {summary.length ? <Badge tone="neutral">{summary.join(" · ")}</Badge> : null}
      </div>

      {page.intro ? (
        <p className="sk-text-title-medium-medium text-sko-text-default">{page.intro}</p>
      ) : null}

      <LessonBlocks blocks={page.blocks} />
    </div>
  );
}
