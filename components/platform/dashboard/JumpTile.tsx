import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/lib/icons";

export interface JumpTileProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** A link when set; otherwise the tile is a button that calls `onClick`. */
  href?: string;
  onClick?: () => void;
  /** Sea skin: the icon box takes a foundation tone by position (0 sky, 1 mint, 2 sun). */
  tone?: number;
}

const TILE =
  "sk-press-card flex h-full w-full flex-col items-start gap-2 rounded-card border border-sko-border-subtle bg-sko-bg-page p-4 text-left transition-colors hover:border-sko-border-primary";

/**
 * DS `LMS / Platform / Jump tile` (6382:3302): a shortcut tile ("Jump somewhere"). Icon 20
 * in icon/primary on a bg/primary-soft box (padding 8, radius 8); Title body-medium/Semibold;
 * Description body-small/Regular text/subtle. bg/page, 1px border/subtle, radius 8,
 * padding 16, gap 8. The whole tile is the link target.
 */
export function JumpTile({ icon, title, description, href, onClick, tone }: JumpTileProps) {
  const content = (
    <>
      <span data-tone={tone === undefined ? undefined : tone % 3} className="flex rounded-control bg-sko-bg-primary-soft p-2">
        <Icon icon={icon} size={20} className="text-sko-icon-primary" aria-hidden="true" />
      </span>
      <span className="sk-text-body-medium-semibold w-full text-sko-text-default">{title}</span>
      <span className="sk-text-body-small-regular w-full text-sko-text-subtle">{description}</span>
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
