"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { ArrivalCount } from "@/components/atoms/ArrivalCount";
import { Badge } from "@/components/atoms/Badge";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateCard } from "@/components/platform/program/CertificatesTab";
import { certificatesInProgress, earnedCertificates } from "@/lib/platform/certificates";
import { CertificatesSkeleton } from "./CertificatesSkeleton";

/** A section heading with its count, as My Learning's section headers. */
function SectionTitle({ id, title, count }: { id: string; title: string; count: number }) {
  return (
    <h2 id={id} className="sk-text-title-large-semibold flex items-center gap-2 text-sko-text-default">
      {title}
      <Badge color="gray" variant="soft" size="md" aria-label={`${count} certificates`}>
        <ArrivalCount value={String(count)} />
      </Badge>
    </h2>
  );
}

/**
 * Certificates (Nelson, 19 Oct 2026): every certificate of the learner on one page, from the
 * Dashboard's Certificates tile and the profile menu.
 * - Earned: the DS Certificate card (issued) in a grid, 3 / 2 / 1 columns, one height per row
 *   with the actions on the bottom edge. View opens the certificate's own page.
 * - In progress: one row per course or program on the way, its bar (bg/info, never green
 *   before it is complete) and what it measures, the row a link to the course page or to the
 *   program certificate page that says what is missing.
 */
export function CertificatesView() {
  return (
    <PlatformPage
      current={null}
      className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10"
      skeleton={<CertificatesSkeleton />}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:gap-10">
        <div data-arrive={0} className="flex flex-col gap-2">
          <h1 className="sk-text-headline-large-bold text-sko-text-default">Certificates</h1>
          <p className="sk-text-body-large-regular text-sko-text-subtle">
            Everything you have earned, and what you are working towards.
          </p>
        </div>

        <section data-arrive={1} aria-labelledby="earned-title" className="flex flex-col gap-4 md:gap-5">
          <SectionTitle id="earned-title" title="Earned" count={earnedCertificates.length} />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
            {earnedCertificates.map((e) => (
              <li key={e.id} className="flex">
                <CertificateCard
                  certificate={{
                    ...e.certificate,
                    viewHref: e.viewHref,
                    // A course of a program says which, under the issue date; the eyebrow stays one
                    // line so the sheets line up across the row.
                    issuedLine: e.program
                      ? `${e.certificate.issuedLine} Course ${e.program.number} of ${e.program.total}, ${e.program.title}.`
                      : e.certificate.issuedLine,
                  }}
                  label={e.kind === "program" ? "Program certificate" : "Course certificate"}
                  labelAs="p"
                  className="w-full"
                />
              </li>
            ))}
          </ul>
        </section>

        <section data-arrive={2} aria-labelledby="progress-title" className="flex flex-col gap-4 md:gap-5">
          <SectionTitle id="progress-title" title="In progress" count={certificatesInProgress.length} />
          <ul className="flex flex-col overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
            {certificatesInProgress.map((c) => (
              <li key={c.id} className="border-b border-sko-border-subtle last:border-b-0">
                <Link
                  href={c.href}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-sko-bg-faint md:px-5"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="sk-text-label-small-medium text-sko-text-subtle">
                        {c.kind === "program" ? "Program certificate" : "Course certificate"}
                        {c.context ? ` · ${c.context}` : ""}
                      </p>
                      <p className="sk-text-body-large-semibold text-sko-text-default">{c.title}</p>
                    </div>
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                      <PlatformProgressBar value={c.percent} label={`${c.title}: ${c.detail}`} className="md:max-w-[320px] md:flex-1" />
                      <p className="sk-text-body-small-regular text-sko-text-subtle">{c.detail}</p>
                    </div>
                  </div>
                  <Icon icon={ChevronRight} size={20} aria-hidden className="shrink-0 text-sko-icon-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PlatformPage>
  );
}
