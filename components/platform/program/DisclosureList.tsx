import * as React from "react";
import { CircleMinus, CirclePlus } from "lucide-react";
import { Icon } from "@/lib/icons";
import { Collapse } from "@/components/atoms/Collapse";
import { CONTENT_PENDING, type ProgramDisclosureItem } from "@/lib/platform/program";
import { cn } from "@/lib/utils";
import styles from "./DisclosureList.module.css";

/**
 * One row of the list (DS FAQ accordion item, 1358:191501 open / 1358:191714 closed): the
 * title (body-large/Semibold, text/default) with a 24px plus-circle, minus-circle when open
 * (icon/faint), 16 apart (8 on mobile); the body (body-large/Regular, text/subtle) sits 4 under the title
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
    // The DS rule is drawn inside the space above the row: 1px border + 15 / 19 / 23 = 16 / 20 / 24.
    <li className={cn(!first && styles.rowRule)}>
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={styles.trigger}
        >
          <span className={`sk-text-body-large-semibold ${styles.title}`}>{item.title}</span>
          {/* Plus and minus are both there and cross-fade with a quarter turn (short4, standard),
              so the icon reads as one thing changing. The state stays on aria-expanded. */}
          <span aria-hidden className={styles.icons}>
            <Icon
              icon={CirclePlus}
              size={24}
              strokeWidth={1.5}
              className={cn(
                styles.icon,
                open ? styles.plusHidden : styles.iconShown,
              )}
            />
            <Icon
              icon={CircleMinus}
              size={24}
              strokeWidth={1.5}
              className={cn(
                styles.icon,
                open ? styles.iconShown : styles.minusHidden,
              )}
            />
          </span>
        </button>
      </h3>
      {/* Grows open (Collapse, medium2); the 4 above the body is padding inside the clipped row. */}
      <Collapse id={panelId} role="region" aria-labelledby={buttonId} open={open}>
        <div className={`sk-text-body-large-regular ${styles.body}`}>
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Collapse>
    </li>
  );
}

/**
 * The FAQ list and the About sections: one card (bg/page, 1px border/subtle, radius 8) of
 * accordion rows, every row after the first under a 1px rule. Padding of the card and the
 * space above each rule 24 / 20 / 16, rows 20 / 20 / 16 apart (desktop / tablet / mobile).
 * The DS stroke takes part in the layout, so the border adds to the padding.
 * Rows open independently.
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
        styles.list,
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
