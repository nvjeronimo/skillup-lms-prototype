"use client";

import * as React from "react";
import { Download, Check, ExternalLink, TerminalSquare } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { Alert } from "@/components/molecules/Alert";
import { LabLaunchCard, type LabLaunchState } from "@/components/molecules/LabLaunchCard";
import { FileTypeChip, fileExtension } from "@/components/views/LessonBlocks";
import { getLab, type DownloadLabContent, type PartnerLabContent } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { cn } from "@/lib/utils";

/**
 * Lab has two families. The download lab is a notebook the learner runs on their own
 * machine; the partner lab runs on the partner's platform (Google, Microsoft) and the
 * learner leaves ours to do it.
 */
export function LabView({ topicId }: { topicId: string; courseSlug?: string }) {
  const topic = getTopic(topicId);
  const lab = React.useMemo(() => (topic ? getLab(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!topic || !lab) return null;
  return lab.kind === "partner" ? (
    <PartnerLabView topicId={topicId} title={topic.title} lab={lab} />
  ) : (
    <DownloadLabView topicId={topicId} lab={lab} />
  );
}

/**
 * What the learner needs before the lab: the DS `Alert` (Brand, Floating) with the
 * requirements as a list. Nelson replaced `LMS/ICP/Topics/Lab-Prerequisites` with it on
 * 12 Oct 2026, on every Lab screen.
 */
function Prerequisites({ items }: { items: string[] }) {
  return (
    <Alert title="BEFORE YOU START">
      <ul className="list-disc pl-5">
        {items.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </Alert>
  );
}

/**
 * Partner lab (Figma `Lab · Third-party platforms`, 6789:325; lab-third-party-platforms.md §4).
 *
 * Nothing comes back from the partner, Google or Microsoft: no score, no completion. Since
 * 19 Oct 2026 SkillUp does not see the click on the launch button either (Komal), so there is
 * no Opened state for now: the card stays Ready, its button stays the primary action, and
 * Before you start stays until the topic is completed. The learner completes the topic with
 * Mark as Complete (the shell renders it in the feedback row, Secondary), and Next asks if they
 * move on without it. How this lab works and the author row are not shown (19 Oct 2026).
 *
 * `labLaunch` (demo menu) only applies to a lab whose component can open inside the page: it
 * shows the lab in the inline frame, or the frame not loading with the way out to a new tab.
 * Every other lab opens in a new tab.
 */
function PartnerLabView({ topicId, title, lab }: { topicId: string; title: string; lab: PartnerLabContent }) {
  const bp = useBreakpoint();
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const labLaunch = useLmsStore((s) => s.labLaunch);

  // A setting stored by an earlier version ("modal") falls back to the new tab.
  const launch = lab.inPage && (labLaunch === "inline" || labLaunch === "refused") ? labLaunch : "new-tab";
  const href = `/partner/${lab.partner}?topic=${topicId}`;
  const inline = launch === "inline";
  const refused = launch === "refused";

  // No Opened state for now (19 Oct 2026): SkillUp cannot tell whether the lab was opened.
  const cardState: LabLaunchState = refused ? "unavailable" : "ready";
  const card =
    cardState === "unavailable"
      ? {
          title: "This lab can't be shown inside the page",
          description:
            "Open the lab in a new tab instead. When you finish, come back to this page and select Mark as Complete.",
          action: "Open in a new tab",
        }
      : { title, description: lab.cardLine, action: lab.launchLabel };

  const alert: { tone: "info" | "success"; title: string; description: string } = isCompleted
    ? { tone: "success", title: "You can do this lab again", description: lab.afterCompletion }
    : {
        tone: "info",
        title:
          inline || refused
            ? "SkillUp can't see your progress in the lab"
            : `SkillUp can't see your progress on ${lab.platform}`,
        description:
          "Nothing is sent back when you finish. Select Mark as Complete when you are done; if you select Next first, we ask you.",
      };

  // Shown until the topic is completed, like the Before you start block: the opening of the lab
  // is not seen (19 Oct 2026). Google's own help does not recommend phones or tablets for its
  // labs; a lab inside the page is a third-party frame 800 px high, which is hard to use on a phone.
  const notCompleted = !isCompleted;
  const needsComputer =
    notCompleted && lab.partner === "google" && bp !== "desktop" ? (
      <InlineAlert
        tone="warning"
        title="This lab needs a computer"
        description="Google doesn't recommend phones or tablets for its labs, and this one may not work here. You can read the instructions now and do the lab later on a desktop or laptop."
      />
    ) : notCompleted && (inline || refused) && bp === "mobile" ? (
      <InlineAlert
        tone="warning"
        title="This lab works best on a computer"
        description="The lab is built for a wide screen and a keyboard. You can read the instructions now and do the lab later on a desktop or laptop."
      />
    ) : null;

  return (
    <div className="flex flex-col gap-3 border-t border-sko-border-subtle pt-3">
      <p className="sk-text-body-large-medium text-sko-text-default">
        {inline
          ? "This lab opens right here, inside the page. If you need more room, you can open it in a new tab."
          : refused
            ? "This lab is set to open inside the page. It can't be shown here right now, so it opens in a new tab instead."
            : lab.intro}
      </p>

      {/* Until the topic is completed, like the computer warning (19 Oct 2026). */}
      {notCompleted ? <Prerequisites items={lab.prerequisites} /> : null}

      {inline ? (
        <>
          {needsComputer}
          {/* LTI "Open tool in: Inline": 800 px high by default (`inline_height`). A sketch,
              like its Figma source (card E1): no DS component for the frame. */}
          <section
            aria-label={`${lab.provider} lab`}
            className="overflow-hidden rounded-lg border border-sko-border-default bg-sko-bg-page"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 bg-sko-bg-faint py-2 pl-4 pr-2">
              <span className="sk-text-body-medium-semibold min-w-0 text-sko-text-default">
                {lab.provider} · {title}
              </span>
              <ButtonLink
                href={href}
                target="_blank"
                rel="noopener"
                hierarchy="tertiary"
                size="sm"
                rightIcon={ExternalLink}
              >
                Open in a new tab
              </ButtonLink>
            </div>
            <iframe title={`${lab.provider} · ${title}`} src={`${href}&embed=1`} className="block h-[800px] w-full bg-sko-bg-subtle" />
          </section>
        </>
      ) : (
        <>
          {needsComputer}
          <LabLaunchCard
            state={cardState}
            provider={lab.provider}
            title={card.title}
            description={card.description}
          >
            {/* The card's action is 36 high in the DS (`Button` md), which is Button sm here. It is
                the primary action of the page: Mark as Complete stays Secondary (19 Oct 2026). */}
            <ButtonLink
              href={href}
              target="_blank"
              rel="noopener"
              hierarchy="primary"
              size="sm"
              rightIcon={ExternalLink}
            >
              {card.action}
            </ButtonLink>
          </LabLaunchCard>
        </>
      )}

      <InlineAlert tone={alert.tone} title={alert.title} description={alert.description} />
    </div>
  );
}

/**
 * Download lab — a notebook the learner downloads and runs offline. Distinct from an
 * Activity (SCORM), which runs interactively in an iframe: a Lab produces no
 * score and completion is manual, so the job of this screen is to get the
 * files onto the learner's machine and set expectations clearly.
 */
function DownloadLabView({ topicId, lab }: { topicId: string; lab: DownloadLabContent }) {
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const markComplete = useLmsStore((s) => s.markComplete);
  const showToast = useLmsStore((s) => s.showToast);
  const [downloaded, setDownloaded] = React.useState<Set<string>>(new Set());

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

      <p className="sk-text-body-large-regular text-sko-text-muted">{lab.intro}</p>

      {/* Prerequisites — surfaced before the download so nobody gets stuck. */}
      <Prerequisites items={lab.prerequisites} />

      {/* Files — the core affordance of a lab topic. */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="sk-text-body-large-semibold text-sko-text-default">Lab files</h2>
          {/* One primary per list: Download all is the action, the rows are Secondary. */}
          <Button
            variant="primary"
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
                      {/* DS body-medium/Bold — semibold until .sk-text-body-medium-bold exists (CT-22). */}
                      <span className="sk-text-body-medium-semibold truncate text-sko-text-default">
                        {f.name}
                      </span>
                      <span className="sk-text-body-small-regular text-sko-text-subtle">{f.size}</span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
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
        <h2 className="sk-text-body-large-semibold text-sko-text-default">How to run it</h2>
        <ol className="flex flex-col gap-2">
          {lab.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              {/* DS LMS / Numbered Step (20328:3297): 22px circle, body-small/Bold
                  (semibold until .sk-text-body-small-bold exists, CT-22). */}
              <span className="sk-text-body-small-semibold inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-sko-bg-primary-soft text-sko-text-primary">
                {i + 1}
              </span>
              <span className="sk-text-body-medium-regular text-sko-text-muted">{s}</span>
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
            Mark as Complete
          </Button>
          {!allDownloaded ? (
            <p className="sk-text-body-small-regular mt-2 text-sko-text-subtle">
              Download the lab files first.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
