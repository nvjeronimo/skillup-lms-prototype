import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PlayerSession } from "@/components/views/PlayerSession";
import { ACCOUNT_COOKIE, SIGN_IN_HREF, parseDeletionRequest } from "@/lib/account-deletion";

/**
 * Spans every topic of one course: the player's session boundary (see PlayerSession).
 * An account with a pending deletion is signed out: the player goes to sign in too.
 */
export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  if (parseDeletionRequest(cookies().get(ACCOUNT_COOKIE)?.value)) redirect(SIGN_IN_HREF);
  return <PlayerSession>{children}</PlayerSession>;
}
