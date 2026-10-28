import * as React from "react";
import { ProviderBadge, type Provider } from "@/components/atoms/MetaBadges";
import { cn } from "@/lib/utils";

/**
 * DS `LMS/ICP/Topics/Lab-Launch-Card` v2.0: where a partner lab is opened from. Three states:
 * - Ready: the lab has not been opened. One Primary action.
 * - Opened: the learner has opened the lab at least once. The action is Secondary and the
 *   card shows the date of the first opening. It stays like this after the topic is completed.
 * - Unavailable: the lab could not be shown inside the page. Error surface, one Primary action.
 *
 * The card never says the lab is complete: nothing comes back from the partner. The topic's
 * status lives in the Topic Header and on the sidebar row.
 *
 * Everything is centred. Padding is 40 on desktop, 32 on tablet and 24 on mobile, gap 8;
 * the action sits 8 lower.
 */
export type LabLaunchState = "ready" | "opened" | "unavailable";

export interface LabLaunchCardProps {
  state: LabLaunchState;
  /** DS `Show provider` + `Provider-Partner Badge`. */
  provider?: Provider;
  title: string;
  description: string;
  /** DS `Opened date`, under the action: "First opened on 12 Oct 2026". Opened state only. */
  openedOn?: string;
  /** The action button (DS `Action`). */
  children?: React.ReactNode;
  className?: string;
}

export const LabLaunchCard = React.forwardRef<HTMLElement, LabLaunchCardProps>(function LabLaunchCard(
  { state, provider, title, description, openedOn, children, className },
  ref,
) {
  const unavailable = state === "unavailable";
  return (
    <section
      ref={ref}
      aria-label="Lab"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-card border p-6 text-center md:p-8 lg:p-10",
        unavailable
          ? "border-sko-border-error bg-sko-bg-error-soft"
          : "border-sko-border-subtle bg-sko-bg-subtle",
        className,
      )}
    >
      {provider ? (
        <span data-invented="provider: no partner field on an Open edX unit or LTI block" className="contents">
          <ProviderBadge value={provider} />
        </span>
      ) : null}
      {/* DS body-large/Bold — semibold until .sk-text-body-large-bold exists (CT-22). */}
      <h2
        className={cn(
          "sk-text-body-large-semibold",
          unavailable ? "text-sko-text-error" : "text-sko-text-default",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "sk-text-body-medium-regular",
          unavailable ? "text-sko-text-error" : "text-sko-text-default",
        )}
      >
        {description}
      </p>
      {children ? <div className="flex flex-wrap justify-center gap-2 pt-2">{children}</div> : null}
      {/* The card is where the one thing we know is read from: that the lab was opened. */}
      {state === "opened" && openedOn ? (
        <p
          data-invented="opened: the launch click is not seen by Open edX"
          className="sk-text-body-medium-regular text-sko-text-default"
          aria-live="polite"
        >
          {openedOn}
        </p>
      ) : null}
    </section>
  );
});
