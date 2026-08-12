"use client";

import * as React from "react";
import { Download, FileText, Table2, NotebookPen, Check, TerminalSquare } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { getLab } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const FILE_ICON = {
  notebook: NotebookPen,
  pdf: FileText,
  data: Table2,
} as const;

/**
 * Lab — a notebook the learner downloads and runs offline. Distinct from an
 * Activity (SCORM), which runs interactively in an iframe: a Lab produces no
 * score and completion is manual, so the job of this screen is to get the
 * files onto the learner's machine and set expectations clearly.
 */
export function LabView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  const lab = React.useMemo(() => (topic ? getLab(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const markComplete = useLmsStore((s) => s.markComplete);
  const showToast = useLmsStore((s) => s.showToast);
  const [downloaded, setDownloaded] = React.useState<Set<string>>(new Set());

  if (!topic || !lab) return null;
  const allDownloaded = downloaded.size === lab.files.length;

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand" leftIcon={TerminalSquare}>
          Hands-on lab
        </Badge>
        <Badge tone="neutral">Runs on your machine</Badge>
        <Badge tone="neutral">~{lab.estimatedMinutes} min</Badge>
      </div>

      <p className="sk-text-md-regular text-sk-text-secondary">{lab.intro}</p>

      {/* Prerequisites — surfaced before the download so nobody gets stuck. */}
      <section className="flex flex-col gap-2 rounded-xl border border-sk-border-secondary bg-sk-bg-secondary p-4">
        <span className="sk-text-2xs-medium uppercase tracking-wide text-sk-text-tertiary">
          Before you start
        </span>
        <ul className="sk-text-sm-regular list-disc pl-5 text-sk-text-secondary">
          {lab.prerequisites.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      {/* Files — the core affordance of a lab topic. */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="sk-text-md-semibold text-sk-text-primary">Lab files</h2>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={Download}
            onClick={() => {
              setDownloaded(new Set(lab.files.map((f) => f.name)));
              showToast("Downloading all lab files…");
            }}
          >
            Download all
          </Button>
        </div>

        <ul className="flex flex-col gap-2">
          {lab.files.map((f) => {
            const got = downloaded.has(f.name);
            return (
              <li key={f.name}>
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3",
                    got
                      ? "border-sk-text-success-primary bg-sk-bg-success-primary"
                      : "border-sk-border-secondary bg-sk-bg-primary",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon
                      icon={FILE_ICON[f.kind]}
                      size={18}
                      className={got ? "text-sk-text-success-primary" : "text-sk-text-brand-secondary"}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="sk-text-sm-semibold truncate text-sk-text-primary">
                        {f.name}
                      </span>
                      <span className="sk-text-xs-regular text-sk-text-tertiary">{f.size}</span>
                    </div>
                  </div>
                  <Button
                    variant={got ? "secondary" : "primary"}
                    size="sm"
                    leftIcon={got ? Check : Download}
                    onClick={() => {
                      setDownloaded((prev) => new Set(prev).add(f.name));
                      showToast(`Downloading ${f.name}…`);
                    }}
                  >
                    {got ? "Downloaded" : "Download"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Steps to run it locally. */}
      <section className="flex flex-col gap-3">
        <h2 className="sk-text-md-semibold text-sk-text-primary">How to run it</h2>
        <ol className="flex flex-col gap-2">
          {lab.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="sk-text-xs-semibold mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sk-bg-brand-section text-sk-text-brand-secondary">
                {i + 1}
              </span>
              <span className="sk-text-sm-regular text-sk-text-secondary">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <InlineAlert
        tone="info"
        title="You mark this lab complete yourself"
        description="The notebook runs on your own machine and is ungraded. Mark it complete once you have worked through it."
      />

      {isCompleted ? (
        <InlineAlert tone="success" title="Lab complete" description="Nice work." />
      ) : (
        <div>
          <Button
            variant="primary"
            size="lg"
            disabled={!allDownloaded}
            onClick={() => markComplete(topicId)}
          >
            Mark as complete
          </Button>
          {!allDownloaded ? (
            <p className="sk-text-xs-regular mt-2 text-sk-text-tertiary">
              Download the lab files first.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
