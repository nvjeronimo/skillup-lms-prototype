import * as React from "react";
import { useRouter, useSearchParams } from "@/lib/router";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/v1/base-components/buttons/Button";
import { ButtonLink } from "@/components/v1/base-components/buttons/ButtonLink";
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
import styles from "./SignInView.module.css";

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
        <div className={styles.stack3}>
          <span className={styles.badge}>
            <Icon icon={CalendarClock} size={24} />
          </span>
          <h1 className={`sk-text-headline-small-semibold ${styles.title}`}>
            Your account is scheduled for deletion
          </h1>
          <p className={`sk-text-body-large-regular ${styles.text}`}>
            We will delete it on <strong className={`sk-text-body-large-semibold ${styles.strong}`}>{deleteOn}</strong>, with
            your courses, progress and certificates.
          </p>
        </div>

        {edx ? (
          <>
            <p className={`sk-text-body-large-regular ${styles.text}`}>
              You can&rsquo;t sign in while the deletion is pending. To keep your account, contact SkillUp support
              before {deleteOn}.
            </p>
            <div className={styles.actions}>
              <Button hierarchy="secondary" className={styles.action} onClick={() => setStep("form")}>
                Back
              </Button>
              <ButtonLink href={SUPPORT_HREF} hierarchy="primary" className={styles.action}>
                Contact support
              </ButtonLink>
            </div>
          </>
        ) : (
          <div
            data-invented="account deletion: Open edX locks a retiring account out; only support can cancel the request"
            className={styles.stack6}
          >
            <p className={`sk-text-body-large-regular ${styles.text}`}>
              If you sign in, we cancel the deletion and your account is active again, with everything as you left
              it. If you want it deleted, keep the deletion and don&rsquo;t sign in.
            </p>
            <div className={styles.actions}>
              <ButtonLink href={DELETION_REQUESTED_HREF} hierarchy="secondary" className={styles.action}>
                Keep the deletion
              </ButtonLink>
              <Button
                hierarchy="primary"
                className={styles.action}
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
      <h1 className={`sk-text-headline-small-semibold ${styles.title}`}>Sign in</h1>
      <form
        className={styles.form}
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
        <Button htmlType="submit" hierarchy="primary" fullWidth disabled={!email || !password}>
          Sign in
        </Button>
      </form>
    </AccountShell>
  );
}
