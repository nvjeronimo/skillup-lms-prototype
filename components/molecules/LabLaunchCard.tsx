import * as React from "react";
import { CircleCheck } from "lucide-react";
import { ProviderBadge, type Provider } from "@/components/atoms/MetaBadges";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * DS `LMS / Lab · Launch Card`: where a partner lab is opened from, and where its state is
 * read back. Four states:
 * - Ready: the lab has not been opened. One Primary action.
 * - Opened: the learner left for the partner's platform. One Secondary action to go again.
 * - Completed: a success check above the title.
 * - Unavailable: the provider refused the frame. Error surface, a Primary and a Secondary.
 *
 * Everything is centred. Padding is 40 on desktop, 32 on tablet and 24 on mobile, gap 8;
 * the actions sit 8 lower and wrap when they do not fit side by side.
 */
export type LabLaunchState = "ready" | "opened" | "completed" | "unavailable";

export interface LabLaunchCardProps {
  state: LabLaunchState;
  /** DS `Show provider` + `LMS / Provider-Partner Badge`. */
  provider?: Provider;
  title: string;
  description: string;
  /** The action buttons (DS `Action` and `Secondary action`). */
  children?: React.ReactNode;
  className?: string;
}

export const LabLaunchCard = React.forwardRef<HTMLElement, LabLaunchCardProps>(function LabLaunchCard(
  { state, provider, title, description, children, className },
  ref,
) {
  const unavailable = state === "unavailable";
  return (
    <section
      ref={ref}
      // Focusable from script only: focus lands here when the action that had it is replaced.
      tabIndex={-1}
      aria-label="Lab"
      className={cn(
        "outline-none flex flex-col items-center justify-center gap-2 rounded-xl border p-6 text-center md:p-8 lg:p-10",
        unavailable
          ? "border-sko-border-error bg-sko-bg-error-soft"
          : "border-sko-border-subtle bg-sko-bg-subtle",
        className,
      )}
    >
      {provider ? <ProviderBadge value={provider} /> : null}
      {state === "completed" ? (
        <span className="inline-flex h-6 w-6 items-center justify-center text-sko-icon-success">
          <Icon icon={CircleCheck} size={20} />
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
        // The card is where the state changes are read from: opened, score received.
        aria-live="polite"
      >
        {description}
      </p>
      {children ? <div className="flex flex-wrap justify-center gap-2 pt-2">{children}</div> : null}
    </section>
  );
});
