import { Check, Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { course } from "@/lib/data";
import { MOCK, type CertStatus } from "@/lib/lab/dashboard-mock";
import type { TrainingPlan } from "@/lib/lab/training-plan";
import { cn } from "@/lib/utils";
import { pad, type CoursePlanModel } from "./plan-model";

/** REAL `cert_status`, said plainly. */
const CERT_WORDS: Record<CertStatus, string> = {
  notpassing: "Not earned yet. It is issued once your graded work passes.",
  audit_passing: "Your graded work is passing so far.",
  generating: "Earned — the certificate is being generated.",
  downloadable: "Earned — ready to download.",
};

export function RaceDay({ model, plan, cert, started }: { model: CoursePlanModel; plan: TrainingPlan; cert: CertStatus; started: boolean }) {
  return (
    <section aria-labelledby="race-h" className="tb-rule-strong-t mt-16 pt-6">
      <h2 id="race-h" className="tb-h2">Race day</h2>
      <div className="mt-6 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-end gap-4">
            <span className="tb-num tb-num-xl">{pad(plan.weeksTotal)}</span>
            <span className="pb-1">
              <span className="tb-label tb-c-ink2 block">Week</span>
              <span className="tb-body tb-strong block">{plan.raceDay}</span>
            </span>
          </p>
          <div className="mt-3">
            <MockTag reason={`Race-day date — ${MOCK.due}`} />
          </div>
          <p className="tb-body mt-6">
            Finish the plan and you earn the {course.provider} certificate for <span className="tb-strong">{course.title}</span>.
          </p>
          <p className="tb-body-s tb-c-ink2 mt-3">
            <span className="tb-strong tb-c-ink">Certificate: </span>
            {started ? CERT_WORDS[cert] : "Not earned yet — it comes at the end of the block."}
          </p>
          <p className="tb-body-s tb-c-ink2 mt-2">
            <span className="tb-strong tb-c-ink">Pass mark: </span>
            the course does not publish one yet.
          </p>
        </div>

        <div className="lg:col-span-7">
          <h3 className="tb-label tb-c-ink2">The graded work on the way</h3>
          <ol className="mt-3">
            {model.graded.map((t) => (
              <li key={t.id} className="tb-rule-t grid grid-cols-[52px_1fr] items-baseline gap-x-4 gap-y-1 py-3 sm:grid-cols-[52px_1fr_auto]">
                <span className="tb-num tb-num-m tb-c-ink2">
                  <span className="sr-only">Week </span>
                  {pad(t.week)}
                </span>
                <span className="tb-body-s">
                  <span className="tb-strong">{t.title}</span>
                  <span className="tb-c-ink2"> · {t.type}</span>
                </span>
                <span className={cn("tb-meta col-start-2 flex items-center gap-1.5 sm:col-start-3", t.state === "done" ? "tb-c-ink2" : "tb-c-ink3")}>
                  {t.state === "done" ? <Icon icon={Check} size={14} aria-hidden="true" /> : null}
                  {t.state === "locked" ? <Icon icon={Lock} size={14} aria-hidden="true" /> : null}
                  {t.state === "done" ? "Done" : t.state === "locked" ? `Opens after ${t.lockedBy}` : t.duration}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
