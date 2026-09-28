import type { Metadata } from "next";
import { PlayerShell } from "@/components/views/PlayerShell";
import { getTopic } from "@/lib/data";

type Params = { params: { courseSlug: string; topicId: string } };

/** The topic's own title (WCAG 2.4.2); the root template appends "· SkillUp". */
export function generateMetadata({ params }: Params): Metadata {
  return { title: getTopic(params.topicId)?.title ?? "Topic not found" };
}

export default function TopicLayout({
  children,
  params,
}: Params & { children: React.ReactNode }) {
  return (
    <PlayerShell courseSlug={params.courseSlug} topicId={params.topicId}>
      {children}
    </PlayerShell>
  );
}
