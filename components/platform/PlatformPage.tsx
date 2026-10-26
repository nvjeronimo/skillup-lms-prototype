"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PlatformTopbar } from "./PlatformTopbar";
import { PlatformTabBar } from "./PlatformTabBar";
import { PlatformFooter } from "./PlatformFooter";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore } from "@/lib/store";
import type { PlatformSection } from "@/lib/platform/user";
import { cn } from "@/lib/utils";
import { inertProps } from "@/lib/inert";
import { useDemoMode } from "@/lib/demo";
import { ArrivalContext, useArrivalController } from "@/lib/arrival/useArrival";
import { PageSkeleton } from "./PageSkeleton";
import { usePersonaGated } from "@/lib/persona-gate";
import { useHarbor } from "@/lib/platform/harbor";
import { HarborRail } from "./harbor/HarborRail";

const SHOW_MOCK_KEY = "sk-platform-show-mock";

/**
 * Shell of every platform page: the page ground is bg/faint, the light
 * `LMS / Platform / Topbar` on top, then the page's own <main>. The LMS sidebar
 * is in development and hidden on these pages.
 * The page sets its own padding from the layout rhythm (DS Layout/*, Nelson 25 Oct 2026):
 * Dashboard, My Learning and the other section pages use page-x / page-top; Program and Course
 * Detail are full-bleed under the bar and use band-x.
 *
 * Under the page, in the footer, sits the test-build note with the "Show which" switch: it sets
 * `data-show-mock` here, and every block tagged `data-mock="<what has no API>"`
 * gets a dashed outline and a SAMPLE chip (styles in app/globals.css), while the note
 * lists what each one is missing.
 *
 * Arrival (motion-matrix §7.9): on a page's first visit in the session the page shows its
 * `skeleton` for the simulated load (PageSkeleton when it has none), then the content, whose
 * `data-arrive={n}` sections rise in order and whose figures count up (lib/arrival). On a
 * revisit the content shows at once with the page fade below.
 */
