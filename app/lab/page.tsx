import type { Metadata } from "@/lib/router";
import Link from "@/lib/router";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Explorations" };

const DASHBOARD = [
  { slug: "continue", name: "A · Continue first", hero: "One dominant resume card; everything else below it.", serves: "Maya, Sara, Noah" },
  { slug: "pace", name: "B · Pace + this week", hero: "On track or behind, and what is due this week.", serves: "Dev, Maya, Helena" },
  { slug: "live", name: "C · Live + today", hero: "Organized by time: now, today, this week.", serves: "Sara, Leo, Maya" },
  { slug: "portfolio", name: "D · Portfolio overview", hero: "Every enrollment and certificate at a glance.", serves: "Priya, Noah" },
];

export default function LabIndex() {
  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <h1 className={`sk-text-headline-medium-semibold ${styles.title}`}>Explorations</h1>
      <p className={`sk-text-body-large-regular ${styles.lede}`}>
        Directions to compare before one is chosen and brought into Figma. Switch persona in the top bar.
      </p>
      <h2 className={`sk-text-title-medium-semibold ${styles.section}`}>Dashboard / Home</h2>
      <ul className={styles.list}>
        {DASHBOARD.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/lab/dashboard/${d.slug}`}
              className={styles.card}
            >
              <span className={`sk-text-body-large-semibold ${styles.name}`}>{d.name}</span>
              <span className={`sk-text-body-medium-regular ${styles.hero}`}>{d.hero}</span>
              <span className={`sk-text-body-small-medium ${styles.serves}`}>For: {d.serves}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
