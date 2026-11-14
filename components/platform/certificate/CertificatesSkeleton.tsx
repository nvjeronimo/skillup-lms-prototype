import { Skeleton } from "@/components/atoms/Skeleton";
import { enrolments } from "@/lib/platform/certificate-enrolments";
import styles from "./CertificatesSkeleton.module.css";

/**
 * Certificates while it loads (motion-matrix §7.9): CertificatesView's column, gaps and text
 * styles. The search, the two Button groups, then the ledger as it opens on Programs: one card
 * per program, its certificate row on bg/subtle and the course bar under it.
 */
export function CertificatesSkeleton() {
  const programs = enrolments.filter((e) => e.kind === "program");
  return (
    <div className={`sk-page-stack ${styles.column}`}>
      <div className={styles.intro}>
        <Skeleton variant="ghost" text="headline-large-bold">
          My Certificates
        </Skeleton>
        <Skeleton variant="ghost" text="body-large-regular">
          Everything you have earned, and what you are working towards.
        </Skeleton>
      </div>

      <div className={styles.section}>
        <div className={styles.searchRow}>
          <Skeleton
            variant="block"
            radius="control"
            className={styles.search}
          />
        </div>
        <div className={styles.filters}>
          <Skeleton
            variant="block"
            radius="track"
            className={styles.filterType}
          />
          <Skeleton
            variant="block"
            radius="track"
            className={styles.filterStatus}
          />
        </div>
        <div className={styles.groups}>
          {programs.map((e) => (
            <div
              key={e.slug}
              className={styles.card}
            >
              <div className={styles.cardHead}>
                <Skeleton
                  variant="block"
                  radius="control"
                  className={styles.thumb}
                />
                <Skeleton variant="ghost" text="title-medium-semibold">
                  {e.title}
                </Skeleton>
              </div>
              <div className={styles.cardBar}>
                <Skeleton text="body-medium-medium" width={220} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
