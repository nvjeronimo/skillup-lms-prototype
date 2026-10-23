"use client";

import * as React from "react";
import { FIELD, FormField, FormModal, FormSelect } from "@/components/organisms/FormModal";
import { discussionThreads } from "@/lib/platform/discussion";
import { sessionId, type SessionRequest } from "@/lib/platform/session-additions";

const TOPICS = [
  "A video, lab or file won't open",
  "My progress or grade looks wrong",
  "Certificates",
  "My account or sign-in",
  "Payments and invoices",
  "Something else",
] as const;

const COURSES = [...new Set(discussionThreads.map((t) => t.course))];

/**
 * Contact support (Services → Support; Nelson, 23 Oct 2026). What it is about (required), the
 * course when it is about one (optional), a subject and the message. SkillUp's help desk, not
 * Open edX, and the integration is not chosen yet. Nothing is sent: the request joins the
 * Support list as "Request 48xx · opened today · In progress" for the session.
 */
export function ContactSupportModal({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: (request: Omit<SessionRequest, "number">) => void;
}) {
  const id = React.useId();
  const [topic, setTopic] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTopic("");
      setCourse("");
      setSubject("");
      setMessage("");
    }
  }, [open]);

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Contact support"
      description="We reply by email within one business day."
      submitLabel="Send"
      canSubmit={!!topic && subject.trim().length > 0 && message.trim().length > 0}
      mock="Support requests need a help-desk integration (not chosen yet)"
      onSubmit={() => onSent({ id: sessionId("request"), topic, subject: subject.trim(), course: course || undefined })}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField id={`${id}-topic`} label="What is it about?">
          <FormSelect id={`${id}-topic`} value={topic} onChange={setTopic} placeholder="Choose one" options={TOPICS} />
        </FormField>
        <FormField id={`${id}-course`} label="Course" optional>
          <FormSelect id={`${id}-course`} value={course} onChange={setCourse} placeholder="Not about a course" options={COURSES} />
        </FormField>
      </div>
      <FormField id={`${id}-subject`} label="Subject">
        <input id={`${id}-subject`} value={subject} onChange={(e) => setSubject(e.target.value)} autoComplete="off" className={FIELD} />
      </FormField>
      <FormField id={`${id}-message`} label="Message" hint="What happened, where, and what you expected.">
        <textarea
          id={`${id}-message`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          aria-describedby={`${id}-message-hint`}
          className={`${FIELD} resize-y`}
        />
      </FormField>
    </FormModal>
  );
}
