"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { CourseRowCard } from "@/components/platform/CourseRowCard";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { useLmsStore } from "@/lib/store";
import {
  MY_LEARNING_DEFAULT_TAB,
  MY_LEARNING_DEFAULT_VIEW,
  myLearningBrowseTile,
  myLearningPrograms,
  myLearningSearch,
  myLearningTabs,
  type MyLearningTab,
  type MyLearningView,
} from "@/lib/platform/my-learning";
import type { MyLearningCourseRow } from "@/lib/platform/my-learning-rows";
import { cn } from "@/lib/utils";
import { BrowseTile } from "./BrowseTile";
import { ProgramCard } from "./ProgramCard";
import { SearchField } from "./SearchField";
import { ViewToggle } from "./ViewToggle";

const ID_BASE = "my-learning";

/* Grid: 3 columns / 24 on desktop, 2 columns / 20 on tablet, 1 column / 16 on mobile. */
const GRID = "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6";
/* List: one column, 24 apart. Desktop only. */
const LIST = "hidden flex-col gap-6 lg:flex";

/* The row is the target of its card's title link: it shows it on hover, as the card did. */
const ROW_HOVER = "min-w-0 transition-colors has-[h3_a:hover]:border-sko-border-default";

const matches = (title: string, query: string) => title.toLowerCase().includes(query);

/**
 * The Collection of My Learning (6394:16636 and siblings): Toolbar + the cards of the
 * selected tab, 24 / 20 / 16 apart (desktop / tablet / mobile).
 * Toolbar, tablet and desktop: Tabs on the left, Search (240) and the Grid / List toggle on
 * the right, 8 above, one 1px border/subtle rule under the whole row. Mobile: the tabs on
 * their rule, then the search at full width, 16 apart.
 * The tab and the view live in the URL (`?tab=programs`, `?view=list`; the drawn defaults,
 * Courses and Grid, leave it clean). Search filters the cards of the selected tab by title.
 * Below desktop the collections are Grid only: the toggle is hidden, and a `?view=list`
 * URL still shows the grid there.
 *
 * Courses (decided by Nelson on 11 Oct 2026): every course is a DS `Course-Row`, not the
 * course card on its own: `Breakpoint` Desktop in the list, Compact in the grid and at every
 * width below desktop. All rows start closed and each opens on its own; the grid aligns its
 * rows at the top, so an opened row grows alone and the rows beside it keep their height.
 * The rows come from the page (lib/platform/my-learning-rows, read on the server).
 */
export function MyLearningCollection({ courseRows }: { courseRows: MyLearningCourseRow[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const showToast = useLmsStore((s) => s.showToast);
  const [query, setQuery] = React.useState("");
  // The rows opened by the learner, by course id: the grid and the list show the same ones.
  const [openRows, setOpenRows] = React.useState<Set<string>>(() => new Set());
  const toggleRow = (id: string) =>
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const tab: MyLearningTab = params.get("tab") === "programs" ? "programs" : MY_LEARNING_DEFAULT_TAB;
  const view: MyLearningView = params.get("view") === "list" ? "list" : MY_LEARNING_DEFAULT_VIEW;

  const setParam = (key: "tab" | "view", value: string, fallback: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const needle = query.trim().toLowerCase();
  const courses = courseRows.filter((row) => matches(row.card.title, needle));
  const programs = myLearningPrograms.filter((p) => matches(p.title, needle));
  const shown = tab === "courses" ? courses.length : programs.length;
  const tabLabel = myLearningTabs.find((t) => t.id === tab)?.label ?? "";
  const noun = tab === "courses" ? "courses" : "programs";

  const tabs = myLearningTabs.map((t) => ({
    ...t,
    count: t.id === "courses" ? courseRows.length : myLearningPrograms.length,
  }));

  const notInPrototype = (name: string) => showToast(`${name} is not part of this prototype yet`);

  const listView = view === "list";

  return (
    <section aria-label="My courses and programs" className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between md:border-b md:border-sko-border-subtle">
        {/* The Size=sm tabs already grow their target to 44 upwards, so the "larger targets"
            min-height is switched off on them: it would make the 32px row 44 tall. */}
        <div className="border-b border-sko-border-subtle max-md:[&_[role=tab]]:min-h-0 md:min-w-0 md:flex-1 md:border-b-0">
          {/* DS Horizontal tabs with a count badge: Size=sm on mobile, md from tablet up. The rule
              is the border of the toolbar, and only the selected panel is rendered. */}
          <PlatformTabs
            tabs={tabs}
            value={tab}
            onChange={(id) => setParam("tab", id, MY_LEARNING_DEFAULT_TAB)}
            size="responsive"
            rule="parent"
            panels="selected"
            idBase={ID_BASE}
            ariaLabel="My learning"
          />
        </div>
        <div className="flex items-center gap-2">
          <SearchField
            value={query}
            onChange={setQuery}
            label={myLearningSearch.placeholder}
            className="w-full md:w-[240px]"
          />
          <ViewToggle
            view={view}
            onChange={(next) => setParam("view", next, MY_LEARNING_DEFAULT_VIEW)}
            className="hidden shrink-0 lg:inline-flex"
          />
        </div>
      </div>

      <div role="tabpanel" id={platformPanelId(ID_BASE, tab)} aria-labelledby={platformTabId(ID_BASE, tab)}>
        <h2 className="sr-only">{tabLabel}</h2>
        {/* Tells assistive tech how many cards the search left. */}
        <p role="status" className="sr-only">
          {needle ? `${shown} ${noun} match “${query.trim()}”` : ""}
        </p>

        {shown === 0 ? (
          <EmptyState
            icon={Search}
            title={`No ${noun} match “${query.trim()}”`}
            description="Check the spelling or search for another title."
          />
        ) : tab === "courses" ? (
          <>
            {/* items-start: an opened row does not stretch the rows of its line. */}
            <ul className={cn(GRID, "items-start", listView && "lg:hidden")}>
              {courses.map((row) => (
                <CourseRowCard
                  key={row.card.id}
                  {...row}
                  breakpoint="compact"
                  open={openRows.has(row.card.id)}
                  onToggle={() => toggleRow(row.card.id)}
                  className={ROW_HOVER}
                />
              ))}
              {/* The way out to the catalog closes the grid. It keeps the height of its line. */}
              <li className="flex min-w-0 self-stretch">
                <BrowseTile
                  title={myLearningBrowseTile.title}
                  subtitle={myLearningBrowseTile.subtitle}
                  onClick={() => notInPrototype(myLearningBrowseTile.title)}
                />
              </li>
            </ul>
            {listView ? (
              <ul className={LIST}>
                {courses.map((row) => (
                  <CourseRowCard
                    key={row.card.id}
                    {...row}
                    breakpoint="desktop"
                    open={openRows.has(row.card.id)}
                    onToggle={() => toggleRow(row.card.id)}
                    className={ROW_HOVER}
                  />
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <>
            {/* Every program card has the same height, whatever its state or title. */}
            <ul className={cn(GRID, "items-start", listView && "lg:hidden")}>
              {programs.map((program) => (
                <li key={program.id} className="min-w-0">
                  <ProgramCard program={program} layout="grid" onAction={() => notInPrototype(program.title)} />
                </li>
              ))}
            </ul>
            {listView ? (
              <ul className={LIST}>
                {programs.map((program) => (
                  <li key={program.id}>
                    <ProgramCard program={program} layout="list" onAction={() => notInPrototype(program.title)} />
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
