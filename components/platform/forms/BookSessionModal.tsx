"use client";

import * as React from "react";
import { ChoiceGroup, FIELD, FormField, FormModal } from "@/components/organisms/FormModal";
import { sessionId, type SessionBooking } from "@/lib/platform/session-additions";
import { addDays, formatDay, formatTime, parseDay, SAMPLE_TODAY, YOUR_TIME } from "@/lib/sample-time";

export type BookableService = "cv" | "interview";

const SERVICES: Record<BookableService, { name: string; title: string; description: string; noteLabel: string; noteHint: string; submit: string }> = {
  cv: {
    name: "CV review",
    title: "Book your CV review",
    description: "30 minutes on video with a career coach. One review is included with your program.",
    noteLabel: "Link to your CV or LinkedIn profile",
    noteHint: "The coach reads it before the call.",
    submit: "Book review",
  },
  interview: {
    name: "Interview practice",
    title: "Book interview practice",
    description: "A 30-minute mock interview on video with a career coach, then feedback on your answers.",
    noteLabel: "The role you are preparing for",
    noteHint: "e.g. Junior UX researcher, Marketing coordinator",
    submit: "Book practice",
  },
};

/** The coach's free slots: the next four weekdays after the sample today, at 10:00 and 15:00. */
function slots(): { value: string; label: string; hint: string }[] {
  const days: string[] = [];
  for (let i = 1; days.length < 4; i++) {
    const d = addDays(SAMPLE_TODAY, i);
    const wd = parseDay(d).getDay();
    if (wd !== 0 && wd !== 6) days.push(d);
  }
  return days.flatMap((d) =>
    ["10:00", "15:00"].map((t) => ({ value: `${d}T${t}`, label: formatDay(d), hint: `${formatTime(t)} · ${YOUR_TIME}` })),
  );
}

/**
 * Book a CV review or interview practice (Services → Career; Nelson, 23 Oct 2026). A coach's
 * free slot (the next four weekdays, two a day, in the learner's time), then what the coach
 * needs. SkillUp's own service: no Open edX API, and the booking system is not chosen yet, so
 * the slots are samples. Nothing is sent: the booking shows in the Calendar as a session for
 * this browser session.
 */
export function BookSessionModal({
  service,
  open,
  onClose,
  onBooked,
}: {
  service: BookableService;
  open: boolean;
  onClose: () => void;
  onBooked: (booking: SessionBooking) => void;
}) {
  const id = React.useId();
  const copy = SERVICES[service];
  const options = React.useMemo(slots, []);
  const [slot, setSlot] = React.useState<string | null>(null);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setSlot(null);
      setNote("");
    }
  }, [open]);

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={copy.title}
      description={copy.description}
      submitLabel={copy.submit}
      canSubmit={slot !== null && (service === "cv" || note.trim().length > 0)}
      mock="Coaching is SkillUp's own service; the booking system is not chosen, the slots are samples"
      onSubmit={() => {
        const [date, time] = (slot as string).split("T");
        onBooked({ id: sessionId("booking"), service: copy.name, date, time, note: note.trim() || undefined });
      }}
    >
      <ChoiceGroup legend="Choose a time" value={slot} onChange={setSlot} options={options} columns={2} />
      <FormField id={`${id}-note`} label={copy.noteLabel} optional={service === "cv"} hint={copy.noteHint}>
        <input
          id={`${id}-note`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          type={service === "cv" ? "url" : "text"}
          inputMode={service === "cv" ? "url" : undefined}
          placeholder={service === "cv" ? "https://" : undefined}
          aria-describedby={`${id}-note-hint`}
          autoComplete="off"
          className={FIELD}
        />
      </FormField>
    </FormModal>
  );
}
