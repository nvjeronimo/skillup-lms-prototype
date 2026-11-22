import * as React from "react";
import { useRouter } from "@/lib/router";
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
import { useEdxScope } from "@/lib/edx-scope";
import styles from "./HarborSearch.module.css";

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
  { label: "My Certificates", icon: Award, href: "/platform/certificates" },
  { label: "Profile", icon: UserRound, href: "/platform/profile" },
];

/* The bar pill at rest: the search icon, "Search" and the Assistant button, with some air. */
const COLLAPSED = 240;
/* From here the bars have room for the pill at its full width all the time. */
const WIDE = "(min-width: 1536px)";

/* In the player, before anything is typed: the course questions learners ask first. */
const POPULAR_COURSE_HELP = ["Summarize this topic", "Where did I stop?", "What is due this week?"];
const COURSE_HELP = Array.from(new Set(COURSE_ASSISTANT_TOPICS.flatMap((t) => t.questions)));

function courseGroupsFor(
  query: string,
  scope: Extract<SearchScope, { kind: "course" }>,
  edx = false,
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
    { id: "help", title: "Ask about this course", ai: true, options: edx ? [] : help },
  ].filter((g) => g.options.length);
}

/* Shown before anything is typed: the questions learners ask first. */
const POPULAR_HELP = ["completion", "certificate", "saved"];

function groupsFor(
  query: string,
  edx = false,
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
    { id: "pages", title: "Go to", options: edx ? [] : pages },
    { id: "courses", title: "Your courses", options: courses },
    { id: "help", title: "Help", ai: true, options: edx ? [] : help },
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

  // On a large screen (from 1536) there is room: the pill keeps its full width, as before
  // (Nelson, 26 Oct 2026); below, it rests compact and opens when the learner is in it.
  const [wide, setWide] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(WIDE);
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const expanded = sheet || wide || focused || open || q.trim() !== "";
  // Open edX scope: search only (course titles, or the course's topics); the Go to palette, Help,
  // Ask about this course and the Assistant button are ours, and Enter never asks the assistant.
  const edx = useEdxScope();
  const groups = React.useMemo(
    () => (scope.kind === "course" ? courseGroupsFor(q, scope, edx) : groupsFor(q, edx)),
    [q, scope, edx],
  );
  const hasPalette = !edx || groups.length > 0 || q.trim() !== "";
  const presence = useExitTransition(open && hasPalette, MOTION_MS.short3);
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
    if (scope.kind === "course" && edx) {
      if (options[0]) choose(options[0]);
      return;
    }
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
        styles.root,
        sheet ? styles.rootSheet : styles.rootBar,
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
        className={styles.field}
      >
        <Icon icon={Search} size={20} className={styles.fieldIcon} aria-hidden />
        <label htmlFor={id} className="sk-sr-only">
          {scope.kind === "course"
            ? edx
              ? "Search this course"
              : "Search this course or ask the assistant"
            : edx
              ? "Search your courses"
              : "Search pages, your courses and help"}
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
          className={cn("sk-text-body-large-regular", styles.input)}
        />
        <button
          type="button"
          data-assistant-anchor={sheet ? undefined : ""}
          data-invented="assistant: no learner chat assistant in Open edX"
          onClick={ask}
          aria-label={q.trim() ? `Ask the assistant: ${q.trim()}` : "Open the assistant"}
          className={cn("sk-text-body-small-semibold", styles.ask)}
        >
          {/* A narrow pill (the tabs bar at 1280) keeps the field: the word goes, the mark stays. */}
          <span className={styles.askWord}>Assistant</span>
          <AssistantGlyph size={16} className={styles.askGlyph} />
        </button>
      </form>

      {presence.mounted ? (
        // Centred under the pill without a transform (the menu motion owns the panel's transform).
        // In the sheet the palette is the page under the field.
        <div className={sheet ? styles.paletteSlotSheet : styles.paletteSlotBar}>
          <div
            data-search-palette=""
            data-state={presence.state}
            onAnimationEnd={presence.onAnimationEnd}
            className={cn(
              styles.palette,
              sheet ? styles.paletteSheet : cn("sk-animate-menu", styles.paletteBar),
            )}
          >
            <div
              id={listId}
              role="listbox"
              aria-label="Search results"
              className={cn("sk-scroll", styles.list, !sheet && styles.listBar)}
            >
              {groups.length === 0 ? (
                <p className={cn("sk-text-body-medium-regular", styles.empty)}>
                  {scope.kind === "course"
                    ? edx
                      ? `Nothing in this course matches “${q.trim()}”.`
                      : `Nothing in this course matches “${q.trim()}”. Press Enter to ask the assistant.`
                    : edx
                      ? `Nothing matches “${q.trim()}”. Press Enter to search your courses.`
                      : `Nothing matches “${q.trim()}”. Press Enter to search your courses, or ask the assistant.`}
                </p>
              ) : (
                groups.map((group, g) => (
                  <div
                    key={group.id}
                    role="group"
                    aria-labelledby={`${id}-${group.id}`}
                    className={cn(styles.group, g > 0 && styles.groupDivided)}
                  >
                    <div className={styles.groupHeader}>
                      <span
                        id={`${id}-${group.id}`}
                        role="presentation"
                        className={cn("sk-text-body-small-semibold", styles.groupTitle)}
                      >
                        {group.title}
                      </span>
                      {group.ai ? (
                        <span className={cn("sk-text-body-small-semibold", styles.ai)}>
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
                            styles.option,
                            on && styles.optionActive,
                          )}
                        >
                          <Icon
                            icon={icon}
                            size={20}
                            aria-hidden
                            className={cn(
                              styles.optionIcon,
                              option.kind === "help"
                                ? styles.optionIconHelp
                                : styles.optionIconDefault,
                            )}
                          />
                          <span className={styles.optionText}>
                            <span className={cn("sk-text-body-large-regular", styles.optionLabel)}>
                              {option.label}
                            </span>
                            {option.kind === "course" || option.kind === "topic" ? (
                              <span className={cn("sk-text-body-small-regular", styles.optionMeta)}>
                                {option.meta}
                              </span>
                            ) : null}
                          </span>
                          {option.kind === "help" ? (
                            <span className={cn("sk-text-body-small-medium", styles.optionAsk)}>
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
