import * as React from "react";
import { Search, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import { useDialog } from "@/lib/useDialog";
import { MOTION_MS } from "@/lib/motion/tokens";
import { useExitTransition } from "@/lib/useExitTransition";
import { cn } from "@/lib/utils";
import { useEdxScope } from "@/lib/edx-scope";
import { AssistantGlyph } from "@/components/assistant/AssistantGlyph";
import { HarborSearch, type SearchScope } from "./HarborSearch";
import styles from "./SearchAssistantButton.module.css";

/**
 * The search + Assistant where the pill does not fit (Nelson, 26 Oct 2026): the compact bars of
 * the platform and the player, and the tabs bar between desktop and 1280. A button with the
 * assistant's mark opens a full-screen sheet: the same field and palette (Go to · Your courses ·
 * Help, or In this course · Ask about this course in the player) with the Assistant button inside
 * the field. It also anchors the assistant's window on a tablet (`data-assistant-anchor`).
 */
export function SearchAssistantButton({
  scope,
  size = "md",
  className,
}: {
  scope?: SearchScope;
  /** "md": 44. "sm": 32 with an invisible band that keeps a 44 target, for the desktop bars'
   * utility row and, since 26 Oct 2026, the compact bars (Nelson: the phone row has to fit; as the
   * DS Compact Topbar, Search-Assistant-Button sm). */
  size?: "sm" | "md";
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  const dialogRef = useDialog(open, close);
  const presence = useExitTransition(open, MOTION_MS.short4);
  const titleId = React.useId();
  const course = scope?.kind === "course";
  // Open edX scope: no assistant, so this is a plain search button (search icon, no halo).
  const edx = useEdxScope();
  // The halo's glint starts at a random point of its cycle and turns either way (after mount,
  // so server and client render the same).
  const [halo, setHalo] = React.useState<React.CSSProperties>();
  React.useEffect(() => {
    setHalo({
      ["--sk-halo-delay" as string]: `${(-Math.random() * 9.6).toFixed(2)}s`,
      ["--sk-halo-direction" as string]: Math.random() < 0.5 ? "normal" : "reverse",
    });
  }, []);
  return (
    <>
      <button
        type="button"
        data-assistant-anchor=""
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={
          edx ? (course ? "Search this course" : "Search") : course ? "Search this course or ask the assistant" : "Search or ask the assistant"
        }
        onClick={() => setOpen(true)}
        data-hit-band={size === "sm" ? "" : undefined}
        style={halo}
        className={cn(
          !edx && "sk-assistant-halo",
          // relative here, not only through the halo: without it (Open edX scope drops the halo)
          // the sm hit band is placed on the top bar and every click there opened the search.
          styles.trigger,
          size === "md" ? styles.triggerMd : styles.triggerSm,
          className,
        )}
      >
        {edx ? (
          <Icon icon={Search} size={size === "md" ? 20 : 18} aria-hidden />
        ) : (
          <AssistantGlyph size={size === "md" ? 20 : 18} />
        )}
      </button>
      {presence.mounted ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-state={presence.state}
          onAnimationEnd={presence.onAnimationEnd}
          className={cn("sk-animate-sheet", styles.sheet)}
        >
          <div className={styles.header}>
            <h2 id={titleId} className={cn("sk-text-title-medium-semibold", styles.title)}>
              {edx ? null : <AssistantGlyph size={20} className={styles.titleGlyph} />}
              {course ? "Search this course" : "Search"}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className={styles.close}
            >
              <Icon icon={X} size={24} />
            </button>
          </div>
          <div className={cn("sk-scroll", styles.body)}>
            <HarborSearch scope={scope} layout="sheet" onDone={close} />
          </div>
        </div>
      ) : null}
    </>
  );
}