export function PlatformPage({
  current,
  children,
  className,
  skeleton,
}: {
  /** The section tab to mark current; null on pages outside the five (Edit profile). */
  current: PlatformSection | null;
  children: React.ReactNode;
  className?: string;
  /** The page-shaped skeleton shown during the simulated load of a first visit. */
  skeleton?: React.ReactNode;
}) {
  const pathname = usePathname();
  const mainRef = React.useRef<HTMLElement>(null);
  const arrival = useArrivalController(pathname, mainRef);
  // A synthetic persona is on (Nelson, 25 Oct 2026): the content reads data the server does
  // not have, so it renders after mount; the skeleton holds its place until then.
  const personaGated = usePersonaGated();
  // Harbor (25 Oct 2026): the sections live in a rail on the left from desktop up.
  const harbor = useHarbor();
  const toast = useLmsStore((s) => s.toast);
  const demo = useDemoMode();
  // On a phone the sections float at the bottom (PlatformTabBar, Nelson 22 Oct 2026).
  const phone = useBreakpoint() === "mobile";
  // What the last block on the page keeps under it on a phone: the bar (16 + 52, compact since 23 Oct) and 16 of air,
  // plus the safe area. The assistant launcher sits beside the bar (23 Oct 2026), not above it.
  const phonePad = "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]";
  const clearToast = useLmsStore((s) => s.clearToast);
  // Remembered per browser; read after mount so the server and first client render agree.
  const [showMock, setShowMock] = React.useState(false);
  React.useEffect(() => {
    try {
      setShowMock(localStorage.getItem(SHOW_MOCK_KEY) === "1");
    } catch {
      /* storage blocked: the switch still works for this visit */
    }
  }, []);
  const toggleMock = () =>
    setShowMock((on) => {
      try {
        localStorage.setItem(SHOW_MOCK_KEY, on ? "0" : "1");
      } catch {
        /* see above */
      }
      return !on;
    });
  // With the marks on, the note lists what each marked block is missing. Read from the
  // rendered blocks (only the visible ones: a hidden tab panel keeps its markup), and
  // again when the page changes under it (a tab switch, a search, a new route).
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [reasons, setReasons] = React.useState<string[]>([]);
  React.useEffect(() => {
    const root = rootRef.current;
    if (!showMock || !root) {
      setReasons([]);
      return;
    }
    let timer = 0;
    const read = () => {
      const seen = new Set<string>();
      root.querySelectorAll<HTMLElement>("main [data-mock]").forEach((el) => {
        if (el.offsetParent !== null && el.dataset.mock) seen.add(el.dataset.mock);
      });
      const next = [...seen];
      setReasons((prev) => (prev.join("|") === next.join("|") ? prev : next));
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 80);
    };
    schedule();
    const main = root.querySelector("main");
    const observer = new MutationObserver(schedule);
    if (main) observer.observe(main, { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] });
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
    // The page's <main> is keyed on the route, so a new route is a new element to observe.
  }, [showMock, pathname]);
  return (
    <div
      ref={rootRef}
      data-platform-page=""
      className="flex min-h-[100dvh] flex-col overflow-x-clip bg-sko-bg-faint"
      data-show-mock={showMock ? "" : undefined}
    >
      <PlatformTopbar current={current} />
      {/* Both wrappers grow, so <main> (flex-1) fills a short page and the footer sits at the bottom
          of the screen on every device (Nelson, 26 Oct 2026); the panel layout puts the rail beside. */}
      <div className={cn("flex flex-1 flex-col", harbor && "lg:flex-row lg:items-stretch")}>
      {harbor ? <HarborRail current={current} /> : null}
      <div className="flex min-w-0 flex-1 flex-col">
      {/* A new route's content comes in (a fade and a 4px nudge); the bar above stays still. */}
      <main
        key={pathname}
        ref={mainRef}
        id="main"
        tabIndex={-1}
        // The room the floating tab bar / the assistant launcher need under the page goes under the
        // last block of the page: the micro footer, or the test-build note when it shows.
        className={cn("sk-animate-page flex-1 outline-none", className)}
      >
        <ArrivalContext.Provider value={arrival}>
          {/* Rendered by the server and until the controller has decided (it only shows under
              data-arrival="pending"), then dropped once the content is in. */}
          {!arrival.decided || !arrival.released || personaGated ? (
            <div {...inertProps(true)} className="sk-arrival-skeleton">
              {skeleton ?? <PageSkeleton />}
            </div>
          ) : null}
          <div data-arrival-content="">{personaGated ? null : children}</div>
        </ArrivalContext.Provider>
      </main>
      {/* The micro footer of the platform pages (Nelson, 23 Oct 2026); the player has none. */}
      <PlatformFooter className={cn(!demo && (phone ? phonePad : "max-md:pb-20"))} />
      {/* Test-build note, in the footer (Nelson, 15 Oct 2026). The same dashed warning treatment
          as the /lab note, so a screenshot of these pages is not read as a promise about the data.
          max-md:pb-20: on a phone the assistant launcher floats over the bottom right (48 + 16 from
          the edge); the footer, last on the page, keeps 80px under its text so it scrolls clear of it. */}
      {demo ? (
      <footer
        aria-label="Test build"
        className={cn(
          "sk-no-print flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-dashed border-sko-border-warning bg-sko-bg-warning-soft px-4 py-2 text-sko-text-warning md:px-8 lg:px-10",
          phone ? phonePad : "max-md:pb-20",
        )}
      >
        <p className="sk-text-body-medium-regular">
          <span className="sk-text-body-medium-semibold">Test build.</span> Most figures on this page are sample data: no
          API returns them yet. The navigation is not final either: top bar or sidebar is still under study.
        </p>
        <button
          type="button"
          aria-pressed={showMock}
          onClick={toggleMock}
          className="sk-text-body-medium-semibold inline-flex min-h-11 items-center underline underline-offset-2"
        >
          {showMock ? "Hide sample-data marks" : "Show which"}
        </button>
        {showMock && reasons.length ? (
          <ul className="sk-text-body-small-regular w-full list-disc pb-1 ps-5">
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : null}
      </footer>
      ) : null}
      </div>
      </div>
      {/* One persistent live region for the load (outside the keyed <main>, so it is in the page
          before its text changes): "Loading…" while the skeleton shows, empty after. */}
      <p role="status" className="sr-only">
        {arrival.decided && arrival.first && !arrival.released ? "Loading…" : ""}
      </p>
      {phone ? <PlatformTabBar current={current} /> : null}
      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
