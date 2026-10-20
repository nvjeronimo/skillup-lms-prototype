import { ButtonLink } from "@/components/atoms/ButtonLink";
import type { ActionEntry } from "@/lib/assistant/types";

/**
 * The one thing to do next (lib/assistant/next-step), with the button that goes there. The
 * same sentence the assistant gives to "What should I do next?".
 */
export function NextStepCard({ text, action }: { text: string; action: ActionEntry }) {
  return (
    <section
      aria-label="Next step"
      className="flex flex-col items-start gap-3 rounded-control border border-sko-border-subtle bg-sko-bg-faint p-4"
    >
      <p className="sk-text-body-medium-regular text-sko-text-default">
        <span className="sk-text-body-small-medium mr-1 uppercase text-sko-text-subtle">Next:</span>
        {text}
      </p>
      <ButtonLink href={action.href} hierarchy="secondary" size="sm" className="!h-auto min-h-9 py-1.5">
        {action.label}
      </ButtonLink>
    </section>
  );
}
