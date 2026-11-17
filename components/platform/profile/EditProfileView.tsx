import * as React from "react";
import { useRouter } from "@/lib/router";
import { KeyRound, Trash2, Upload } from "lucide-react";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { FilterChip } from "@/components/atoms/FilterChip";
import { SelectField } from "@/components/atoms/SelectField";
import { Skeleton, SkeletonPill } from "@/components/atoms/Skeleton";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { PlatformSegmented } from "@/components/platform/PlatformSegmented";
import { DeleteAccountSection } from "@/components/platform/profile/DeleteAccount";
import {
  editProfileSeed,
  PROFILE_OPTIONS,
  BIO_MAX,
  type EditProfileForm,
} from "@/lib/platform/profile";
import { useLmsStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import styles from "./EditProfileView.module.css";

/* DS Input field, Size=md with a label (as NoteEditorModal): label body-medium/Medium text/muted,
   the field bg/page, 1px border/default, radius 8, padding 10/14, body-large/Regular, 44 tall.
   Focus: border/primary. Read-only: bg/muted, text/subtle. */
/* The box without its fill, ink and shadow: cn() does not merge classes, so the read-only field
   takes its own (it rendered white before; Nelson, 28 Oct 2026, the disabled look of Figma). */
const FIELD_BOX = cn("sk-text-body-large-regular", styles.fieldBox);
const FIELD = cn(FIELD_BOX, styles.field);
const READ_ONLY = cn(FIELD_BOX, styles.readOnly);

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
    <div className={cn(styles.fieldStack, className)}>
      <label htmlFor={id} className={cn("sk-text-body-medium-medium", styles.muted)}>
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className={cn("sk-text-body-medium-regular", styles.subtle)}>
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
    <SelectField id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(FIELD, styles.select)}>
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
      className={styles.card}
    >
      <header className={styles.cardHeader}>
        <h2 id={id} className={cn("sk-text-title-medium-semibold", styles.ink)}>
          {title}
        </h2>
        <p className={cn("sk-text-body-medium-regular", styles.subtle)}>{lead}</p>
      </header>
      <div className={styles.cardBody}>
        {children}
      </div>
    </section>
  );
}

/** A labelled field while it loads: the ghost label, the field's box (46 tall, as FIELD), the hint. */
function FieldSkeleton({ label, hint, rows, className }: { label: string; hint?: string; rows?: number; className?: string }) {
  return (
    <div className={cn(styles.fieldStack, className)}>
      <Skeleton variant="ghost" text="body-medium-medium">{label}</Skeleton>
      <Skeleton variant="block" radius="control" height={rows ? rows * 24 + 22 : 46} />
      {hint ? <Skeleton variant="ghost" text="body-small-regular">{hint}</Skeleton> : null}
    </div>
  );
}

