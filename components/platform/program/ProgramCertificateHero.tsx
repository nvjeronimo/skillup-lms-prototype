"use client";

import * as React from "react";
import { Award, Check, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import type { ProgramCertificateState } from "@/lib/platform/catalog";
import { coursePlayerHref, programCertificatePageHref } from "@/lib/platform/hrefs";
import type { CertificateDocumentData, Program } from "@/lib/platform/program";
import { Icon } from "@/lib/icons";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CertificateDocument, certificateLearner } from "./CertificateDocument";

const EYEBROW = "sk-text-label-small-semibold uppercase text-sko-text-subtle";

/**
 * The sheet the learner is working towards, before it is issued: the program's title and
 * partners on the real certificate layout, with "On completion" where the date and ID go. The
 * partners and signatories are those of the program's course certificates.
 */
function previewDocument(program: Program): CertificateDocumentData {
  const issued = program.certificates.find((c) => c.status === "issued");
  const base = issued?.status === "issued" ? issued.document : undefined;
  return {
    kind: "program",
    courseTitle: program.title,
    summary: `${program.stats.courses}  ·  ${program.stats.duration}`,
    issuedOn: "On completion",
    certificateId: "Issued on completion",
    verifyUrl: "skillup.online/certificates",
    partnerLogoSrc: base?.partnerLogoSrc,
    partnerName: base?.partnerName,
    morePartners: base?.morePartners,
    signatories: base?.signatories ?? [],
  };
}

/**
 * The Program certificate on the program's Certificates tab (Nelson, 23 Oct 2026: "more
 * prominence, a better card"). One card across the column, the goal of the whole program:
 * - Left: the certificate itself (CertificateDocument at 2:√2). Not earned, it is a muted
 *   preview with a lock and "Complete all N courses"; issued, the real sheet.
 * - Right: the eyebrow, the program title (title-large/Semibold), the state, then
 *   - not earned: one segment per course in program order (bg/info done, bg/info-soft the course
 *     in progress, bg/track the rest; each has its name for assistive tech), "N of M courses
 *     complete", the next course with Resume (Primary) and "What's needed" (Secondary) to the
 *     certificate page;
 *   - issued: the issue line and View (Primary), Download (Secondary), Share.
 * - Under them, what the certificate gives: a verifiable ID, the partners, sharing on LinkedIn.
 * From 680 of its own width (container query): the two sides 24 apart (the sheet 320 wide);
 * narrower, the sheet on top (up to 480), the details under it.
 * No API says whether a program certificate is earned: counted from the course rows (mock mark).
 */
