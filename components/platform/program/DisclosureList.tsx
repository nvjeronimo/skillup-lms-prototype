"use client";

import * as React from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { CONTENT_PENDING, type ProgramDisclosureItem } from "@/lib/platform/program";
import { cn } from "@/lib/utils";

/**
 * One row of the list (DS FAQ accordion item, 1358:191501 open / 1358:191714 closed): the
 * title (body-large/Semibold, text/default) with a 24px plus-circle, minus-circle when open
 * (icon/faint), 16 apart; the body (body-large/Regular, text/subtle) sits 4 under the title
 * and stops short of the icon. Paragraphs of a body are 16 apart.
 * The title is the accordion button inside the row's <h3>; its hit area is padded to 44px
 * without moving the layout.
 */
function DisclosureRow({
  item,
  first,
  open,
  onToggle,
}: {
  item: ProgramDisclosureItem;
  first: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const uid = React.useId();
  const buttonId = `${uid}-header`;
  const panelId = `${uid}-panel`;
  const body = item.body ?? [CONTENT_PENDING];
  return (
    <li className={cn(!first && "border-t border-sko-border-subtle pt-6")}>
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="-my-2.5 flex w-full items-start gap-4 py-2.5 text-left"
        >
          <span className="sk-text-md-semibold min-w-0 flex-1 text-sko-text-default">{item.title}</span>
          <Icon
            icon={open ? CircleMinus : CirclePlus}
            size={24}
            strokeWidth={1.5}
            aria-hidden
            className="shrink-0 text-sko-icon-faint"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="sk-text-md-regular mt-1 space-y-4 pr-10 text-sko-text-subtle"
      >
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </li>
  );
}

/**
 * The FAQ list (6448:24335) and the About sections (6448:26798): one card — bg/page, 1px
 * border/subtle, radius 8, padding 24 — of accordion rows, 20 apart, every row after the
 * first under a 1px rule with 24 above it. Rows open independently.
 */
export function DisclosureList({ items, mock, className }: { items: ProgramDisclosureItem[]; mock?: string; className?: string }) {
  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(items.filter((i) => i.defaultOpen).map((i) => i.id)),
  );
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <ul
      data-mock={mock}
      className={cn(
        // The DS stroke is inside the card and the CSS border is outside the padding: 23 + 1 = the DS 24 on desktop.
        "flex flex-col gap-5 rounded-lg border border-sko-border-subtle bg-sko-bg-page p-4 md:p-6 lg:p-[23px]",
        className,
      )}
    >
      {items.map((item, index) => (
        <DisclosureRow
          key={item.id}
          item={item}
          first={index === 0}
          open={open.has(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </ul>
  );
}
