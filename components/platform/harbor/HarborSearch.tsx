"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  BookOpen,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  MessagesSquare,
  ListTree,
  Search,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { openAssistant } from "@/lib/assistant/bus";
import { KNOWLEDGE } from "@/lib/assistant/knowledge";
import { COURSE_ASSISTANT_TOPICS } from "@/lib/assistant/topics";
import { AssistantGlyph } from "@/components/assistant/AssistantGlyph";
import { myLearningCourses } from "@/lib/platform/my-learning";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn } from "@/lib/utils";

/**
 * The panel layout's top-bar search (Harbor, Fluent; Nelson, 25–26 Oct 2026, after the DreamHost
 * panel): one pale pill in the middle of the bar, the assistant's button inside it. Focusing it
 * opens a palette under the pill, as the panel's: Go to (the platform's pages), Your courses (the
 * titles that match what is typed) and Help (the assistant's own answers, "Powered by AI"). Arrows
 * move through the options, Enter opens one (or searches My Learning when none is picked), Esc
 * closes. Open edX searches one course at a time, so "your courses" means their titles, as My
 * Learning's own search.
 *
 * Since 26 Oct 2026 (Nelson) it is the assistant's only way in, everywhere: every skin's platform
 * bar, the player's bar with `scope` "course" (In this course: the topics whose title matches;
 * Ask about this course: the course questions; Enter asks the assistant), and, where the pill does
 * not fit, a full-screen sheet (`layout` "sheet", SearchAssistantButton) with the palette inline.
 * The Assistant button carries `data-assistant-anchor`: the window hangs under it.
 */

export type SearchScope =
  | { kind: "platform" }
  | { kind: "course"; title: string; topics: { id: string; title: string; meta: string; href: string }[] };

type Option =
  | { kind: "page"; id: string; label: string; icon: LucideIcon; href: string }
  | { kind: "course"; id: string; label: string; meta: string; href: string }
  | { kind: "all"; id: string; label: string; href: string }
  | { kind: "topic"; id: string; label: string; meta: string; href: string }
  | { kind: "help"; id: string; label: string };

const PAGES: { label: string; icon: LucideIcon; href: string }[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/platform/dashboard" },
  { label: "My Learning", icon: BookOpen, href: "/platform/my-learning" },
  { label: "Calendar", icon: CalendarDays, href: "/platform/calendar" },
  { label: "Discussion", icon: MessagesSquare, href: "/platform/discussion" },
  { label: "Services", icon: LifeBuoy, href: "/platform/services" },
  { label: "Certificates", icon: Award, href: "/platform/certificates" },
  { label: "Profile", icon: UserRound, href: "/platform/profile" },
];

/* The bar pill at rest: the search icon, "Search" and the Assistant button, with some air. */
const COLLAPSED = 240;

/* In the player, before anything is typed: the course questions learners ask first. */
const POPULAR_COURSE_HELP = ["Summarize this topic", "Where did I stop?", "What is due this week?"];
const COURSE_HELP = Array.from(new Set(COURSE_ASSISTANT_TOPICS.flatMap((t) => t.questions)));

function courseGroupsFor(
  query: string,
  scope: Extract<SearchScope, { kind: "course" }>,
): { id: string; title: string; ai?: boolean; options: Option[] }[] {
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const topics: Option[] = q
    ? scope.topics
        .filter((t) => t.title.toLowerCase().includes(q))
        .slice(0, 6)
        .map((t) => ({ kind: "topic", id: `topic-${t.id}`, label: t.title, meta: t.meta, href: t.href }))
    : [];
  const help: Option[] = (q ? COURSE_HELP.filter((h) => words.some((w) => h.toLowerCase().includes(w))) : POPULAR_COURSE_HELP)
    .slice(0, 4)
    .map((h) => ({ kind: "help", id: `help-${h}`, label: h }));
  return [
    { id: "topics", title: "In this course", options: topics },
    { id: "help", title: "Ask about this course", ai: true, options: help },
  ].filter((g) => g.options.length);
}

/* Shown before anything is typed: the questions learners ask first. */
const POPULAR_HELP = ["completion", "certificate", "saved"];

