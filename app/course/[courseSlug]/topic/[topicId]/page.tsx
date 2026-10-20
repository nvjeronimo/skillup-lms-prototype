import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicBody } from "@/components/views/TopicBody";
import { flattenOutline } from "@/lib/courses/outline";
import { getTopic } from "@/lib/data";
import { playerCourse } from "@/lib/platform/catalog";
import { pageTitle } from "@/lib/utils";

type Params = { params: { courseSlug: string; topicId: string } };

/** A topic belongs to the course in the address; another course's topic is a 404, not borrowed content. */
function inCourse({ courseSlug, topicId }: Params["params"]): boolean {
  return flattenOutline(playerCourse(courseSlug)).some((t) => t.id === topicId);
}

export function generateMetadata({ params }: Params): Metadata {
  const found = inCourse(params) ? getTopic(params.topicId) : undefined;
  return { title: pageTitle(found?.title ?? "Topic not found") };
}

export default function TopicPage({ params }: Params) {
  if (!inCourse(params)) notFound();
  return <TopicBody topicId={params.topicId} courseSlug={params.courseSlug} />;
}
