"use client";

import * as React from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { ModuleTimeLeft } from "@/components/molecules/ModuleTimeLeft";
import { course } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { PlanModule } from "@/app/lab/training/course/six-sigma/plan-model";
import {
  BackLink,
  CourseProgress,
  PageMock,
  ReplanNote,
  NextTopicBlock,
  TopicLine,
  certificateLine,
  moduleStatus,
  timeLeftSegments,
  useCourse,
} from "../shared";

type Phase = "done" | "current" | "waiting";

/** A module waits behind a gate when its first topic is locked. */
function gatedBy(m: PlanModule): string | undefined {
  const first = m.topics[0];
  return first?.state === "locked" ? first.lockedBy ?? "an earlier module" : undefined;
}

/** The node on the path: a check when done, the number otherwise, a lock when gated. */
function Node({ phase, n, gated }: { phase: Phase; n: number; gated: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "sk-text-sm-semibold relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        phase === "done" && "bg-sko-bg-success text-sko-icon-on-success",
        phase === "current" && "bg-sko-bg-primary text-sko-text-on-primary",
        phase === "waiting" && "border border-sko-border-default bg-sko-bg-page text-sko-text-muted",
      )}
    >
      {phase === "done" ? <Icon icon={Check} size={20} /> : gated ? <Icon icon={Lock} size={18} /> : n}
    </span>
  );
}

/**
 * B · Path. The modules as a vertical path joined by a line: done ones folded with a check, the
 * current one open with the next topic highlighted, later ones waiting. Each can be opened.
 */
export function View() {
  const data = useCourse();
  const { model, next, started, q, currentIndex } = data;
  const allDone = !next;

  const phaseOf = (i: number): Phase =>
    model.modules[i].done === model.modules[i].topics.length
      ? "done"
      : i === currentIndex && !allDone
        ? "current"
        : "waiting";

  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(allDone ? [] : [model.modules[currentIndex].id]),
  );
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 outline-none md:px-8 md:pt-8">
      <BackLink option="b" q={q} />

      <header className="mt-4">
        <h1 className="sk-text-display-sm-semibold text-balance text-sko-text-default">{course.title}</h1>
        <p className="sk-text-md-regular mt-2 text-sko-text-muted">{certificateLine(data)}</p>
        <CourseProgress model={model} className="mt-6 max-w-md" />
        <ReplanNote data={data} className="mt-3" />
      </header>

      <section aria-labelledby="path-h" className="mt-12">
        <h2 id="path-h" className="sk-text-lg-semibold text-sko-text-default">
          Your path
        </h2>

        <ol className="relative mt-6">
          {model.modules.map((m, i) => {
            const phase = phaseOf(i);
            const isOpen = open.has(m.id);
            const gate = gatedBy(m);
            const last = i === model.modules.length - 1;
            const panelId = `${m.id}-topics`;
            return (
              <li key={m.id} className="relative flex gap-4 pb-10 last:pb-0">
                {/* The connector: a neutral hairline from this node down to the next one. */}
                {!last ? (
                  <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px -translate-x-1/2 bg-sko-border-default" />
                ) : null}
                <Node phase={phase} n={i + 1} gated={!!gate} />

                <div className="min-w-0 flex-1">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(m.id)}
                      className="flex min-h-[44px] w-full items-start justify-between gap-3 rounded-md text-left"
                    >
                      <span className="flex min-w-0 flex-col gap-1 pt-2">
                        <span className="sk-text-md-semibold text-sko-text-default">
                          <span className="sr-only">Module {i + 1}: </span>
                          {m.title}
                        </span>
                        <span className="sk-text-sm-regular text-sko-text-muted">
                          {phase === "current" ? "You are here · " : ""}
                          {gate ? `Opens after “${gate}” · ` : ""}
                          {moduleStatus(m, phase === "current")}
                        </span>
                      </span>
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-sko-icon-subtle">
                        <Icon
                          icon={ChevronDown}
                          size={24}
                          aria-hidden="true"
                          className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                        />
                      </span>
                    </button>
                  </h3>

                  <div id={panelId} hidden={!isOpen} className="mt-4">
                    {phase === "current" ? <ModuleTimeLeft segments={timeLeftSegments(m)} className="mb-3" /> : null}
                    <div className="flex flex-col gap-4">
                      {m.lessons.map((l) => (
                        <div key={l.id}>
                          {l.label ? (
                            <h4 className="sk-text-sm-semibold mb-1 px-3 text-sko-text-muted">{l.label}</h4>
                          ) : null}
                          <ol className="flex flex-col gap-1">
                            {l.topics.map((t) => (
                              <li key={t.id}>
                                {t.state === "next" ? <NextTopicBlock t={t} started={started} /> : <TopicLine t={t} />}
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <PageMock />
    </main>
  );
}
