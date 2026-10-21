"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PlatformTopbar } from "./PlatformTopbar";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore } from "@/lib/store";
import type { PlatformSection } from "@/lib/platform/user";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/lib/demo";
import { ArrivalContext, useArrivalController } from "@/lib/arrival/useArrival";
import { PageSkeleton } from "./PageSkeleton";

const SHOW_MOCK_KEY = "sk-platform-show-mock";

/**
 * Shell of every platform page: the page ground is bg/faint, the light
 * `LMS / Platform / Topbar` on top, then the page's own <main>. The LMS sidebar
 * is in development and hidden on these pages.
 * The page sets its own padding: Dashboard and My Learning use 40 / 32 / 24
 * (desktop / tablet / mobile); Program Detail is full-bleed under the bar.
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
  const toast = useLmsStore((s) => s.toast);
  const demo = useDemoMode();
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
      className="flex min-h-[100dvh] flex-col bg-sko-bg-faint"
      data-show-mock={showMock ? "" : undefined}
    >
      <PlatformTopbar current={current} />
      {/* A new route's content comes in (a fade and a 4px nudge); the bar above stays still. */}
      <main
        key={pathname}
        ref={mainRef}
        id="main"
        tabIndex={-1}
        // On a phone the assistant launcher floats 48 + 16 over the bottom right. The test-build
        // footer used to keep 80px under the page; without it (demo mode off) the page keeps it,
        // so the last card or button scrolls clear of the launcher (audit, 21 Oct 2026).
        className={cn("sk-animate-page flex-1 outline-none", !demo && "max-md:pb-20", className)}
      >
        <ArrivalContext.Provider value={arrival}>
          {/* Rendered by the server and until the controller has decided (it only shows under
              data-arrival="pending"), then dropped once the content is in. */}
          {!arrival.decided || !arrival.released ? (
            <div className="sk-arrival-skeleton">
              {skeleton ?? <PageSkeleton />}
            </div>
          ) : null}
          <div data-arrival-content="">{children}</div>
        </ArrivalContext.Provider>
      </main>
      {/* Test-build note, in the footer (Nelson, 15 Oct 2026). The same dashed warning treatment
          as the /lab note, so a screenshot of these pages is not read as a promise about the data.
          max-md:pb-20: on a phone the assistant launcher floats over the bottom right (48 + 16 from
          the edge); the footer, last on the page, keeps 80px under its text so it scrolls clear of it. */}
      {demo ? (
      <footer
        aria-label="Test build"
        className="sk-no-print flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-dashed border-sko-border-warning bg-sko-bg-warning-soft px-4 py-2 text-sko-text-warning max-md:pb-20 md:px-8 lg:px-10"
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
      {/* One persistent live region for the load (outside the keyed <main>, so it is in the page
          before its text changes): "Loading…" while the skeleton shows, empty after. */}
      <p role="status" className="sr-only">
        {arrival.decided && arrival.first && !arrival.released ? "Loading…" : ""}
      </p>
      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
