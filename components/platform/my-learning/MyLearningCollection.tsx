"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { useLmsStore } from "@/lib/store";
import {
  MY_LEARNING_DEFAULT_TAB,
  MY_LEARNING_DEFAULT_VIEW,
  myLearningBrowseTile,
  myLearningCourses,
  myLearningPrograms,
  myLearningSearch,
  myLearningTabs,
  type MyLearningTab,
  type MyLearningView,
} from "@/lib/platform/my-learning";
import { cn } from "@/lib/utils";
import { BrowseTile } from "./BrowseTile";
import { MyLearningCourseCard } from "./MyLearningCourseCard";
import { ProgramCard } from "./ProgramCard";
import { SearchField } from "./SearchField";
import { ViewToggle } from "./ViewToggle";

const ID_BASE = "my-learning";

/* Grid: 3 columns / 24 on desktop, 2 columns / 20 on tablet, 1 column / 16 on mobile. */
const GRID = "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6";
/* List: one column, 24 apart. Desktop only. */
const LIST = "hidden flex-col gap-6 lg:flex";

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
 */
export function MyLearningCollection() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const showToast = useLmsStore((s) => s.showToast);
  const [query, setQuery] = React.useState("");

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
  const courses = myLearningCourses.filter((c) => matches(c.title, needle));
  const programs = myLearningPrograms.filter((p) => matches(p.title, needle));
  const shown = tab === "courses" ? courses.length : programs.length;
  const tabLabel = myLearningTabs.find((t) => t.id === tab)?.label ?? "";
  const noun = tab === "courses" ? "courses" : "programs";

  const tabs = myLearningTabs.map((t) => ({
    ...t,
    count: t.id === "courses" ? myLearningCourses.length : myLearningPrograms.length,
  }));

  const notInPrototype = (name: string) => showToast(`${name} is not part of this prototype yet`);

  const listView = view === "list";

  return (
    <section aria-label="My courses and programs" className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between md:border-b md:border-sko-border-subtle">
        <div className="border-b border-sko-border-subtle md:min-w-0 md:flex-1 md:border-b-0">
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
            <ul className={cn(GRID, listView && "lg:hidden")}>
              {/* One primary action in the grid: the first course. The DS card draws every action as Primary. */}
              {courses.map((course, index) => (
                <li key={course.id} className="flex min-w-0">
                  <MyLearningCourseCard
                    course={course}
                    layout="grid"
                    emphasis={index === 0 ? "primary" : "secondary"}
                    className="w-full"
                  />
                </li>
              ))}
              {/* The way out to the catalog closes the grid. */}
              <li className="flex min-w-0">
                <BrowseTile
                  title={myLearningBrowseTile.title}
                  subtitle={myLearningBrowseTile.subtitle}
                  onClick={() => notInPrototype(myLearningBrowseTile.title)}
                />
              </li>
            </ul>
            {listView ? (
              <ul className={LIST}>
                {courses.map((course) => (
                  <li key={course.id}>
                    <MyLearningCourseCard course={course} layout="list" />
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <>
            {/* items-start: program cards keep their own height (a longer title makes a taller card). */}
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
