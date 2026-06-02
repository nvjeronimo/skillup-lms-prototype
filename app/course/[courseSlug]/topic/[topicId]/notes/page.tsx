import { NotesTab } from "@/components/views/NotesTab";

export default function NotesPage({
  params,
}: {
  params: { courseSlug: string; topicId: string };
}) {
  return <NotesTab topicId={params.topicId} courseSlug={params.courseSlug} />;
}
