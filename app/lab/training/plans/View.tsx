import * as React from "react";
import Link from "@/lib/router";
import { useSearchParams } from "@/lib/router";
import { DemoAction } from "@/components/lab/training/DemoAction";
import { MockTag } from "@/components/lab/MockTag";
import { MOCK, type Enrolment } from "@/lib/lab/dashboard-mock";
import { getPlan, type TrainingPlan } from "@/lib/lab/training-plan";
import { cn } from "@/lib/utils";
import { WEEKS, nextSession, planWeek } from "./parts";
import styles from "./View.module.css";

type Group = { key: Enrolment["status"]; title: string };

const GROUPS: Group[] = [
  { key: "in-progress", title: "In progress" },
  { key: "not-started", title: "Ready to start" },
  { key: "locked", title: "Opens later" },
  { key: "completed", title: "Finished" },
];

const coursePlanHref = (e: Enrolment, q: string) => (e.id === "six-sigma" ? `/lab/training/course/six-sigma${q}` : undefined);

/** Plans. One job: pick which plan to continue. */
export function TrainingPlans() {
  const params = useSearchParams();
  const plan = getPlan(params.get("persona"));
  const q = `?persona=${plan.persona.id}`;
  const all = plan.persona.enrolments;

  const groups = GROUPS.map((g) => ({ ...g, items: all.filter((e) => e.status === g.key) })).filter((g) => g.items.length > 0);
  const grouped = groups.length > 1;

  // The one primary action on the page: the plan whose next session is today.
  const ordered = groups.flatMap((g) => g.items);
  const primaryId = ordered.find(
    (e) => (e.status === "in-progress" || e.status === "not-started") && nextSession(e, plan)?.state === "today",
  )?.id;

  const list = (items: Enrolment[], level: 2 | 3) => (
    <ul className={`tb-rule-b ${styles.list}`}>
      {items.map((e) => (
        <PlanRow key={e.id} e={e} plan={plan} q={q} level={level} primary={e.id === primaryId} />
      ))}
    </ul>
  );

  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <h1 className="tb-h1">Plans</h1>

      {all.length === 0 ? (
        <p className={`tb-body tb-c-ink2 ${styles.empty}`}>No plans yet. When you enroll in a course, its plan appears here.</p>
      ) : grouped ? (
        groups.map((g) => (
          <section key={g.key} aria-labelledby={`${g.key}-h`} className={styles.group}>
            <h2 id={`${g.key}-h`} className="tb-h2">
              {g.title}
            </h2>
            {list(g.items, 3)}
          </section>
        ))
      ) : (
        <div className={styles.single}>{list(ordered, 2)}</div>
      )}

      {all.length > 0 ? (
        <div className={styles.mock}>
          <MockTag reason={`Plan weeks and next sessions. ${MOCK.pace}; ${MOCK.due}. Titles, progress and certificates are real.`} />
        </div>
      ) : null}
    </main>
  );
}

function statusLine(e: Enrolment, plan: TrainingPlan): string {
  switch (e.status) {
    case "in-progress": {
      const next = nextSession(e, plan)?.title ?? e.nextTopic?.title;
      return `Week ${planWeek(e, plan)} of ${WEEKS}${next ? ` · Next: ${next}` : ""}`;
    }
    case "not-started":
      return `Starts when you do · ${WEEKS} weeks`;
    case "locked":
      return `Opens when you finish ${e.lockedBy ?? "the plan before it"}`;
    default:
      switch (e.cert) {
        case "downloadable":
          return "Finished · certificate ready";
        case "generating":
          return "Finished · certificate being prepared";
        case "audit_passing":
          return "Finished · passed, no certificate on this track";
        default:
          return "Finished";
      }
  }
}

/** Where "Continue" / "Start" goes: the next session, else the next topic, else the course plan. */
function actionHref(e: Enrolment, plan: TrainingPlan, q: string): string | undefined {
  const real = (h?: string) => (h && h !== "#" ? h : undefined);
  return real(nextSession(e, plan)?.href) ?? real(e.nextTopic?.href) ?? coursePlanHref(e, q);
}

function PlanRow({
  e,
  plan,
  q,
  level,
  primary,
}: {
  e: Enrolment;
  plan: TrainingPlan;
  q: string;
  level: 2 | 3;
  primary: boolean;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  const titleHref = coursePlanHref(e, q);
  const btn = cn("tb-btn", primary ? "tb-btn-primary" : "tb-btn-quiet");

  let action: React.ReactNode = null;
  if (e.status === "in-progress" || e.status === "not-started") {
    const label = e.status === "in-progress" ? "Continue" : "Start";
    const href = actionHref(e, plan, q);
    const inner = (
      <>
        {label}
        <span className="sk-sr-only">: {e.title}</span>
      </>
    );
    action = href ? (
      <Link href={href} className={btn}>
        {inner}
      </Link>
    ) : (
      <DemoAction className={btn}>{inner}</DemoAction>
    );
  } else if (e.status === "completed" && e.cert === "downloadable") {
    action = (
      <DemoAction className="tb-btn tb-btn-quiet">
        Download certificate<span className="sk-sr-only">: {e.title}</span>
      </DemoAction>
    );
  }

  return (
    <li className={`tb-rule-t ${styles.row}`}>
      <div className={styles.rowMain}>
        <Heading className="tb-title">
          {titleHref ? (
            <Link href={titleHref} className={styles.titleLink}>
              {e.title}
            </Link>
          ) : (
            e.title
          )}
        </Heading>
        <p className={`tb-body-s tb-c-ink2 ${styles.status}`}>{statusLine(e, plan)}</p>
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </li>
  );
}
