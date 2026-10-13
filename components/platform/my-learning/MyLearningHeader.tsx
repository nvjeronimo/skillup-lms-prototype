import { myLearningHeading } from "@/lib/platform/my-learning";

/**
 * Header of My Learning: the page title alone. The three DS `Stat` (In progress, Completed,
 * Certificates) left the page on 13 Oct 2026 (Nelson): the Dashboard already shows those
 * figures.
 */
export function MyLearningHeader() {
  return (
    <header>
      {/* headline-large/Bold: 36/44, 30/38 on tablet, 24/32 on mobile. */}
      <h1 className="sk-text-headline-large-bold text-sko-text-default">
        {myLearningHeading.title} <span className="text-sko-text-subtle">{myLearningHeading.emphasis}</span>
      </h1>
    </header>
  );
}
