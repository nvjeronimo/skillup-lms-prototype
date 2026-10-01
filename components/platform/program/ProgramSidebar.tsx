import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import type { Program } from "@/lib/platform/program";
import { cn } from "@/lib/utils";
import { CardShell } from "./parts";

/**
 * The right column of Program Detail (6443:18743), three `LMS / Course Detail / Sidebar card`
 * instances 16 apart, the same on every tab:
 * - Program dates (Type=Dates, 6443:18749): rows of a 44×48 date tile (bg/subtle, radius 8),
 *   title, date line and the relative badge (Badge v2 Outline / Gray), split by 1px rules;
 * - What's included (Card shell, 6445:24736): a bulleted list, body-medium/Regular;
 * - Program instructor (Type=Team, 6443:18745): DS Avatar md + name + role.
 * 320px wide on desktop; below desktop the cards move under the main column (two columns on
 * tablet, one on mobile), which Figma does not draw.
 */
export function ProgramSidebar({ program, className }: { program: Program; className?: string }) {
  return (
    <aside
      aria-label="Program details"
      className={cn("grid gap-4 md:grid-cols-2 md:items-start lg:flex lg:flex-col lg:items-stretch", className)}
    >
      <CardShell label="Program dates" gap="lg">
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
                <span className="sk-text-md-semibold text-sko-text-default">{date.day}</span>
                <span className="sk-text-xs-semibold text-sko-text-subtle">{date.month}</span>
              </span>
              <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                <p className="sk-text-sm-semibold text-sko-text-default">{date.title}</p>
                <p className="sk-text-xs-regular text-sko-text-subtle">
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

      <CardShell label="What's included">
        <ul className="sk-text-sm-regular list-disc ps-[21px] text-sko-text-default">
          {program.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardShell>

      <CardShell label="Program instructor" gap="lg">
        <ul className="flex flex-col gap-4">
          {program.instructors.map((person) => (
            <li key={person.name} className="flex items-center gap-2">
              <Avatar name={person.name} size="md" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="sk-text-sm-semibold text-sko-text-default">{person.name}</p>
                <p className="sk-text-sm-regular text-sko-text-subtle">{person.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardShell>
    </aside>
  );
}
