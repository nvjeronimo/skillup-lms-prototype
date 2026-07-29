"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { getBlockedInfo } from "@/lib/content";
import { getTopic } from "@/lib/data";

/**
 * Blocked content types (Programming Assignment · Role Play · Dialogue) are
 * native to Coursera but have no stock Open edX path. Rather than fake a working
 * topic, the shell shows an honest "needs a platform decision" panel: what the
 * type is, why it's blocked, and the possible edX route. There is nothing to
 * complete here — completion is intentionally not offered.
 */
export function BlockedView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId);
  if (!topic) return null;
  const info = getBlockedInfo(topic);

  return (
    <div className="flex flex-col gap-5 py-4">
      <section className="flex flex-col gap-4 rounded-xl border border-sk-border-secondary bg-sk-bg-primary p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warning" leftIcon={Lock}>
            Not available yet
          </Badge>
          <Badge tone="neutral">{info.badge}</Badge>
        </div>

        <Field label="What it is" value={info.what} lead />
        <Field label="Why it's blocked" value={info.whyBlocked} />
        <Field label="Possible Open edX path" value={info.possiblePath} />

        {info.note ? <InlineAlert tone="info" title="Worth flagging" description={info.note} /> : null}
      </section>

      <InlineAlert
        tone="warning"
        title="Needs a build-or-buy decision"
        description="This type is native to Coursera but has no stock Open edX equivalent. It stays blocked in the ICP until a platform path is chosen — so there is nothing to complete here yet."
      />
    </div>
  );
}

function Field({ label, value, lead }: { label: string; value: string; lead?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="sk-text-2xs-medium uppercase tracking-wide text-sk-text-tertiary">{label}</span>
      <p className={lead ? "sk-text-md-regular text-sk-text-secondary" : "sk-text-sm-regular text-sk-text-secondary"}>
        {value}
      </p>
    </div>
  );
}
