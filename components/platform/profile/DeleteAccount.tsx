"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { FIELD, FormField, FormModal } from "@/components/organisms/FormModal";
import { useEdxScope } from "@/lib/edx-scope";
import {
  DELETION_REQUESTED_HREF,
  GRACE_DAYS,
  deletionDate,
  formatDay,
  requestDeletion,
} from "@/lib/account-deletion";

/** What the learner loses, in the order it matters to them (Step 1). */
const LOSES = [
  "Your courses and programs, and access to any you have paid for",
  "Your progress, grades, notes and bookmarks",
  "Your certificates: download any you want to keep before you go",
  "Your profile. Your posts in discussions stay, without your name",
];

/**
 * Delete account (Nelson, 30 Oct 2026: try the next-release flow). The section closes Edit
 * profile, as Open edX's Account settings ends with "Delete my account". Two steps in one modal:
 * 1 · what you lose and the 14-day grace period, acknowledged with a checkbox;
 * 2 · the password (Open edX asks for it) and the exact date the account is deleted.
 * Submitting records the request (lib/account-deletion), signs the learner out and opens the
 * confirmation page. Nothing is sent.
 */
export function DeleteAccountSection({ email }: { email: string }) {
  const router = useRouter();
  const edx = useEdxScope();
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<1 | 2>(1);
  const [understood, setUnderstood] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const deleteOn = formatDay(deletionDate(new Date()));

  const close = () => {
    setOpen(false);
    setStep(1);
    setUnderstood(false);
    setPassword("");
  };

  return (
    <section
      data-arrive={4}
      aria-labelledby="delete-account-title"
      className="rounded-card border border-sko-border-subtle bg-sko-bg-page"
    >
      <div className="flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6 md:py-6">
        <div className="flex flex-col gap-1">
          <h2 id="delete-account-title" className="sk-text-title-medium-semibold text-sko-text-default">
            Delete account
          </h2>
          <p className="sk-text-body-medium-regular text-sko-text-subtle">
            Your account and your learning data are deleted {GRACE_DAYS} days after you ask.
          </p>
        </div>
        <Button
          type="button"
          tone="destructive"
          hierarchy="secondary"
          leftIcon={Trash2}
          className="shrink-0 max-md:w-full"
          onClick={() => setOpen(true)}
        >
          Delete my account
        </Button>
      </div>

      <FormModal
        open={open}
        onClose={close}
        title={step === 1 ? "Delete your account?" : "Confirm with your password"}
        description={`Step ${step} of 2`}
        submitLabel={step === 1 ? "Continue" : "Delete my account"}
        submitTone={step === 1 ? "brand" : "destructive"}
        canSubmit={step === 1 ? understood : password.length > 0}
        secondaryAction={step === 2 ? { label: "Back", onClick: () => setStep(1) } : undefined}
        onSubmit={() => {
          if (step === 1) {
            setStep(2);
            return;
          }
          requestDeletion();
          close();
          router.push(DELETION_REQUESTED_HREF);
        }}
      >
        {step === 1 ? (
          <>
            <div className="flex flex-col gap-2">
              <p className="sk-text-body-large-medium text-sko-text-default">When your account is deleted, you lose:</p>
              <ul className="sk-text-body-large-regular flex list-disc flex-col gap-1.5 pl-5 text-sko-text-muted">
                {LOSES.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <p className="sk-text-body-large-regular text-sko-text-muted">
              You have {GRACE_DAYS} days to change your mind. After that, we can&rsquo;t restore your account or
              anything in it.
            </p>
            <label className="flex cursor-pointer items-start gap-3 rounded-control border border-sko-border-subtle p-3">
              <input
                id="delete-understood"
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-bg-primary)]"
              />
              <span className="sk-text-body-large-regular text-sko-text-default">
                I understand that my account and learning data will be deleted for good after {GRACE_DAYS} days.
              </span>
            </label>
          </>
        ) : (
          <>
            <p className="sk-text-body-large-regular text-sko-text-default">
              We will delete your account on <strong className="font-semibold">{deleteOn}</strong>. We sign you out
              now and send a confirmation to {email}.
            </p>
            <p className="sk-text-body-large-regular text-sko-text-muted">
              {edx
                ? "Until then, you can keep your account by contacting SkillUp support."
                : "Until then, you can keep your account: sign in again and choose to cancel the deletion."}
            </p>
            <FormField id="delete-password" label="Password" hint="To confirm it is you.">
              <input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="delete-password-hint"
                className={FIELD}
              />
            </FormField>
          </>
        )}
      </FormModal>
    </section>
  );
}
