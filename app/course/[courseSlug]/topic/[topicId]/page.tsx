import { TranscriptTab } from "@/components/views/TranscriptTab";

export default function TranscriptPage({
  params,
}: {
  params: { courseSlug: string; topicId: string };
}) {
  return <TranscriptTab topicId={params.topicId} courseSlug={params.courseSlug} />;
}