export function ProgramCertificateHero({
  state,
  titleAs: Title = "h3",
  titleId: titleIdProp,
}: {
  state: ProgramCertificateState;
  /** The title's level: h3 on the program page, h4 under a section heading (Certificates page). */
  titleAs?: "h3" | "h4";
  /** The title's id, when a section around the card is named by it (Certificates page). */
  titleId?: string;
}) {
  const generatedId = React.useId();
  const titleId = titleIdProp ?? generatedId;
  const showToast = useLmsStore((s) => s.showToast);
  const { program, certificate, complete } = state;
  const courses = state.courses.map((c) => ({ ...c, percent: c.percent ?? 0 }));
  const issued = certificate.status === "issued";
  const total = courses.length;
  const current =
    courses.find((c) => c.percent > 0 && c.percent < 100) ?? courses.find((c) => c.percent < 100);
  const doc = issued ? certificate.document : previewDocument(program);
  const partners = [doc.partnerName, ...(doc.morePartners ?? []).map((p) => p.name)].filter(
    Boolean,
  ) as string[];

  return (
    // Sized by its own width, not the viewport (Nelson, 23 Oct 2026): beside the 320 sidebar the
    // main column can be narrow on a laptop, so the sheet goes beside the details only from 680.
    <div className="[container-type:inline-size]">
      <article
        aria-labelledby={titleId}
        data-mock="No API says whether a program certificate is earned: counted here from the course rows"
        className="grid gap-5 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:p-6 [@container_(min-width:680px)]:grid-cols-[320px_minmax(0,1fr)] [@container_(min-width:680px)]:gap-6"
      >
        <div className="relative aspect-[1123/794] w-full max-w-[480px] self-start overflow-hidden rounded-card-inset border border-sko-border-subtle bg-sko-bg-subtle [container-type:inline-size]">
          <div className={cn("absolute inset-0", !issued && "opacity-50 grayscale")}>
            <CertificateDocument
              data={doc}
              label={
                issued
                  ? `Certificate of completion: ${certificateLearner(doc)}, ${program.title}`
                  : `Preview of the program certificate: ${program.title}`
              }
            />
          </div>
          {!issued ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <span className="sk-text-body-small-semibold inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-sko-border-subtle bg-sko-bg-page px-3 py-1.5 text-sko-text-default shadow-sm">
                <Icon icon={Lock} size={14} aria-hidden />
                Complete all {total} courses
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className={EYEBROW}>Program certificate</p>
              {/* Earned: green with the icon and the word, never colour alone (13 Oct 2026). */}
              {issued ? (
                <Badge variant="soft" color="success" leftIcon={CheckCircle2}>
                  Earned
                </Badge>
              ) : null}
            </div>
            <Title
              id={titleId}
              className="sk-text-title-large-semibold text-sko-text-default"
            >
              {program.title}
            </Title>
            <p className="sk-text-body-medium-regular text-sko-text-subtle">
              {issued
                ? certificate.issuedLine
                : complete === total
                  ? certificate.title
                  : `${complete} of ${total} courses complete`}
            </p>
          </div>

          {issued ? (
            <div className="flex flex-wrap items-center gap-2">
              <ButtonLink
                href={certificate.viewHref ?? programCertificatePageHref(program.slug)}
                hierarchy="primary"
                size="md"
                aria-label={`View certificate: ${program.title}`}
                className="max-md:h-11 max-md:flex-1"
              >
                View certificate
              </ButtonLink>
              <Button
                hierarchy="secondary"
                size="md"
                onClick={() => showToast("Download certificate is not part of this prototype yet")}
                className="max-md:h-11 max-md:flex-1"
              >
                Download
              </Button>
              <CertificateShare
                target={{ title: program.title, document: certificate.document }}
                look="icon"
              />
            </div>
          ) : (
            <>
              {/* One segment per course, in program order: the progress towards the certificate. */}
              <ol aria-label="Courses towards the certificate" className="flex gap-1">
                {courses.map((c) => {
                  const done = c.percent >= 100;
                  const now = c === current && c.percent > 0;
                  return (
                    <li
                      key={c.slug}
                      className={cn(
                        "h-2 min-w-0 flex-1",
                        done ? "bg-sko-bg-info" : now ? "bg-sko-bg-info-soft" : "bg-sko-bg-track",
                      )}
                    >
                      <span className="sr-only">
                        Course {c.number}, {c.title}:{" "}
                        {done
                          ? "complete"
                          : c.percent > 0
                            ? `${c.percent}% complete`
                            : "not started"}
                      </span>
                    </li>
                  );
                })}
              </ol>
              {current ? (
                <div className="flex flex-col gap-3 rounded-card-inset bg-sko-bg-subtle p-3">
                  <div className="flex min-w-0 flex-col">
                    <p className={EYEBROW}>{current.percent > 0 ? "In progress" : "Up next"}</p>
                    <p className="sk-text-body-medium-semibold text-sko-text-default">
                      Course {current.number} · {current.title}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <ButtonLink
                      href={coursePlayerHref(current.slug)}
                      hierarchy="primary"
                      size="sm"
                      className="max-md:h-11 max-md:flex-1"
                    >
                      {current.percent > 0 ? "Resume" : "Start"}
                    </ButtonLink>
                    <ButtonLink
                      href={programCertificatePageHref(program.slug)}
                      hierarchy="secondary"
                      size="sm"
                      className="max-md:h-11 max-md:flex-1"
                    >
                      What&apos;s needed
                    </ButtonLink>
                  </div>
                </div>
              ) : null}
            </>
          )}

          <ul className="sk-text-body-small-regular mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sko-text-subtle">
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Award} size={16} className="text-sko-icon-subtle" aria-hidden />
              {partners.length
                ? `Issued with ${partners.join(" and ")}`
                : "Issued by SkillUp Online"}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Check} size={16} className="text-sko-icon-subtle" aria-hidden />A
              certificate ID anyone can verify
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon icon={Check} size={16} className="text-sko-icon-subtle" aria-hidden />
              Ready to share on LinkedIn
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
}
