"use client";

import * as React from "react";
import { Download, Check, TerminalSquare } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { FileTypeChip, fileExtension } from "@/components/views/LessonBlocks";
import { getLab } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

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

      <p className="sk-text-md-regular text-sko-text-muted">{lab.intro}</p>

      {/* Prerequisites — surfaced before the download so nobody gets stuck. */}
      {/* DS LMS / Lab · Prerequisites (20328:3331): p16, gap 8, r10. */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-sko-border-subtle bg-sko-bg-subtle p-4">
        <span className="sk-text-xs-medium uppercase text-sko-text-subtle">
          Before you start
        </span>
        <ul className="sk-text-sm-regular list-disc pl-5 text-sko-text-muted">
          {lab.prerequisites.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      {/* Files — the core affordance of a lab topic. */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="sk-text-md-semibold text-sko-text-default">Lab files</h2>
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
                {/* DS LMS / Lab · File Row (20328:3330): p 8/12, file-type chip, meta gap 2. */}
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2",
                    got
                      ? "border-sko-border-success bg-sko-bg-success-soft"
                      : "border-sko-border-subtle bg-sko-bg-page",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileTypeChip label={fileExtension(f.name, f.kind)} tone={got ? "success" : "subtle"} />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      {/* DS body-medium/Bold — semibold until .sk-text-sm-bold exists (CT-22). */}
                      <span className="sk-text-sm-semibold truncate text-sko-text-default">
                        {f.name}
                      </span>
                      <span className="sk-text-xs-regular text-sko-text-subtle">{f.size}</span>
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
        <h2 className="sk-text-md-semibold text-sko-text-default">How to run it</h2>
        <ol className="flex flex-col gap-2">
          {lab.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              {/* DS LMS / Numbered Step (20328:3297): 22px circle, body-small/Bold
                  (semibold until .sk-text-xs-bold exists, CT-22). */}
              <span className="sk-text-xs-semibold inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-sko-bg-primary-soft text-sko-text-primary">
                {i + 1}
              </span>
              <span className="sk-text-sm-regular text-sko-text-muted">{s}</span>
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
            <p className="sk-text-xs-regular mt-2 text-sko-text-subtle">
              Download the lab files first.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
