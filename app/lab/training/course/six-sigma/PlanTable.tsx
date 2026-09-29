"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, Lock } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { CoursePlanModel, PlanModule, PlanTopic } from "./plan-model";

/** "VILT-Live Session" → "Live", "VILT-Recording" → "Recording"; the rest as the course names them. */
function kind(t: PlanTopic): string {
  if (t.live) return "Live";
  return t.type.replace(/^VILT-/, "");
}

/** One meta line: kind · time, then only the facts that change what the learner does. */
function meta(t: PlanTopic): string {
  const parts = [kind(t)];
  if (t.live) parts.push(t.duration);
  else if (t.minutes != null) parts.push(`${t.minutes} min`);
  if (t.graded && !/graded/i.test(t.type)) parts.push("Graded");
  if (t.movedFrom) parts.push(`moved from week ${t.movedFrom}`);
  if (t.state === "locked" && t.lockedBy) parts.push(`opens after you finish ${t.lockedBy}`);
  return parts.filter(Boolean).join(" · ");
}

const STATE_WORD: Record<PlanTopic["state"], string> = {
  done: "Done",
  next: "",
  todo: "Planned",
  locked: "Locked",
};

/** Three marks only: done, the one next topic (lime), planned. Locked is a lock icon. */
function Mark({ t }: { t: PlanTopic }) {
  return (
    <span className="flex h-5 w-4 flex-none items-center justify-center" aria-hidden>
      {t.state === "done" ? (
        <Icon icon={Check} size={16} className="tb-c-ink2" />
      ) : t.state === "locked" ? (
        <Icon icon={Lock} size={14} className="tb-c-ink3" />
      ) : (
        <span className={cn("tb-mark", t.state === "next" ? "tb-mark-today" : "tb-mark-plan")} />
      )}
    </span>
  );
}

function TopicRow({ t }: { t: PlanTopic }) {
  const body = (
    <>
      <Mark t={t} />
      <span className="min-w-0 flex-1">
        {t.state === "next" ? null : <span className="sr-only">{STATE_WORD[t.state]}: </span>}
        <span className={cn("tb-body-s block", t.state === "next" && "tb-strong", t.state === "locked" && "tb-c-ink2")}>
          {t.title}
        </span>
        <span className="tb-meta tb-c-ink2 block">
          {t.state === "next" ? <span className="tb-strong tb-c-ink">Next · </span> : null}
          {meta(t)}
        </span>
      </span>
    </>
  );
  const cls = "flex min-h-[44px] items-start gap-3 py-2.5";
  return (
    <li className="tb-rule-t">
      {t.state === "locked" ? (
        <div className={cls}>{body}</div>
      ) : (
        <Link href={t.href} className={cn(cls, "hover:underline")} aria-current={t.state === "next" ? "step" : undefined}>
          {body}
        </Link>
      )}
    </li>
  );
}

function ModuleItem({ mod, open, onToggle }: { mod: PlanModule; open: boolean; onToggle: () => void }) {
  const panelId = `cp-panel-${mod.id}`;
  return (
    <li className="tb-rule-t">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-h-[56px] w-full items-center gap-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="tb-title block">{mod.title}</span>
            <span className="tb-body-s tb-c-ink2 block">
              {mod.done} of {mod.topics.length} done
            </span>
          </span>
          <Icon
            icon={ChevronDown}
            size={20}
            aria-hidden="true"
            className={cn("tb-c-ink2 flex-none transition-transform motion-reduce:transition-none", open && "rotate-180")}
          />
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="pb-4">
        {mod.lessons.map((lesson) =>
          lesson.label ? (
            <section key={lesson.id} aria-labelledby={`${lesson.id}-h`} className="mt-2">
              <h4 id={`${lesson.id}-h`} className="tb-label tb-c-ink2 py-2">
                {lesson.label}
              </h4>
              <ol>
                {lesson.topics.map((t) => (
                  <TopicRow key={t.id} t={t} />
                ))}
              </ol>
            </section>
          ) : (
            <ol key={lesson.id}>
              {lesson.topics.map((t) => (
                <TopicRow key={t.id} t={t} />
              ))}
            </ol>
          ),
        )}
      </div>
    </li>
  );
}

/** The plan: modules as a plain accordion; the module holding the next topic opens by default. */
export function PlanModules({ model }: { model: CoursePlanModel }) {
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(model.nextModuleId ? [model.nextModuleId] : []));
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <ul className="tb-rule-b mt-4">
      {model.modules.map((m) => (
        <ModuleItem key={m.id} mod={m} open={open.has(m.id)} onToggle={() => toggle(m.id)} />
      ))}
    </ul>
  );
}
