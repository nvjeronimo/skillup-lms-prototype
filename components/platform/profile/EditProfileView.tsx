"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Trash2, Upload } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { SelectField } from "@/components/atoms/SelectField";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSegmented } from "@/components/platform/PlatformSegmented";
import {
  editProfileSeed,
  PROFILE_OPTIONS,
  BIO_MAX,
  type EditProfileForm,
} from "@/lib/platform/profile";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* DS Input field, Size=md with a label (as NoteEditorModal): label body-medium/Medium text/muted,
   the field bg/page, 1px border/default, radius 8, padding 10/14, body-large/Regular, 44 tall.
   Focus: border/primary. Read-only: bg/muted, text/subtle. */
const FIELD =
  "sk-text-body-large-regular min-h-11 w-full rounded-control border border-sko-border-default bg-sko-bg-page px-3.5 py-2.5 text-sko-text-default shadow-sm placeholder:text-sko-text-placeholder transition-[border-color,box-shadow] focus:border-sko-border-primary focus:outline-none focus:ring-1 focus:ring-sko-border-primary";
const READ_ONLY = "bg-sko-bg-muted text-sko-text-subtle shadow-none";

function Field({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="sk-text-body-medium-medium text-sko-text-muted">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="sk-text-body-small-regular text-sko-text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <SelectField id={id} value={value} onChange={(e) => onChange(e.target.value)} className={FIELD}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </SelectField>
  );
}

/** One section of the page: a card on bg/page with its title and a line on what it holds. */
function Section({
  id,
  step,
  title,
  lead,
  children,
}: {
  id: string;
  /** Its place in the first-visit cascade (motion-matrix §7.9). */
  step: number;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-arrive={step}
      aria-labelledby={id}
      className="rounded-card border border-sko-border-subtle bg-sko-bg-page"
    >
      <header className="flex flex-col gap-1 border-b border-sko-border-subtle px-4 py-4 md:px-6 md:py-5">
        <h2 id={id} className="sk-text-title-medium-semibold text-sko-text-default">
          {title}
        </h2>
        <p className="sk-text-body-medium-regular text-sko-text-subtle">{lead}</p>
      </header>
      <div className="grid grid-cols-1 gap-5 px-4 py-5 md:grid-cols-2 md:px-6 md:py-6">
        {children}
      </div>
    </section>
  );
}

/** A labelled field while it loads: the ghost label, the field's box (46 tall, as FIELD), the hint. */
function FieldSkeleton({ label, hint, rows, className }: { label: string; hint?: string; rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Skeleton variant="ghost" text="body-medium-medium">{label}</Skeleton>
      <Skeleton variant="block" radius="control" height={rows ? rows * 24 + 22 : 46} />
      {hint ? <Skeleton variant="ghost" text="body-small-regular">{hint}</Skeleton> : null}
    </div>
  );
}

function SectionSkeleton({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-sko-border-subtle bg-sko-bg-page">
      <div className="flex flex-col gap-1 border-b border-sko-border-subtle px-4 py-4 md:px-6 md:py-5">
        <Skeleton variant="ghost" text="title-medium-semibold">{title}</Skeleton>
        <Skeleton variant="ghost" text="body-medium-regular">{lead}</Skeleton>
      </div>
      <div className="grid grid-cols-1 gap-5 px-4 py-5 md:grid-cols-2 md:px-6 md:py-6">{children}</div>
    </div>
  );
}

/**
 * Edit profile while it loads (motion-matrix §7.9): the form's column, its two sections and their
 * fields at the fields' own heights, the labels and hints as ghost lines, and the actions.
 */
