"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { getPersona } from "@/lib/lab/dashboard-mock";
import { cn } from "@/lib/utils";
import { BASE } from "./model";

/** The gallery's own signage: the logo, two destinations, and who is visiting. */
export function ExNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  const p = getPersona(params.get("persona"));
  const q = `?persona=${p.id}`;
  const items = [
    { label: "Home", href: BASE, current: pathname === BASE ? ("page" as const) : undefined },
    {
      label: "My Learning",
      href: `${BASE}/learning`,
      // The course page lives inside My Learning: the section is current, the page is not in this nav.
      current: pathname === `${BASE}/learning` ? ("page" as const) : pathname.startsWith(`${BASE}/course`) ? ("true" as const) : undefined,
    },
  ];
  return (
    <header className="ex-plaster ex-on-plaster ex-rule-b">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-4 px-4 md:gap-8 md:px-10">
        <Link href={`${BASE}${q}`} aria-label="SkillUp, Home" className="inline-flex min-h-[44px] shrink-0 items-center">
          <SkillUpLogo className="h-7" />
        </Link>
        <nav aria-label="Primary" className="ml-auto md:ml-0">
          <ul className="flex items-stretch">
            {items.map((it) => (
              <li key={it.label}>
                <Link
                  href={`${it.href}${q}`}
                  aria-current={it.current}
                  className={cn(
                    "ex-nav-link inline-flex min-h-[64px] items-center px-3",
                    it.current ? "ex-nav-current" : "ex-nav-idle",
                  )}
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="ex-small ex-c-ink2 ml-auto hidden md:block">
          <span className="sr-only">Visiting as </span>
          {p.name}
        </p>
      </div>
    </header>
  );
}
