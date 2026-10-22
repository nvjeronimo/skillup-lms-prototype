"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import { discussionHref } from "@/lib/platform/discussion";
import { serviceSections, servicesMentor, type ServiceItem } from "@/lib/platform/services";
import { coursePageHref } from "@/lib/platform/hrefs";
import { Icon } from "@/lib/icons";
import { useLmsStore } from "@/lib/store";

/** One service: icon tile, title and status, a line on what it gives, the action as a link-looking button. */
function ServiceRow({ item, onAction }: { item: ServiceItem; onAction: (what: string) => void }) {
  const actionClass =
    "sk-text-body-medium-semibold relative inline-flex items-center gap-1 self-start text-sko-text-primary underline-offset-4 hover:underline min-h-6 max-md:min-h-11";
  const label = (
    <>
      {item.action}
      {item.external ? <Icon icon={ArrowUpRight} size={16} aria-hidden="true" /> : null}
      {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  );
  return (
    <li className="flex items-start gap-3 border-b border-sko-border-subtle p-4 last:border-b-0">
      <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-control bg-sko-bg-primary-soft text-sko-icon-primary">
        <Icon icon={item.icon} size={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="sk-text-body-medium-semibold text-sko-text-default">{item.title}</h3>
          {item.status ? <Badge color={item.status.color}>{item.status.label}</Badge> : null}
        </div>
        <p className="sk-text-body-small-regular text-sko-text-subtle">{item.description}</p>
        {item.href ? (
          <Link href={item.href} className={actionClass}>
            {label}
          </Link>
        ) : (
          <button type="button" onClick={() => onAction(item.action)} className={actionClass}>
            {label}
          </button>
        )}
      </div>
    </li>
  );
}

/**
 * Services while it loads (motion-matrix §7.9): ServicesView's column from the same data, so it
 * has the page's geometry: the title, the mentor card (avatar, ghost name, role and last
 * message, the two buttons), then each section's header and its rows as ghost lines.
 */
function ServicesSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
      <Skeleton variant="ghost" text="headline-large-bold">Here to help.</Skeleton>
      <div className="flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div className="flex items-start gap-4">
          <Skeleton variant="circle" size={48} />
          <div className="flex min-w-0 flex-col gap-1">
            <Skeleton variant="ghost" text="title-large-semibold">{servicesMentor.name}</Skeleton>
            <Skeleton variant="ghost" text="body-medium-regular">{`${servicesMentor.role} · ${servicesMentor.promise}`}</Skeleton>
            <div className="mt-1 flex items-start gap-1.5">
              <Skeleton variant="block" width={16} height={16} radius="inner" className="mt-0.5 shrink-0" />
              <Skeleton variant="ghost" text="body-small-regular">
                <span className="sk-text-body-small-semibold">{servicesMentor.last.from}:</span>{" "}
                {`“${servicesMentor.last.text}” · ${servicesMentor.last.when}`}
              </Skeleton>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <SkeletonPill size="button-md" className="justify-center">Message your mentor</SkeletonPill>
          <SkeletonPill size="button-md" className="justify-center">Your discussions</SkeletonPill>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
        {serviceSections.map((section) => (
          <div key={section.id} className="flex min-w-0 flex-col gap-4">
            <Skeleton variant="ghost" text="headline-small-bold">
              {section.emphasis ? `${section.title} ${section.emphasis}` : section.title}
            </Skeleton>
            <div className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
              {section.items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border-b border-sko-border-subtle p-4 last:border-b-0">
                  <Skeleton variant="block" width={40} height={40} radius="control" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton variant="ghost" text="body-medium-semibold">{item.title}</Skeleton>
                      {item.status ? <SkeletonPill>{item.status.label}</SkeletonPill> : null}
                    </div>
                    <Skeleton variant="ghost" text="body-small-regular">{item.description}</Skeleton>
                    <div className="flex min-h-11 items-center self-start md:min-h-6">
                      <Skeleton variant="ghost" text="body-medium-semibold">
                        {item.action}
                        {item.external ? "\u2003" : ""}
                      </Skeleton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Services (proposal, 17 Oct 2026; no Figma screen yet). The mentor first — the one person who
 * answers this learner — then three groups of services: Career, Support, Benefits and tools.
 * Desktop: the groups in three columns; tablet two; mobile one. Nothing here is Open edX, so
 * each block carries the SAMPLE mark with what it needs.
 */
export function ServicesView() {
  const showToast = useLmsStore((s) => s.showToast);
  const notInPrototype = (what: string) => showToast(`${what} is not part of this prototype yet`);

  return (
    <PlatformPage
      current="services"
      className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10"
      skeleton={<ServicesSkeleton />}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        <h1 data-arrive={0} className="sk-text-headline-large-bold text-sko-text-default">
          Here <span data-heading-em="" className="text-sko-text-subtle">to help.</span>
        </h1>

        <section
          data-arrive={1}
          aria-labelledby="services-mentor"
          data-mock={servicesMentor.mock}
          className="flex flex-col gap-4 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6"
        >
          <div className="flex items-start gap-4">
            <Avatar name={servicesMentor.name} size="lg" />
            <div className="flex min-w-0 flex-col gap-1">
              <h2 id="services-mentor" className="sk-text-title-large-semibold text-sko-text-default">
                {servicesMentor.name}
              </h2>
              <p className="sk-text-body-medium-regular text-sko-text-subtle">
                {servicesMentor.role} · {servicesMentor.promise}
              </p>
              <p className="sk-text-body-small-regular mt-1 flex items-start gap-1.5 text-sko-text-muted">
                <Icon icon={MessageCircle} size={16} className="mt-0.5 shrink-0 text-sko-icon-subtle" aria-hidden="true" />
                <span>
                  <span className="sk-text-body-small-semibold text-sko-text-default">{servicesMentor.last.from}:</span> “{servicesMentor.last.text}” ·{" "}
                  {servicesMentor.last.when}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
            {/* Nelson, 21 Oct 2026: messaging the mentor is the course's private Mentorship Q&A. */}
            <ButtonLink href={`${coursePageHref("ai-driven-content-and-brand-communication")}?tab=qa`} size="md" className="max-md:h-11">
              Message your mentor
            </ButtonLink>
            <ButtonLink href={discussionHref()} hierarchy="secondary" size="md" className="max-md:h-11">
              Your discussions
            </ButtonLink>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {serviceSections.map((section, i) => (
            <section key={section.id} data-arrive={2 + i} aria-labelledby={`services-${section.id}`} className="flex min-w-0 flex-col gap-4">
              <PlatformSectionHeader id={`services-${section.id}`} title={section.title} emphasis={section.emphasis} />
              <ul data-mock={section.mock} className="overflow-hidden rounded-card border border-sko-border-subtle bg-sko-bg-page">
                {section.items.map((item) => (
                  <ServiceRow key={item.id} item={item} onAction={notInPrototype} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </PlatformPage>
  );
}