function EditProfileSkeleton() {
  const f = editProfileSeed;
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton variant="ghost" text="headline-large-bold">Edit profile</Skeleton>
        <Skeleton variant="ghost" text="body-large-regular">
          What other learners and your instructors see, and how you sign in.
        </Skeleton>
      </div>
      <SectionSkeleton title="Your profile" lead="Shown next to your posts, answers and certificates.">
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <Skeleton variant="block" width={48} height={48} radius="control" />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <SkeletonPill size="button-sm" icon className="max-md:h-11">Upload photo</SkeletonPill>
              <SkeletonPill size="button-sm" icon className="max-md:h-11">Remove</SkeletonPill>
            </div>
            <Skeleton variant="ghost" text="body-small-regular">JPG or PNG, up to 1 MB.</Skeleton>
          </div>
        </div>
        <FieldSkeleton label="Username" hint="Your username can't be changed." />
        <FieldSkeleton label="Country" />
        <FieldSkeleton label="Spoken language" />
        <FieldSkeleton label="Education" />
        <FieldSkeleton label="About me" rows={4} hint={`${f.bio.length} / ${BIO_MAX} characters`} className="md:col-span-2" />
        <FieldSkeleton label="LinkedIn" className="md:col-span-2" />
        <div className="flex flex-col items-start gap-1.5 md:col-span-2">
          <Skeleton variant="ghost" text="body-medium-medium">Who can see your profile</Skeleton>
          <div className="inline-flex gap-0.5 rounded-track bg-sko-bg-track p-1">
            <SkeletonPill size="segment" className="bg-transparent">Full profile</SkeletonPill>
            <SkeletonPill size="segment" className="bg-transparent">Limited</SkeletonPill>
          </div>
          <Skeleton variant="ghost" text="body-small-regular">
            {f.visibility === "all_users" ? "Learners on SkillUp see everything above." : "Learners see only your username and photo."}
          </Skeleton>
        </div>
      </SectionSkeleton>
      <SectionSkeleton title="Account" lead="How you sign in and how we reach you.">
        <FieldSkeleton label="Full name" hint="As it appears on your certificates." />
        <FieldSkeleton label="Email" hint="We send a link to the new address before it changes." />
        <FieldSkeleton label="Site language" />
        <FieldSkeleton label="Time zone" hint="Deadlines and live sessions show in this time zone." />
        <div className="flex flex-col items-start gap-1.5 md:col-span-2">
          <Skeleton variant="ghost" text="body-medium-medium">Password</Skeleton>
          <SkeletonPill size="button-sm" icon className="max-md:h-11">Reset password</SkeletonPill>
          <Skeleton variant="ghost" text="body-small-regular">We email you a link to choose a new one.</Skeleton>
        </div>
      </SectionSkeleton>
      <div className="flex gap-3 md:justify-end">
        <SkeletonPill size="button-md" className="flex-1 justify-center md:flex-none">Cancel</SkeletonPill>
        <SkeletonPill size="button-md" className="flex-1 justify-center md:flex-none">Save changes</SkeletonPill>
      </div>
    </div>
  );
}

/**
 * Edit profile (Nelson, 19 Oct 2026), opened from the profile menu: one page, two sections.
 * - Your profile: what other learners and the instructors see. Open edX profile (learner-profile
 *   MFE): photo, bio, country, language, education, social link, and who can see it (full or limited).
 * - Account: how the learner signs in and how the platform talks to them. Open edX account settings
 *   (account MFE): full name, email (confirmed by email before it changes), password reset by email,
 *   site language, time zone. The username cannot change in Open edX: read-only.
 * In the prototype nothing is sent: Save keeps the values for this visit and says so.
 */
