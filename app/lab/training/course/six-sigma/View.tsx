import * as React from "react";
import Link from "@/lib/router";
import { useSearchParams } from "@/lib/router";
import { ArrowLeft, Play } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { course } from "@/lib/data";
import { MOCK } from "@/lib/lab/dashboard-mock";
import { getPlan } from "@/lib/lab/training-plan";
import { getCoursePlan } from "./plan-model";
import { PlanModules } from "./PlanTable";
import styles from "./View.module.css";

/** The Six Sigma course plan. One job: continue this course, and see what is left. */
export function CoursePlan() {
  const params = useSearchParams();
  const plan = getPlan(params.get("persona"));
  const persona = plan.persona;
  const model = getCoursePlan(persona.id);
  const started = model.done > 0;
  const q = `?persona=${persona.id}`;
  const next = model.next;

  const status = started
    ? `Week ${plan.weekIndex} of ${plan.weeksTotal} · ${model.done} of ${model.total} topics done · Certificate by ${plan.raceDay}`
    : `${plan.weeksTotal} weeks · ${model.total} topics · starts when you do`;
  const replanned = plan.status.tone === "replanned" && model.moved > 0;

  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <Link href={`/lab/training/plans${q}`} className={`tb-link tb-body-s ${styles.back}`}>
        <Icon icon={ArrowLeft} size={16} aria-hidden="true" />
        All plans
      </Link>

      <header className={styles.header}>
        <h1 className={`tb-h1 ${styles.title}`}>{course.title}</h1>
        <p className={`tb-body tb-c-ink2 ${styles.status}`}>{status}</p>
        {replanned ? (
          <p className={`tb-body-s tb-c-ink2 ${styles.replan}`}>
            We moved {model.moved} topics a week later after your break. Nothing was dropped.
          </p>
        ) : null}
      </header>

      {next ? (
        <section aria-labelledby="next-h" className={`tb-rule-t ${styles.next}`}>
          <div className={styles.nextMain}>
            <h2 id="next-h" className="tb-title">
              <span className="sk-sr-only">{started ? "Next" : "First"}: </span>
              {next.title}
            </h2>
            <p className={`tb-body-s tb-c-ink2 ${styles.nextMeta}`}>
              {next.type.replace(/^VILT-/, "")}
              {next.minutes != null ? ` · ${next.minutes} min` : ""}
            </p>
          </div>
          <Link href={next.href} className={`tb-btn tb-btn-primary ${styles.cta}`}>
            <Icon icon={Play} size={18} aria-hidden="true" />
            {started ? "Continue" : "Start"}
            <span className="sk-sr-only">: {next.title}</span>
          </Link>
        </section>
      ) : null}

      <section aria-labelledby="plan-h" className={styles.plan}>
        <h2 id="plan-h" className="tb-h2">The plan</h2>
        <PlanModules model={model} />
      </section>

      <div className={styles.mock}>
        <MockTag reason={`Plan weeks, your progress, the re-plan and the certificate date. ${MOCK.pace}; ${MOCK.due}. Titles, types, durations and locks are real.`} />
      </div>
    </main>
  );
}
