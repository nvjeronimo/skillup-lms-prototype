import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCOUNT_COOKIE, SIGN_IN_HREF, parseDeletionRequest } from "@/lib/account-deletion";
import { PersonaGateProvider } from "@/lib/persona-gate";
import { requestPersonaId } from "@/lib/persona-server";

/**
 * The platform pages' layout: only the synthetic personas' gate (Nelson, 25 Oct 2026). It reads
 * the `sk-persona` cookie of the request, so PlatformPage knows, on the server and while
 * hydrating alike, whether to hold its content until mount (lib/persona-gate).
 * An account with a pending deletion is signed out (lib/account-deletion): every platform page
 * goes to sign in.
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  if (parseDeletionRequest(cookies().get(ACCOUNT_COOKIE)?.value)) redirect(SIGN_IN_HREF);
  return <PersonaGateProvider id={requestPersonaId()}>{children}</PersonaGateProvider>;
}
