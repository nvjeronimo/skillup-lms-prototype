"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { AccountShell } from "@/components/account/AccountShell";
import { useEdxScope } from "@/lib/edx-scope";
import { Icon } from "@/lib/icons";
import { editProfileSeed } from "@/lib/platform/profile";
import { DASHBOARD_HREF } from "@/lib/platform/routes";
import {
  GRACE_DAYS,
  SIGN_IN_HREF,
  SUPPORT_HREF,
  cancelDeletion,
  deletionDate,
  formatDay,
  readDeletionRequest,
} from "@/lib/account-deletion";

/**
 * After "Delete my account" (next-release item 3, Nelson 30 Oct 2026): the request is
 * acknowledged, the learner is told what happens next, with the real dates. Open edX shows a
 * one-line "we're sorry to see you go" modal here; this page is presentation of the same facts.
 */
export function DeletionRequestedView() {
  const router = useRouter();
  const edx = useEdxScope();
  const [requested, setRequested] = React.useState<Date | null>(null);
  React.useEffect(() => setRequested(readDeletionRequest() ?? new Date()), []);
  const today = requested ? formatDay(requested) : "Today";
  const deleteOn = requested ? formatDay(deletionDate(requested)) : `In ${GRACE_DAYS} days`;

  const steps = [
    { when: today, what: `You are signed out and can no longer use your account. We sent a confirmation to ${editProfileSeed.email}.` },
    {
      when: `Until ${deleteOn}`,
      what: edx
        ? "You can still keep your account: contact SkillUp support and ask us to cancel the deletion."
        : "You can still keep your account: sign in and choose to cancel the deletion.",
    },
    { when: deleteOn, what: "We delete your account and your learning data. It can't be restored after this." },
  ];

  return (
    <AccountShell>
      <div className="flex flex-col gap-3">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-sko-bg-success-soft text-sko-icon-success">
          <Icon icon={CircleCheck} size={24} />
        </span>
        <h1 className="sk-text-headline-small-semibold text-sko-text-default">We received your request</h1>
        <p className="sk-text-body-large-regular text-sko-text-muted">
          Your account will be deleted on <strong className="font-semibold text-sko-text-default">{deleteOn}</strong>,{" "}
          {GRACE_DAYS} days from today.
        </p>
      </div>

      <section aria-labelledby="next-title" className="flex flex-col gap-3">
        <h2 id="next-title" className="sk-text-title-medium-semibold text-sko-text-default">
          What happens next
        </h2>
        <ol className="flex flex-col gap-4 border-l border-sko-border-subtle pl-4">
          {steps.map((s) => (
            <li key={s.when} className="flex flex-col gap-0.5">
              <span className="sk-text-body-medium-semibold text-sko-text-default">{s.when}</span>
              <span className="sk-text-body-medium-regular text-sko-text-muted">{s.what}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-2 md:flex-row md:justify-end">
        {edx ? (
          <ButtonLink href={SUPPORT_HREF} hierarchy="secondary" className="max-md:w-full">
            Contact support
          </ButtonLink>
        ) : null}
        <ButtonLink href={SIGN_IN_HREF} hierarchy="primary" className="max-md:w-full">
          Go to sign in
        </ButtonLink>
      </div>

      {/* Prototype only: put the account back without going through sign in. */}
      <p className="sk-text-body-small-regular border-t border-sko-border-subtle pt-4 text-sko-text-subtle">
        Prototype:{" "}
        <Button
          type="button"
          hierarchy="link-subtle"
          size="sm"
          onClick={() => {
            cancelDeletion();
            router.push(DASHBOARD_HREF);
          }}
        >
          restore the account
        </Button>{" "}
        · <Link href={`${SIGN_IN_HREF}?account=pending-deletion`} className="underline">test link</Link>
      </p>
    </AccountShell>
  );
}
