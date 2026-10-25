import { PersonaGateProvider } from "@/lib/persona-gate";
import { requestPersonaId } from "@/lib/persona-server";

/**
 * The platform pages' layout: only the synthetic personas' gate (Nelson, 25 Oct 2026). It reads
 * the `sk-persona` cookie of the request, so PlatformPage knows, on the server and while
 * hydrating alike, whether to hold its content until mount (lib/persona-gate).
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <PersonaGateProvider id={requestPersonaId()}>{children}</PersonaGateProvider>;
}
