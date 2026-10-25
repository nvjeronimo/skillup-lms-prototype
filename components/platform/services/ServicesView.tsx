"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ChevronRight, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSectionHeader } from "@/components/platform/PlatformSectionHeader";
import { BookSessionModal, type BookableService } from "@/components/platform/forms/BookSessionModal";
import { ContactSupportModal } from "@/components/platform/forms/ContactSupportModal";
import { discussionHref } from "@/lib/platform/discussion";
import { coursePageHref } from "@/lib/platform/hrefs";
import {
  contactSupport,
  helpCenter,
  includedMock,
  includedServices,
  moreMock,
  moreServices,
  openRequests,
  servicesMentor,
  supportMock,
  type ServiceItem,
  type SupportRequest,
} from "@/lib/platform/services";
import { sessionAdditions, useSessionAdditions } from "@/lib/platform/session-additions";
import { Icon } from "@/lib/icons";
import { formatDay, formatTime } from "@/lib/sample-time";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const CARD = "rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 md:p-5 lg:p-6";
const EYEBROW = "sk-text-label-small-semibold uppercase text-sko-text-subtle";
const LINK =
  "sk-text-body-medium-semibold inline-flex min-h-6 items-center gap-1 self-start text-sko-text-primary underline-offset-4 hover:underline max-md:min-h-11";

