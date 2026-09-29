import type { Metadata } from "next";
import Link from "next/link";
import { WORLDS, WORLD_PAGES } from "@/lib/lab/worlds";

export const metadata: Metadata = { title: { absolute: "Worlds · Lab · SkillUp" } };

/** Four worlds × three pages, one click each. */
export default function WorldsIndex() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 outline-none md:px-8">
      <h1 className="sk-text-display-sm-semibold text-sko-text-default">Worlds</h1>
      <p className="sk-text-md-regular mt-2 max-w-2xl text-sko-text-muted">
        Four out-of-the-box directions, each carried across Home, My Learning and a course. Switch world or page from the
        strip at the top of any page; switch persona in the lab bar.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {WORLDS.map((w) => (
          <li key={w.key} className="rounded-xl border border-sko-border-subtle bg-sko-bg-page p-5">
            <h2 className="sk-text-lg-semibold text-sko-text-default">
              {w.letter} · {w.name}
            </h2>
            <p className="sk-text-sm-regular mt-1 text-sko-text-muted">{w.idea}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {WORLD_PAGES.map((p) => (
                <li key={p.key}>
                  <Link
                    href={`/lab/worlds/${w.key}${p.path}?persona=dev`}
                    className="sk-text-sm-semibold inline-flex min-h-[44px] items-center rounded-md border border-sko-border-default px-3 text-sko-text-primary hover:bg-sko-bg-faint"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
