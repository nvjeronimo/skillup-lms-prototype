"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { useLmsStore } from "@/lib/store";
import type { CourseDate, CourseDateState, CourseDetail } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";
import { CourseAlert } from "./CourseAlert";

/* The 12px dot of the spine. The DS binds icon/success and icon/error as its fill; the bg
   roles of the same colours stand in, since an icon token is not a fill here. */
const DOT: Record<CourseDateState, string> = {
  complete: "bg-sko-bg-success",
  overdue: "bg-sko-bg-error",
  upcoming: "bg-sko-bg-muted",
  locked: "bg-sko-bg-muted",
};

const STATE_LABEL: Record<CourseDateState, string> = {
  complete: "Past",
  overdue: "Overdue",
  upcoming: "Upcoming",
  locked: "Locked",
};

/** DS `Content divider`, Type=Text: the label (body-medium/Medium, text/subtle) between two 1px rules, 8 apart. */
function Divider({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "h3" }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="flex-1 border-t border-sko-border-subtle" />
      <Tag className="sk-text-body-medium-medium text-sko-text-subtle">{children}</Tag>
      <span aria-hidden className="flex-1 border-t border-sko-border-subtle" />
    </div>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Date-Row`. Desktop and tablet: the date column (104 wide:
 * the date, body-medium/Semibold, over the time, body-small/Regular), the spine (a 2px
 * bg/muted line with a 12px dot ringed in bg/page) and the content — badges (Badge v2
 * Outline sm), title, description and the link — 12 apart. Padding 12 above; 24 / 20 below.
 * Mobile: the spine first, the date and the time on one line above the badges; 16 below.
 * One markup: a grid whose date cell moves from the content column to its own column.
 */
function DateRow({ item, href, first }: { item: CourseDate; href: string; first: boolean }) {
  return (
    <li className="relative grid grid-cols-[16px_minmax(0,1fr)] gap-x-3 gap-y-1 pb-4 pt-3 md:grid-cols-[104px_16px_minmax(0,1fr)] md:gap-y-0 md:pb-5 lg:pb-6">
      <span
        aria-hidden
        className={cn("absolute bottom-0 left-[7px] w-0.5 bg-sko-bg-muted md:left-[123px]", first ? "top-4" : "top-0")}
      />
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 top-4 size-3 rounded-full ring-2 ring-sko-bg-page md:left-[118px]",
          DOT[item.state],
        )}
      />
      <p className="col-start-2 row-start-1 flex flex-wrap items-center gap-x-1.5 md:col-start-1 md:row-span-2 md:flex-col md:items-start md:gap-0.5 md:self-start">
        <time dateTime={item.iso} className="sk-text-body-medium-semibold text-sko-text-default">
          {item.date}
        </time>
        <span className="sk-text-body-small-regular text-sko-text-subtle">{item.time}</span>
        <span className="sr-only">{STATE_LABEL[item.state]}</span>
      </p>
      <div className="col-start-2 row-start-2 flex min-w-0 flex-col items-start gap-1 md:col-start-3 md:row-start-1">
        <ul aria-label="Type and status" className="flex flex-wrap items-start gap-1">
          {item.badges.map((badge) => (
            <li key={badge.label} className="flex">
              <Badge variant="outline" color={badge.color}>
                {badge.label}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="sk-text-body-medium-semibold text-sko-text-default">{item.title}</p>
        <p className="sk-text-body-medium-regular text-sko-text-muted">{item.description}</p>
        {item.link ? (
          <ButtonLink
            href={href}
            hierarchy="link"
            size="sm"
            rightIcon={ArrowRight}
            aria-label={`${item.link}: ${item.title}`}
          >
            {item.link}
          </ButtonLink>
        ) : null}
      </div>
    </li>
  );
}

function DateCard({ items, href, label }: { items: CourseDate[]; href: string; label: string }) {
  return (
    <ol
      aria-label={label}
      // The DS stroke is inside the card and the CSS border is outside the padding: 15 + 1 = the DS 16.
      className="rounded-[10px] border border-sko-border-subtle bg-sko-bg-page p-[15px]"
    >
      {items.map((item, index) => (
        <DateRow key={item.id} item={item} href={href} first={index === 0} />
      ))}
    </ol>
  );
}

/**
 * Dates tab (desktop 6406:42688, tablet 6406:43322, mobile 6406:43877): heading, the
 * missed-deadline alert with "Shift due dates", then the timeline of `course_date_blocks[]`
 * — Past, the Today marker, Upcoming — and the time-zone line. One column on every
 * breakpoint, 24 / 20 / 16 apart; the timeline's own blocks are 12 apart.
 */
export function DatesTab({ course }: { course: CourseDetail }) {
  const showToast = useLmsStore((s) => s.showToast);
  const tab = course.datesTab;
  return (
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <h2 className="sk-text-headline-medium-bold text-sko-text-default">{tab.title}</h2>

      <CourseAlert
        tone="warning"
        title={tab.missedAlert.title}
        body={tab.missedAlert.body}
        dismissible
        action={
          <Button
            hierarchy="secondary"
            size="sm"
            onClick={() => showToast("Shift due dates is not part of this prototype yet")}
            className="max-md:h-11"
          >
            {tab.missedAlert.cta}
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <Divider as="h3">{tab.pastLabel}</Divider>
        <DateCard items={tab.past} href={course.progress.href} label={tab.pastLabel} />
        <Divider>
          <time dateTime="2026-09-18">{tab.todayLabel}</time>
        </Divider>
        <Divider as="h3">{tab.upcomingLabel}</Divider>
        <DateCard items={tab.upcoming} href={course.progress.href} label={tab.upcomingLabel} />
      </div>

      <p className="sk-text-body-small-regular text-sko-text-subtle">{tab.timezoneNote}</p>
    </div>
  );
}
