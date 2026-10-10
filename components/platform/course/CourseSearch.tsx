"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { InlineAlert } from "@/components/atoms/InlineAlert";
import { PlatformTabs } from "@/components/platform/PlatformTabs";
import { SearchField } from "@/components/platform/my-learning/SearchField";
import {
  SEARCH_FAIL_WORD,
  SEARCH_PAGE_SIZE,
  hasOwnSearchContent,
  excerptOf,
  searchCourse,
  searchSamples,
  searchPattern,
  type SearchContentType,
  type SearchResult,
} from "@/lib/platform/course-search";
import { useDialog } from "@/lib/useDialog";
import { cn } from "@/lib/utils";

type Filter = "all" | SearchContentType;
const TYPES: SearchContentType[] = ["Text", "Video", "Quiz", "Lesson"];
const isFilter = (value: string | null): value is SearchContentType =>
  TYPES.includes(value as SearchContentType);

type Status = "idle" | "loading" | "done" | "error";

/**
 * The state of one search: the text in the field, the search that was last sent and what
 * came back. The keyword and the type stay in the URL (`q`, `f`), as the platform's own
 * search does, so a result opened and then Back brings the search back.
 */
function useCourseSearch(active: boolean, slug: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlFilter = searchParams.get("f");

  const [text, setText] = React.useState(urlQuery);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [total, setTotal] = React.useState(0);
  const [accessDenied, setAccessDenied] = React.useState(0);
  const [filter, setFilter] = React.useState<Filter>(isFilter(urlFilter) ? urlFilter : "all");
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number>();

  const writeUrl = React.useCallback(
    (q: string, f: Filter) => {
      const next = new URLSearchParams(searchParams.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      if (q && f !== "all") next.set("f", f);
      else next.delete("f");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  /** One request per search, sent on submit only. The delay stands in for the network. */
  const run = React.useCallback((q: string) => {
    window.clearTimeout(timer.current);
    setQuery(q);
    setStatus("loading");
    setOpen(true);
    timer.current = window.setTimeout(() => {
      if (q.toLowerCase() === SEARCH_FAIL_WORD) {
        setStatus("error");
        return;
      }
      const page = searchCourse(q, 0, slug);
      setResults(page.results);
      setTotal(page.total);
      setAccessDenied(page.accessDenied);
      setStatus("done");
    }, 700);
  }, [slug]);

  // A URL that carries `q` reopens the search (a shared link, or Back from a result).
  const restored = React.useRef(false);
  React.useEffect(() => {
    if (restored.current || !active) return;
    restored.current = true;
    if (urlQuery) run(urlQuery);
  }, [active, run, urlQuery]);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  function change(value: string) {
    setText(value);
    // Emptying the field clears the search; typing something else only shows the hint again.
    if (value.trim() === "") {
      window.clearTimeout(timer.current);
      setQuery("");
      setStatus("idle");
      setResults([]);
      setFilter("all");
      writeUrl("", "all");
    }
  }

  function submit() {
    const q = text.trim();
    if (!q) return;
    setFilter("all");
    writeUrl(q, "all");
    run(q);
  }

  /** Prototype helper: fill the field with a sample search and send it. */
  function runSample(q: string) {
    setText(q);
    setFilter("all");
    writeUrl(q, "all");
    run(q);
  }

  function showMore() {
    const page = searchCourse(query, Math.ceil(results.length / SEARCH_PAGE_SIZE), slug);
    setResults((current) => [...current, ...page.results]);
  }

  function selectFilter(next: Filter) {
    setFilter(next);
    writeUrl(query, next);
  }

  /** What the panel shows: the hint while the text differs from what was searched. */
  const view: "none" | "hint" | Status =
    text.trim() === "" ? "none" : text.trim() !== query ? "hint" : status === "idle" ? "hint" : status;

  return {
    slug, text, query, results, total, accessDenied, filter, open, view,
    setOpen, change, submit, showMore, selectFilter, runSample, retry: () => run(query),
  };
}

type Search = ReturnType<typeof useCourseSearch>;

/** The excerpt with every match in semibold, as the platform's `<b>` marks. */
function Excerpt({ text, query }: { text: string; query: string }) {
  const part = excerptOf(text, query);
  const pattern = searchPattern(query);
  if (!pattern) return <>{part}</>;
  const pieces: React.ReactNode[] = [];
  let last = 0;
  for (const match of Array.from(part.matchAll(pattern))) {
    const at = match.index ?? 0;
    if (at > last) pieces.push(part.slice(last, at));
    pieces.push(
      <strong key={at} className="sk-text-body-medium-semibold text-sko-text-default">
        {match[0]}
      </strong>,
    );
    last = at + match[0].length;
  }
  pieces.push(part.slice(last));
  return <>{pieces}</>;
}

/** One result: type, title, excerpt, where it is in the course, how many matches. A link to its topic. */
function ResultRow({
  result,
  query,
  href,
  compact,
}: {
  result: SearchResult;
  query: string;
  href: string;
  /** Mobile: the match count goes under the location, so the text keeps the width. */
  compact?: boolean;
}) {
  const matches = result.text ? `${result.matches} ${result.matches === 1 ? "match" : "matches"}` : null;
  return (
    <li>
      <Link
        href={href}
        className="flex items-start gap-3 rounded-lg p-3 hover:bg-sko-bg-subtle focus-visible:bg-sko-bg-subtle"
      >
        <span className="flex w-[60px] shrink-0">
          <Badge color="gray" size="sm">
            {result.type}
          </Badge>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="sk-text-body-medium-semibold text-sko-text-default">{result.title}</span>
          {result.text ? (
            <span className="sk-text-body-medium-regular text-sko-text-muted">
              <Excerpt text={result.text} query={query} />
            </span>
          ) : null}
          <span className="sk-text-body-small-regular text-sko-text-subtle">{result.location.join("  ›  ")}</span>
          {matches && compact ? (
            <span className="sk-text-body-small-medium text-sko-text-subtle">{matches}</span>
          ) : null}
        </span>
        {matches && !compact ? (
          <span className="sk-text-body-small-medium shrink-0 text-sko-text-subtle">{matches}</span>
        ) : null}
      </Link>
    </li>
  );
}

/**
 * What sits under the field: the hint, the spinner, the results, "no results" or the error.
 * The same content in the desktop popup and in the mobile sheet; on mobile the type tabs
 * are a select (DS `LMS / Mobile Tab Select`).
 */
function SearchPanel({ search, topicHref, compact }: { search: Search; topicHref: string; compact?: boolean }) {
  const idBase = React.useId();
  const { view, text, query, results, total, accessDenied, filter } = search;
  const typed = text.trim();

  // Prototype only, not in the design: with the field empty, the searches that the sample
  // content answers. In the product an empty field shows nothing.
  if (view === "none") {
    return (
      <div data-prototype-note className="flex flex-col gap-3">
        <p className="sk-text-label-small-medium uppercase text-sko-text-subtle">Prototype note · sample content</p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">
          {hasOwnSearchContent(search.slug)
            ? "The prototype searches this course's lesson and topic titles and the few topic bodies written for it."
            : "The prototype searches about forty sample items, not the real course."}{" "}
          Type one of these and press Enter, or select it:
        </p>
        <ul className="flex flex-col gap-1">
          {searchSamples(search.slug).map((sample) => (
            <li key={sample.query}>
              <button
                type="button"
                onClick={() => search.runSample(sample.query)}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left hover:bg-sko-bg-subtle md:min-h-9"
              >
                <span className="sk-text-body-medium-semibold text-sko-text-primary">{sample.query}</span>
                <span className="sk-text-body-small-regular text-sko-text-subtle">{sample.gives}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (view === "hint") {
    return (
      <>
        <p className="flex items-center justify-between gap-3">
          <span className="sk-text-body-medium-medium min-w-0 text-sko-text-default">
            Search this course for “{typed}”
          </span>
          <Badge color="gray" size="sm" className="shrink-0">
            Enter ↵
          </Badge>
        </p>
        <p className="sk-text-body-small-regular text-sko-text-subtle">
          Results show after you press Enter. Titles, texts, quiz questions and video transcripts are searched.
        </p>
      </>
    );
  }

  if (view === "loading") {
    return (
      <p role="status" className="sk-text-body-medium-medium flex h-[68px] items-center justify-center gap-3 text-sko-text-muted">
        <Icon icon={Loader2} size={20} className="animate-spin text-sko-icon-primary motion-reduce:animate-none" aria-hidden="true" />
        Searching…
      </p>
    );
  }

  if (view === "error") {
    return (
      <>
        <InlineAlert
          tone="error"
          title="The search did not work"
          description="Try again in a few minutes. If it keeps failing, contact support."
        />
        <div>
          <Button hierarchy="link" size="sm" onClick={search.retry}>
            Try again
          </Button>
        </div>
      </>
    );
  }

  if (view !== "done") return null;

  if (total === 0) {
    return (
      <div role="status" className="flex flex-col gap-3">
        <p className="sk-text-body-large-semibold text-sko-text-default">No results for “{query}”</p>
        <p className="sk-text-body-medium-regular text-sko-text-muted">
          Check the spelling, or try fewer or different words. The search looks in titles, texts, quiz questions
          and video transcripts of this course.
        </p>
      </div>
    );
  }

  const counts = TYPES.map((type) => ({ type, count: results.filter((r) => r.type === type).length })).filter(
    (c) => c.count > 0,
  );
  const tabs = [{ id: "all" as Filter, label: "All", count: results.length }].concat(
    counts.map((c) => ({ id: c.type as Filter, label: c.type, count: c.count })),
  );
  // A filter kept in the URL may have no result in this search: it then falls back to All.
  const current: Filter = filter !== "all" && counts.some((c) => c.type === filter) ? filter : "all";
  const shown = current === "all" ? results : results.filter((r) => r.type === current);
  const heading =
    current === "all"
      ? results.length < total
        ? `${results.length} of ${total} results for “${query}”`
        : `${total} ${total === 1 ? "result" : "results"} for “${query}”`
      : `${shown.length} ${current.toLowerCase()} ${shown.length === 1 ? "result" : "results"} for “${query}”`;

  return (
    <>
      <p role="status" className="sk-text-body-medium-medium text-sko-text-subtle">
        {heading}
      </p>
      {/* The platform shows the types only when the results have more than one. */}
      {counts.length > 1 ? (
        compact ? (
          <label className="flex flex-col">
            <span className="sr-only">Show results of type</span>
            <select
              value={current}
              onChange={(event) => search.selectFilter(event.target.value as Filter)}
              className="sk-text-body-medium-semibold h-11 rounded-lg border border-sko-border-primary bg-sko-bg-page px-3 text-sko-text-primary"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label} {tab.count}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <PlatformTabs
            tabs={tabs}
            value={current}
            onChange={search.selectFilter}
            size="sm"
            panels="selected"
            idBase={idBase}
            ariaLabel="Result types"
          />
        )
      ) : null}
      <ul
        className={cn("flex flex-col gap-1", !compact && "sk-scroll max-h-[min(614px,55vh)] overflow-y-auto")}
        aria-label={heading}
      >
        {shown.map((result) => (
          <ResultRow key={result.id} result={result} query={query} href={result.href ?? topicHref} compact={compact} />
        ))}
      </ul>
      {current === "all" ? (
        <div className="flex min-h-7 items-center justify-between gap-3">
          <p className="sk-text-body-small-regular text-sko-text-subtle">
            Showing {results.length} of {total}
          </p>
          {results.length < total ? (
            <Button hierarchy="link" size="sm" onClick={search.showMore}>
              Show more results
            </Button>
          ) : null}
        </div>
      ) : null}
      {/* The count is about the whole search, so it shows on All only, like the footer. */}
      {accessDenied > 0 && current === "all" ? (
        <p className="sk-text-body-small-regular text-sko-text-subtle">
          {accessDenied} more {accessDenied === 1 ? "result is" : "results are"} in content that is not open to you yet.
        </p>
      ) : null}
    </>
  );
}

export interface CourseSearchProps {
  /** Placeholder and accessible name of the field. */
  label: string;
  /** Where a result without a topic of its own goes: the topic the course resumes on. */
  topicHref: string;
  /** The course searched: one with content of its own is searched in that content. */
  slug: string;
  /**
   * `popup`: desktop and tablet, the results open in a panel 8 under the field, right-aligned
   * with it, 560 wide. `sheet`: mobile, the search opens as a full screen with the field and Cancel.
   */
  variant: "popup" | "sheet";
  className?: string;
}

/**
 * Content search of a course (feature 33; Figma section 6837:27914, eight screens; metadata
 * map §39). The search runs on submit only (Enter, or the Search key on a phone): while the
 * learner types, the panel only says what Enter will do. Esc or a click outside closes the
 * popup and keeps the text; emptying the field clears the search.
 *
 * Both the popup and the sheet are local compositions, as in Figma: the DS has no search
 * popup and no result row yet.
 */
export function CourseSearch({ label, topicHref, slug, variant, className }: CourseSearchProps) {
  // Two instances live on the page (tab row from tablet up, top of the Course tab on mobile);
  // only the one that is on screen restores a search from the URL.
  const [active, setActive] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setActive(mq.matches === (variant === "popup"));
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [variant]);

  const search = useCourseSearch(active, slug);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const sheetInputRef = React.useRef<HTMLInputElement>(null);
  const { setOpen } = search;
  const sheetOpen = variant === "sheet" && search.open;
  const closeSheet = React.useCallback(() => setOpen(false), [setOpen]);
  const sheetRef = useDialog(sheetOpen, closeSheet, { initialFocusRef: sheetInputRef });

  // Popup: a click outside closes it. The text stays in the field.
  React.useEffect(() => {
    if (variant !== "popup" || !search.open) return;
    const onDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [variant, search.open, setOpen]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    search.submit();
  };

  if (variant === "sheet") {
    return (
      <div className={className}>
        {/* On the page the field is the way in: focusing it opens the full-screen search. */}
        <SearchField
          value={search.text}
          onChange={() => {}}
          label={label}
          inputProps={{ readOnly: true, onFocus: () => setOpen(true), onClick: () => setOpen(true), "aria-haspopup": "dialog" }}
        />
        {sheetOpen ? (
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="fixed inset-0 z-[60] flex flex-col bg-sko-bg-page"
          >
            <form role="search" onSubmit={onSubmit} className="flex items-center gap-3 border-b border-sko-border-subtle p-4">
              <SearchField
                value={search.text}
                onChange={search.change}
                label={label}
                className="min-w-0 flex-1"
                inputRef={sheetInputRef}
                inputProps={{ name: "q", enterKeyHint: "search" }}
              />
              <Button type="button" hierarchy="link" size="sm" onClick={closeSheet}>
                Cancel
              </Button>
            </form>
            <div className="sk-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
              <SearchPanel search={search} topicHref={topicHref} compact />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // With the field empty the popup holds the prototype's sample searches.
  const showPopup = search.open;
  return (
    <div ref={rootRef} className={className}>
     {/* The popup hangs from the field itself, 8 under it, whatever padding the row gives this block. */}
     <div
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape" && search.open) {
          event.stopPropagation();
          setOpen(false);
        }
      }}
     >
      <form role="search" onSubmit={onSubmit}>
        <SearchField
          value={search.text}
          onChange={(value) => {
            search.change(value);
            setOpen(true);
          }}
          label={label}
          // `name="q"`: if Enter is pressed before the page is interactive, the browser submits the
          // form itself and the search comes back from the URL instead of being lost.
          inputProps={{ name: "q", onFocus: () => setOpen(true), enterKeyHint: "search" }}
        />
      </form>
      {showPopup ? (
        <section
          aria-label="Search results"
          className="absolute right-0 top-full z-30 mt-2 flex w-[560px] max-w-[calc(100vw-48px)] flex-col gap-3 rounded-lg border border-sko-border-default bg-sko-bg-page p-4 shadow-2xl"
        >
          <SearchPanel search={search} topicHref={topicHref} />
        </section>
      ) : null}
     </div>
    </div>
  );
}
