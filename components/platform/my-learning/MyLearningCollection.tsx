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
  myLearningPrograms,
  myLearningSearch,
  myLearningStateOf,
  myLearningStatusFilters,
  myLearningStatusOrder,
  type MyLearningStatusFilter,
  myLearningTabs,
  type MyLearningTab,
  type MyLearningView,
} from "@/lib/platform/my-learning";
import type { MyLearningCourseRow } from "@/lib/platform/my-learning-rows";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/lib/scrollToElement";
import { staggerStyle } from "@/lib/motion/stagger";
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
/* A card coming into the list rises, one after the other (staggerStyle). */
const ROW_ENTER = "sk-animate-rise sk-enter-only";

const matches = (title: string, query: string) => title.toLowerCase().includes(query);

/**
 * The Collection of My Learning (6394:16636 and siblings): Toolbar + the cards of the
 * selected tab, 24 / 20 / 16 apart (desktop / tablet / mobile).
 * Toolbar (Nelson, 13 Oct 2026): the Tabs alone on the first row, on a 1px border/subtle rule
 * across the width, 8 above. Second row: the status filter on the left, Search (320 on
 * desktop, 240 on tablet) and the Grid / List toggle on the right. Mobile: the tabs, the
 * search at full width, then the filter, 16 apart.
 * The tab and the view live in the URL (`?tab=programs`, `?view=list`; the drawn defaults,
 * Courses and Grid, leave it clean). Search filters the cards of the selected tab by title.
 * Below desktop the collections are Grid only: the toggle is hidden, and a `?view=list`
 * URL still shows the grid there.
 *
 * Status filter (decided by Nelson on 13 Oct 2026; it replaced the three sections of the same
 * day, which spread the cards and made the learner scroll): one list per tab, always ordered
 * In progress, Not started, Completed, and a DS `Button group` under the toolbar that keeps
 * the cards of one state (All by default). It works together with the search and the view.
 * On mobile the four segments are wider than the screen: the track fills the width and the
 * segments scroll sideways inside it.
 * The Browse catalog tile is hidden for now.
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
  const [status, setStatus] = React.useState<MyLearningStatusFilter>("all");
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
  const inStatus = (pct: number | null) => status === "all" || myLearningStateOf(pct) === status;
  const byState = (a: number | null, b: number | null) =>
    myLearningStatusOrder.indexOf(myLearningStateOf(a)) - myLearningStatusOrder.indexOf(myLearningStateOf(b));
  // Always In progress, then Not started, then Completed; the data order holds inside a state.
  const courses = courseRows
    .filter((row) => matches(row.card.title, needle) && inStatus(row.card.progressPct))
    .sort((a, b) => byState(a.card.progressPct, b.card.progressPct));
  const programs = myLearningPrograms
    .filter((p) => matches(p.title, needle) && inStatus(p.progressPct))
    .sort((a, b) => byState(a.progressPct, b.progressPct));
  const statusLabel = myLearningStatusFilters.find((f) => f.id === status)?.label ?? "";
  const shown = tab === "courses" ? courses.length : programs.length;
  const noun = tab === "courses" ? "courses" : "programs";

  const tabs = myLearningTabs.map((t) => ({
    ...t,
    count: t.id === "courses" ? courseRows.length : myLearningPrograms.length,
  }));

  const notInPrototype = (name: string) => showToast(`${name} is not part of this prototype yet`);

  const listView = view === "list";

  return (
    <section aria-label="My courses and programs" className="flex flex-col gap-4 md:gap-5 lg:gap-6">
      {/* Row 1: the tabs on their 1px border/subtle rule, across the whole width.
          The Size=sm tabs already grow their target to 44 upwards, so the "larger targets"
          min-height is switched off on them: it would make the 32px row 44 tall. */}
      <div className="border-b border-sko-border-subtle pt-2 max-md:[&_[role=tab]]:min-h-0">
        {/* DS Horizontal tabs with a count badge: Size=sm on mobile, md from tablet up. The rule
            is the border of this row, and only the selected panel is rendered. */}
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

      {/* Row 2 (Nelson, 13 Oct 2026): the status filter on the left, the search and the Grid /
          List toggle on the right, 24 apart. Mobile: the search at full width, then the filter. */}
      <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        {/* DS `Button group`: a bg/muted track (padding 4, gap 2, radius 8); the pressed segment is a
            pill on bg/page with 1px border/subtle and text/primary. Segments 32 tall, 44 on mobile.
            Mobile (Nelson, 13 Oct 2026, Figma 7187:37067): the track fills the width and stays
            put; the segments scroll sideways inside it and the last one is cut at its right edge,
            which is the cue that there is more. No scrollbar is drawn. */}
        <div className="min-w-0 md:shrink-0">
          <div
            role="group"
            aria-label={`Filter ${noun} by status`}
            className="flex w-full gap-0.5 overflow-x-auto rounded-lg bg-sko-bg-muted p-1 [scrollbar-width:none] md:inline-flex md:w-auto md:overflow-visible [&::-webkit-scrollbar]:hidden"
          >
            {myLearningStatusFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={status === item.id}
                onClick={() => setStatus(item.id)}
                // A segment reached with the keyboard comes into the track when it was cut off.
                onFocus={(e) => scrollToElement(e.currentTarget, "nearest")}
                className={cn(
                  "sk-text-body-medium-semibold h-8 shrink-0 whitespace-nowrap rounded-md border px-4 transition-colors max-md:h-11",
                  status === item.id
                    ? "border-sko-border-subtle bg-sko-bg-page text-sko-text-primary"
                    : "border-transparent text-sko-text-subtle hover:bg-sko-bg-subtle hover:text-sko-text-default",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <SearchField
            value={query}
            onChange={setQuery}
            label={myLearningSearch.placeholder}
            className="w-full md:w-[240px] lg:w-[320px]"
          />
          <ViewToggle
            view={view}
            onChange={(next) => setParam("view", next, MY_LEARNING_DEFAULT_VIEW)}
            className="hidden shrink-0 lg:inline-flex"
          />
        </div>
      </div>

      <div role="tabpanel" id={platformPanelId(ID_BASE, tab)} aria-labelledby={platformTabId(ID_BASE, tab)}>
        {/* Tells assistive tech how many cards the search or the filter left. */}
        <p role="status" className="sr-only">
          {needle
            ? `${shown} ${noun} match “${query.trim()}”`
            : status !== "all"
              ? `${statusLabel}: ${shown} ${shown === 1 ? noun.slice(0, -1) : noun}`
              : ""}
        </p>

        {/* A new filter or tab cross-fades the cards; the cards rise one after the other. */}
        <div key={`${tab}-${status}`} className="sk-animate-fade sk-enter-only">
          {shown === 0 ? (
            <EmptyState
              icon={Search}
              title={needle ? `No ${noun} match “${query.trim()}”` : `No ${noun} here`}
              description={
                needle
                  ? "Check the spelling or search for another title."
                  : `None of your ${noun} is “${statusLabel}” right now. Choose All to see every one.`
              }
            />
          ) : tab === "courses" ? (
            <>
              {/* items-start: an opened row does not stretch the rows of its line. */}
              <ul className={cn(GRID, "items-start", listView && "lg:hidden")}>
                {courses.map((row, i) => (
                  <CourseRowCard
                    key={row.card.id}
                    {...row}
                    breakpoint="compact"
                    open={openRows.has(row.card.id)}
                    onToggle={() => toggleRow(row.card.id)}
                    className={cn(ROW_HOVER, ROW_ENTER)}
                    style={staggerStyle(i, courses.length)}
                  />
                ))}
              </ul>
              {listView ? (
                <ul className={LIST}>
                  {courses.map((row, i) => (
                    <CourseRowCard
                      key={row.card.id}
                      {...row}
                      breakpoint="desktop"
                      open={openRows.has(row.card.id)}
                      onToggle={() => toggleRow(row.card.id)}
                      className={cn(ROW_HOVER, ROW_ENTER)}
                      style={staggerStyle(i, courses.length)}
                    />
                  ))}
                </ul>
              ) : null}
              {/* The Browse catalog tile is hidden (Nelson, 13 Oct 2026): that way out has not been
                  discussed yet. `BrowseTile` and its copy stay in the code for when it is. */}
            </>
          ) : (
            <>
              {/* Every program card has the same height, whatever its state or title. */}
              <ul className={cn(GRID, "items-start", listView && "lg:hidden")}>
                {programs.map((program, i) => (
                  <li key={program.id} className={cn("min-w-0", ROW_ENTER)} style={staggerStyle(i, programs.length)}>
                    <ProgramCard program={program} layout="grid" onAction={() => notInPrototype(program.cta)} />
                  </li>
                ))}
              </ul>
              {listView ? (
                <ul className={LIST}>
                  {programs.map((program, i) => (
                    <li key={program.id} className={ROW_ENTER} style={staggerStyle(i, programs.length)}>
                      <ProgramCard program={program} layout="list" onAction={() => notInPrototype(program.cta)} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