function groupsFor(
  query: string,
): { id: string; title: string; ai?: boolean; options: Option[] }[] {
  const q = query.trim().toLowerCase();
  const has = (text: string) => !q || text.toLowerCase().includes(q);
  const pages: Option[] = PAGES.filter((p) => has(p.label)).map((p) => ({
    kind: "page",
    id: `page-${p.href}`,
    ...p,
  }));
  const courses: Option[] = q
    ? [
        ...myLearningCourses
          .filter((c) => c.title.toLowerCase().includes(q))
          .slice(0, 4)
          .map(
            (c): Option => ({
              kind: "course",
              id: `course-${c.id}`,
              label: c.title,
              meta: c.progressPct ? `${c.progressPct}% complete` : "Not started",
              href: c.detailHref ?? "/platform/my-learning",
            }),
          ),
        {
          kind: "all",
          id: "all",
          label: `Search all your courses for “${query.trim()}”`,
          href: `/platform/my-learning?tab=courses&q=${encodeURIComponent(query.trim())}`,
        },
      ]
    : [];
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const help: Option[] = (
    q
      ? KNOWLEDGE.filter((k) => words.some((w) => k.question.toLowerCase().includes(w)))
      : KNOWLEDGE.filter((k) => POPULAR_HELP.includes(k.id))
  )
    .slice(0, 4)
    .map((k) => ({ kind: "help", id: `help-${k.id}`, label: k.question }));
  return [
    { id: "pages", title: "Go to", options: pages },
    { id: "courses", title: "Your courses", options: courses },
    { id: "help", title: "Help", ai: true, options: help },
  ].filter((g) => g.options.length);
}

