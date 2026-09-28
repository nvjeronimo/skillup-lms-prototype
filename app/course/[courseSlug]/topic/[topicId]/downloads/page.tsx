import type { Metadata } from "next";
import { DownloadsTab } from "@/components/views/DownloadsTab";
import { getTopic } from "@/lib/data";

type Params = { params: { courseSlug: string; topicId: string } };

export function generateMetadata({ params }: Params): Metadata {
  const topic = getTopic(params.topicId);
  return { title: topic ? `Downloads · ${topic.title}` : "Downloads" };
}

export default function DownloadsPage({ params }: Params) {
  return <DownloadsTab topicId={params.topicId} />;
}
