import * as React from "react";
import Link from "@/lib/router";
import { useRouter } from "@/lib/router";
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
import styles from "./DeletionRequestedView.module.css";

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
      <div className={styles.stack3}>
        <span className={styles.badge}>
          <Icon icon={CircleCheck} size={24} />
        </span>
        <h1 className={`sk-text-headline-small-semibold ${styles.title}`}>We received your request</h1>
        <p className={`sk-text-body-large-regular ${styles.text}`}>
          Your account will be deleted on <strong className={`sk-text-body-large-semibold ${styles.strong}`}>{deleteOn}</strong>,{" "}
          {GRACE_DAYS} days from today.
        </p>
      </div>

      <section aria-labelledby="next-title" className={styles.stack3}>
        <h2 id="next-title" className={`sk-text-title-medium-semibold ${styles.title}`}>
          What happens next
        </h2>
        <ol className={styles.steps}>
          {steps.map((s) => (
            <li key={s.when} className={styles.step}>
              <span className={`sk-text-body-medium-semibold ${styles.title}`}>{s.when}</span>
              <span className={`sk-text-body-medium-regular ${styles.text}`}>{s.what}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.actions}>
        {edx ? (
          <ButtonLink href={SUPPORT_HREF} hierarchy="secondary" className={styles.action}>
            Contact support
          </ButtonLink>
        ) : null}
        <ButtonLink href={SIGN_IN_HREF} hierarchy="primary" className={styles.action}>
          Go to sign in
        </ButtonLink>
      </div>

      {/* Prototype only: put the account back without going through sign in. */}
      <p className={`sk-text-body-small-regular ${styles.note}`}>
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
        · <Link href={`${SIGN_IN_HREF}?account=pending-deletion`} className={styles.noteLink}>test link</Link>
      </p>
    </AccountShell>
  );
}
