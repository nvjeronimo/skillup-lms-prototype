"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SkillUpLogo } from "@/components/atoms/SkillUpLogo";

const BASE = "/lab/worlds/album";

/** The world's own top bar: the logo, Home and My Learning. The persona travels with every link. */
export function AlbumNav() {
  const pathname = usePathname();
  const persona = useSearchParams().get("persona");
  const q = persona ? `?persona=${encodeURIComponent(persona)}` : "";
  const onHome = pathname === BASE;
  const onLearning = pathname.startsWith(`${BASE}/learning`);
  const inCourse = pathname.startsWith(`${BASE}/course`);
  return (
    <header className="al-rule-b">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 md:px-8">
        <Link href={`${BASE}${q}`} aria-label="SkillUp, Home" className="inline-flex min-h-[48px] items-center">
          <SkillUpLogo className="h-7" />
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            <li>
              <Link href={`${BASE}${q}`} aria-current={onHome ? "page" : undefined} className="al-nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link
                href={`${BASE}/learning${q}`}
                aria-current={onLearning ? "page" : inCourse ? "true" : undefined}
                className="al-nav-link"
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