export function EditProfileView() {
  const router = useRouter();
  const showToast = useLmsStore((s) => s.showToast);
  const [form, setForm] = React.useState<EditProfileForm>(editProfileSeed);
  const [saved, setSaved] = React.useState<EditProfileForm>(editProfileSeed);
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const set =
    <K extends keyof EditProfileForm>(key: K) =>
    (value: EditProfileForm[K]) =>
      setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(form);
    showToast(
      form.email !== saved.email
        ? `Profile saved. We sent a link to ${form.email} to confirm the new email.`
        : "Profile saved",
    );
  };

  return (
    <PlatformPage
      current={null}
      className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10"
      skeleton={<EditProfileSkeleton />}
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-[880px] flex-col gap-6 lg:gap-8"
      >
        <div data-arrive={0} className="flex flex-col gap-2">
          <h1 className="sk-text-headline-large-bold text-sko-text-default">Edit profile</h1>
          <p className="sk-text-body-large-regular text-sko-text-subtle">
            What other learners and your instructors see, and how you sign in.
          </p>
        </div>

        <Section
          id="profile-title"
          step={1}
          title="Your profile"
          lead="Shown next to your posts, answers and certificates."
        >
          {/* Photo: Open edX takes JPG or PNG, up to 1 MB. */}
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <Avatar name={form.fullName} size="lg" shape="square" />
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  hierarchy="secondary"
                  size="sm"
                  leftIcon={Upload}
                  onClick={() => showToast("Uploading a photo is not part of this prototype")}
                >
                  Upload photo
                </Button>
                <Button type="button" hierarchy="tertiary" size="sm" leftIcon={Trash2} disabled>
                  Remove
                </Button>
              </div>
              <p className="sk-text-body-small-regular text-sko-text-subtle">
                JPG or PNG, up to 1 MB.
              </p>
            </div>
          </div>

          <Field id="username" label="Username" hint="Your username can't be changed.">
            <input
              id="username"
              value={form.username}
              readOnly
              aria-describedby="username-hint"
              className={cn(FIELD, READ_ONLY)}
            />
          </Field>
          <Field id="country" label="Country">
            <Select
              id="country"
              value={form.country}
              options={PROFILE_OPTIONS.country}
              onChange={set("country")}
            />
          </Field>
          <Field id="spoken-language" label="Spoken language">
            <Select
              id="spoken-language"
              value={form.spokenLanguage}
              options={PROFILE_OPTIONS.language}
              onChange={set("spokenLanguage")}
            />
          </Field>
          <Field id="education" label="Education">
            <Select
              id="education"
              value={form.education}
              options={PROFILE_OPTIONS.education}
              onChange={set("education")}
            />
          </Field>
          <Field
            id="bio"
            label="About me"
            className="md:col-span-2"
            hint={`${form.bio.length} / ${BIO_MAX} characters`}
          >
            <textarea
              id="bio"
              rows={4}
              maxLength={BIO_MAX}
              value={form.bio}
              onChange={(e) => set("bio")(e.target.value)}
              aria-describedby="bio-hint"
              className={cn(FIELD, "resize-y")}
            />
          </Field>
          <Field id="linkedin" label="LinkedIn" className="md:col-span-2">
            <input
              id="linkedin"
              type="url"
              inputMode="url"
              value={form.linkedin}
              onChange={(e) => set("linkedin")(e.target.value)}
              placeholder="https://www.linkedin.com/in/…"
              className={FIELD}
            />
          </Field>
          <div className="flex flex-col items-start gap-1.5 md:col-span-2">
            <p className="sk-text-body-medium-medium text-sko-text-muted">
              Who can see your profile
            </p>
            <PlatformSegmented
              label="Who can see your profile"
              value={form.visibility}
              onChange={set("visibility")}
              options={[
                { id: "all_users", label: "Full profile" },
                { id: "private", label: "Limited" },
              ]}
            />
            <p className="sk-text-body-small-regular text-sko-text-subtle">
              {form.visibility === "all_users"
                ? "Learners on SkillUp see everything above."
                : "Learners see only your username and photo."}
            </p>
          </div>
        </Section>

        <Section id="account-title" step={2} title="Account" lead="How you sign in and how we reach you.">
          <Field id="full-name" label="Full name" hint="As it appears on your certificates.">
            <input
              id="full-name"
              value={form.fullName}
              onChange={(e) => set("fullName")(e.target.value)}
              autoComplete="name"
              aria-describedby="full-name-hint"
              required
              className={FIELD}
            />
          </Field>
          <Field
            id="email"
            label="Email"
            hint="We send a link to the new address before it changes."
          >
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              autoComplete="email"
              aria-describedby="email-hint"
              required
              className={FIELD}
            />
          </Field>
          <Field id="site-language" label="Site language">
            <Select
              id="site-language"
              value={form.siteLanguage}
              options={PROFILE_OPTIONS.siteLanguage}
              onChange={set("siteLanguage")}
            />
          </Field>
          <Field
            id="time-zone"
            label="Time zone"
            hint="Deadlines and live sessions show in this time zone."
          >
            <Select
              id="time-zone"
              value={form.timeZone}
              options={PROFILE_OPTIONS.timeZone}
              onChange={set("timeZone")}
            />
          </Field>
          <div className="flex flex-col items-start gap-1.5 md:col-span-2">
            <p className="sk-text-body-medium-medium text-sko-text-muted">Password</p>
            <Button
              type="button"
              hierarchy="secondary"
              size="sm"
              leftIcon={KeyRound}
              onClick={() => showToast(`We sent a link to ${saved.email} to reset your password.`)}
            >
              Reset password
            </Button>
            <p className="sk-text-body-small-regular text-sko-text-subtle">
              We email you a link to choose a new one.
            </p>
          </div>
        </Section>

        {/* The actions: on the right on desktop, both filling on mobile (two buttons side by side fill). */}
        <div data-arrive={3} className="flex gap-3 md:justify-end">
          <Button
            type="button"
            hierarchy="secondary"
            className="flex-1 md:flex-none"
            onClick={() => (dirty ? setForm(saved) : router.back())}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 md:flex-none" disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </form>
    </PlatformPage>
  );
}