/** The action of a service: a link (an internal page or a new tab) or a button. */
function ServiceAction({ item, onAction, className }: { item: ServiceItem; onAction: (item: ServiceItem) => void; className?: string }) {
  const label = (
    <>
      {item.action}
      {item.external ? <Icon icon={ArrowUpRight} size={16} aria-hidden="true" /> : null}
      {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  );
  return item.href ? (
    <Link href={item.href} className={cn(LINK, className)}>
      {label}
    </Link>
  ) : (
    <button type="button" onClick={() => onAction(item)} className={cn(LINK, className)}>
      {label}
    </button>
  );
}

/** One open request: subject, number and course, its state. */
function RequestRow({ request }: { request: SupportRequest }) {
  return (
    <li className="flex items-start justify-between gap-3 border-t border-sko-border-subtle py-3 first:border-t-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="sk-text-body-medium-semibold text-sko-text-default">{request.subject}</p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">
          Request {request.number} · {request.opened}
          {request.course ? ` · ${request.course}` : ""}
        </p>
      </div>
      <Badge color={request.status.color} className="shrink-0">
        {request.status.label}
      </Badge>
    </li>
  );
}

/**
 * Services while it loads (motion-matrix §7.9): the page's geometry from the same data — the
 * title, the two "help now" cards, the included cards.
 */
function ServicesSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
      <Skeleton variant="ghost" text="headline-large-bold">Here to help.</Skeleton>
      <div className="grid gap-layout-column lg:grid-cols-2">
        {["Your mentor", "Support"].map((label) => (
          <div key={label} className={cn(CARD, "flex flex-col gap-4")}>
            <Skeleton variant="ghost" text="label-small-semibold">{label}</Skeleton>
            <div className="flex items-start gap-4">
              <Skeleton variant="circle" size={48} />
              <div className="flex flex-col gap-1">
                <Skeleton variant="ghost" text="title-large-semibold">{servicesMentor.name}</Skeleton>
                <Skeleton variant="ghost" text="body-medium-regular">{servicesMentor.role}</Skeleton>
              </div>
            </div>
            <div className="flex gap-2">
              <SkeletonPill size="button-md">Message your mentor</SkeletonPill>
              <SkeletonPill size="button-md">Your discussions</SkeletonPill>
            </div>
          </div>
        ))}
      </div>
      <Skeleton variant="ghost" text="headline-small-bold">Included with your program</Skeleton>
      <div className="grid gap-layout-grid md:grid-cols-3">
        {includedServices.map((item) => (
          <div key={item.id} className={cn(CARD, "flex flex-col gap-3")}>
            <Skeleton variant="block" width={40} height={40} radius="control" />
            <Skeleton variant="ghost" text="body-large-semibold">{item.title}</Skeleton>
            <Skeleton variant="ghost" text="body-small-regular">{item.description}</Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Services (proposal, 17 Oct 2026; reorganised by weight on 23 Oct 2026, Nelson: "too confusing,
 * too much on one level: what matters most must stand out, the rest in the background").
 * 1. Help now, two cards side by side from desktop (stacked below): the mentor — the one
 *    person who answers this learner — with the last message and Message your mentor (Primary);
 *    and support — Write to us, the help center, and the learner's open requests with their state.
 * 2. Included with your program: what the learner already has and should use (CV review,
 *    Azure credits, IBM badge), each a card with its state and one action; three across from
 *    tablet.
 * 3. More from SkillUp: everything else as quiet one-line links (interview practice, job
 *    board, LinkedIn, sandbox, certificates), two or three across.
 * Nothing here is Open edX, so each block carries the SAMPLE mark with what it needs.
 * Write to us and the two bookings open their modals (PR 300): a request joins the support
 * list, a CV review booking shows on its card and in the Calendar, for the session.
 */
export function ServicesView() {
  const showToast = useLmsStore((s) => s.showToast);
  const router = useRouter();
  const notInPrototype = (what: string) => showToast(`${what} is not part of this prototype yet`);
  const [booking, setBooking] = React.useState<BookableService | null>(null);
  const [contacting, setContacting] = React.useState(false);
  const sentRequests = useSessionAdditions((s) => s.requests);
  const bookings = useSessionAdditions((s) => s.bookings);
  const requests = React.useMemo<SupportRequest[]>(
    () => [
      ...sentRequests.map((r) => ({
        id: r.id,
        number: r.number,
        subject: r.subject,
        opened: "opened today",
        course: r.course,
        status: { label: "In progress", color: "warning" as const },
      })),
      ...openRequests,
    ],
    [sentRequests],
  );
  const cvBooked = bookings.find((b) => b.service === "CV review");

  const onAction = (item: ServiceItem) => {
    if (item.id === "cv" || item.id === "interview") setBooking(item.id);
    else if (item.id === "contact") setContacting(true);
    else notInPrototype(item.action);
  };

  return (
    <PlatformPage
      current="services"
      className="px-layout-page-x pb-12 pt-layout-page-top md:pb-16 lg:pb-20"
      skeleton={<ServicesSkeleton />}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
        <h1 data-arrive={0} className="sk-text-headline-large-bold text-sko-text-default">
          Here <span data-heading-em="" className="text-sko-text-subtle">to help.</span>
        </h1>

        {/* 1 · Help now */}
        <div data-arrive={1} className="grid items-stretch gap-layout-column lg:grid-cols-2">
          <section aria-labelledby="services-mentor" data-mock={servicesMentor.mock} className={cn(CARD, "flex flex-col gap-4")}>
            <p className={EYEBROW}>Your mentor</p>
            <div className="flex items-start gap-4">
              <Avatar name={servicesMentor.name} size="lg" />
              <div className="flex min-w-0 flex-col gap-1">
                <h2 id="services-mentor" className="sk-text-title-large-semibold text-sko-text-default">
                  {servicesMentor.name}
                </h2>
                <p className="sk-text-body-medium-regular text-sko-text-subtle">
                  {/* The eyebrow already says "Your mentor". */}
                  {servicesMentor.role.replace(/^Your mentor · /, "")} · {servicesMentor.promise}
                </p>
              </div>
            </div>
            <p className="sk-text-body-small-regular flex items-start gap-1.5 rounded-card-inset bg-sko-bg-subtle p-3 text-sko-text-muted">
              <Icon icon={MessageCircle} size={16} className="mt-0.5 shrink-0 text-sko-icon-subtle" aria-hidden="true" />
              <span>
                <span className="sk-text-body-small-semibold text-sko-text-default">{servicesMentor.last.from}:</span> “
                {servicesMentor.last.text}” · {servicesMentor.last.when}
              </span>
            </p>
            <div className="mt-auto flex flex-col gap-2 sm:flex-row">
              {/* Nelson, 21 Oct 2026: messaging the mentor is the course's private Mentorship Q&A. */}
              <ButtonLink href={`${coursePageHref("ai-driven-content-and-brand-communication")}?tab=qa`} size="md" className="max-md:h-11">
                Message your mentor
              </ButtonLink>
              <ButtonLink href={discussionHref()} hierarchy="secondary" size="md" className="max-md:h-11">
                Your discussions
              </ButtonLink>
            </div>
          </section>

          <section aria-labelledby="services-support" data-mock={supportMock} className={cn(CARD, "flex flex-col gap-4")}>
            <p className={EYEBROW}>Support</p>
            <div className="flex flex-col gap-1">
              <h2 id="services-support" className="sk-text-title-large-semibold text-sko-text-default">
                Something not working?
              </h2>
              <p className="sk-text-body-medium-regular text-sko-text-subtle">{contactSupport.description}</p>
            </div>
            <div className="flex flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-center">
              <Button hierarchy="secondary" size="md" onClick={() => setContacting(true)} className="max-md:h-11">
                {contactSupport.action}
              </Button>
              <ServiceAction item={helpCenter} onAction={onAction} className="sm:self-center" />
            </div>
            <div className="mt-auto flex flex-col gap-1">
              <h3 className={EYEBROW}>Your requests</h3>
              {requests.length ? (
                <ul>
                  {requests.map((r) => (
                    <RequestRow key={r.id} request={r} />
                  ))}
                </ul>
              ) : (
                <p className="sk-text-body-small-regular py-3 text-sko-text-subtle">No open requests.</p>
              )}
            </div>
          </section>
        </div>

        {/* 2 · Included with your program */}
        <section data-arrive={2} aria-labelledby="services-included" className="flex flex-col gap-4">
          <PlatformSectionHeader id="services-included" title="Included" emphasis="with your program" />
          <ul data-mock={includedMock} className="grid gap-layout-grid md:grid-cols-3">
            {includedServices.map((item) => {
              const booked = item.id === "cv" ? cvBooked : undefined;
              return (
                <li key={item.id} className={cn(CARD, "flex flex-col gap-3")}>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      aria-hidden
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-control bg-sko-bg-primary-soft text-sko-icon-primary"
                    >
                      <Icon icon={item.icon} size={20} />
                    </span>
                    {booked ? (
                      <Badge color="info">{`Booked · ${formatDay(booked.date)}`}</Badge>
                    ) : item.status ? (
                      <Badge color={item.status.color}>{item.status.label}</Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="sk-text-body-large-semibold text-sko-text-default">{item.title}</h3>
                    <p className="sk-text-body-small-regular text-sko-text-subtle">{item.description}</p>
                  </div>
                  {booked ? (
                    <p className="sk-text-body-small-medium mt-auto text-sko-text-muted">
                      {formatDay(booked.date)}, {formatTime(booked.time)} · in your Calendar
                    </p>
                  ) : (
                    <ServiceAction item={item} onAction={onAction} className="mt-auto" />
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* 3 · More from SkillUp: quiet one-line links */}
        <section data-arrive={3} aria-labelledby="services-more" className="flex flex-col gap-3">
          <h2 id="services-more" className="sk-text-body-large-semibold text-sko-text-default">
            More from SkillUp
          </h2>
          <ul data-mock={moreMock} className="grid border-t border-sko-border-subtle sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">
            {moreServices.map((item) => {
              const inner = (
                <>
                  <Icon icon={item.icon} size={20} className="shrink-0 text-sko-icon-subtle" aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="sk-text-body-medium-semibold text-sko-text-default">{item.title}</span>
                    <span className="sk-text-body-small-regular truncate text-sko-text-subtle">{item.description}</span>
                  </span>
                  <Icon icon={item.external ? ArrowUpRight : ChevronRight} size={16} className="shrink-0 text-sko-icon-subtle" aria-hidden="true" />
                  {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </>
              );
              const row =
                "flex min-h-14 w-full items-center gap-3 border-b border-sko-border-subtle px-1 py-3 text-left transition-colors hover:bg-sko-bg-hover";
              return (
                <li key={item.id}>
                  {item.href ? (
                    <Link href={item.href} className={row}>
                      {inner}
                    </Link>
                  ) : (
                    <button type="button" onClick={() => onAction(item)} className={row}>
                      {inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <BookSessionModal
        service={booking ?? "cv"}
        open={booking !== null}
        onClose={() => setBooking(null)}
        onBooked={(b) => {
          sessionAdditions.addBooking(b);
          setBooking(null);
          showToast(`${b.service} booked for ${formatDay(b.date)}, ${formatTime(b.time)}.`, {
            actionLabel: "View in Calendar",
            onAction: () => router.push("/platform/calendar"),
          });
        }}
      />
      <ContactSupportModal
        open={contacting}
        onClose={() => setContacting(false)}
        onSent={(r) => {
          const full = sessionAdditions.addRequest(r);
          setContacting(false);
          showToast(`Request ${full.number} sent. We'll reply by email within one business day.`);
        }}
      />
    </PlatformPage>
  );
}
