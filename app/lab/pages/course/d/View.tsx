"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ModuleTimeLeft } from "@/components/molecules/ModuleTimeLeft";
import { course } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  BackLink,
  CourseProgress,
  NextTopicBlock,
  PageMock,
  ReplanNote,
  TopicLine,
  certificateLine,
  timeLeftSegments,
  useCourse,
} from "../shared";

/**
 * D · This module. Only one module on screen, large: its topics as big rows with the next one
 * accented. The other modules are a short list; choosing one swaps the view in place.
 */
export function View() {
  const data = useCourse();
  const { model, next, started, q, currentIndex } = data;
  const [shown, setShown] = React.useState(currentIndex);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const firstRender = React.useRef(true);

  // Moving to another module sends focus to its heading, so the swap is announced.
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [shown]);

  const m = model.modules[shown];
  const isCurrent = shown === currentIndex && !!next;
  const total = m.topics.length;
  const allDone = m.done === total;
  const status = allDone
    ? `All ${total} topics done`
    : m.done > 0
      ? `${m.done} of ${total} done`
      : `Not started · ${total} topics`;

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 outline-none md:px-8 md:pt-8">
      <BackLink option="d" q={q} />

      <header className="mt-4 max-w-3xl">
        <h1 className="sk-text-lg-semibold text-balance text-sko-text-default">{course.title}</h1>
        <p className="sk-text-sm-regular mt-1 text-sko-text-muted">{certificateLine(data)}</p>
      </header>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <section aria-labelledby="module-h" className="min-w-0">
          <h2
            id="module-h"
            ref={headingRef}
            tabIndex={-1}
            className="sk-text-display-sm-semibold text-balance text-sko-text-default outline-none"
          >
            <span className="sr-only">Module {shown + 1}: </span>
            {m.title}
          </h2>
          <p className="sk-text-md-medium mt-3 flex items-center gap-2 text-sko-text-muted">
            {allDone ? <Icon icon={Check} size={20} aria-hidden="true" className="text-sko-icon-success" /> : null}
            Module {shown + 1} of {model.modules.length} · {status}
          </p>
          {!allDone ? <ModuleTimeLeft segments={timeLeftSegments(m)} className="mt-1" /> : null}
          {isCurrent ? <ReplanNote data={data} className="mt-2" /> : null}
          {!isCurrent && next ? (
            <Button hierarchy="secondary" size="md" className="mt-5" onClick={() => setShown(currentIndex)}>
              Back to where you are
            </Button>
          ) : null}

          <div className="mt-8 flex flex-col gap-8">
            {m.lessons.map((l) => (
              <div key={l.id}>
                {l.label ? (
                  <h3 className="sk-text-md-semibold mb-2 px-4 text-sko-text-muted">{l.label}</h3>
                ) : null}
                <ol className="flex flex-col gap-2">
                  {l.topics.map((t) => (
                    <li key={t.id} className={cn(t.state !== "next" && "border-b border-sko-border-subtle last:border-b-0")}>
                      {t.state === "next" ? <NextTopicBlock t={t} started={started} large /> : <TopicLine t={t} large />}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <aside aria-labelledby="all-h" className="lg:sticky lg:top-6 lg:self-start">
          <h2 id="all-h" className="sk-text-md-semibold text-sko-text-default">
            All modules
          </h2>
          <CourseProgress model={model} className="mt-3" />
          <ol className="mt-5 flex flex-col gap-1">
            {model.modules.map((mod, i) => {
              const selected = i === shown;
              const done = mod.done === mod.topics.length;
              const words = done
                ? "Done"
                : i === currentIndex && next
                  ? `You are here · ${mod.done} of ${mod.topics.length}`
                  : mod.done > 0
                    ? `${mod.done} of ${mod.topics.length} done`
                    : "Not started";
              return (
                <li key={mod.id}>
                  <button
                    type="button"
                    aria-current={selected ? "true" : undefined}
                    onClick={() => setShown(i)}
                    className={cn(
                      "flex min-h-[44px] w-full items-start gap-3 rounded-lg px-3 py-3 text-left",
                      selected ? "bg-sko-bg-primary-soft" : "hover:bg-sko-bg-faint",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "sk-text-xs-semibold inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                        done ? "bg-sko-bg-success text-sko-icon-on-success" : "bg-sko-bg-faint text-sko-text-muted",
                      )}
                    >
                      {done ? <Icon icon={Check} size={14} /> : i + 1}
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className={cn("sk-text-sm-semibold", selected ? "text-sko-text-primary" : "text-sko-text-default")}>
                        <span className="sr-only">Module {i + 1}: </span>
                        {mod.title}
                      </span>
                      <span className="sk-text-xs-medium text-sko-text-muted">
                        {words}
                        {selected ? <span className="sr-only">, shown</span> : null}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>

      <PageMock />
    </main>
  );
}
