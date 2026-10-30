import { Skeleton } from "@/components/atoms/Skeleton";
import type { ProgramCertificateCourse } from "@/lib/platform/catalog";
import type { ProgramCertificate } from "@/lib/platform/program";

/** A breadcrumb item and its chevron: 44 tall below desktop (its target), 24 on desktop. */
function Crumb({ text, last = false }: { text: string; last?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 md:gap-2">
      <div className="flex min-h-11 items-center lg:min-h-6">
        <Skeleton variant="ghost" text="body-medium-semibold">
          {text}
        </Skeleton>
      </div>
      {last ? null : <Skeleton variant="block" width={16} height={16} radius="inner" />}
    </div>
  );
}

/** A label over its value, as the facts list beside the sheet draws them. */
function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <Skeleton variant="ghost" text="body-small-regular">
        {label}
      </Skeleton>
      <Skeleton variant="ghost" text="body-medium-semibold" className="break-all">
        {value}
      </Skeleton>
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
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-layout-band-x pb-8 pt-6 md:pb-12 lg:pb-20 lg:pt-6">
      <div className="flex flex-wrap items-center gap-x-1.5 md:gap-x-2">
        <Crumb text="My Learning" />
        {program ? (
          <>
            <Crumb text="Programs" />
            <Crumb text={program.title} />
          </>
        ) : null}
        <Crumb text={kind === "program" ? "Program certificate" : "Certificate"} last />
      </div>

      <div className="flex flex-col gap-1">
        <Skeleton variant="ghost" text="headline-small-semibold">
          {heading}
        </Skeleton>
        <Skeleton variant="ghost" text="body-medium-regular">
          {certificate.status === "issued"
            ? certificate.issuedLine
            : `Program certificate · ${certificate.title}`}
        </Skeleton>
      </div>

      {certificate.status === "issued" ? (
        <div className="flex flex-col gap-layout-column lg:flex-row lg:items-start">
          <Skeleton
            variant="block"
            radius="card"
            className="aspect-[1123/794] w-full min-w-0 lg:flex-1"
          />
          <div className="flex flex-col gap-3 lg:w-[320px] lg:shrink-0">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} variant="block" height={48} radius="control" />
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <Fact label="Issued" value={certificate.document.issuedOn} />
              <Fact label="Certificate ID" value={certificate.document.certificateId} />
              {certificate.document.signatories.length ? (
                <div className="flex flex-col gap-0.5">
                  <Skeleton variant="ghost" text="body-small-regular">
                    Signed by
                  </Skeleton>
                  {certificate.document.signatories.map((s) => (
                    <div key={s.name}>
                      <Skeleton variant="ghost" text="body-medium-semibold">
                        {s.name}
                      </Skeleton>
                      <Skeleton variant="ghost" text="body-small-regular">
                        {s.role}
                      </Skeleton>
                    </div>
                  ))}
                </div>
              ) : null}
              <Fact label="Verify at" value={certificate.document.verifyUrl} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-layout-column lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-[15px] md:p-[19px] lg:flex-1 lg:p-[23px]">
            <Skeleton variant="ghost" text="headline-small-bold">
              What is missing
            </Skeleton>
            <div className="flex flex-col gap-4">
              {certificate.requirements.map((req) => (
                <div key={req.title} className="flex flex-col gap-0.5">
                  <Skeleton variant="ghost" text="body-medium-semibold">
                    {req.title}
                  </Skeleton>
                  <Skeleton variant="ghost" text="body-small-regular">
                    {req.detail}
                  </Skeleton>
                  <Skeleton variant="block" height={8} radius="none" />
                </div>
              ))}
            </div>
            {courses.length > 0 ? (
              <div className="flex flex-col">
                {courses.map((course) => (
                  <div
                    key={course.slug}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-sko-border-subtle py-3"
                  >
                    <div className="flex min-h-11 min-w-0 items-center md:min-h-6">
                      <Skeleton
                        variant="ghost"
                        text="body-medium-medium"
                      >{`Course ${course.number} · ${course.title}`}</Skeleton>
                    </div>
                    <Skeleton variant="block" width={112} height={24} radius="pill" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 lg:w-[320px] lg:shrink-0">
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