export function HarborSearch({
  className,
  scope = { kind: "platform" },
  layout = "bar",
  width = 420,
  onDone,
}: {
  className?: string;
  scope?: SearchScope;
  /** "sheet": inside SearchAssistantButton's full-screen sheet: palette inline and always open. */
  layout?: "bar" | "sheet";
  /**
   * The bar pill's open width. At rest it is only as wide as "Search" and the Assistant button
   * (COLLAPSED); it grows to this width while the learner is in it (Nelson, 26 Oct 2026).
   */
  width?: number;
  /** Called once an option is chosen or the assistant opens (the sheet closes itself). */
  onDone?: () => void;
}) {
  const sheet = layout === "sheet";
  const [focused, setFocused] = React.useState(false);
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [openState, setOpen] = React.useState(false);
  const open = sheet || openState;
  const [active, setActive] = React.useState(-1);
  const id = React.useId();
  const listId = `${id}-list`;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const expanded = sheet || focused || open || q.trim() !== "";
  const presence = useExitTransition(open, MOTION_MS.short3);
  const groups = React.useMemo(
    () => (scope.kind === "course" ? courseGroupsFor(q, scope) : groupsFor(q)),
    [q, scope],
  );
  const options = groups.flatMap((g) => g.options);
  const optionId = (index: number) => `${id}-opt-${index}`;

  // A click outside closes the palette (the input's blur would close it before a click lands).
  React.useEffect(() => {
    if (!open || sheet) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, sheet]);
  React.useEffect(() => {
    if (sheet) inputRef.current?.focus();
  }, [sheet]);

  const choose = (option: Option) => {
    setOpen(false);
    setActive(-1);
    onDone?.();
    if (option.kind === "help") openAssistant(option.label);
    else router.push(option.href);
  };
  const ask = () => {
    setOpen(false);
    onDone?.();
    openAssistant(q);
  };
  // Enter with nothing picked: My Learning's search on the platform; in the player, the assistant.
  const searchCourses = () => {
    const text = q.trim();
    if (scope.kind === "course") return ask();
    setOpen(false);
    onDone?.();
    router.push(`/platform/my-learning?tab=courses${text ? `&q=${encodeURIComponent(text)}` : ""}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      if (!options.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + options.length) % options.length);
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  let index = -1;
  return (
    <div
      ref={rootRef}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      style={sheet ? undefined : { width: expanded ? width : COLLAPSED }}
      className={cn(
        "relative",
        sheet ? "w-full" : "min-w-0 max-w-full shrink transition-[width] duration-short4 ease-standard",
        className,
      )}
    >
      <form
        role="search"
        aria-label={scope.kind === "course" ? "Search this course" : "Search your courses"}
        onSubmit={(e) => {
          e.preventDefault();
          const picked = open && active >= 0 ? options[active] : undefined;
          if (picked) choose(picked);
          else searchCourses();
        }}
        className={cn(
          "flex h-12 w-full items-center gap-2 rounded-pill bg-sko-bg-track pl-4 pr-1.5 [container-type:inline-size]",
          "focus-within:shadow-[0_0_0_2px_var(--color-border-focus-gap),0_0_0_4px_var(--color-border-primary)]",
        )}
      >
        <Icon icon={Search} size={20} className="shrink-0 text-sko-icon-subtle" aria-hidden />
        <label htmlFor={id} className="sr-only">
          {scope.kind === "course" ? "Search this course or ask the assistant" : "Search pages, your courses and help"}
        </label>
        <input
          ref={inputRef}
          id={id}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={scope.kind === "course" && expanded ? "Search this course" : "Search"}
          autoComplete="off"
          className="sk-text-body-large-regular min-w-0 flex-1 bg-transparent text-sko-text-default outline-none placeholder:text-sko-text-placeholder focus-visible:!shadow-none focus-visible:!outline-none"
        />
        <button
          type="button"
          data-assistant-anchor={sheet ? undefined : ""}
          onClick={ask}
          aria-label={q.trim() ? `Ask the assistant: ${q.trim()}` : "Open the assistant"}
          className="sk-text-body-small-semibold inline-flex h-9 shrink-0 items-center gap-1.5 rounded-pill bg-sko-bg-page pl-4 pr-3 text-sko-text-default shadow-[var(--sk-shadow-harbor-pill)] transition-colors hover:bg-sko-bg-subtle [@container_(max-width:220px)]:pl-3"
        >
          {/* A narrow pill (the tabs bar at 1280) keeps the field: the word goes, the mark stays. */}
          <span className="[@container_(max-width:220px)]:sr-only">Assistant</span>
          <AssistantGlyph size={16} className="text-sko-icon-primary" />
        </button>
      </form>

      {presence.mounted ? (
        // Centred under the pill without a transform (the menu motion owns the panel's transform).
        // In the sheet the palette is the page under the field.
        <div className={cn(sheet ? "mt-4" : "absolute left-1/2 top-[calc(100%+8px)] z-50 flex w-0 justify-center")}>
          <div
            data-search-palette=""
            data-state={presence.state}
            onAnimationEnd={presence.onAnimationEnd}
            className={cn(
              "overflow-hidden bg-sko-bg-page",
              sheet
                ? "w-full"
                : "sk-animate-menu w-[min(560px,calc(100vw-32px))] shrink-0 origin-top rounded-surface border border-sko-border-subtle shadow-xl",
            )}
          >
            <div
              id={listId}
              role="listbox"
              aria-label="Search results"
              className={cn("sk-scroll overflow-y-auto py-2", !sheet && "max-h-[min(560px,70dvh)]")}
            >
              {groups.length === 0 ? (
                <p className="sk-text-body-medium-regular px-5 py-4 text-sko-text-muted">
                  {scope.kind === "course"
                    ? `Nothing in this course matches “${q.trim()}”. Press Enter to ask the assistant.`
                    : `Nothing matches “${q.trim()}”. Press Enter to search your courses, or ask the assistant.`}
                </p>
              ) : (
                groups.map((group, g) => (
                  <div
                    key={group.id}
                    role="group"
                    aria-labelledby={`${id}-${group.id}`}
                    className={cn("px-2 pb-2 pt-3", g > 0 && "border-t border-sko-border-subtle")}
                  >
                    <div className="flex items-center justify-between px-3 pb-2">
                      <span
                        id={`${id}-${group.id}`}
                        role="presentation"
                        className="sk-text-body-small-semibold text-sko-text-subtle"
                      >
                        {group.title}
                      </span>
                      {group.ai ? (
                        <span className="sk-text-body-small-semibold inline-flex items-center gap-1 text-sko-text-primary">
                          <AssistantGlyph size={14} />
                          Powered by AI
                        </span>
                      ) : null}
                    </div>
                    {group.options.map((option) => {
                      index += 1;
                      const i = index;
                      const on = i === active;
                      const icon =
                        option.kind === "page"
                          ? option.icon
                          : option.kind === "help"
                            ? FileText
                            : option.kind === "all"
                              ? Search
                              : option.kind === "topic"
                                ? ListTree
                                : BookOpen;
                      return (
                        <div
                          key={option.id}
                          id={optionId(i)}
                          role="option"
                          aria-selected={on}
                          onPointerDown={(e) => e.preventDefault()}
                          onPointerMove={() => setActive(i)}
                          onClick={() => choose(option)}
                          className={cn(
                            "flex min-h-12 cursor-pointer items-center gap-4 rounded-control px-3 py-2",
                            on && "bg-sko-bg-hover",
                          )}
                        >
                          <Icon
                            icon={icon}
                            size={20}
                            aria-hidden
                            className={cn(
                              "shrink-0",
                              option.kind === "help"
                                ? "text-sko-icon-primary"
                                : "text-sko-icon-subtle",
                            )}
                          />
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="sk-text-body-large-regular truncate text-sko-text-default">
                              {option.label}
                            </span>
                            {option.kind === "course" || option.kind === "topic" ? (
                              <span className="sk-text-body-small-regular text-sko-text-subtle">
                                {option.meta}
                              </span>
                            ) : null}
                          </span>
                          {option.kind === "help" ? (
                            <span className="sk-text-body-small-medium shrink-0 text-sko-text-subtle">
                              Ask
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
