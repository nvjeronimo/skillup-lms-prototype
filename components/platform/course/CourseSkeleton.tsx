import * as React from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { HeaderBandSkeleton, TabBarSkeleton } from "@/components/platform/HeaderBandSkeleton";
import { IntroSkeleton } from "@/components/platform/program/ProgramSkeleton";
import { DEFAULT_COURSE_TAB, courseTabsFor, hasDatesTab, isCourseTab, type CourseDetail, type CourseModule, type CourseTabId } from "@/lib/platform/course-detail";
import { SHIFT_DATES } from "@/lib/platform/shift-dates";
import { cn } from "@/lib/utils";
import styles from "./CourseSkeleton.module.css";

const BODY = styles.body;
/* The sidebar cards: measured from sample data (21 Oct 2026; phone / tablet and up). Seven
   different cards (team, dates, certificate, weekly goal…) not drawn line for line here. */
/** The Upcoming dates card (sixth), shown only with a Dates tab. */
const UPCOMING_DATES = styles.datesCard;
const SIDEBAR = [
  styles.mentorCard,
  styles.teamCard,
  styles.goalCard,
  styles.certificateCard,
  styles.handoutsCard,
  UPCOMING_DATES,
  styles.toolsCard,
];

/** CourseAlert: the frame (radius 12, padding 16), the featured icon, ghost title and body, the action. */
function AlertSkeleton({
  title,
  body,
  stacked,
  dismissible,
  action,
}: {
  title: string;
  body: string;
  stacked: boolean;
  dismissible: boolean;
  action: boolean;
}) {
  return (
    <div className={cn(styles.alert, !stacked && styles.alertResponsive)}>
      <Skeleton variant="circle" size={20} />
      <div className={styles.alertContent}>
        <div className={cn(styles.alertCopy, dismissible && !stacked && styles.alertCopyClearsClose)}>
          <Skeleton variant="ghost" text="body-medium-semibold">{title}</Skeleton>
          <Skeleton variant="ghost" text="body-medium-regular">{body}</Skeleton>
        </div>
        {action ? <Skeleton variant="block" radius="control" className={styles.alertAction} /> : null}
      </div>
    </div>
  );
}

/** ModuleList's row: number, ghost title and meta (and the lock reason below desktop); an open row its topics. */
function ModuleSkeleton({ mod }: { mod: CourseModule }) {
  const locked = mod.state === "locked";
  return (
    <div className={styles.module}>
      <div className={cn(styles.moduleHeader, mod.defaultOpen && styles.moduleHeaderOpen)}>
        <Skeleton variant="circle" size={32} />
        <div className={styles.moduleHeading}>
          <Skeleton variant="ghost" text="body-large-semibold">{mod.title}</Skeleton>
          <Skeleton variant="ghost" text="body-small-regular">{`${mod.topicCount} · ${mod.duration}`}</Skeleton>
          {locked && mod.lockReason ? (
            <Skeleton variant="ghost" text="body-small-regular" className={styles.belowDesktop}>{mod.lockReason}</Skeleton>
          ) : null}
        </div>
        <Skeleton variant="block" width={locked ? 54 : 20} height={20} radius="inner" />
      </div>
      {mod.defaultOpen ? (
        <div className={styles.topics}>
          {(mod.lessons ?? []).map((lesson) => (
            <React.Fragment key={lesson.id}>
              <div className={styles.lesson}>
                <Skeleton variant="ghost" text="body-small-medium">{lesson.label}</Skeleton>
              </div>
              {lesson.topics.map((topic, i) => (
                <div
                  key={topic.id}
                  className={cn(
                    styles.topic,
                    i < lesson.topics.length - 1 && styles.topicRuled,
                  )}
                >
                  <span className={styles.status}>
                    <Skeleton variant="circle" size={18} />
                  </span>
                  <div className={styles.topicBody}>
                    <Skeleton variant="ghost" text="body-large-medium" className={styles.topicTitle}>{topic.title}</Skeleton>
                    <span className={styles.topicMeta}>
                      <Skeleton variant="block" width={72} height={20} radius="pill" />
                      <Skeleton text="body-small-regular" width={40} />
                    </span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Course Detail while it loads (motion-matrix §7.9): the header band, the tab bar with the
 * search, and the opening tab (?tab=, Course by default). On Course: the search on a phone, the
 * alerts, the intro and the module list as ghost lines (they wrap as the content will), and the
 * sidebar cards; the other tabs draw blocks. A course hosted by a partner is its header and the
 * note under it.
 */
export function CourseSkeleton({ course }: { course: CourseDetail }) {
  const [tab, setTab] = React.useState<CourseTabId>(DEFAULT_COURSE_TAB);
  React.useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (isCourseTab(t) && courseTabsFor(course).some((x) => x.id === t)) setTab(t);
  }, [course]);
  const dates = hasDatesTab(course);
  const header = (
    <HeaderBandSkeleton
      kind="course"
      title={course.title}
      facts={[course.stats.structure, course.stats.duration, course.stats.org]}
      cardLines={2}
    />
  );
  if (course.hosted) {
    return (
      <>
        {header}
        <div className={BODY}>
          <Skeleton variant="block" height={96} radius="none" />
        </div>
      </>
    );
  }
  return (
    <>
      {header}
      <TabBarSkeleton tabs={dates ? [56, 72, 48, 136] : [56, 72, 136]} search />
      <div className={BODY}>
        <Skeleton variant="block" radius="control" className={styles.phoneSearch} />
        {course.passed ? <Skeleton variant="block" height={96} radius="none" className={styles.passedAlert} /> : null}
        {tab === "course" ? (
          <div className={styles.coursePanel}>
            <div className={styles.main}>
              {dates && course.datesTab.missedAlert ? (
                <AlertSkeleton title={SHIFT_DATES.title} body={SHIFT_DATES.body} stacked={false} dismissible={false} action />
              ) : null}
              <AlertSkeleton title={course.update.title} body={course.update.body} stacked dismissible action={false} />
              <IntroSkeleton title={course.intro.title} lead={course.intro.lead} />
              <div className={styles.modules}>
                {course.modules.map((m) => (
                  <ModuleSkeleton key={m.id} mod={m} />
                ))}
              </div>
            </div>
            <div className={styles.sidebar}>
              {/* Without a Dates tab, no Upcoming dates card (decision 036). */}
              {(dates ? SIDEBAR : SIDEBAR.filter((h) => h !== UPCOMING_DATES)).map((h, i) => (
                <Skeleton key={i} variant="block" radius="card" className={h} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.blocks}>
            <Skeleton variant="block" height={160} radius="card" />
            <Skeleton variant="block" height={240} radius="card" />
            <Skeleton variant="block" height={240} radius="card" />
          </div>
        )}
      </div>
    </>
  );
}
