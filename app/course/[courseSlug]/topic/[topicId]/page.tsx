import type { Metadata } from "next";
import { TopicBody } from "@/components/views/TopicBody";
import { getTopic } from "@/lib/data";
import { pageTitle } from "@/lib/utils";

type Params = { params: { courseSlug: string; topicId: string } };

export function generateMetadata({ params }: Params): Metadata {
  return { title: pageTitle(getTopic(params.topicId)?.title ?? "Topic not found") };
}

export default function TopicPage({ params }: Params) {
  return <TopicBody topicId={params.topicId} courseSlug={params.courseSlug} />;
}
