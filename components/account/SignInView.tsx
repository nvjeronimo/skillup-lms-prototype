"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ButtonLink } from "@/components/atoms/ButtonLink";
import { AccountShell } from "@/components/account/AccountShell";
import { FIELD, FormField } from "@/components/organisms/FormModal";
import { useEdxScope } from "@/lib/edx-scope";
import { Icon } from "@/lib/icons";
import { editProfileSeed } from "@/lib/platform/profile";
import { DASHBOARD_HREF } from "@/lib/platform/routes";
import { useLmsStore } from "@/lib/store";
import {
  DELETION_REQUESTED_HREF,
  SUPPORT_HREF,
  cancelDeletion,
  deletionDate,
  formatDay,
  readDeletionRequest,
  requestDeletion,
} from "@/lib/account-deletion";

/**
 * A stand-in for the Open edX sign-in page (the authn MFE), so the deletion flow can be tried
 * end to end. Any password works. With an account pending deletion, signing in opens the
 * interstitial (next-release item 4, Nelson 30 Oct 2026):
 * - Beyond Open edX: the learner chooses to cancel the deletion and sign in, or keep it.
 * - Open edX scope: a retiring account is locked out; only support can cancel it, so the page
 *   says so (docs.openedx.org, "What is User Retirement?").
 * Test link: ?account=pending-deletion records a request today; ?account=active clears it.
 */
export function SignInView() {
  const router = useRouter();
  const params = useSearchParams();
  const edx = useEdxScope();
  const showToast = useLmsStore((s) => s.showToast);
  const [email, setEmail] = React.useState(editProfileSeed.email);
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState<Date | null>(null);
  const [step, setStep] = React.useState<"form" | "scheduled">("form");

  React.useEffect(() => {
    const q = params.get("account");
    if (q === "pending-deletion") requestDeletion();
    else if (q === "active") cancelDeletion();
    setPending(readDeletionRequest());
  }, [params]);

  const deleteOn = pending ? formatDay(deletionDate(pending)) : "";

  if (step === "scheduled" && pending) {
    return (
      <AccountShell>
        <div className="flex flex-col gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-sko-bg-warning-soft text-sko-icon-warning">
            <Icon icon={CalendarClock} size={24} />
          </span>
          <h1 className="sk-text-headline-small-semibold text-sko-text-default">
            Your account is scheduled for deletion
          </h1>
          <p className="sk-text-body-large-regular text-sko-text-muted">
            We will delete it on <strong className="font-semibold text-sko-text-default">{deleteOn}</strong>, with
            your courses, progress and certificates.
          </p>
        </div>

        {edx ? (
          <>
            <p className="sk-text-body-large-regular text-sko-text-muted">
              You can&rsquo;t sign in while the deletion is pending. To keep your account, contact SkillUp support
              before {deleteOn}.
            </p>
            <div className="flex flex-col gap-2 md:flex-row md:justify-end">
              <Button type="button" hierarchy="secondary" className="max-md:w-full" onClick={() => setStep("form")}>
                Back
              </Button>
              <ButtonLink href={SUPPORT_HREF} hierarchy="primary" className="max-md:w-full">
                Contact support
              </ButtonLink>
            </div>
          </>
        ) : (
          <div
            data-invented="account deletion: Open edX locks a retiring account out; only support can cancel the request"
            className="flex flex-col gap-6"
          >
            <p className="sk-text-body-large-regular text-sko-text-muted">
              If you sign in, we cancel the deletion and your account is active again, with everything as you left
              it. If you want it deleted, keep the deletion and don&rsquo;t sign in.
            </p>
            <div className="flex flex-col gap-2 md:flex-row md:justify-end">
              <ButtonLink href={DELETION_REQUESTED_HREF} hierarchy="secondary" className="max-md:w-full">
                Keep the deletion
              </ButtonLink>
              <Button
                type="button"
                hierarchy="primary"
                className="max-md:w-full"
                onClick={() => {
                  cancelDeletion();
                  showToast("Deletion cancelled. Your account is active again.");
                  router.push(DASHBOARD_HREF);
                }}
              >
                Cancel deletion and sign in
              </Button>
            </div>
          </div>
        )}
      </AccountShell>
    );
  }

  return (
    <AccountShell>
      <h1 className="sk-text-headline-small-semibold text-sko-text-default">Sign in</h1>
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (readDeletionRequest()) {
            setPending(readDeletionRequest());
            setStep("scheduled");
          } else router.push(DASHBOARD_HREF);
        }}
      >
        <FormField id="signin-email" label="Email">
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={FIELD}
          />
        </FormField>
        <FormField id="signin-password" label="Password" hint="Prototype: any password works.">
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="signin-password-hint"
            required
            className={FIELD}
          />
        </FormField>
        <Button type="submit" hierarchy="primary" className="w-full" disabled={!email || !password}>
          Sign in
        </Button>
      </form>
    </AccountShell>
  );
}
