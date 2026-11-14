import Link from "@/lib/router";
import { ChevronRight, Download } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformProgressBar } from "@/components/platform/PlatformProgressBar";
import { CertificateDocument, certificateLearner } from "@/components/platform/program/CertificateDocument";
import { CertificateShare } from "@/components/platform/certificate/CertificateShare";
import type { ProgramCertificateCourse } from "@/lib/platform/catalog";
import { coursePageHref, programPageHref } from "@/lib/platform/hrefs";
import type { ProgramCertificate } from "@/lib/platform/program";
import { MY_LEARNING_HREF, MY_LEARNING_PROGRAMS_HREF } from "@/lib/platform/routes";
import styles from "./CertificatePageView.module.css";

const CRUMB = `sk-text-body-medium-semibold ${styles.crumb}`;


/** The state of one course on the program certificate page, in the words of the course cards. */
function courseStatus(percent: number | null): { label: string; color: "success" | "gray" } {
  if (percent === null) return { label: "Not started", color: "gray" };
  if (percent >= 100) return { label: "Complete", color: "success" };
  return { label: `In progress · ${percent}%`, color: "gray" };
}

/**
 * Download: the browser's print dialog with the sheet on one A4 landscape page, no margins. The
 * page size is set only while printing, so other pages print as before.
 */
function printSheet() {
  const style = document.createElement("style");
  style.textContent = "@page { size: A4 landscape; margin: 0; }";
  document.head.appendChild(style);
  window.addEventListener("afterprint", () => style.remove(), { once: true });
  window.print();
}

/**
 * A certificate on its own page: where *View* on a Certificate card leads.
 *
 * Drawn in Figma on 19 Oct 2026 with the Certificates page (in review), from what exists: the
 * platform shell, the breadcrumb of the course and program pages, the certificate document of
 * the Certificate card, DS buttons. Until then it was a proposal with a "not designed yet" note.
 *
 * Two kinds since 10 Oct 2026, both proposals:
 * - `course`: the certificate of a course (issued), as before;
 * - `program`: the certificate of a program. Issued, it is the same page. Not earned (the
 *   other two sample programs), there is no sheet to show: the page says what is missing instead,
 *   the requirement with its bar (courses complete of total) and the list of the program's
 *   courses, each with its state and a link to its page.
 * The trail goes through Programs for anything of a program, like the course page.
 */
