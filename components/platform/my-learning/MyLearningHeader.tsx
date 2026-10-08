import { PlatformStat } from "@/components/platform/PlatformStat";
import { myLearningHeading, myLearningStats } from "@/lib/platform/my-learning";

/**
 * Header of My Learning: the page title and three DS `Stat` (Theme=Default): In progress,
 * Completed, Certificates, the totals Learner Home returns, so no sample-data mark.
 * Tablet and desktop: one row, the Stats block 600 wide on the right (200 × 122 each), a 1px
 * border/subtle rule between stats. Mobile: the title, then 20 below it the three stats side
 * by side (109 × 116 each), no rule between them. The Stats block carries a 1px
 * border/subtle rule top and bottom on every breakpoint. The first stat has no left padding;
 * on mobile none of them has.
 */
export function MyLearningHeader() {
  return (
    <header className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-6 lg:gap-8">
      {/* headline-large/Bold: 36/44, 30/38 on tablet, 24/32 on mobile. */}
      <h1 className="sk-text-headline-large-bold shrink-0 whitespace-nowrap text-sko-text-default">
        {myLearningHeading.title} <span className="text-sko-text-subtle">{myLearningHeading.emphasis}</span>
      </h1>
      <ul className="flex min-w-0 border-y border-sko-border-subtle md:w-[600px]">
        {myLearningStats.map((stat, i) => (
          <li key={stat.label} className="flex min-w-0 flex-1">
            <PlatformStat
              label={stat.label}
              value={stat.value}
              detail={stat.detail}
              className={
                i === 0
                  ? "w-full pl-0"
                  : "w-full pl-0 md:border-l md:border-sko-border-subtle md:pl-4"
              }
            />
          </li>
        ))}
      </ul>
    </header>
  );
}
