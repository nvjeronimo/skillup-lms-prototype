"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Check, ExternalLink, TerminalSquare } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { LabLaunchCard, type LabLaunchState } from "@/components/molecules/LabLaunchCard";
import { LabModal } from "@/components/organisms/LabModal";
import { FileTypeChip, fileExtension } from "@/components/views/LessonBlocks";
import { getLab, type DownloadLabContent, type PartnerLabContent } from "@/lib/content";
import { getAdjacentTopics, getTopic } from "@/lib/data";
import { useLmsStore } from "@/lib/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { cn } from "@/lib/utils";

/**
 * Lab has two families. The download lab is a notebook the learner runs on their own
 * machine; the partner lab runs on the partner's platform (Google, Microsoft) and the
 * learner leaves ours to do it.
 */
export function LabView({ topicId, courseSlug }: { topicId: string; courseSlug: string }) {
  const topic = getTopic(topicId);
  const lab = React.useMemo(() => (topic ? getLab(topic) : null), [topicId]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!topic || !lab) return null;
  return lab.kind === "partner" ? (
    <PartnerLabView topicId={topicId} courseSlug={courseSlug} title={topic.title} lab={lab} />
  ) : (
    <DownloadLabView topicId={topicId} lab={lab} />
  );
}

/** DS `LMS / Lab · Prerequisites` (20328:3331): p16, gap 8, r10. */
function Prerequisites({ items }: { items: string[] }) {
  return (
    <section className="flex flex-col gap-2 rounded-[10px] border border-sko-border-subtle bg-sko-bg-subtle p-4">
      <span className="sk-text-body-small-medium uppercase text-sko-text-subtle">Before you start</span>
      <ul className="sk-text-body-medium-regular list-disc pl-5 text-sko-text-muted">
        {items.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  );
}

/**
 * DS `LMS / Numbered Step` (20328:3297): 22px circle, body-small/Bold (semibold until
 * .sk-text-body-small-bold exists, CT-22), gap 12.
 */
function NumberedStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="sk-text-body-small-semibold inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-sko-bg-primary-soft text-sko-text-primary">
        {n}
      </span>
      <span className="sk-text-body-medium-regular text-sko-text-muted">{children}</span>
    </li>
  );
}

const DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** "50 minutes ago", for the card of a lab that reports nothing back. */
function ago(from: number, now: number): string {
  const minutes = Math.floor((now - from) / 60000);
  if (minutes < 1) return "less than a minute ago";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  return `on ${DAY.format(from)}`;
}

/**
 * Partner lab (Figma `Lab · Third-party platforms`, 6789:325; lab-third-party-platforms.md).
 *
 * Google is an LTI component with a score: opening the lab leaves the topic waiting, and
 * the score coming back completes it, with nothing to mark by hand. Microsoft is a link:
 * nothing comes back, so the shell shows Mark as Complete under the content.
 *
 * `labLaunch` (demo menu) switches the Google lab between the new tab it opens in today and
 * the alternatives still to be tested in Studio: inline, modal, and the provider refusing
 * the frame. A lab with no LTI component has no such setting and always opens in a new tab.
 */
