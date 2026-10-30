"use client";

import * as React from "react";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import { CertificatesLedger } from "./CertificatesLedger";
import { CertificatesSkeleton } from "./CertificatesSkeleton";

/**
 * Certificates (Nelson, 19 Oct 2026, Figma 7584:94993): every certificate of the learner, from
 * the Dashboard's Certificates tile and the profile menu.
 * The title and its intro, Search (by certificate, course or program title) on the right, full
 * width on mobile, then the ledger (since 30 Oct 2026, CertificatesLedger): two DS Button
 * groups, Programs | Single courses and All | In progress | Earned, over one row per
 * certificate, a program's course rows grouped under its own certificate. It replaced the
 * Earned / In progress tabs (21 Oct) and the program cards behind them (29 Oct, PR 428).
 */
export function CertificatesView() {
  const [query, setQuery] = React.useState("");
  const needle = query.trim().toLowerCase();

  return (
    <PlatformPage
      current={null}
      className="px-layout-page-x pb-12 pt-layout-page-top md:pb-16 lg:pb-20"
      skeleton={<CertificatesSkeleton />}
    >
      <div className="sk-page-stack mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
        <div data-arrive={0} className="flex flex-col gap-2">
          <h1 className="sk-text-headline-large-bold text-sko-text-default">My Certificates</h1>
          <p className="sk-text-body-large-regular text-sko-text-subtle">
            Everything you have earned, and what you are working towards.
          </p>
        </div>

        <section aria-label="My certificates" className="flex flex-col gap-layout-stack">
          <div data-arrive={1} className="flex items-center gap-2 md:justify-end">
            <SearchField
              value={query}
              onChange={setQuery}
              label="Search certificates"
              className="w-full md:w-[240px] lg:w-[320px]"
            />
          </div>
          <div data-arrive={2}>
            {/* The program titles are h3 and the rows h4: this h2 keeps the outline. */}
            <h2 className="sr-only">Certificates</h2>
            <CertificatesLedger needle={needle} />
          </div>
        </section>
      </div>
    </PlatformPage>
  );
}
