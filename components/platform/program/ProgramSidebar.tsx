import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import type { Program } from "@/lib/platform/program";
import { cn } from "@/lib/utils";
import { CardShell } from "./parts";

/**
 * The right column of the Program page, three `LMS / Course Detail / Sidebar card` instances
 * 16 apart, the same on Certificates, FAQs and About (the Courses tab has none):
 * - Program dates (Type=Dates, 6443:18749): rows of a 44×48 date tile (bg/subtle, radius 8),
 *   title, date line and the relative badge (Badge v2 Outline / Gray), split by 1px rules;
 * - What's included (Card shell, 6445:24736): a bulleted list, body-medium/Regular;
 * - Program instructor (Type=Team, 6443:18745): DS Avatar md + name + role.
 * 320px wide on the right on desktop and tablet; on mobile the three cards follow the main
 * column at full width.
 */
export function ProgramSidebar({ program, className }: { program: Program; className?: string }) {
  return (
    <aside
      aria-label="Program details"
      className={cn("flex flex-col gap-4", className)}
    >
      <CardShell label="Program dates" gap="lg" mock="Program dates have no API; the relative labels are computed">
        <ul className="flex flex-col">
          {program.dates.map((date, index) => (
            <li
              key={date.id}
              className={cn(
                "flex items-center gap-3 py-3",
                index < program.dates.length - 1 && "border-b border-sko-border-subtle",
              )}
            >
              <span
                aria-hidden
                className="flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-sko-bg-subtle"
              >
                <span className="sk-text-body-large-semibold text-sko-text-default">{date.day}</span>
                <span className="sk-text-body-small-semibold text-sko-text-subtle">{date.month}</span>
              </span>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                <p className="sk-text-body-medium-semibold text-sko-text-default">{date.title}</p>
                <p className="sk-text-body-small-regular text-sko-text-subtle">
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

      <CardShell label="What's included" mock="Content counts per program have no API">
        <ul className="sk-text-body-medium-regular list-disc ps-[21px] text-sko-text-default">
          {program.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardShell>

      <CardShell label="Program instructor" gap="lg" mock="No instructor field on the LMS APIs">
        <ul className="flex flex-col gap-4">
          {program.instructors.map((person) => (
            <li key={person.name} className="flex items-center gap-2">
              <Avatar name={person.name} size="md" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="sk-text-body-medium-semibold text-sko-text-default">{person.name}</p>
                <p className="sk-text-body-medium-regular text-sko-text-subtle">{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardShell>
    </aside>
  );
}
