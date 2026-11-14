import * as React from "react";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import { CertificatesLedger } from "./CertificatesLedger";
import { CertificatesSkeleton } from "./CertificatesSkeleton";
import styles from "./CertificatesView.module.css";

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
      className={styles.page}
      skeleton={<CertificatesSkeleton />}
    >
      <div className={`sk-page-stack ${styles.column}`}>
        <div data-arrive={0} className={styles.intro}>
          <h1 className={`sk-text-headline-large-bold ${styles.title}`}>My Certificates</h1>
          <p className={`sk-text-body-large-regular ${styles.lead}`}>
            Everything you have earned, and what you are working towards.
          </p>
        </div>

        <section aria-label="My certificates" className={styles.section}>
          <div data-arrive={1} className={styles.searchRow}>
            <SearchField
              value={query}
              onChange={setQuery}
              label="Search certificates"
              className={styles.search}
            />
          </div>
          <div data-arrive={2}>
            {/* The program titles are h3 and the rows h4: this h2 keeps the outline. */}
            <h2 className="sk-sr-only">Certificates</h2>
            <CertificatesLedger needle={needle} />
          </div>
        </section>
      </div>
    </PlatformPage>
  );
}
