import * as React from "react";
import Link from "@/lib/router";
import { useRouter } from "@/lib/router";
import { ArrowUpRight, ChevronRight, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { NotInEdx } from "@/components/edx-scope/NotInEdx";
import { useEdxScope } from "@/lib/edx-scope";
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
import styles from "./ServicesView.module.css";

const CARD = styles.card;
const EYEBROW = cn("sk-text-label-small-semibold", styles.eyebrow);
const LINK = cn("sk-text-body-medium-semibold", styles.link);

/** The action of a service: a link (an internal page or a new tab) or a button. */
function ServiceAction({ item, onAction, className }: { item: ServiceItem; onAction: (item: ServiceItem) => void; className?: string }) {
  const label = (
    <>
      {item.action}
      {item.external ? <Icon icon={ArrowUpRight} size={16} aria-hidden="true" /> : null}
      {item.external ? <span className="sk-sr-only"> (opens in a new tab)</span> : null}
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
    <li className={styles.request}>
      <div className={styles.requestText}>
        <p className={cn("sk-text-body-medium-semibold", styles.ink)}>{request.subject}</p>
        <p className={cn("sk-text-body-small-regular", styles.subtle)}>
          Request {request.number} · {request.opened}
          {request.course ? ` · ${request.course}` : ""}
        </p>
      </div>
      <Badge color={request.status.color} className={styles.noShrink}>
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
    <div className={cn("sk-page-stack", styles.stack)}>
      <Skeleton variant="ghost" text="headline-large-bold">Here to help.</Skeleton>
      <div className={styles.helpGrid}>
        {["Your mentor", "Support"].map((label) => (
          <div key={label} className={cn(CARD, styles.cardGap4)}>
            <Skeleton variant="ghost" text="label-small-semibold">{label}</Skeleton>
            <div className={styles.person}>
              <Skeleton variant="circle" size={48} />
              <div className={styles.stack1}>
                <Skeleton variant="ghost" text="title-large-semibold">{servicesMentor.name}</Skeleton>
                <Skeleton variant="ghost" text="body-medium-regular">{servicesMentor.role}</Skeleton>
              </div>
            </div>
            <div className={styles.skeletonActions}>
              <SkeletonPill size="button-md">Ask your mentor</SkeletonPill>
              <SkeletonPill size="button-md">Your discussions</SkeletonPill>
            </div>
          </div>
        ))}
      </div>
      <Skeleton variant="ghost" text="headline-small-bold">Included with your program</Skeleton>
      <div className={styles.includedGrid}>
        {includedServices.map((item) => (
          <div key={item.id} className={cn(CARD, styles.cardGap3)}>
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
 *    person who answers this learner — with the last message and Ask your mentor (Primary, to the course's Mentorship Q&A);
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
  const edx = useEdxScope();

  const onAction = (item: ServiceItem) => {
    if (item.id === "cv" || item.id === "interview") setBooking(item.id);
    else if (item.id === "contact") setContacting(true);
    else notInPrototype(item.action);
  };

  // Open edX scope: nothing behind this page (its modals go with it).
  if (edx) {
    return (
      <PlatformPage current="services">
        <NotInEdx
          title="Services"
          reason="Mentoring, coaching, support requests and included services have no Open edX feature behind them."
        />
      </PlatformPage>
    );
  }

  return (
    <PlatformPage
      current="services"
      className={styles.page}
      skeleton={<ServicesSkeleton />}
    >
      <div className={cn("sk-page-stack", styles.stack)}>
        <h1 data-arrive={0} className={cn("sk-text-headline-large-bold", styles.ink)}>
          Here <span data-heading-em="" className={styles.subtle}>to help.</span>
        </h1>

        {/* 1 · Help now */}
        <div data-arrive={1} className={cn(styles.helpGrid, styles.stretch)}>
          <section aria-labelledby="services-mentor" data-mock={servicesMentor.mock} className={cn(CARD, styles.cardGap4)}>
            <p className={EYEBROW}>Your mentor</p>
            <div className={styles.person}>
              <Avatar name={servicesMentor.name} size="lg" />
              <div className={styles.personText}>
                <h2 id="services-mentor" className={cn("sk-text-title-large-semibold", styles.ink)}>
                  {servicesMentor.name}
                </h2>
                <p className={cn("sk-text-body-medium-regular", styles.subtle)}>
                  {/* The eyebrow already says "Your mentor". */}
                  {servicesMentor.role.replace(/^Your mentor · /, "")} · {servicesMentor.promise}
                </p>
              </div>
            </div>
            <p className={cn("sk-text-body-medium-regular", styles.lastMessage)}>
              <Icon icon={MessageCircle} size={16} className={styles.lastMessageIcon} aria-hidden="true" />
              <span>
                <span className={cn("sk-text-body-small-semibold", styles.ink)}>{servicesMentor.last.from}:</span> “
                {servicesMentor.last.text}” · {servicesMentor.last.when}
              </span>
            </p>
            <div className={styles.mentorActions}>
              {/* Asking the mentor is the course's Mentorship Q&A: question posts in the course discussions, public to the course (Open edX has no private messages, 28 Oct 2026). */}
              <ButtonLink href={`${coursePageHref("ai-driven-content-and-brand-communication")}?tab=qa`} size="md" className={styles.phoneTall}>
                Ask your mentor
              </ButtonLink>
              <ButtonLink href={discussionHref()} hierarchy="secondary" size="md" className={styles.phoneTall}>
                Your discussions
              </ButtonLink>
            </div>
          </section>

          <section aria-labelledby="services-support" data-mock={supportMock} className={cn(CARD, styles.cardGap4)}>
            <p className={EYEBROW}>Support</p>
            <div className={styles.stack1}>
              <h2 id="services-support" className={cn("sk-text-title-large-semibold", styles.ink)}>
                Something not working?
              </h2>
              <p className={cn("sk-text-body-medium-regular", styles.subtle)}>{contactSupport.description}</p>
            </div>
            <div className={styles.supportActions}>
              <Button hierarchy="secondary" size="md" onClick={() => setContacting(true)} className={styles.phoneTall}>
                {contactSupport.action}
              </Button>
              <ServiceAction item={helpCenter} onAction={onAction} className={styles.helpCenter} />
            </div>
            <div className={styles.requests}>
              <h3 className={EYEBROW}>Your requests</h3>
              {requests.length ? (
                <ul>
                  {requests.map((r) => (
                    <RequestRow key={r.id} request={r} />
                  ))}
                </ul>
              ) : (
                <p className={cn("sk-text-body-medium-regular", styles.noRequests)}>No open requests.</p>
              )}
            </div>
          </section>
        </div>

        {/* 2 · Included with your program */}
        <section data-arrive={2} aria-labelledby="services-included" className={styles.section4}>
          <PlatformSectionHeader id="services-included" title="Included" emphasis="with your program" />
          <ul data-mock={includedMock} className={styles.includedGrid}>
            {includedServices.map((item) => {
              const booked = item.id === "cv" ? cvBooked : undefined;
              return (
                <li key={item.id} className={cn(CARD, styles.cardGap3)}>
                  <div className={styles.includedTop}>
                    <span
                      aria-hidden
                      className={styles.includedIcon}
                    >
                      <Icon icon={item.icon} size={20} />
                    </span>
                    {booked ? (
                      <Badge color="info">{`Booked · ${formatDay(booked.date)}`}</Badge>
                    ) : item.status ? (
                      <Badge color={item.status.color}>{item.status.label}</Badge>
                    ) : null}
                  </div>
                  <div className={styles.stack1}>
                    <h3 className={cn("sk-text-body-large-semibold", styles.ink)}>{item.title}</h3>
                    <p className={cn("sk-text-body-medium-regular", styles.subtle)}>{item.description}</p>
                  </div>
                  {booked ? (
                    <p className={cn("sk-text-body-small-medium", styles.bookedNote)}>
                      {formatDay(booked.date)}, {formatTime(booked.time)} · in your Calendar
                    </p>
                  ) : (
                    <ServiceAction item={item} onAction={onAction} className={styles.pushDown} />
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* 3 · More from SkillUp: quiet one-line links */}
        <section data-arrive={3} aria-labelledby="services-more" className={styles.section3}>
          <h2 id="services-more" className={cn("sk-text-body-large-semibold", styles.ink)}>
            More from SkillUp
          </h2>
          {/* One 1fr column on a phone: an implicit column sized to the longest description ran the
              rows past the screen and hid their chevrons (Nelson, 28 Oct 2026). */}
          <ul data-mock={moreMock} className={styles.moreList}>
            {moreServices.map((item) => {
              const inner = (
                <>
                  <Icon icon={item.icon} size={20} className={styles.moreIcon} aria-hidden="true" />
                  <span className={styles.moreText}>
                    <span className={cn("sk-text-body-medium-semibold", styles.ink)}>{item.title}</span>
                    <span className={cn("sk-text-body-small-regular", styles.subtle)}>{item.description}</span>
                  </span>
                  <Icon icon={item.external ? ArrowUpRight : ChevronRight} size={16} className={styles.moreIcon} aria-hidden="true" />
                  {item.external ? <span className="sk-sr-only"> (opens in a new tab)</span> : null}
                </>
              );
              const row = styles.moreRow;
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