function SectionSkeleton({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Skeleton variant="ghost" text="title-medium-semibold">{title}</Skeleton>
        <Skeleton variant="ghost" text="body-medium-regular">{lead}</Skeleton>
      </div>
      <div className={styles.cardBody}>{children}</div>
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
    <div className={cn("sk-page-stack", styles.column)}>
      <div className={styles.intro}>
        <Skeleton variant="ghost" text="headline-large-bold">Edit profile</Skeleton>
        <Skeleton variant="ghost" text="body-large-regular">
          What other learners and your instructors see, and how you sign in.
        </Skeleton>
      </div>
      <SectionSkeleton title="Your profile" lead="Shown next to your posts, answers and certificates.">
        <div className={styles.photo}>
          <Skeleton variant="block" width={48} height={48} radius="control" />
          <div className={styles.photoSide}>
            <div className={styles.wrapRow}>
              <SkeletonPill size="button-sm" icon className={styles.phoneTall}>Upload photo</SkeletonPill>
              <SkeletonPill size="button-sm" icon className={styles.phoneTall}>Remove</SkeletonPill>
            </div>
            <Skeleton variant="ghost" text="body-small-regular">JPG or PNG, up to 1 MB.</Skeleton>
          </div>
        </div>
        <FieldSkeleton label="Username" hint="Your username can't be changed." />
        <FieldSkeleton label="Country" />
        <FieldSkeleton label="Spoken language" />
        <FieldSkeleton label="Education" />
        <FieldSkeleton label="About me" rows={4} hint={`${f.bio.length} / ${BIO_MAX} characters`} className={styles.wide} />
        <FieldSkeleton label="LinkedIn" className={styles.wide} />
        <div className={styles.wideStart}>
          <Skeleton variant="ghost" text="body-medium-medium">Who can see your profile</Skeleton>
          <div className={styles.segmentTrack}>
            <SkeletonPill size="segment" className={styles.segmentGhost}>Full profile</SkeletonPill>
            <SkeletonPill size="segment" className={styles.segmentGhost}>Limited</SkeletonPill>
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
        <FieldSkeleton label="Year of birth" hint="Only you and SkillUp see this." />
        <FieldSkeleton label="Gender" hint="Only you and SkillUp see this." />
        <div className={styles.wideStart}>
          <Skeleton variant="ghost" text="body-medium-medium">Password</Skeleton>
          <SkeletonPill size="button-sm" icon className={styles.phoneTall}>Reset password</SkeletonPill>
          <Skeleton variant="ghost" text="body-small-regular">We email you a link to choose a new one.</Skeleton>
        </div>
      </SectionSkeleton>
      <SectionSkeleton title="Career" lead={CAREER_LEAD}>
        <FieldSkeleton label="Phone" />
        <FieldSkeleton label="Current work status" />
        <FieldSkeleton label="Work experience" />
        <div className={cn(styles.fieldStack, styles.wide)}>
          <Skeleton variant="ghost" text="body-medium-medium">Areas of interest</Skeleton>
          <div className={styles.wrapRow}>
            {PROFILE_OPTIONS.interests.map((o) => (
              <SkeletonPill key={o} size="segment">{o}</SkeletonPill>
            ))}
          </div>
        </div>
      </SectionSkeleton>
      <div className={styles.actions}>
        <SkeletonPill size="button-md" className={cn(styles.action, styles.centered)}>Cancel</SkeletonPill>
        <SkeletonPill size="button-md" className={cn(styles.action, styles.centered)}>Save changes</SkeletonPill>
      </div>
    </div>
  );
}

const CAREER_LEAD = "Helps us recommend courses for your career. Only you and SkillUp see this.";

