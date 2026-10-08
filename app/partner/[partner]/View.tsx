"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { getPartnerLab } from "@/lib/content";
import { getTopic } from "@/lib/data";
import { getCourseDetailBySlug } from "@/lib/platform/course-detail";
import { LAB_SCORES_KEY } from "@/lib/store";

/**
 * Stand-in for the partner's lab platform. In the product this page does not exist: the
 * learner is on Google Skills or on Microsoft Learn, on the partner's own site. It is here
 * so the prototype can show what comes back from each partner, and it says so on screen.
 *
 * Google (LTI, scored): "End lab" sends the score to SkillUp, the way the LTI tool posts a
 * grade back. Microsoft (a link): nothing is sent, and the page says that too.
 */
function StandIn({ partner }: { partner: string }) {
  const params = useSearchParams();
  const topicId = params.get("topic") ?? "";
  const embedded = params.get("embed") === "1";
  const topic = getTopic(topicId);
  const lab = topic ? getPartnerLab(topic) : null;
  const [ended, setEnded] = React.useState(false);

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

  function endLab() {
    if (!topic) return;
    try {
      const pending = JSON.parse(window.localStorage.getItem(LAB_SCORES_KEY) ?? "{}");
      pending[topic.id] = { earned: 1, total: 1 };
      window.localStorage.setItem(LAB_SCORES_KEY, JSON.stringify(pending));
    } catch {
      // Storage blocked: nothing reaches SkillUp, as when a real score never arrives.
    }
    setEnded(true);
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

      {lab.scored ? (
        ended ? (
          <div className="w-full max-w-[520px] text-left">
            <InlineAlert
              tone="success"
              title="Lab ended · score 1 / 1 sent to SkillUp"
              description={
                embedded
                  ? "The topic is now marked complete."
                  : "You can close this tab and go back to SkillUp: the topic is marked complete."
              }
            />
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={endLab}>
            End lab
          </Button>
        )
      ) : (
        <div className="w-full max-w-[520px] text-left">
          <InlineAlert
            tone="info"
            title="Nothing is sent back to SkillUp"
            description="When you finish the module, close this tab and select Mark as Complete on the SkillUp topic."
          />
        </div>
      )}
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
