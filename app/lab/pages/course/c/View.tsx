"use client";

import * as React from "react";
import { Award, FileText } from "lucide-react";
import { DeliveryModeBadge, DifficultyBadge, ProviderBadge, type Provider } from "@/components/atoms/MetaBadges";
import { DemoButton } from "@/components/lab/pages/DemoButton";
import { ModuleHeader } from "@/components/molecules/ModuleHeader";
import { OverallProgress } from "@/components/molecules/OverallProgress";
import { PanelTabs } from "@/components/molecules/PanelTabs";
import { course, downloads } from "@/lib/data";
import { Download, Icon } from "@/lib/icons";
import {
  BackLink,
  ContinueButton,
  PageMock,
  ReplanNote,
  TopicLine,
  TopicMeta,
  certificateLine,
  useCourse,
  type CourseData,
} from "../shared";

type Tab = "plan" | "about" | "resources";
const TABS: { value: Tab; label: string }[] = [
  { value: "plan", label: "Plan" },
  { value: "about", label: "About" },
  { value: "resources", label: "Resources" },
];

/** Plan: the modules as an accordion (DS Module Header), the current one open. */
function PlanPanel({ data }: { data: CourseData }) {
  const { model, currentIndex, next } = data;
  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(next ? [model.modules[currentIndex].id] : []),
  );
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="overflow-hidden rounded-lg border border-sko-border-subtle">
      {model.modules.map((m, i) => {
        const collapsed = !open.has(m.id);
        const label = course.modules[i]?.label ?? `Module ${i + 1}`;
        return (
          <div key={m.id}>
            <h3>
              <ModuleHeader
                label={label}
                title={m.title}
                topicsCompleted={m.done}
                topicsTotal={m.topics.length}
                isCompleted={m.done === m.topics.length}
                collapsed={collapsed}
                onToggle={() => toggle(m.id)}
                className="min-h-[56px]"
              />
            </h3>
            {collapsed ? null : (
              <div className="flex flex-col gap-4 border-b border-sko-border-subtle bg-sko-bg-page px-2 py-3 md:px-3">
                {m.lessons.map((l) => (
                  <div key={l.id}>
                    {l.label ? <h4 className="sk-text-sm-semibold mb-1 px-3 text-sko-text-muted">{l.label}</h4> : null}
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
            )}
          </div>
        );
      })}
    </div>
  );
}

/** About: what the course covers (the real module titles), how it runs, and what you get. */
function AboutPanel({ data }: { data: CourseData }) {
  const graded = data.model.modules.flatMap((m) => m.topics).filter((t) => t.graded).length;
  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <section aria-labelledby="cover-h">
        <h3 id="cover-h" className="sk-text-md-semibold text-sko-text-default">
          What you will cover
        </h3>
        <ol className="mt-3 flex flex-col gap-3">
          {data.model.modules.map((m, i) => (
            <li key={m.id} className="sk-text-md-regular text-sko-text-default">
              <span className="text-sko-text-muted">{i + 1}.</span> {m.title}
              <span className="sk-text-sm-regular text-sko-text-muted"> · {m.topics.length} topics</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="runs-h">
        <h3 id="runs-h" className="sk-text-md-semibold text-sko-text-default">
          How it runs
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ProviderBadge value={course.provider as Provider} />
          <DifficultyBadge value={course.difficulty} />
          <DeliveryModeBadge value={course.deliveryMode} />
        </div>
      </section>

      <section aria-labelledby="get-h">
        <h3 id="get-h" className="sk-text-md-semibold text-sko-text-default">
          What you get
        </h3>
        <div className="mt-3 flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sko-bg-success-soft text-sko-icon-success">
            <Icon icon={Award} size={20} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="sk-text-md-semibold text-sko-text-default">A {course.provider} certificate of completion</p>
            <p className="sk-text-sm-regular text-sko-text-muted">
              Finish all {data.model.total} topics and pass the {graded} graded ones. {certificateLine(data)}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Resources: the course files (real names and sizes); the download is not wired in the lab. */
function ResourcesPanel() {
  return (
    <ul className="flex max-w-2xl flex-col divide-y divide-sko-border-subtle">
      {downloads.map((f) => (
        <li key={f.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <Icon icon={FileText} size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-sko-icon-subtle" />
            <div className="min-w-0">
              <p className="sk-text-sm-medium break-all text-sko-text-default">{f.name}</p>
              <p className="sk-text-xs-medium text-sko-text-subtle">
                {f.type} · {f.size}
              </p>
            </div>
          </div>
          <DemoButton hierarchy="tertiary" size="md" leftIcon={Download} aria-label={`Download ${f.name}`}>
            Download
          </DemoButton>
        </li>
      ))}
    </ul>
  );
}

/**
 * C · Overview + tabs. A course header with progress and the one Continue, then Plan / About /
 * Resources as tabs so only one of them is on screen at a time.
 */
export function View() {
  const data = useCourse();
  const { model, next, started, q, currentIndex } = data;
  const [tab, setTab] = React.useState<Tab>("plan");
  const pct = Math.round((model.done / model.total) * 100);
  const current = TABS.find((t) => t.value === tab)!;

  return (
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-6 outline-none md:px-8 md:pt-8">
      <BackLink option="c" q={q} />

      <header className="mt-4 flex flex-col gap-6 rounded-xl border border-sko-border-subtle bg-sko-bg-page p-5 md:p-8">
        <div>
          <h1 className="sk-text-display-sm-semibold text-balance text-sko-text-default">{course.title}</h1>
          <p className="sk-text-md-regular mt-2 text-sko-text-muted">{course.provider}</p>
        </div>

        <div className="flex items-center gap-4">
          <OverallProgress pct={pct} moduleCurrent={currentIndex + 1} moduleTotal={model.modules.length} device="Mobile" />
          <div className="flex min-w-0 flex-col">
            <p className="sk-text-sm-semibold text-sko-text-default">
              {started ? `${model.done} of ${model.total} topics done` : `Not started · ${model.total} topics`}
            </p>
            <p className="sk-text-sm-regular text-sko-text-muted">
              {started ? `Module ${currentIndex + 1} of ${model.modules.length} · ` : ""}
              {certificateLine(data)}
            </p>
          </div>
        </div>
        <ReplanNote data={data} className="-mt-2" />

        {next ? (
          <div className="flex flex-col gap-4 border-t border-sko-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="sk-text-md-semibold text-sko-text-default">
                <span className="text-sko-text-muted">{started ? "Next: " : "First: "}</span>
                {next.title}
              </p>
              <TopicMeta t={next} noState />
            </div>
            <ContinueButton next={next} started={started} className="w-full shrink-0 sm:w-auto" />
          </div>
        ) : null}
      </header>

      <div className="mt-8 overflow-hidden rounded-xl border border-sko-border-subtle bg-sko-bg-page">
        <PanelTabs tabs={TABS} active={tab} onChange={(v) => setTab(v as Tab)} ariaLabel="Course" />
        <div role="tabpanel" aria-label={current.label} tabIndex={0} className="p-4 md:p-8">
          <h2 className="sr-only">{current.label}</h2>
          {tab === "plan" ? <PlanPanel data={data} /> : tab === "about" ? <AboutPanel data={data} /> : <ResourcesPanel />}
        </div>
      </div>

      <PageMock />
    </main>
  );
}
