import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import type { Program } from "@/lib/platform/program";
import { cn } from "@/lib/utils";
import { CardShell } from "./parts";
import styles from "./ProgramSidebar.module.css";

/**
 * The right column of the Program page, three `LMS / Course Detail / Sidebar card` instances
 * side-gap apart (DS Layout/*), the same on Certificates, FAQs and About (the Courses tab has none):
 * - Program dates (Type=Dates, 6443:18749): rows of a 44×48 date tile (bg/subtle, radius 8),
 *   title, date line and the relative badge (Badge Outline / Gray), split by 1px rules;
 * - What's included (Card shell, 6445:24736): a bulleted list, body-medium/Regular;
 * - Program instructor (Type=Team, 6443:18745): DS Avatar md + name + role.
 * 320px wide on the right on desktop and tablet; on mobile the three cards follow the main
 * column at full width.
 */
export function ProgramSidebar({ program, className }: { program: Program; className?: string }) {
  return (
    <aside
      aria-label="Program details"
      className={cn(styles.sidebar, className)}
    >
      <CardShell label="Program dates" gap="lg" mock="Program dates have no API; the relative labels are computed">
        <ul className={styles.dates}>
          {program.dates.map((date, index) => (
            <li
              key={date.id}
              className={cn(
                styles.date,
                index < program.dates.length - 1 && styles.dateRule,
              )}
            >
              <span
                aria-hidden
                className={styles.tile}
              >
                <span className={`sk-text-body-large-semibold ${styles.textDefault}`}>{date.day}</span>
                <span className={`sk-text-body-small-semibold ${styles.textSubtle}`}>{date.month}</span>
              </span>
              <div className={styles.dateBody}>
                <p className={`sk-text-body-medium-semibold ${styles.textDefault}`}>{date.title}</p>
                <p className={`sk-text-body-small-regular ${styles.textSubtle}`}>
                  <time dateTime={date.iso}>{date.detail}</time>
                </p>
                <Badge variant="outline" color="gray">
                  {date.relative}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardShell>

      <CardShell
        label="What's included"
        mock="Content counts per program have no API"
        invented="catalogue: no content counts per program in Open edX"
      >
        <ul className={`sk-text-body-medium-regular ${styles.included}`}>
          {program.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardShell>

      <CardShell label="Program instructor" gap="lg" mock="No instructor field on the LMS APIs">
        <ul className={styles.people}>
          {program.instructors.map((person) => (
            <li key={person.name} className={styles.person}>
              <Avatar name={person.name} size="md" />
              <div className={styles.personText}>
                <p className={`sk-text-body-medium-semibold ${styles.textDefault}`}>{person.name}</p>
                <p className={`sk-text-body-medium-regular ${styles.textSubtle}`}>{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardShell>
    </aside>
  );
}
