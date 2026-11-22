import { Skeleton } from "@/components/atoms/Skeleton";
import type { ProgramCertificateCourse } from "@/lib/platform/catalog";
import type { ProgramCertificate } from "@/lib/platform/program";
import styles from "./CertificatePageSkeleton.module.css";

/** A breadcrumb item and its chevron: 44 tall below desktop (its target), 24 on desktop. */
function Crumb({ text, last = false }: { text: string; last?: boolean }) {
  return (
    <div className={styles.crumb}>
      <div className={styles.crumbTarget}>
        <Skeleton variant="ghost" text="body-medium-semibold">{text}</Skeleton>
      </div>
      {last ? null : <Skeleton variant="block" width={16} height={16} radius="inner" />}
    </div>
  );
}

/** A label over its value, as the facts list beside the sheet draws them. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <Skeleton variant="ghost" text="body-small-regular">{label}</Skeleton>
      <Skeleton variant="ghost" text="body-medium-semibold" className={styles.breakAll}>{value}</Skeleton>
    </div>
  );
}

/**
 * A certificate page while it loads (motion-matrix §7.9): CertificatePageView's column with the
 * breadcrumb, the heading and its line as ghost text; an issued certificate's sheet (1123:794)
 * and the column of actions and facts beside it; a certificate not earned yet, the card of what
 * is missing (requirements with their bars, the program's courses) and the way back.
 */
export function CertificatePageSkeleton({
  kind,
  certificate,
  program,
  courses = [],
}: {
  kind: "course" | "program";
  certificate: ProgramCertificate;
  program?: { slug: string; title: string };
  courses?: ProgramCertificateCourse[];
}) {
  const heading = kind === "program" && program ? program.title : certificate.title;
  return (
    <div className={styles.page}>
      <div className={styles.crumbs}>
        <Crumb text="My Learning" />
        {program ? (
          <>
            <Crumb text="Programs" />
            <Crumb text={program.title} />
          </>
        ) : null}
        <Crumb text={kind === "program" ? "Program certificate" : "Certificate"} last />
      </div>

      <div className={styles.heading}>
        <Skeleton variant="ghost" text="headline-small-semibold">{heading}</Skeleton>
        <Skeleton variant="ghost" text="body-medium-regular">
          {certificate.status === "issued" ? certificate.issuedLine : `Program certificate · ${certificate.title}`}
        </Skeleton>
      </div>

      {certificate.status === "issued" ? (
        <div className={styles.layout}>
          <Skeleton variant="block" radius="card" className={styles.sheet} />
          <div className={styles.side}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} variant="block" height={48} radius="control" />
            ))}
            <div className={styles.facts}>
              <Fact label="Issued" value={certificate.document.issuedOn} />
              <Fact label="Certificate ID" value={certificate.document.certificateId} />
              {certificate.document.signatories.length ? (
                <div className={styles.fact}>
                  <Skeleton variant="ghost" text="body-small-regular">Signed by</Skeleton>
                  {certificate.document.signatories.map((s) => (
                    <div key={s.name}>
                      <Skeleton variant="ghost" text="body-medium-semibold">{s.name}</Skeleton>
                      <Skeleton variant="ghost" text="body-small-regular">{s.role}</Skeleton>
                    </div>
                  ))}
                </div>
              ) : null}
              <Fact label="Verify at" value={certificate.document.verifyUrl} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.missing}>
            <Skeleton variant="ghost" text="headline-small-bold">What is missing</Skeleton>
            <div className={styles.requirements}>
              {certificate.requirements.map((req) => (
                <div key={req.title} className={styles.fact}>
                  <Skeleton variant="ghost" text="body-medium-semibold">{req.title}</Skeleton>
                  <Skeleton variant="ghost" text="body-small-regular">{req.detail}</Skeleton>
                  <Skeleton variant="block" height={8} radius="none" />
                </div>
              ))}
            </div>
            {courses.length > 0 ? (
              <div className={styles.courses}>
                {courses.map((course) => (
                  <div
                    key={course.slug}
                    className={styles.course}
                  >
                    <div className={styles.courseTitle}>
                      <Skeleton variant="ghost" text="body-medium-medium">{`Course ${course.number} · ${course.title}`}</Skeleton>
                    </div>
                    <Skeleton variant="block" width={112} height={24} radius="pill" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className={styles.side}>
            <Skeleton variant="block" height={48} radius="control" />
            <Skeleton variant="ghost" text="body-medium-regular">
              The certificate appears on this page once every course of the program is complete.
            </Skeleton>
          </div>
        </div>
      )}
    </div>
  );
}
