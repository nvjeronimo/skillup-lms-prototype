import type { Metadata } from "next";
import { DownloadsTab } from "@/components/views/DownloadsTab";
import { getTopic } from "@/lib/data";
import { pageTitle } from "@/lib/utils";

type Params = { params: { courseSlug: string; topicId: string } };

export function generateMetadata({ params }: Params): Metadata {
  const topic = getTopic(params.topicId);
  return { title: pageTitle(topic ? `Downloads · ${topic.title}` : "Downloads") };
}

export default function DownloadsPage({ params }: Params) {
  return <DownloadsTab topicId={params.topicId} />;
}
