"use client";

import * as React from "react";
import { PlatformTopbar } from "./PlatformTopbar";
import { Toast } from "@/components/organisms/Toast";
import { useLmsStore } from "@/lib/store";
import type { PlatformSection } from "@/lib/platform/user";
import { cn } from "@/lib/utils";

const SHOW_MOCK_KEY = "sk-platform-show-mock";

/**
 * Shell of every platform page: the page ground is bg/faint, the light
 * `LMS / Platform / Topbar` on top, then the page's own <main>. The LMS sidebar
 * is in development and hidden on these pages.
 * The page sets its own padding: Dashboard and My Learning use 40 / 32 / 24
 * (desktop / tablet / mobile); Program Detail is full-bleed under the bar.
 *
 * Under the bar sits the test-build note with the "Show which" switch: it sets
 * `data-show-mock` here, and every block tagged `data-mock="<what has no API>"`
 * gets a dashed outline and a SAMPLE chip (styles in app/globals.css), while the note
 * lists what each one is missing.
 */
export function PlatformPage({
  current,
  children,
  className,
}: {
  current: PlatformSection;
  children: React.ReactNode;
  className?: string;
}) {
  const toast = useLmsStore((s) => s.toast);
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
  }, [showMock]);
  return (
    <div
      ref={rootRef}
      className="flex min-h-[100dvh] flex-col bg-sko-bg-faint"
      data-show-mock={showMock ? "" : undefined}
    >
      <PlatformTopbar current={current} />
      {/* Test-build note. The same dashed warning treatment as the /lab note, so a
          screenshot of these pages is not read as a promise about the data. */}
      <div
        role="note"
        className="sk-no-print flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-dashed border-sko-border-warning bg-sko-bg-warning-soft px-4 py-1 text-sko-text-warning md:px-8 lg:px-10"
      >
        <p className="sk-text-sm-regular">
          <span className="sk-text-sm-semibold">Test build.</span> Most figures on this page are sample data: no
          API returns them yet.
        </p>
        <button
          type="button"
          aria-pressed={showMock}
          onClick={toggleMock}
          className="sk-text-sm-semibold inline-flex min-h-11 items-center underline underline-offset-2"
        >
          {showMock ? "Hide sample-data marks" : "Show which"}
        </button>
        {showMock && reasons.length ? (
          <ul className="sk-text-xs-regular w-full list-disc pb-1 ps-5">
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <main id="main" tabIndex={-1} className={cn("flex-1 outline-none", className)}>
        {children}
      </main>
      <Toast toast={toast} onDone={clearToast} />
    </div>
  );
}
