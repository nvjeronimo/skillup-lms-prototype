"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/atoms/EmptyState";
import { CourseRowCard } from "@/components/platform/CourseRowCard";
import { PlatformTabs, platformPanelId, platformTabId } from "@/components/platform/PlatformTabs";
import { useLmsStore } from "@/lib/store";
import {
  MY_LEARNING_DEFAULT_VIEW,
  MY_LEARNING_TAB_KEY,
  myLearningFirstTab,
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
import { useEqualHeights } from "@/lib/useEqualHeights";
import { HarborCourseTable } from "@/components/platform/harbor/HarborCourseTable";
import { ProgramCard } from "./ProgramCard";
import { StickyToolbar } from "@/components/platform/StickyToolbar";
import { SearchField } from "./SearchField";
import { ViewToggle } from "./ViewToggle";

const ID_BASE = "my-learning";

/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile, grid-gap apart (DS Layout/*). */
/* The status filter's track (DS Button group); its skeleton reuses it. */
export const MY_LEARNING_FILTER_TRACK =
  "flex w-full gap-0.5 overflow-x-auto rounded-track bg-sko-bg-track p-1 [scrollbar-width:none] md:inline-flex md:w-auto md:overflow-visible [&::-webkit-scrollbar]:hidden";
export const MY_LEARNING_GRID =
  "grid grid-cols-1 gap-layout-grid md:grid-cols-2 lg:grid-cols-3";
/* List: one column, grid-gap apart; from a tablet up since 23 Oct 2026 (Nelson). */
const LIST = "hidden flex-col gap-layout-grid md:flex";

/* The row is the target of its card's title link: it shows it on hover, as the card did. */
const ROW_HOVER = "min-w-0 transition-colors has-[h3_a:hover]:border-sko-border-default";
/* A card coming into the list rises a nudge (4px), one after the other (staggerStyle). */
const ROW_ENTER = "sk-animate-rise sk-rise-nudge sk-enter-only";

const matches = (title: string, query: string) => title.toLowerCase().includes(query);

/**
 * The Collection of My Learning (6394:16636 and siblings): Toolbar + the cards of the
 * selected tab, stack-gap apart (DS Layout/*, Nelson 25 Oct 2026).
 * Toolbar (Nelson, 13 Oct 2026): the Tabs alone on the first row, on a 1px border/subtle rule
 * across the width, 8 above. Second row: the status filter on the left, Search (320 on
 * desktop, 240 on tablet) and the Grid / List toggle on the right. Mobile: the tabs, the
 * search at full width, then the filter, 16 apart.
 * The tab and the view live in the URL (`?tab=programs`, `?view=list`; the drawn defaults,
 * Courses and Grid, leave it clean). Search filters the cards of the selected tab by title.
 * The Grid / List toggle shows from a tablet up (Nelson, 23 Oct 2026; it used to hide below
 * desktop). List on a tablet: course rows take the stacked list card (progress above the Up next
 * box), program cards their list layout. A phone stays Grid: a list card does not fit 343, and a
 * `?view=list` URL still shows the grid there.
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
 *
 * Arrival (motion-matrix §7.9): on the page's first visit the tabs, the toolbar and the panel
 * rise after the title (`data-arrive` 1–3); a filter, a search or a tab change later only
 * cross-fades the cards, as before.
 */
export function MyLearningCollection({ courseRows }: { courseRows: MyLearningCourseRow[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const showToast = useLmsStore((s) => s.showToast);
  // `?q=`: a search from Harbor's top bar lands here with its words (25 Oct 2026).
  const [query, setQuery] = React.useState(() => params.get("q") ?? "");
  const paramQ = params.get("q");
  React.useEffect(() => {
    if (paramQ !== null) setQuery(paramQ);
  }, [paramQ]);
  // A link may open the list on a status (the Dashboard glance figures: ?status=in-progress|completed).
  const linkedStatus = params.get("status");
  const [status, setStatus] = React.useState<MyLearningStatusFilter>(
    myLearningStatusFilters.some((f) => f.id === linkedStatus) ? (linkedStatus as MyLearningStatusFilter) : "all",
  );
  // The rows opened by the learner, by course id: the grid and the list show the same ones.
  const [openRows, setOpenRows] = React.useState<Set<string>>(() => new Set());
  const toggleRow = (id: string) =>
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // The tab: `?tab=` when the link says one; otherwise the one the learner last opened (kept in
  // this browser); the first time, Programs when they are enrolled in one (Nelson, 16 Oct 2026).
  const paramTab = params.get("tab");
  const linkedTab: MyLearningTab | null =
    paramTab === "programs" || paramTab === "courses" ? paramTab : null;
  const [storedTab, setStoredTab] = React.useState<MyLearningTab | null>(null);
  React.useEffect(() => {
    try {
      const v = localStorage.getItem(MY_LEARNING_TAB_KEY);
      if (v === "programs" || v === "courses") setStoredTab(v);
    } catch {
      /* storage blocked: the first-time rule applies */
    }
  }, []);
  const tab: MyLearningTab =
    linkedTab ?? storedTab ?? myLearningFirstTab(myLearningPrograms.length);
  const rememberTab = (t: MyLearningTab) => {
    setStoredTab(t);
    try {
      localStorage.setItem(MY_LEARNING_TAB_KEY, t);
    } catch {
      /* see above */
    }
  };
  React.useEffect(() => {
    if (linkedTab) rememberTab(linkedTab);
  }, [linkedTab]);
  // `?view=grid` too: a synthetic persona can open on the list (Nelson, 25 Oct 2026), and the grid is then the one asked for.
  const viewParam = params.get("view");
  const view: MyLearningView =
    viewParam === "list" || viewParam === "grid" || viewParam === "table" ? viewParam : MY_LEARNING_DEFAULT_VIEW;
  // The table view (Harbor first, every skin since 26 Oct 2026, Nelson) is for courses; on Programs
  // it reads as the list.
  const tableView = view === "table" && tab === "courses";

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
    myLearningStatusOrder.indexOf(myLearningStateOf(a)) -
    myLearningStatusOrder.indexOf(myLearningStateOf(b));
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

  const listView = view === "list" || (view === "table" && tab !== "courses");
  // Every card has the height of the tallest one, in the grid and in the list (course rows; a title can take two lines).
  // Not on a phone (below md, one column): there the cards keep their own height (25 Oct 2026).
  const gridRef = useEqualHeights<HTMLDivElement>(
    "[data-card-grid]",
    [tab, status, needle, view, courses.length, programs.length],
    { minWidth: 768 },
  );

  return (
    <section aria-label="My courses and programs" className="flex flex-col gap-layout-stack">
      {/* The tabs and the filter row stay at hand: stuck to the top on scroll up (StickyToolbar). */}
      <StickyToolbar bleed className="flex flex-col gap-6">
        {/* Row 1: the tabs on their 1px border/subtle rule, across the whole width.
          The Size=sm tabs already grow their target to 44 upwards, so the "larger targets"
          min-height is switched off on them: it would make the 32px row 44 tall. */}
        <div
          data-arrive={1}
          className="border-b border-sko-border-subtle pt-2 max-md:[&_[role=tab]]:min-h-0"
        >
          {/* DS Horizontal tabs with a count badge: Size=sm on mobile, md from tablet up. The rule
            is the border of this row, and only the selected panel is rendered. */}
          <PlatformTabs
            tabs={tabs}
            value={tab}
            onChange={(id) => {
              rememberTab(id as MyLearningTab);
              setParam("tab", id, "");
            }}
            size="responsive"
            rule="parent"
            panels="selected"
            idBase={ID_BASE}
            ariaLabel="My learning"
          />
        </div>

        {/* Row 2 (Nelson, 13 Oct 2026): the status filter on the left, the search and the Grid /
          List toggle on the right, 24 apart. Mobile: the search at full width, then the filter. */}
        <div
          data-arrive={2}
          className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between md:gap-6"
        >
          {/* DS `Button group`: a bg/muted track (padding 4, gap 2, radius 8); the pressed segment is a
            pill on bg/page with 1px border/subtle and text/primary. Segments 32 tall, 44 on mobile.
            Mobile (Nelson, 13 Oct 2026, Figma 7187:37067): the track fills the width and stays
            put; the segments scroll sideways inside it and the last one is cut at its right edge,
            which is the cue that there is more. No scrollbar is drawn. */}
          <div className="min-w-0 md:shrink-0">
            <div
              role="group"
              aria-label={`Filter ${noun} by status`}
              className={MY_LEARNING_FILTER_TRACK}
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
                    "sk-text-body-medium-semibold h-8 shrink-0 whitespace-nowrap rounded-control border px-4 transition-colors max-md:h-11",
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
          {/* Stuck to the top, the bar keeps the tabs and the filter; the search steps out unless it holds a query. */}
          <div data-search-slot="" data-keep={query ? "" : undefined} className="flex min-w-0 items-center gap-2">
            <div data-hide-when-stuck="" data-keep={query ? "" : undefined} className="w-full md:w-auto">
              <SearchField
                value={query}
                onChange={setQuery}
                label={myLearningSearch.placeholder}
                className="w-full md:w-[240px] lg:w-[320px]"
              />
            </div>
            <ViewToggle
              view={view}
              withTable
              onChange={(next) => setParam("view", next, MY_LEARNING_DEFAULT_VIEW)}
              className="hidden shrink-0 md:inline-flex"
            />
          </div>
        </div>
      </StickyToolbar>

      <div
        data-arrive={3}
        role="tabpanel"
        id={platformPanelId(ID_BASE, tab)}
        aria-labelledby={platformTabId(ID_BASE, tab)}
      >
        {/* The card titles are h3: this h2 (the tab's own name) keeps the outline h1 → h2 → h3. */}
        <h2 className="sr-only">{myLearningTabs.find((t) => t.id === tab)?.label ?? noun}</h2>
        {/* Tells assistive tech how many cards the search or the filter left. */}
        <p role="status" className="sr-only">
          {needle
            ? `${shown} ${noun} match “${query.trim()}”`
            : status !== "all"
              ? `${statusLabel}: ${shown} ${shown === 1 ? noun.slice(0, -1) : noun}`
              : ""}
        </p>

        {/* A new filter or tab cross-fades the cards; the cards rise one after the other. */}
        <div key={`${tab}-${status}`} ref={gridRef} className="sk-animate-fade sk-enter-only">
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
              {tableView ? (
                <div className="hidden md:block">
                  <HarborCourseTable courses={courses.map((r) => r.card)} onAction={(c) => notInPrototype(c.cta)} />
                </div>
              ) : null}
              {/* items-start: an opened row does not stretch the rows of its line. */}
              <ul className={cn(MY_LEARNING_GRID, "items-start", (listView || tableView) && "md:hidden")}>
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
              {/* Every program card has the same height, whatever its state or title (useEqualHeights). */}
              <ul className={cn(MY_LEARNING_GRID, "items-start", listView && "md:hidden")}>
                {programs.map((program, i) => (
                  <li
                    key={program.id}
                    className={cn("min-w-0", ROW_ENTER)}
                    style={staggerStyle(i, programs.length)}
                  >
                    <ProgramCard
                      program={program}
                      layout="grid"
                      onAction={() => notInPrototype(program.cta)}
                    />
                  </li>
                ))}
              </ul>
              {listView ? (
                <ul className={LIST}>
                  {programs.map((program, i) => (
                    <li
                      key={program.id}
                      className={ROW_ENTER}
                      style={staggerStyle(i, programs.length)}
                    >
                      <ProgramCard
                        program={program}
                        layout="list"
                        onAction={() => notInPrototype(program.cta)}
                      />
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
