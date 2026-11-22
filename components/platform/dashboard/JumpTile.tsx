import Link from "@/lib/router";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import styles from "./JumpTile.module.css";

export interface JumpTileProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** A link when set; otherwise the tile is a button that calls `onClick`. */
  href?: string;
  onClick?: () => void;
}

const TILE = cn("sk-press-card", styles.tile);

/**
 * DS `LMS / Platform / Jump tile` (6382:3302): a shortcut tile ("Jump somewhere"). Icon 20
 * in icon/primary on a bg/primary-soft box (padding 8, radius 8); Title body-medium/Semibold;
 * Description body-small/Regular text/subtle. bg/page, 1px border/subtle, radius 8,
 * padding 16, gap 8. The whole tile is the link target.
 */
export function JumpTile({ icon, title, description, href, onClick }: JumpTileProps) {
  const content = (
    <>
      <span className={styles.iconBox}>
        <Icon icon={icon} size={20} className={styles.icon} aria-hidden="true" />
      </span>
      <span className={cn("sk-text-body-medium-semibold", styles.title)}>{title}</span>
      <span className={cn("sk-text-body-small-regular", styles.description)}>{description}</span>
    </>
  );
  return href ? (
    <Link href={href} className={TILE}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={TILE}>
      {content}
    </button>
  );
}
