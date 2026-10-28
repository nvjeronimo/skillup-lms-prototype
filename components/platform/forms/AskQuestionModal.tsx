"use client";

import * as React from "react";
import { FIELD, FormField, FormModal, FormSelect } from "@/components/organisms/FormModal";
import type { CourseDetail, QaThread } from "@/lib/platform/course-detail";
import { sessionId } from "@/lib/platform/session-additions";

const TITLE_MAX = 120;

/**
 * Ask a question (Course Detail → Mentorship Q&A; Nelson, 23 Oct 2026). A question post in the
 * course discussions, public to the course (28 Oct 2026: Open edX has no private messages). The question (required, up to 120 characters), the
 * details (required) and, optionally, where in the course it comes from (the course's modules,
 * `display_name` verbatim). Open edX: the Discussions API posts a thread of type "question" in
 * the course's mentorship topic. Nothing is sent: the question opens at the top of "Your
 * questions", Unanswered and Following, for the session.
 */
export function AskQuestionModal({
  course,
  open,
  onClose,
  onAsked,
}: {
  course: CourseDetail;
  open: boolean;
  onClose: () => void;
  onAsked: (thread: QaThread) => void;
}) {
  const id = React.useId();
  const [title, setTitle] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [module, setModule] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle("");
      setDetails("");
      setModule("");
    }
  }, [open]);

  const where = course.modules.find((m) => m.id === module);
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Ask a question"
      description="Everyone in the course can read your question. A mentor answers it in the course discussions."
      submitLabel="Post question"
      canSubmit={title.trim().length > 0 && details.trim().length > 0}
      onSubmit={() =>
        onAsked({
          id: sessionId("asked"),
          title: title.trim(),
          preview: `You: ${details.trim()}`,
          meta: where ? `Just now · Module ${where.number}` : "Just now",
          answered: false,
          following: true,
          unread: false,
          messages: [{ id: "m1", from: "learner", author: "You", body: details.trim(), time: "Just now" }],
        })
      }
    >
      <FormField id={`${id}-title`} label="Your question" hint={`${title.length} / ${TITLE_MAX}`}>
        <input
          id={`${id}-title`}
          value={title}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Why does my control chart flag every point?"
          aria-describedby={`${id}-title-hint`}
          autoComplete="off"
          className={FIELD}
        />
      </FormField>
      <FormField id={`${id}-details`} label="Details" hint="What you tried, and where you are stuck.">
        <textarea
          id={`${id}-details`}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          aria-describedby={`${id}-details-hint`}
          className={`${FIELD} resize-y`}
        />
      </FormField>
      <FormField id={`${id}-module`} label="Where in the course" optional>
        <FormSelect
          id={`${id}-module`}
          value={module}
          onChange={setModule}
          placeholder="Choose a module"
          options={course.modules.map((m) => [m.id, `Module ${m.number} · ${m.title}`] as const)}
        />
      </FormField>
    </FormModal>
  );
}
