"use client";

import { useSearchParams } from "@/lib/router";
import { getPersona, type Persona } from "@/lib/lab/dashboard-mock";

/** The persona picked with ?persona=noah|maya|dev|priya (default Maya, the baseline). */
export function usePersona(): Persona {
  const params = useSearchParams();
  return getPersona(params.get("persona"));
}
