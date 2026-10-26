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
  Search,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { openAssistant } from "@/lib/assistant/bus";
import { KNOWLEDGE } from "@/lib/assistant/knowledge";
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
 */

type Option =
  | { kind: "page"; id: string; label: string; icon: LucideIcon; href: string }
  | { kind: "course"; id: string; label: string; meta: string; href: string }
  | { kind: "all"; id: string; label: string; href: string }
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

export function HarborSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const id = React.useId();
  const listId = `${id}-list`;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const presence = useExitTransition(open, MOTION_MS.short3);
  const groups = React.useMemo(() => groupsFor(q), [q]);
  const options = groups.flatMap((g) => g.options);
  const optionId = (index: number) => `${id}-opt-${index}`;

  // A click outside closes the palette (the input's blur would close it before a click lands).
  React.useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const choose = (option: Option) => {
    setOpen(false);
    setActive(-1);
    if (option.kind === "help") openAssistant(option.label);
    else router.push(option.href);
  };
  const searchCourses = () => {
    const text = q.trim();
    setOpen(false);
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
    <div ref={rootRef} className={cn("relative w-full max-w-[420px]", className)}>
      <form
        role="search"
        aria-label="Search your courses"
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
          Search pages, your courses and help
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
          placeholder="Search"
          autoComplete="off"
          className="sk-text-body-large-regular min-w-0 flex-1 bg-transparent text-sko-text-default outline-none placeholder:text-sko-text-placeholder focus-visible:!shadow-none focus-visible:!outline-none"
        />
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            openAssistant(q);
          }}
          aria-label={q.trim() ? `Ask the assistant: ${q.trim()}` : "Open the assistant"}
          className="sk-text-body-small-semibold inline-flex h-9 shrink-0 items-center gap-1.5 rounded-pill bg-sko-bg-page pl-4 pr-3 text-sko-text-default shadow-[var(--sk-shadow-harbor-pill)] transition-colors hover:bg-sko-bg-subtle [@container_(max-width:260px)]:pl-3"
        >
          {/* A narrow pill (the tabs bar at 1280) keeps the field: the word goes, the mark stays. */}
          <span className="[@container_(max-width:260px)]:sr-only">Assistant</span>
          <Icon icon={Sparkles} size={16} className="text-sko-icon-primary" aria-hidden />
        </button>
      </form>

      {presence.mounted ? (
        // Centred under the pill without a transform (the menu motion owns the panel's transform).
        <div className="absolute left-1/2 top-[calc(100%+8px)] z-50 flex w-0 justify-center">
          <div
            data-search-palette=""
            data-state={presence.state}
            onAnimationEnd={presence.onAnimationEnd}
            className="sk-animate-menu w-[min(560px,calc(100vw-32px))] shrink-0 origin-top overflow-hidden rounded-surface border border-sko-border-subtle bg-sko-bg-page shadow-xl"
          >
            <div
              id={listId}
              role="listbox"
              aria-label="Search results"
              className="sk-scroll max-h-[min(560px,70dvh)] overflow-y-auto py-2"
            >
              {groups.length === 0 ? (
                <p className="sk-text-body-medium-regular px-5 py-4 text-sko-text-muted">
                  Nothing matches “{q.trim()}”. Press Enter to search your courses, or ask the
                  assistant.
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
                          <Icon icon={Sparkles} size={14} aria-hidden />
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
                            {option.kind === "course" ? (
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