function PartnerLabView({
  topicId,
  courseSlug,
  title,
  lab,
}: {
  topicId: string;
  courseSlug: string;
  title: string;
  lab: PartnerLabContent;
}) {
  const router = useRouter();
  const bp = useBreakpoint();
  const isCompleted = useLmsStore((s) => s.completedTopics.has(topicId));
  const progress = useLmsStore((s) => s.labState[topicId]);
  const labLaunch = useLmsStore((s) => s.labLaunch);
  const labOpened = useLmsStore((s) => s.labOpened);
  const [modalOpen, setModalOpen] = React.useState(false);
  const cardRef = React.useRef<HTMLElement>(null);
  // Closing the modal returns focus to "Open lab". When the score arrived meanwhile that
  // button is gone (the card now reads Completed), so focus goes to the card instead.
  const closeModal = React.useCallback(() => {
    setModalOpen(false);
    window.requestAnimationFrame(() => {
      if (document.activeElement === document.body) cardRef.current?.focus();
    });
  }, []);
  // Keeps "opened N minutes ago" current while the learner is away on the partner's site.
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const google = lab.partner === "google";
  const launch = lab.scored ? labLaunch : "new-tab";
  const opened = Boolean(progress?.openedAt);
  const href = `/partner/${lab.partner}?topic=${topicId}`;
  const next = getAdjacentTopics(topicId).next;

  const cardState: LabLaunchState = isCompleted
    ? "completed"
    : opened
      ? "opened"
      : launch === "refused"
        ? "unavailable"
        : "ready";

  const again = google ? "Open the lab again" : "Open on Microsoft Learn again";
  const card: Record<LabLaunchState, { title: string; description: string; action: string }> = google
    ? {
        ready: {
          title,
          description:
            launch === "modal"
              ? `${lab.platform} · opens in a window over this page · graded, 1 point`
              : `${lab.platform} · opens in a new tab · graded, 1 point`,
          action: "Open lab",
        },
        opened: {
          title: "Your lab is open in another tab",
          description: `Finish it in ${lab.platform}. This page updates when your score arrives.`,
          action: again,
        },
        completed: {
          title: "Lab complete",
          description: progress?.score
            ? `Score ${progress.score.earned} / ${progress.score.total} · received from ${lab.platform} on ${DAY.format(progress.completedAt ?? now)}`
            : `Completed on ${DAY.format(progress?.completedAt ?? now)}`,
          action: again,
        },
        unavailable: {
          title: "This lab can't be shown inside the page",
          description:
            "The lab provider doesn't allow it. Open the lab in a new tab instead: your score still comes back here.",
          action: "Open in a new tab",
        },
      }
    : {
        ready: {
          title,
          description: `${lab.platform} · opens in a new tab · not graded`,
          action: "Open on Microsoft Learn",
        },
        opened: {
          title: "Back from Microsoft Learn?",
          description: `You opened this lab ${ago(progress?.openedAt ?? now, now)}.`,
          action: again,
        },
        completed: {
          title: "Lab complete",
          description: `You marked this lab as complete on ${DAY.format(progress?.completedAt ?? now)}`,
          action: again,
        },
        unavailable: { title, description: "", action: "Open in a new tab" },
      };

  const steps = !google
    ? [
        "Open the module. It starts in a new tab and this page stays open.",
        "Work through the units and exercises on Microsoft Learn.",
        "Come back to this page and select Mark as Complete.",
      ]
    : launch === "inline"
      ? [
          "Start the lab in the frame below this list.",
          "Follow the instructions and check your progress as you go.",
          "End the lab. Your score comes back and the topic is marked complete for you.",
        ]
      : [
          launch === "modal"
            ? "Open the lab. It opens in a window over this page."
            : "Open the lab. It starts in a new tab and this page stays open.",
          `Follow the instructions in ${lab.platform} and check your progress there as you go.`,
          "End the lab. Your score comes back to this page and the topic is marked complete for you.",
        ];

  const alert: { tone: "info" | "success"; title: string; description: string } = google
    ? isCompleted
      ? {
          tone: "success",
          title: "Topic marked complete for you",
          description: `${lab.platform} sent your score, so there is nothing to mark by hand.`,
        }
      : opened
        ? {
            tone: "info",
            title: "Waiting for your score",
            description: `It arrives after you end the lab in ${lab.platform}. You can move on to the next topic in the meantime.`,
          }
        : {
            tone: "info",
            title: "Google receives your username and email",
            description:
              "Only what is needed to start the lab under your name and send your score back to SkillUp.",
          }
    : isCompleted
      ? {
          tone: "success",
          title: "Marked as complete",
          description: "You can open the module on Microsoft Learn again whenever you want to review it.",
        }
      : opened
        ? {
            tone: "info",
            title: "Finished the lab?",
            description: "Select Mark as Complete below so it counts towards your progress.",
          }
        : {
            tone: "info",
            title: "SkillUp can't see your progress on Microsoft Learn",
            description:
              "Nothing is sent back when you finish, so this topic stays open until you mark it as complete.",
          };

  // Google's own help does not recommend phones or tablets for its labs. The warning sits
  // above the launch, on tablet and mobile, until the lab has been opened.
  const needsComputer =
    google && bp !== "desktop" && !opened && !isCompleted ? (
      <InlineAlert
        tone="warning"
        title="This lab needs a computer"
        description="Google doesn't recommend phones or tablets for its labs, and this one may not work here. You can read the instructions now and do the lab later on a desktop or laptop."
      />
    ) : null;

  // The card's actions are 36 high in the DS (`Buttons/Button` md), which is Button V2 sm here.
  const newTab = (hierarchy: "primary" | "secondary", label: string) => (
    <ButtonLink
      href={href}
      target="_blank"
      rel="noopener"
      hierarchy={hierarchy}
      size="sm"
      rightIcon={ExternalLink}
      onClick={() => labOpened(topicId)}
    >
      {label}
    </ButtonLink>
  );

  const inline = launch === "inline" && !opened;
  const stepList = (
    <>
      <h2 className="sk-text-title-large-bold text-sko-text-default">How this lab works</h2>
      <ol className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <NumberedStep key={i} n={i + 1}>
            {s}
          </NumberedStep>
        ))}
      </ol>
    </>
  );

  return (
    <div className="flex flex-col gap-3 border-t border-sko-border-subtle pt-3">
      <p className="sk-text-body-large-medium text-sko-text-default">
        {inline
          ? `This lab runs on ${lab.platform} and opens right here, inside the page. You work in a real Google Cloud project with temporary credentials.`
          : lab.intro}
      </p>

      <Prerequisites items={lab.prerequisites} />

      {inline ? (
        <>
          {stepList}
          {needsComputer}
          {/* LTI "Open tool in: Inline": 800 px high by default (`inline_height`). A sketch,
              like its Figma source: no DS component until the Studio test (§2 of the doc). */}
          <section
            aria-label={`${lab.platform} lab`}
            className="overflow-hidden rounded-lg border border-sko-border-default bg-sko-bg-page"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 bg-sko-bg-faint py-2 pl-4 pr-2">
              <span className="sk-text-body-medium-semibold min-w-0 text-sko-text-default">
                {lab.platform} · {title}
              </span>
              <ButtonLink
                href={href}
                target="_blank"
                rel="noopener"
                hierarchy="tertiary"
                size="sm"
                rightIcon={ExternalLink}
                onClick={() => labOpened(topicId)}
              >
                Open in a new tab
              </ButtonLink>
            </div>
            <iframe title={`${lab.platform} · ${title}`} src={`${href}&embed=1`} className="block h-[800px] w-full bg-sko-bg-subtle" />
          </section>
        </>
      ) : (
        <>
          {needsComputer}
          <LabLaunchCard
            ref={cardRef}
            state={cardState}
            provider={lab.provider}
            title={card[cardState].title}
            description={card[cardState].description}
          >
            {cardState === "ready" && launch === "modal" ? (
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
                {card.ready.action}
              </Button>
            ) : (
              newTab(cardState === "ready" || cardState === "unavailable" ? "primary" : "secondary", card[cardState].action)
            )}
            {cardState === "unavailable" && next ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/course/${courseSlug}/topic/${next.id}`)}
              >
                Skip for now
              </Button>
            ) : null}
          </LabLaunchCard>
          {stepList}
        </>
      )}

      <InlineAlert tone={alert.tone} title={alert.title} description={alert.description} />

      <LabModal
        open={modalOpen}
        title={title}
        src={`${href}&embed=1`}
        newTabHref={href}
        compact={bp === "mobile"}
        onOpenNewTab={() => {
          labOpened(topicId);
          setModalOpen(false);
        }}
        onClose={closeModal}
      />
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
      {/* DS LMS / Lab · Prerequisites (20328:3331): p16, gap 8, r10. */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-sko-border-subtle bg-sko-bg-subtle p-4">
        <span className="sk-text-body-small-medium uppercase text-sko-text-subtle">
          Before you start
        </span>
        <ul className="sk-text-body-medium-regular list-disc pl-5 text-sko-text-muted">
          {lab.prerequisites.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      {/* Files — the core affordance of a lab topic. */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="sk-text-body-large-semibold text-sko-text-default">Lab files</h2>
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
                      {/* DS body-medium/Bold — semibold until .sk-text-body-medium-bold exists (CT-22). */}
                      <span className="sk-text-body-medium-semibold truncate text-sko-text-default">
                        {f.name}
                      </span>
                      <span className="sk-text-body-small-regular text-sko-text-subtle">{f.size}</span>
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
            Mark as complete
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
