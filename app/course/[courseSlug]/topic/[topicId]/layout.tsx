import { PlayerShell } from "@/components/views/PlayerShell";

export default function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseSlug: string; topicId: string };
}) {
  return (
    <PlayerShell courseSlug={params.courseSlug} topicId={params.topicId}>
      {children}
    </PlayerShell>
  );
}
