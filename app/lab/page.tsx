import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Explorations" };

const DASHBOARD = [
  { slug: "continue", name: "A · Continue first", hero: "One dominant resume card; everything else below it.", serves: "Maya, Sara, Noah" },
  { slug: "pace", name: "B · Pace + this week", hero: "On track or behind, and what is due this week.", serves: "Dev, Maya, Helena" },
  { slug: "live", name: "C · Live + today", hero: "Organised by time: now, today, this week.", serves: "Sara, Leo, Maya" },
  { slug: "portfolio", name: "D · Portfolio overview", hero: "Every enrolment and certificate at a glance.", serves: "Priya, Noah" },
];

export default function LabIndex() {
  return (
    <main id="main" tabIndex={-1} className="outline-none mx-auto w-full max-w-4xl flex-1 p-4 md:p-8">
      <h1 className="sk-text-display-sm-semibold text-sko-text-default">Explorations</h1>
      <p className="sk-text-md-regular mt-1 text-sko-text-muted">
        Directions to compare before one is chosen and brought into Figma. Switch persona in the top bar.
      </p>
      <h2 className="sk-text-lg-semibold mt-8 text-sko-text-default">Dashboard / Home</h2>
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {DASHBOARD.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/lab/dashboard/${d.slug}`}
              className="flex h-full flex-col gap-1 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-4 hover:border-sko-border-primary"
            >
              <span className="sk-text-md-semibold text-sko-text-default">{d.name}</span>
              <span className="sk-text-sm-regular text-sko-text-muted">{d.hero}</span>
              <span className="sk-text-xs-medium text-sko-text-subtle">For: {d.serves}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
