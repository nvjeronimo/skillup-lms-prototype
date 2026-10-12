"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { getPartnerLab } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { getCourseDetailBySlug } from "@/lib/platform/course-detail";

/**
 * Stand-in for the partner's lab platform. In the product this page does not exist: the
 * learner is on Google Skills or on Microsoft Learn, on the partner's own site. It is here
 * so the prototype has somewhere to send the learner, and it says so on screen.
 *
 * Nothing comes back from a partner, Google or Microsoft (9 Oct 2026): the page says that
 * and sends the learner back to SkillUp to complete the topic.
 */
function StandIn({ partner }: { partner: string }) {
  const params = useSearchParams();
  const topicId = params.get("topic") ?? "";
  const embedded = params.get("embed") === "1";
  const topic = getTopic(topicId);
  const lab = topic ? getPartnerLab(topic) : null;

  // A whole course hosted by the partner (IBM): nothing of it is ours and nothing comes back.
  const course = getCourseDetailBySlug(params.get("course") ?? "");
  if (course?.hosted && course.hosted.partner.toLowerCase() === partner) {
    return (
      <main
        id="main"
        tabIndex={-1}
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-sko-bg-subtle p-6 text-center outline-none"
      >
        <span className="sk-text-label-small-medium uppercase text-sko-text-subtle">
          Prototype stand-in · not a SkillUp screen
        </span>
        <h1 className="sk-text-title-large-bold text-sko-text-default">
          {course.hosted.partner} · {course.title}
        </h1>
        <p className="sk-text-body-medium-regular max-w-[520px] text-sko-text-muted">
          In the product this is {course.hosted.partner}&rsquo;s own site, where the learner signs in with an{" "}
          {course.hosted.partner} account and takes the course. The course itself is not part of the prototype.
        </p>
        <div className="w-full max-w-[520px] text-left">
          <InlineAlert
            tone="info"
            title="We do not know yet what comes back to SkillUp"
            description="Whether IBM reports progress or completion is an open question, so the SkillUp page shows a dash for progress."
          />
        </div>
      </main>
    );
  }

  if (!topic || !lab || lab.partner !== partner) {
    return (
      <main id="main" tabIndex={-1} className="p-6">
        <p className="sk-text-body-medium-regular text-sko-text-muted">This lab was not found.</p>
      </main>
    );
  }

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-sko-bg-subtle p-6 text-center outline-none"
    >
      <span className="sk-text-label-small-medium uppercase text-sko-text-subtle">
        Prototype stand-in · not a SkillUp screen
      </span>
      <h1 className="sk-text-title-large-bold text-sko-text-default">
        {lab.platform} · {topic.title}
      </h1>
      <p className="sk-text-body-medium-regular max-w-[520px] text-sko-text-muted">
        In the product this is {lab.platform}, on {lab.provider === "Microsoft" ? "Microsoft" : "Google"}
        &rsquo;s own site. The lab itself is not part of the prototype.
      </p>

      <div className="w-full max-w-[520px] text-left">
        <InlineAlert
          tone="info"
          title="Nothing is sent back to SkillUp"
          description={
            embedded
              ? "When you finish the lab, select Mark as Complete at the end of the SkillUp page."
              : "When you finish, close this tab, go back to the SkillUp topic and select Mark as Complete."
          }
        />
      </div>
    </main>
  );
}

export function PartnerStandIn({ partner }: { partner: string }) {
  // useSearchParams needs a Suspense boundary to keep the route statically buildable.
  return (
    <React.Suspense fallback={null}>
      <StandIn partner={partner} />
    </React.Suspense>
  );
}
