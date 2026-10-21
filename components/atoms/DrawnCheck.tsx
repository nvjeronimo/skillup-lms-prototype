import * as React from "react";
import type { LucideProps } from "lucide-react";

/**
 * Lucide's Check, drawn: `pathLength` 1 lets `.sk-draw-check-immediate` dash the whole stroke
 * (app/globals.css; under reduced motion the check appears without the draw). Shaped like a
 * Lucide icon, so it goes wherever one does (`<Icon icon={DrawnCheck} />`, a Button's
 * `leftIcon` / `rightIcon`). Each mount draws it once.
 */
export const DrawnCheck = React.forwardRef<SVGSVGElement, LucideProps>(function DrawnCheck(
  { size = 24, strokeWidth = 2, color = "currentColor", absoluteStrokeWidth: _abs, className, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M20 6 9 17l-5-5" pathLength={1} className="sk-draw-check-immediate" />
    </svg>
  );
});
