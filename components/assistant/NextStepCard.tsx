import { ButtonLink } from "@/components/atoms/ButtonLink";
import type { ActionEntry } from "@/lib/assistant/types";
import styles from "./NextStepCard.module.css";

/**
 * The one thing to do next (lib/assistant/next-step), with the button that goes there. The
 * same sentence the assistant gives to "What should I do next?".
 */
export function NextStepCard({ text, action }: { text: string; action: ActionEntry }) {
  return (
    <section
      aria-label="Next step"
      className={styles.card}
    >
      <p className={`sk-text-body-medium-regular ${styles.text}`}>
        <span className={`sk-text-body-small-medium ${styles.lead}`}>Next:</span>
        {text}
      </p>
      <ButtonLink href={action.href} hierarchy="secondary" size="sm" className={styles.action}>
        {action.label}
      </ButtonLink>
    </section>
  );
}
