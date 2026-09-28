import type { Metadata } from "next";
import { NotesTab } from "@/components/views/NotesTab";
import { getTopic } from "@/lib/data";

type Params = { params: { courseSlug: string; topicId: string } };

export function generateMetadata({ params }: Params): Metadata {
  const topic = getTopic(params.topicId);
  return { title: topic ? `Notes · ${topic.title}` : "Notes" };
}

export default function NotesPage({ params }: Params) {
  return <NotesTab topicId={params.topicId} courseSlug={params.courseSlug} />;
}
