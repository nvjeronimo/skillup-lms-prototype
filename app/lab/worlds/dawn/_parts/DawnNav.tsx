"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";
import { BASE, personaQuery } from "./light";

/** The world's own top bar: the logo (dark asset, it sits on night) and the two places a learner goes. */
export function DawnNav() {
  const pathname = usePathname();
  const q = personaQuery(useSearchParams().get("persona"));
  const onHome = pathname === BASE;
  const onLearning = pathname.startsWith(`${BASE}/learning`);
  const inCourse = pathname.startsWith(`${BASE}/course`);

  return (
    <header className="dw-nav">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-4 px-4 md:gap-8 md:px-10">
        <Link href={`${BASE}${q}`} aria-label="SkillUp, Home" className="inline-flex min-h-[44px] shrink-0 items-center">
          <SkillUpLogo className="h-6 md:h-7" />
        </Link>
        <nav aria-label="Primary" className="ml-auto md:ml-0">
          <ul className="flex items-stretch">
            <li>
              <Link
                href={`${BASE}${q}`}
                aria-current={onHome ? "page" : undefined}
                className="dw-navlink inline-flex min-h-[64px] items-center px-3"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href={`${BASE}/learning${q}`}
                aria-current={onLearning ? "page" : inCourse ? "true" : undefined}
                className="dw-navlink inline-flex min-h-[64px] items-center px-3"
              >
                My Learning
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
