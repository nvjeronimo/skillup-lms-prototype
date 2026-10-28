"use client";

import * as React from "react";
import { ChoiceGroup, FIELD, FormField, FormModal, FormSelect } from "@/components/organisms/FormModal";
import { discussionThreads, type DiscussionKind, type DiscussionThread } from "@/lib/platform/discussion";
import { sessionId } from "@/lib/platform/session-additions";

const COURSES = [...new Map(discussionThreads.map((t) => [t.courseSlug, t.course])).entries()];
const TITLE_MAX = 120;

/** A course's discussion topics: "General" first, then the module topics its threads use. */
function topicsOf(slug: string): string[] {
  return ["General", ...new Set(discussionThreads.filter((t) => t.courseSlug === slug).map((t) => t.topic))];
}

/**
 * New post (Discussion; Nelson, 23 Oct 2026). Open edX discussions live in one course at a time,
 * so a post starts there: the course (preset to the inbox's course filter), then its topic, then
 * Question or Discussion (a question can get an accepted answer), the title and the post. The
 * Discussions API creates the thread (`type`, `topic_id`, `title`, `raw_body`). Nothing is sent:
 * the post opens at the top of the inbox and under My posts, for the session.
 */
export function NewPostModal({
  open,
  onClose,
  defaultCourse,
  onPosted,
}: {
  open: boolean;
  onClose: () => void;
  /** The inbox's course filter, when it is one course. */
  defaultCourse?: string;
  onPosted: (thread: DiscussionThread) => void;
}) {
  const id = React.useId();
  const [course, setCourse] = React.useState("");
  const [topic, setTopic] = React.useState("General");
  const [kind, setKind] = React.useState<DiscussionKind>("question");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setCourse(defaultCourse ?? "");
      setTopic("General");
      setKind("question");
      setTitle("");
      setBody("");
    }
  }, [open, defaultCourse]);

  const courseTitle = COURSES.find(([slug]) => slug === course)?.[1];
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="New post"
      description="Everyone in the course's cohort can read and reply."
      submitLabel="Post"
      canSubmit={!!course && title.trim().length > 0 && body.trim().length > 0}
      onSubmit={() =>
        onPosted({
          id: sessionId("post"),
          course: courseTitle ?? "",
          courseSlug: course,
          topic,
          kind,
          title: title.trim(),
          preview: body.trim(),
          meta: "You · just now",
          replies: 0,
          unread: 0,
          mine: true,
          messages: [{ id: "m1", from: "learner", author: "You", body: body.trim(), time: "Just now" }],
        })
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField id={`${id}-course`} label="Course">
          <FormSelect
            id={`${id}-course`}
            value={course}
            onChange={(v) => {
              setCourse(v);
              setTopic("General");
            }}
            placeholder="Choose a course"
            options={COURSES.map(([slug, t]) => [slug, t] as const)}
          />
        </FormField>
        <FormField id={`${id}-topic`} label="Topic">
          <FormSelect id={`${id}-topic`} value={topic} onChange={setTopic} options={course ? topicsOf(course) : ["General"]} />
        </FormField>
      </div>
      <ChoiceGroup
        legend="Type"
        value={kind}
        onChange={setKind}
        columns={2}
        options={[
          { value: "question", label: "Question", hint: "Needs an answer; one can be accepted" },
          { value: "discussion", label: "Discussion", hint: "Share an idea or start a conversation" },
        ]}
      />
      <FormField id={`${id}-title`} label="Title" hint={`${title.length} / ${TITLE_MAX}`}>
        <input
          id={`${id}-title`}
          value={title}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          aria-describedby={`${id}-title-hint`}
          autoComplete="off"
          className={FIELD}
        />
      </FormField>
      <FormField id={`${id}-body`} label="Post">
        <textarea id={`${id}-body`} value={body} onChange={(e) => setBody(e.target.value)} rows={6} className={`${FIELD} resize-y`} />
      </FormField>
    </FormModal>
  );
}
