"use client";

import * as React from "react";
import { CourseRowCard } from "@/components/platform/CourseRowCard";
import type { Program } from "@/lib/platform/program";
import { SectionIntro } from "./parts";

/**
 * Courses tab (handoff cards 01–03 of 6728:15050): the Section intro and the seven course
 * rows (DS `Course-Row`: components/platform/CourseRowCard, shared with My Learning), 16 apart, as an ordered list in one full-width column (this tab has no sidebar: the
 * List card needs the width). Each row opens on its own; the course in progress opens with
 * the page, as drawn.
 */
export function CoursesTab({ program }: { program: Program }) {
  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(program.courses.filter((c) => c.defaultOpen).map((c) => c.id)),
  );
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex flex-col gap-6">
      <SectionIntro title={program.coursesIntro.title} lead={program.coursesIntro.lead} />
      <ol className="flex flex-col gap-4">
        {program.courses.map((course) => (
          <CourseRowCard
            key={course.id}
            card={course.card}
            position={course.position}
            detail={course.detail}
            modules={course.modules}
            open={open.has(course.id)}
            onToggle={() => toggle(course.id)}
          />
        ))}
      </ol>
    </div>
  );
}
