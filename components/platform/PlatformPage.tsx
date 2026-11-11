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
import { ArrivalContext, useArrivalController } from "@/lib/arrival/useArrival";
import { PageSkeleton } from "./PageSkeleton";
import { usePersonaGated } from "@/lib/persona-gate";
import { useHarbor } from "@/lib/platform/harbor";
import { HarborRail } from "./harbor/HarborRail";

/**
 * Shell of every platform page: the page ground is bg/faint, the light
 * `LMS / Platform / Topbar` on top, then the page's own <main>. The LMS sidebar
 * is in development and hidden on these pages.
 * The page sets its own padding from the layout rhythm (DS Layout/*, Nelson 25 Oct 2026):
 * Dashboard, My Learning and the other section pages use page-x / page-top; Program and Course
 * Detail are full-bleed under the bar and use band-x.
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
  // On a phone the sections float at the bottom (PlatformTabBar, Nelson 22 Oct 2026).
  const phone = useBreakpoint() === "mobile";
  // What the last block on the page keeps under it on a phone: the bar (16 + 52, compact since 23 Oct) and 16 of air,
  // plus the safe area.
  const phonePad = "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]";
  const clearToast = useLmsStore((s) => s.clearToast);
  return (
    <div
      data-platform-page=""
      className="flex min-h-[100dvh] flex-col overflow-x-clip bg-sko-bg-faint"
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
        // The room the floating tab bar needs under the page goes under the
        // last block of the page: the micro footer.
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
      <PlatformFooter className={cn(phone && phonePad)} />
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
