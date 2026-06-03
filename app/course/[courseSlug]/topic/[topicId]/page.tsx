import { TopicBody } from "@/components/views/TopicBody";

export default function TopicPage({
  params,
}: {
  params: { courseSlug: string; topicId: string };
}) {
  return <TopicBody topicId={params.topicId} courseSlug={params.courseSlug} />;
}
