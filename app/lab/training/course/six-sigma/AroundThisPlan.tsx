import { DemoAction } from "@/components/lab/training/DemoAction";
import Link from "next/link";
import { FileText, Radio } from "lucide-react";
import { Icon } from "@/lib/icons";
import { MockTag } from "@/components/lab/MockTag";
import { course, downloads, getTopic } from "@/lib/data";
import { MOCK, type Persona } from "@/lib/lab/dashboard-mock";

/** MOCK: no course-team endpoint exists; names follow the live-session mock. */
const TEAM = [
  { name: "Olivia Rhye", role: "Lead instructor" },
  { name: "Marcus Lee", role: "Measure-phase coach" },
];

/** Quiet, secondary: what sits around the plan, never competing with it. */
export function AroundThisPlan({ persona }: { persona: Persona }) {
  const live = persona.live.value.filter((s) => s.course === "Six Sigma");
  const fileTopic = downloads[0] ? getTopic(downloads[0].topicId, course) : undefined;

  return (
    <section aria-labelledby="around-h" className="tb-rule-strong-t mt-16 pt-6">
      <h2 id="around-h" className="tb-h2">Around this plan</h2>
      <div className="mt-6 grid gap-10 md:grid-cols-3 md:gap-8">
        <div>
          <h3 className="tb-label tb-c-ink2">Live sessions</h3>
          {live.length ? (
            <ul className="mt-3">
              {live.map((s) => (
                <li key={s.id} className="tb-rule-t py-3">
                  <p className="tb-body-s tb-strong">{s.title}</p>
                  <p className="tb-meta tb-c-ink2 mt-0.5 flex items-center gap-1.5">
                    {s.state === "live" ? (
                      <>
                        <Icon icon={Radio} size={14} className="tb-c-live" aria-hidden="true" />
                        <span className="tb-c-live tb-strong">{s.when}</span>
                      </>
                    ) : (
                      <span>{s.when}</span>
                    )}
                    <span>· {s.host}</span>
                  </p>
                  {s.state === "live" ? (
                    <DemoAction className="tb-btn tb-btn-live mt-3">Join now</DemoAction>
                  ) : s.state === "recording" ? (
                    <DemoAction className="tb-link">Watch the recording</DemoAction>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="tb-body-s tb-c-ink2 tb-rule-t mt-3 py-3">No live sessions are booked for this plan.</p>
          )}
          <div className="mt-2">
            <MockTag reason={MOCK.live} />
          </div>
        </div>

        <div>
          <h3 className="tb-label tb-c-ink2">Files</h3>
          <ul className="mt-3">
            {downloads.map((d) => (
              <li key={d.id} className="tb-rule-t flex items-center gap-3 py-3">
                <Icon icon={FileText} size={18} className="tb-c-ink2 shrink-0" aria-hidden="true" />
                <span className="tb-body-s min-w-0 flex-1 break-words">{d.name}</span>
                <span className="tb-meta tb-c-ink3 shrink-0">
                  {d.type} · {d.size}
                </span>
              </li>
            ))}
          </ul>
          {fileTopic ? (
            <Link href={`/course/${course.slug}/topic/${fileTopic.id}/downloads`} className="tb-link tb-body-s">
              Open files · {fileTopic.title}
            </Link>
          ) : null}
        </div>

        <div>
          <h3 className="tb-label tb-c-ink2">Course team</h3>
          <ul className="mt-3">
            {TEAM.map((m) => (
              <li key={m.name} className="tb-rule-t flex items-center gap-3 py-3">
                <span aria-hidden className="tb-bg-ink tb-label inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  {m.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <span className="tb-body-s">
                  <span className="tb-strong block">{m.name}</span>
                  <span className="tb-c-ink2">{m.role}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <MockTag reason="No course-team endpoint exists — names follow the live-session mock" />
          </div>
        </div>
      </div>
    </section>
  );
}
