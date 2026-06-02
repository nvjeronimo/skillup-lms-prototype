import { DownloadsTab } from "@/components/views/DownloadsTab";

export default function DownloadsPage({
  params,
}: {
  params: { courseSlug: string; topicId: string };
}) {
  return <DownloadsTab topicId={params.topicId} />;
}
