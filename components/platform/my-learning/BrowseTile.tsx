import { Plus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./BrowseTile.module.css";

export interface BrowseTileProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
  className?: string;
}

/**
 * DS `LMS / Platform / Browse tile` (6388:116426): the last tile of a My Learning grid, a
 * way out to the catalog. Dashed border/default on bg/faint, radius 8, padding 24 / 20 / 16, gap 4;
 * DS plus icon 32 (icon/subtle), Title body-medium/Semibold, Subtitle body-small/Regular.
 * It fills the grid cell (342 beside the course cards) and is 160 tall on mobile, where
 * it sits alone in its row. The whole tile is the control.
 */
export function BrowseTile({ title, subtitle, onClick, className }: BrowseTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // h-40 on mobile, not min-height: the "larger targets" rule in globals.css sets a 44px
        // min-height on every button and would win over a min-h class.
        styles.tile,
        className,
      )}
    >
      <Icon icon={Plus} size={32} strokeWidth={1.5} className={styles.icon} aria-hidden="true" />
      <span className={cn("sk-text-body-medium-semibold", styles.title)}>{title}</span>
      <span className={cn("sk-text-body-small-regular", styles.subtitle)}>{subtitle}</span>
    </button>
  );
}
