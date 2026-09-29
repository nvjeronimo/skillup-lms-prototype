import { cn } from "@/lib/utils";
import { Cover, Disc } from "./Cover";

/**
 * Sleeve in front, record half out behind it. With `slide`, the record slides out on arrival (Home's one
 * authored moment); without it, it simply rests half out.
 */
export function Deck({ id, slide = false, className }: { id: string; slide?: boolean; className?: string }) {
  return (
    <div className={cn("al-deck", className)} data-slide={slide ? "" : undefined} aria-hidden="true">
      <div className="al-deck-disc">
        <Disc id={id} />
      </div>
      <div className="al-deck-sleeve al-sleeve">
        <Cover id={id} />
      </div>
    </div>
  );
}
