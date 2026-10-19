import { PlayerSession } from "@/components/views/PlayerSession";

/** Spans every topic of one course: the player's session boundary (see PlayerSession). */
export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return <PlayerSession>{children}</PlayerSession>;
}
