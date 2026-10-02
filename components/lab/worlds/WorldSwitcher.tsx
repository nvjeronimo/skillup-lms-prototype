"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { WORLDS, WORLD_PAGES, type WorldKey } from "@/lib/lab/worlds";
import { cn } from "@/lib/utils";

/** Lab-only strip above every world: switch world (same page) or page (same world). Not part of any design. */
export function WorldSwitcher() {
  const pathname = usePathname();
  const params = useSearchParams();
  const m = /^\/lab\/worlds\/(exhibition|album|field|dawn)(\/learning|\/course)?/.exec(pathname);
  if (!m) return null;
  const world = m[1] as WorldKey;
  const pagePath = m[2] ?? "";
  const q = params.toString() ? `?${params.toString()}` : "";
  const current = WORLDS.find((w) => w.key === world);
  const chip = (on: boolean) =>
    cn(
      "sk-text-sm-medium inline-flex min-h-[44px] items-center rounded-md border px-3",
      on ? "border-sko-border-primary bg-sko-bg-page text-sko-text-primary" : "border-transparent text-sko-text-muted hover:bg-sko-bg-page",
    );
  return (
    <nav aria-label="Lab: worlds and pages" className="border-b border-dashed border-sko-border-default bg-sko-bg-faint">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-1 md:px-6">
        <ul className="flex flex-wrap gap-1" aria-label="Worlds">
          {WORLDS.map((w) => (
            <li key={w.key}>
              <Link href={`/lab/worlds/${w.key}${pagePath}${q}`} aria-current={w.key === world ? "page" : undefined} className={chip(w.key === world)}>
                {w.letter} · {w.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-1" aria-label="Pages">
          {WORLD_PAGES.map((p) => (
            <li key={p.key}>
              <Link href={`/lab/worlds/${world}${p.path}${q}`} aria-current={p.path === pagePath ? "page" : undefined} className={chip(p.path === pagePath)}>
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        {current ? <p className="sk-text-sm-regular w-full pb-1 text-sko-text-muted">{current.idea}</p> : null}
      </div>
    </nav>
  );
}
