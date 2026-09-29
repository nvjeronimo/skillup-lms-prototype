"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { getPersona } from "@/lib/lab/dashboard-mock";
import { withPersona } from "./copy";

const BASE = "/lab/worlds/field";

/** A floating white capsule (logo + links) and, detached from it, the learner's own pill. */
export function FieldNav() {
  const pathname = usePathname();
  const persona = useSearchParams().get("persona");
  const p = getPersona(persona);
  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  const items = [
    { label: "Home", href: BASE, current: pathname === BASE ? "page" : undefined },
    {
      label: "My Learning",
      href: `${BASE}/learning`,
      // The course page lives under My Learning: it is the current section, not the current page.
      current: pathname === `${BASE}/learning` ? "page" : pathname.startsWith(`${BASE}/course`) ? "true" : undefined,
    },
  ] as const;

  return (
    <header className="fd-wrap flex items-center gap-3 pt-4 md:pt-6">
      <nav aria-label="Primary" className="fd-capsule flex min-w-0 flex-1 items-center gap-1 py-1.5 pl-4 pr-1.5 md:gap-2 md:py-2 md:pl-7 md:pr-2">
        <Link href={withPersona(BASE, persona)} aria-label="SkillUp home" className="inline-flex min-h-[44px] shrink-0 items-center rounded-full pr-2 md:pr-6">
          <SkillUpLogo className="h-6 md:h-8" />
        </Link>
        <ul className="ml-auto flex items-center gap-1">
          {items.map((it) => (
            <li key={it.label}>
              <Link href={withPersona(it.href, persona)} aria-current={it.current} className="fd-navlink">
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="fd-capsule hidden shrink-0 items-center gap-3 py-2 pl-6 pr-2 sm:flex">
        <span className="fd-label fd-c-ink">{p.name}</span>
        <span className="fd-initials" aria-hidden>
          {initials}
        </span>
      </p>
    </header>
  );
}
