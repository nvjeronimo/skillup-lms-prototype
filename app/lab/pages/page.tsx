import type { Metadata } from "next";
import Link from "next/link";
import { PAGES, PAGE_KEYS } from "@/lib/lab/page-options";

export const metadata: Metadata = { title: { absolute: "Page options · Lab · SkillUp" } };

/** Every option for every page, side by side, one click to open. */
export default function PageOptionsIndex() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 outline-none md:px-8">
      <h1 className="sk-text-display-sm-semibold text-sko-text-default">Page options</h1>
      <p className="sk-text-md-regular mt-2 max-w-2xl text-sko-text-muted">
        Four different ideas for each learner page, in the SkillUp DS. Open one, then use the strip under the top bar to
        compare the others. Switch persona in the lab bar.
      </p>
      {PAGE_KEYS.map((k) => (
        <section key={k} aria-labelledby={`${k}-h`} className="mt-10">
          <h2 id={`${k}-h`} className="sk-text-lg-semibold text-sko-text-default">
            {PAGES[k].label}
          </h2>
          <p className="sk-text-sm-regular text-sko-text-muted">{PAGES[k].job}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PAGES[k].options.map((o) => (
              <li key={o.key}>
                <Link
                  href={`/lab/pages/${k}/${o.key}?persona=dev`}
                  className="flex h-full flex-col gap-1 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4 hover:border-sko-border-primary"
                >
                  <span className="sk-text-md-semibold text-sko-text-default">
                    {o.key.toUpperCase()} · {o.name}
                  </span>
                  <span className="sk-text-sm-regular text-sko-text-muted">{o.idea}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
