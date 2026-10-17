"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import { discussionHref } from "@/lib/platform/discussion";
import { serviceSections, servicesMentor, type ServiceItem } from "@/lib/platform/services";
import { Icon } from "@/lib/icons";
import { useLmsStore } from "@/lib/store";

/** One service: icon tile, title and status, a line on what it gives, the action as a link-looking button. */
function ServiceRow({ item, onAction }: { item: ServiceItem; onAction: (what: string) => void }) {
  const actionClass =
    "sk-text-body-medium-semibold relative inline-flex items-center gap-1 self-start text-sko-text-primary underline-offset-4 hover:underline max-md:min-h-11";
  const label = (
    <>
      {item.action}
      {item.external ? <Icon icon={ArrowUpRight} size={16} aria-hidden="true" /> : null}
      {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  );
  return (
    <li className="flex items-start gap-3 border-b border-sko-border-subtle p-4 last:border-b-0">
      <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-sko-bg-primary-soft text-sko-icon-primary">
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
 * Services (proposal, 17 Oct 2026; no Figma screen yet). The mentor first — the one person who
 * answers this learner — then three groups of services: Career, Support, Benefits and tools.
 * Desktop: the groups in three columns; tablet two; mobile one. Nothing here is Open edX, so
 * each block carries the SAMPLE mark with what it needs.
 */
export function ServicesView() {
  const showToast = useLmsStore((s) => s.showToast);
  const notInPrototype = (what: string) => showToast(`${what} is not part of this prototype yet`);

  return (
    <PlatformPage current="services" className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        <h1 className="sk-text-headline-large-bold text-sko-text-default">
          Here <span className="text-sko-text-subtle">to help.</span>
        </h1>

        <section
          aria-labelledby="services-mentor"
          data-mock={servicesMentor.mock}
          className="flex flex-col gap-4 rounded-lg border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6"
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
            <Button size="md" onClick={() => notInPrototype("Messaging your mentor")} className="max-md:h-11">
              Message your mentor
            </Button>
            <ButtonLink href={discussionHref()} hierarchy="secondary" size="md" className="max-md:h-11">
              Your discussions
            </ButtonLink>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {serviceSections.map((section) => (
            <section key={section.id} aria-labelledby={`services-${section.id}`} className="flex min-w-0 flex-col gap-4">
              <PlatformSectionHeader id={`services-${section.id}`} title={section.title} emphasis={section.emphasis} />
              <ul data-mock={section.mock} className="overflow-hidden rounded-lg border border-sko-border-subtle bg-sko-bg-page">
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
