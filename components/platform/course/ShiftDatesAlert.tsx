"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { CourseAlert } from "./CourseAlert";
import { courseDetailHref } from "@/lib/platform/course-detail";
import { SHIFT_DATES } from "@/lib/platform/shift-dates";
import { useLmsStore } from "@/lib/store";

/**
 * Open edX `ShiftDatesAlert` on the course page (Course and Dates tabs): the warning alert with the
 * platform's copy and a Primary "Shift due dates". After the shift, the toast with "View all dates"
 * and the alert goes (the dates are reloaded). Not dismissible, as in Open edX. See lib/platform/shift-dates.
 */
export function ShiftDatesAlert({ courseSlug, className }: { courseSlug: string; className?: string }) {
  const router = useRouter();
  const showToast = useLmsStore((s) => s.showToast);
  const [shifted, setShifted] = React.useState(false);
  // After the shift the alert leaves with its own exit (CourseAlert `open`), not in one frame.
  return (
    <CourseAlert
      open={!shifted}
      tone="warning"
      title={SHIFT_DATES.title}
      body={SHIFT_DATES.body}
      mock="The reset is POST /api/course_experience/v1/reset_course_deadlines; the prototype only shows the toast"
      className={className}
      action={
        <Button
          size="sm"
          className="max-md:h-11 max-md:w-full"
          onClick={() => {
            setShifted(true);
            showToast(SHIFT_DATES.toast, {
              actionLabel: SHIFT_DATES.toastLink,
              onAction: () => router.push(courseDetailHref(courseSlug, "dates")),
            });
          }}
        >
          {SHIFT_DATES.button}
        </Button>
      }
    />
  );
}
