import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { useLmsStore } from "@/lib/store";
import type { CourseDate, CourseDateState, CourseDetail } from "@/lib/platform/course-detail";
import { cn } from "@/lib/utils";
import { topicLinks } from "@/lib/platform/topic-links";
import { ShiftDatesAlert } from "./ShiftDatesAlert";
import styles from "./DatesTab.module.css";

/* The 12px dot of the spine. The DS binds icon/success and icon/warning as its fill; the bg
   roles of the same colours stand in, since an icon token is not a fill here. Past due is amber,
   never red (Nelson, 28 Oct 2026): a missed suggested date can still be shifted. */
const DOT: Record<CourseDateState, string> = {
  complete: styles.dotComplete,
  overdue: styles.dotOverdue,
  upcoming: styles.dotMuted,
  locked: styles.dotMuted,
};

const STATE_LABEL: Record<CourseDateState, string> = {
  complete: "Past",
  overdue: "Past due",
  upcoming: "Upcoming",
  locked: "Not yet released",
};

/** DS `Content divider`, Type=Text: the label (body-medium/Medium, text/subtle) between two 1px rules, 8 apart. */
function Divider({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "h3" }) {
  return (
    <div className={styles.divider}>
      <span aria-hidden className={styles.dividerRule} />
      <Tag className={`sk-text-body-medium-medium ${styles.subtle}`}>{children}</Tag>
      <span aria-hidden className={styles.dividerRule} />
    </div>
  );
}

/**
 * DS `LMS/Platform/Course-Detail/Date-Row`. Desktop and tablet: the date column (104 wide:
 * the date, body-medium/Semibold, over the time, body-small/Regular), the spine (a 2px
 * bg/muted line with a 12px dot ringed in bg/page) and the content — badges (Badge
 * Outline sm), title, description and the link — 12 apart. As Open edX draws a due date: the
 * assignment type before the title ("Assignment: …") and no description (lib/platform/edx-dates). Padding 12 above; 24 / 20 below.
 * Mobile: the spine first, the date and the time on one line above the badges; 16 below.
 * One markup: a grid whose date cell moves from the content column to its own column.
 */
function DateRow({ item, href, first }: { item: CourseDate; href: string; first: boolean }) {
  return (
    <li className={styles.row}>
      <span
        aria-hidden
        className={cn(styles.spine, first ? styles.spineFirst : styles.spineRest)}
      />
      <span
        aria-hidden
        className={cn(
          styles.dot,
          DOT[item.state],
        )}
      />
      <p className={styles.when}>
        <time dateTime={item.iso} className={`sk-text-body-medium-semibold ${styles.default}`}>
          {item.date}
        </time>
        <span className={`sk-text-body-small-regular ${styles.subtle}`}>{item.time}</span>
        <span className="sk-sr-only">{STATE_LABEL[item.state]}</span>
      </p>
      <div className={styles.content}>
        <ul aria-label="Type and status" className={styles.badges}>
          {item.badges.map((badge) => (
            <li key={badge.label} className={styles.flexItem}>
              <Badge variant="outline" color={badge.color}>
                {badge.label}
              </Badge>
            </li>
          ))}
        </ul>
        <p className={`sk-text-body-medium-semibold ${styles.default}`}>
          {item.assignmentType && !item.title.toLowerCase().includes(item.assignmentType.toLowerCase())
            ? `${item.assignmentType}: `
            : null}
          {item.title}
        </p>
        {item.description ? (
          <p className={`sk-text-body-medium-regular ${styles.muted}`}>{item.description}</p>
        ) : null}
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

function DateCard({ items, href, label }: { items: CourseDate[]; href: (title: string) => string; label: string }) {
  return (
    <ol
      aria-label={label}
      // The DS stroke is inside the card and the CSS border is outside the padding: 15 + 1 = the DS 16.
      className={styles.card}
    >
      {items.map((item, index) => (
        <DateRow key={item.id} item={item} href={href(item.title)} first={index === 0} />
      ))}
    </ol>
  );
}

/**
 * Dates tab (desktop 6406:42688, tablet 6406:43322, mobile 6406:43877): heading, the
 * missed-deadline alert with "Shift due dates", then the timeline of `course_date_blocks[]`
 * — Past, the Today marker, Upcoming — and the time-zone line. One column on every
 * breakpoint, stack-gap apart (DS Layout/*); the timeline's own blocks are 12 apart.
 */
export function DatesTab({ course }: { course: CourseDetail }) {
  const showToast = useLmsStore((s) => s.showToast);
  const tab = course.datesTab;
  const links = React.useMemo(() => topicLinks(course.slug, course.progress.href), [course.slug, course.progress.href]);
  return (
    <div className={styles.tab}>
      <h2 className={`sk-text-headline-medium-bold ${styles.default}`}>{tab.title}</h2>

      {/* Only for a learner who is behind the suggested schedule. */}
      {tab.missedAlert ? <ShiftDatesAlert courseSlug={course.slug} /> : null}

      <div className={styles.timeline}>
        <Divider as="h3">{tab.pastLabel}</Divider>
        <DateCard items={tab.past} href={links.byTitle} label={tab.pastLabel} />
        <Divider>
          <time dateTime={tab.todayIso}>{tab.todayLabel}</time>
        </Divider>
        <Divider as="h3">{tab.upcomingLabel}</Divider>
        <DateCard items={tab.upcoming} href={links.byTitle} label={tab.upcomingLabel} />
      </div>

      <p className={`sk-text-body-medium-regular ${styles.subtle}`}>{tab.timezoneNote}</p>
    </div>
  );
}