export function CertificatePageView({
  kind,
  certificate,
  program,
  courseSlug,
  courses = [],
  complete = 0,
}: {
  kind: "course" | "program";
  certificate: ProgramCertificate;
  /** The program the certificate, or its course, belongs to. */
  program?: { slug: string; title: string };
  /** `course` only: the course the certificate is for. */
  courseSlug?: string;
  /** `program` only: its courses and how many are complete. */
  courses?: ProgramCertificateCourse[];
  complete?: number;
}) {
  const heading = kind === "program" && program ? program.title : certificate.title;
  const back =
    kind === "course" && courseSlug
      ? { label: "Go to the course", href: coursePageHref(courseSlug) }
      : program
        ? { label: "Go to the program", href: programPageHref(program.slug) }
        : { label: "Go to My Learning", href: MY_LEARNING_HREF };

  return (
    <div className={styles.page}>
      <nav data-arrive={0} aria-label="Breadcrumb">
        <ol className={styles.crumbs}>
          <li className={styles.crumbItem}>
            <Link href={MY_LEARNING_HREF} className={`${CRUMB} ${styles.crumbLink}`}>
              My Learning
            </Link>
            <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevron} />
          </li>
          {program ? (
            <>
              <li className={styles.crumbItem}>
                <Link href={MY_LEARNING_PROGRAMS_HREF} className={`${CRUMB} ${styles.crumbLink}`}>
                  Programs
                </Link>
                <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevron} />
              </li>
              <li className={`${styles.crumbItem} ${styles.crumbItemShrink}`}>
                <Link
                  href={`${programPageHref(program.slug)}?tab=certificates`}
                  className={`${CRUMB} ${styles.crumbShrink} ${styles.crumbLink}`}
                >
                  {program.title}
                </Link>
                <Icon icon={ChevronRight} size={16} aria-hidden className={styles.chevron} />
              </li>
            </>
          ) : null}
          <li className={styles.crumbLast}>
            <span aria-current="page" className={`${CRUMB} ${styles.crumbCurrent}`}>
              {kind === "program" ? "Program certificate" : "Certificate"}
            </span>
          </li>
        </ol>
      </nav>

      <div data-arrive={1} className={styles.heading}>
        <h1 className={`sk-text-headline-small-semibold ${styles.textDefault}`}>{heading}</h1>
        <p className={`sk-text-body-medium-regular ${styles.textSubtle}`}>
          {certificate.status === "issued" ? certificate.issuedLine : `Program certificate · ${certificate.title}`}
        </p>
      </div>

      {certificate.status === "issued" ? (
        <div className={styles.layout}>
          <div
            data-arrive={2}
            data-mock="Certificate artwork, ID and verification address are sample data"
            className={`sk-print-sheet ${styles.sheet}`}
          >
            <div className={styles.sheetFill}>
              <CertificateDocument
                data={certificate.document}
                label={`Certificate of completion: ${certificateLearner(certificate.document)}, ${certificate.title}`}
              />
            </div>
          </div>

          <div data-arrive={3} className={styles.side}>
            {/* Shown in the Open edX scope too (Nelson, 3 Nov 2026): Open edX makes no PDF, only the
                web certificate, so the download is something to build, not a stock feature. In the
                prototype it opens the browser's print dialog ("Save as PDF" makes the file), which
                prints the sheet alone on one A4 landscape page (globals.css, .sk-print-sheet). */}
            <Button hierarchy="primary" size="lg" leftIcon={Download} onClick={printSheet}>
              Download certificate
            </Button>
            <CertificateShare target={{ title: certificate.title, document: certificate.document }} size="lg" />
            <ButtonLink href={back.href} hierarchy="secondary" size="lg">
              {back.label}
            </ButtonLink>
            {/* The sheet is one image whose small print scales below 12 px: everything a learner
                reads on it that is not in its label (learner, course) is listed here as text,
                signatories included. */}
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt className={`sk-text-body-small-regular ${styles.textSubtle}`}>Issued</dt>
                <dd className={`sk-text-body-medium-semibold ${styles.textDefault}`}>{certificate.document.issuedOn}</dd>
              </div>
              <div data-invented="certificate: Open edX identifies it by its verify UUID, no readable ID" className={styles.fact}>
                <dt className={`sk-text-body-small-regular ${styles.textSubtle}`}>Certificate ID</dt>
                <dd className={`sk-text-body-medium-semibold ${styles.textDefault}`}>{certificate.document.certificateId}</dd>
              </div>
              {certificate.document.signatories.length ? (
                // Who signed it: on the sheet this is small print (audit 16 Oct 2026).
                <div className={styles.fact}>
                  <dt className={`sk-text-body-small-regular ${styles.textSubtle}`}>Signed by</dt>
                  {certificate.document.signatories.map((s) => (
                    <dd key={s.name} className={`sk-text-body-medium-semibold ${styles.textDefault}`}>
                      {s.name}
                      <span className={`sk-text-body-small-regular ${styles.signatoryRole}`}>{s.role}</span>
                    </dd>
                  ))}
                </div>
              ) : null}
              <div className={styles.fact}>
                <dt className={`sk-text-body-small-regular ${styles.textSubtle}`}>Verify at</dt>
                <dd className={`sk-text-body-medium-semibold ${styles.verifyUrl}`}>{certificate.document.verifyUrl}</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        /* Not earned: no sheet and nothing to download. What is missing, then the way back. */
        <div className={styles.layout}>
          <section
            data-arrive={2}
            aria-labelledby="certificate-missing-title"
            data-mock="No API says whether a program certificate is earned: counted here from the course rows"
            className={styles.missing}
          >
            <h2 id="certificate-missing-title" className={`sk-text-headline-small-bold ${styles.textDefault}`}>
              What is missing
            </h2>
            <ul className={styles.requirements}>
              {certificate.requirements.map((req) => (
                <li key={req.title} className={styles.requirement}>
                  <p className={`sk-text-body-medium-semibold ${styles.textDefault}`}>{req.title}</p>
                  <p className={`sk-text-body-small-regular ${styles.textSubtle}`}>{req.detail}</p>
                  <PlatformProgressBar value={req.percent} label={req.title} />
                </li>
              ))}
            </ul>
            {courses.length > 0 ? (
              <ol aria-label={`Courses of the program: ${complete} of ${courses.length} complete`} className={styles.courses}>
                {courses.map((course) => {
                  const status = courseStatus(course.percent);
                  return (
                    <li
                      key={course.slug}
                      className={styles.course}
                    >
                      <Link
                        href={coursePageHref(course.slug)}
                        className={`sk-text-body-medium-medium ${styles.courseLink}`}
                      >
                        Course {course.number} · {course.title}
                      </Link>
                      <Badge color={status.color} size="md" className={styles.courseBadge}>
                        {status.label}
                      </Badge>
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </section>

          <div data-arrive={3} className={styles.side}>
            <ButtonLink href={back.href} hierarchy="primary" size="lg">
              {back.label}
            </ButtonLink>
            <p className={`sk-text-body-medium-regular ${styles.textSubtle}`}>
              The certificate appears on this page once every course of the program is complete.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
