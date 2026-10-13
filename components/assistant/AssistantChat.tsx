"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { isAssistantPath, pageContextFromPath } from "@/lib/assistant/page-context";
import { buildSnapshot } from "@/lib/assistant/snapshot";
import { useAssistant } from "@/lib/assistant/useAssistant";
import { platformUser } from "@/lib/platform/user";
import { useLmsStore } from "@/lib/store";
import { AssistantLauncher } from "./AssistantLauncher";
import { AssistantWindow } from "./AssistantWindow";

const OPEN_KEY = "sk-assistant-open";
const EDGE = 24;
const EDGE_PHONE = 16;
const GAP = 16;
/** The launcher's size (DS `Assistant-Launcher`, 48 since 13 Oct 2026). */
const SIZE = 48;
const PHONE = "(max-width: 767px)";

/**
 * The assistant, mounted once for the whole app (ResponsiveShell): a launcher in the bottom
 * left corner and the chat it opens. Left on desktop and tablet since 13 Oct 2026 (on the right
 * it sat over Mark as Complete in the feedback row); on a phone it is on the right, above the
 * footer nav, at the end of the feedback row.
 * It knows where it is from the address, so no page
 * hands it anything. Shown on the platform pages and in the player only.
 */
export function AssistantChat() {
  const pathname = usePathname() ?? "/";
  if (!isAssistantPath(pathname)) return null;
  return <Chat pathname={pathname} />;
}

function Chat({ pathname }: { pathname: string }) {
  const windowId = React.useId();
  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const completedTopics = useLmsStore((s) => s.completedTopics);
  const bookmarks = useLmsStore((s) => s.bookmarks);
  const previewPhone = useLmsStore((s) => s.deviceMode === "mobile");
  const snapshot = React.useMemo(
    () => buildSnapshot({ completedTopics, bookmarks }, pageContextFromPath(pathname)),
    [completedTopics, bookmarks, pathname],
  );
  const assistant = useAssistant(snapshot);

  // Open or closed is remembered for the tab, so following a button keeps the chat open.
  const [open, setOpen] = React.useState(false);
  const [phone, setPhone] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia(PHONE);
    const sync = () => setPhone(query.matches);
    sync();
    // On a phone the chat is a full-screen sheet: a page never opens covered by it.
    try {
      setOpen(!query.matches && sessionStorage.getItem(OPEN_KEY) === "1");
    } catch {
      /* storage blocked: closed */
    }
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const set = (next: boolean) => {
    setOpen(next);
    try {
      sessionStorage.setItem(OPEN_KEY, next ? "1" : "0");
    } catch {
      /* see above */
    }
  };
  // Closing gives the focus back to the launcher. On a phone the launcher is not rendered
  // under the sheet, so the focus moves once it is back (the effect below).
  const refocus = React.useRef(false);
  const close = () => {
    refocus.current = true;
    set(false);
  };
  React.useEffect(() => {
    if (open || !refocus.current) return;
    refocus.current = false;
    launcherRef.current?.focus();
  }, [open]);

  const isPhone = phone || previewPhone;
  // On a phone, following a button of an answer goes to the page: the sheet gets out of the way.
  const lastPath = React.useRef(pathname);
  React.useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (isPhone) set(false);
  });
  const edge = isPhone ? EDGE_PHONE : EDGE;
  // Left, except on a phone. The footer lifts the launcher only where the two would meet.
  const side = isPhone ? "right" : "left";
  const bottom = edge + useFooterHeight(pathname, side, edge + SIZE);
  const sheet = open && isPhone;

  return (
    <>
      {open ? (
        <AssistantWindow
          id={windowId}
          messages={assistant.messages}
          streaming={assistant.streaming}
          status={assistant.status}
          suggestions={assistant.suggestions}
          firstName={platformUser.firstName}
          onAsk={assistant.ask}
          onClear={assistant.clear}
          onClose={close}
          modal={isPhone}
          className={
            isPhone ? "fixed inset-0 z-[45]" : "fixed z-[45] w-[380px] max-w-[calc(100vw-48px)]"
          }
          style={
            isPhone
              ? undefined
              : { [side]: edge, bottom: bottom + SIZE + GAP, height: `min(600px, calc(100dvh - ${bottom + SIZE + GAP + 24}px))` }
          }
        />
      ) : null}
      {sheet ? null : (
        <AssistantLauncher
          ref={launcherRef}
          open={open}
          onToggle={() => (open ? close() : set(true))}
          controls={windowId}
          className="fixed z-[45]"
          style={{ [side]: edge, bottom }}
        />
      )}
    </>
  );
}

/**
 * How much of the viewport's bottom the player's topic footer covers under the launcher, so
 * the launcher sits above it and never over Previous or Next. 0 on a page with no footer nav, and 0
 * where the footer does not reach the launcher's column (on desktop the sidebar is there).
 * `reach` is how far from its edge the launcher extends. On a phone the launcher is on the right.
 */
function useFooterHeight(pathname: string, side: "left" | "right", reach: number): number {
  const [height, setHeight] = React.useState(0);
  const inPlayer = pathname.startsWith("/course/");
  React.useEffect(() => {
    // Only the player has a footer nav; the other pages pay nothing.
    if (!inPlayer) return setHeight(0);
    const measure = () => {
      const footer = document.querySelector<HTMLElement>('nav[aria-label="Topic navigation"]');
      if (!footer) return setHeight(0);
      const { top, bottom, left, right } = footer.getBoundingClientRect();
      const meets = side === "left" ? left < reach : right > window.innerWidth - reach;
      const visible = top < window.innerHeight && bottom > 0 && meets;
      setHeight(visible ? Math.max(0, Math.round(window.innerHeight - top)) : 0);
    };
    measure();
    // The footer moves without the DOM changing (the player settles its layout after the
    // store hydrates), so DOM and size observers are not enough: a slow tick catches the rest.
    const mutations = new MutationObserver(measure);
    mutations.observe(document.body, { childList: true, subtree: true });
    const sizes = new ResizeObserver(measure);
    sizes.observe(document.body);
    const tick = window.setInterval(measure, 500);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      mutations.disconnect();
      sizes.disconnect();
      window.clearInterval(tick);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [pathname, inPlayer, side, reach]);
  return height;
}
