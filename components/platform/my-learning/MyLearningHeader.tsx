import { myLearningHeading } from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";
import styles from "./MyLearningHeader.module.css";

/**
 * Header of My Learning: the page title alone. The three DS `Stat` (In progress, Completed,
 * Certificates) left the page on 13 Oct 2026 (Nelson): the Dashboard already shows those
 * figures.
 */
export function MyLearningHeader() {
  return (
    <header data-arrive={0}>
      {/* headline-large/Bold: 36/44, 30/38 on tablet, 24/32 on mobile. */}
      <h1 className={cn("sk-text-headline-large-bold", styles.title)}>
        {myLearningHeading.title} <span data-heading-em="" className={styles.emphasis}>{myLearningHeading.emphasis}</span>
      </h1>
    </header>
  );
}
