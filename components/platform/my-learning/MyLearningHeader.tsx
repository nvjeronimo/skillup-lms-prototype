import { PlatformStat } from "@/components/platform/PlatformStat";
import { myLearningHeading, myLearningStats } from "@/lib/platform/my-learning";

/**
 * Header of My Learning (6374:114665 · tablet 6397:17289 · mobile 6400:29851): the page
 * title and three DS `LMS / Platform / Stat` (Theme=Default).
 * Tablet and desktop: one row, the Stats block 600 wide on the right, a 1px border/subtle
 * rule between stats. Mobile: the stats stack under the title (116 each), no rule between
 * them. The Stats block carries a 1px border/subtle rule top and bottom on every breakpoint.
 * The first stat has no left padding; on mobile none of them has.
 */
export function MyLearningHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-6">
      {/* headline-large/Bold: 36/44, 30/38 on tablet, 24/32 on mobile. */}
      <h1 className="sk-text-headline-large-bold shrink-0 whitespace-nowrap text-sko-text-default">
        {myLearningHeading.title} <span className="text-sko-text-subtle">{myLearningHeading.emphasis}</span>
      </h1>
      <ul
        data-mock="Daily goals, items and minutes have no API"
        className="flex min-w-0 flex-col border-y border-sko-border-subtle md:w-[600px] md:flex-row"
      >
        {myLearningStats.map((stat, i) => (
          <li key={stat.label} className="flex min-w-0 md:flex-1">
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
