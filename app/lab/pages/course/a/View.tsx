"use client";

import * as React from "react";
import { course } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  BackLink,
  ContinueButton,
  CourseProgress,
  PageMock,
  ReplanNote,
  TopicLine,
  TopicMeta,
  certificateLine,
  moduleStatus,
  useCourse,
} from "../shared";

/**
 * A · Syllabus. Every module and topic on one page as a numbered syllabus. The Continue panel
 * sits first on mobile and stays in view in a right column on desktop.
 */
export function View() {
  const data = useCourse();
  const { model, next, started, q, currentIndex } = data;

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 outline-none md:px-8 md:pt-8">
      <BackLink option="a" q={q} />

      <header className="mt-4 max-w-3xl">
        <h1 className="sk-text-display-sm-semibold text-balance text-sko-text-default">{course.title}</h1>
        <p className="sk-text-md-regular mt-2 text-sko-text-muted">
          {course.provider} · {model.modules.length} modules · {model.total} topics
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
        {/* Continue panel: first in the DOM so it leads on mobile; the right column on desktop. */}
        <aside aria-labelledby="continue-h" className="lg:sticky lg:top-6 lg:order-2 lg:self-start">
          <div className="flex flex-col gap-5 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-5 md:p-6">
            <h2 id="continue-h" className="sk-text-lg-semibold text-sko-text-default">
              {next ? (started ? "Pick up where you left off" : "Start here") : "All topics done"}
            </h2>
            {next ? (
              <div className="flex flex-col gap-1.5">
                <p className="sk-text-md-semibold text-sko-text-default">{next.title}</p>
                <TopicMeta t={next} noState />
              </div>
            ) : null}
            {next ? <ContinueButton next={next} started={started} className="w-full" /> : null}
            <CourseProgress model={model} className="border-t border-sko-border-subtle pt-5" />
            <p className="sk-text-sm-regular text-sko-text-muted">{certificateLine(data)}</p>
            <ReplanNote data={data} />
          </div>
        </aside>

        <section aria-labelledby="syllabus-h" className="min-w-0 lg:order-1">
          <h2 id="syllabus-h" className="sk-text-lg-semibold text-sko-text-default">
            Syllabus
          </h2>
          <ol className="mt-6 flex flex-col gap-12">
            {model.modules.map((m, i) => (
              <li key={m.id} aria-labelledby={`${m.id}-h`}>
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={cn(
                      "sk-text-sm-semibold inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      i === currentIndex && next
                        ? "bg-sko-bg-primary text-sko-text-on-primary"
                        : "bg-sko-bg-faint text-sko-text-muted",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 id={`${m.id}-h`} className="sk-text-md-semibold text-sko-text-default">
                      <span className="sr-only">Module {i + 1}: </span>
                      {m.title}
                    </h3>
                    <p className="sk-text-sm-regular mt-1 text-sko-text-muted">
                      {moduleStatus(m, i === currentIndex && !!next)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-5 md:pl-[52px]">
                  {m.lessons.map((l) => (
                    <div key={l.id}>
                      {l.label ? (
                        <h4 className="sk-text-sm-semibold mb-1 px-3 text-sko-text-muted">{l.label}</h4>
                      ) : null}
                      <ol className="flex flex-col">
                        {l.topics.map((t) => (
                          <li key={t.id}>
                            <TopicLine t={t} accent />
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <PageMock />
    </main>
  );
}