/**
 * Edit profile (Nelson, 19 Oct 2026), opened from the profile menu: one page, two sections.
 * - Your profile: what other learners and the instructors see. Open edX profile (learner-profile
 *   MFE): photo, bio, country, language, education, social link, and who can see it (full or limited).
 * - Account: how the learner signs in and how the platform talks to them. Open edX account settings
 *   (account MFE): full name, email (confirmed by email before it changes), password reset by email,
 *   site language, time zone, year of birth, gender (29 Oct). The username cannot change in Open edX: read-only.
 * - Career (Nelson, 29 Oct 2026): SkillUp's own fields from the skillup.online profile (phone,
 *   work status, experience, areas of interest), kept in Open edX scope: SkillUp marketing
 *   needs them (Nelson, 29 Oct 2026).
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
      className={styles.page}
      skeleton={<EditProfileSkeleton />}
    >
      <form
        onSubmit={onSubmit}
        className={cn("sk-page-stack", styles.column)}
      >
        <div data-arrive={0} className={styles.intro}>
          <h1 className={cn("sk-text-headline-large-bold", styles.ink)}>Edit profile</h1>
          <p className={cn("sk-text-body-large-regular", styles.subtle)}>
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
          <div className={styles.photo}>
            <Avatar name={form.fullName} size="lg" shape="square" />
            <div className={styles.photoSide}>
              <div className={styles.wrapRow}>
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
              <p className={cn("sk-text-body-medium-regular", styles.subtle)}>
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
              className={READ_ONLY}
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
            className={styles.wide}
            hint={`${form.bio.length} / ${BIO_MAX} characters`}
          >
            <textarea
              id="bio"
              rows={4}
              maxLength={BIO_MAX}
              value={form.bio}
              onChange={(e) => set("bio")(e.target.value)}
              aria-describedby="bio-hint"
              className={cn(FIELD, styles.textarea)}
            />
          </Field>
          <Field id="linkedin" label="LinkedIn" className={styles.wide}>
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
          <div className={styles.wideStart}>
            <p className={cn("sk-text-body-medium-medium", styles.muted)}>
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
            <p className={cn("sk-text-body-medium-regular", styles.subtle)}>
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
          <Field id="year-of-birth" label="Year of birth" hint="Only you and SkillUp see this.">
            <Select
              id="year-of-birth"
              value={form.yearOfBirth}
              options={PROFILE_OPTIONS.yearOfBirth}
              onChange={set("yearOfBirth")}
            />
          </Field>
          <Field id="gender" label="Gender" hint="Only you and SkillUp see this.">
            <Select
              id="gender"
              value={form.gender}
              options={PROFILE_OPTIONS.gender}
              onChange={set("gender")}
            />
          </Field>
          <div className={styles.wideStart}>
            <p className={cn("sk-text-body-medium-medium", styles.muted)}>Password</p>
            <Button
              type="button"
              hierarchy="secondary"
              size="sm"
              leftIcon={KeyRound}
              onClick={() => showToast(`We sent a link to ${saved.email} to reset your password.`)}
            >
              Reset password
            </Button>
            <p className={cn("sk-text-body-medium-regular", styles.subtle)}>
              We email you a link to choose a new one.
            </p>
          </div>
        </Section>

        <Section
          id="career-title"
          step={3}
          title="Career"
          lead={CAREER_LEAD}
        >
          <Field id="phone" label="Phone">
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
              placeholder="+351 912 345 678"
              className={FIELD}
            />
          </Field>
          <Field id="work-status" label="Current work status">
            <Select
              id="work-status"
              value={form.workStatus}
              options={PROFILE_OPTIONS.workStatus}
              onChange={set("workStatus")}
            />
          </Field>
          <Field id="work-experience" label="Work experience">
            <Select
              id="work-experience"
              value={form.workExperience}
              options={PROFILE_OPTIONS.workExperience}
              onChange={set("workExperience")}
            />
          </Field>
          <div role="group" aria-labelledby="interests-label" className={cn(styles.fieldStack, styles.wide)}>
            <p id="interests-label" className={cn("sk-text-body-medium-medium", styles.muted)}>
              Areas of interest
            </p>
            <div className={styles.wrapRow}>
              {PROFILE_OPTIONS.interests.map((o) => {
                const on = form.interests.includes(o);
                return (
                  <FilterChip
                    key={o}
                    label={o}
                    active={on}
                    className={styles.chip}
                    onClick={() =>
                      set("interests")(on ? form.interests.filter((i) => i !== o) : [...form.interests, o])
                    }
                  />
                );
              })}
            </div>
            <p className={cn("sk-text-body-medium-regular", styles.subtle)}>Pick as many as you like.</p>
          </div>
        </Section>

        {/* The actions: on the right on desktop, both filling on mobile (two buttons side by side fill). */}
        <div data-arrive={4} className={styles.actions}>
          <Button
            type="button"
            hierarchy="secondary"
            className={styles.action}
            onClick={() => (dirty ? setForm(saved) : router.back())}
          >
            Cancel
          </Button>
          <Button type="submit" className={styles.action} disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </form>
      {/* Outside the form: deleting is not saving the profile. */}
      <div className={cn("sk-page-stack", styles.deleteColumn)}>
        <DeleteAccountSection email={saved.email} />
      </div>
    </PlatformPage>
  );
}
