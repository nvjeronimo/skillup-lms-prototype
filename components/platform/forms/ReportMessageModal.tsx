"use client";

import * as React from "react";
import { ChoiceGroup, FIELD, FormField, FormModal } from "@/components/organisms/FormModal";

const REASONS = [
  { value: "spam", label: "Spam or advertising" },
  { value: "abuse", label: "Harassment or offensive language" },
  { value: "off-topic", label: "Off-topic for this course" },
  { value: "personal", label: "Shares someone's personal information" },
  { value: "other", label: "Something else" },
] as const;

type Reason = (typeof REASONS)[number]["value"];

/**
 * Report a message (Discussion and Mentorship Q&A; Nelson, 23 Oct 2026): the player's Report
 * issue pattern for people's messages. A reason (required) and optional details. Open edX: the
 * Discussions API's `abuse_flagged` on the comment or thread; moderators see it in their
 * reported queue. The learner is not told who reviews it or what happens next beyond "the course
 * team will review it". Nothing is sent in the prototype.
 */
export function ReportMessageModal({
  open,
  onClose,
  onReported,
}: {
  open: boolean;
  onClose: () => void;
  onReported: () => void;
}) {
  const id = React.useId();
  const [reason, setReason] = React.useState<Reason | null>(null);
  const [details, setDetails] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setReason(null);
      setDetails("");
    }
  }, [open]);

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Report this message"
      description="The course team reviews every report. The author is not told who reported it."
      submitLabel="Report"
      canSubmit={reason !== null}
      onSubmit={onReported}
    >
      <ChoiceGroup legend="What is wrong with it?" value={reason} onChange={setReason} options={REASONS} />
      <FormField id={`${id}-details`} label="Details" optional>
        <textarea
          id={`${id}-details`}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={3}
          className={`${FIELD} resize-y`}
        />
      </FormField>
    </FormModal>
  );
}
