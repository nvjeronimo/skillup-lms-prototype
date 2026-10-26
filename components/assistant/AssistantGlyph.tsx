import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The assistant's small mark (Nelson, 26 Oct 2026): the paper plane and the three sparkles of the
 * Assistant mark (AssistantMark, the old launcher), without its ball, in `currentColor`. It marks
 * the search + Assistant module everywhere: the bars' Assistant button and search button, and the
 * window's header and greeting. Sized like an icon (16–24); the sparkles hold still.
 */
export function AssistantGlyph({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="16 -4 124 150"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M133.466 0.821161C135.303 1.97734 136.258 4.12987 135.883 6.26775L118.408 105.799C118.061 107.775 116.636 109.39 114.719 109.981C112.802 110.572 110.716 110.04 109.316 108.603L82.1595 80.7132L46.2394 69.7173C44.2956 69.1222 42.8578 67.4759 42.5299 65.4697C42.2019 63.4635 43.0407 61.445 44.6938 60.262L127.51 0.998072C129.275 -0.2651 131.629 -0.335017 133.466 0.821161ZM59.7043 62.6623L86.5971 70.8947C87.456 71.1577 88.2348 71.6329 88.8614 72.2765L109.687 93.6646L123.095 17.2992L59.7043 62.6623Z"
      />
      <path d="M45 85C45 101.8783 53.5077 110.3173 70.5233 110.3173C53.5077 110.3173 45 118.7567 45 135.635C45 118.7567 36.4923 110.3173 19.4766 110.3173C36.4923 110.3173 45 101.8783 45 85Z" />
      <path d="M91.4287 127.97C81.423 127.97 76.4203 123.0073 76.4203 113.0827C76.4203 123.0073 71.4173 127.97 61.412 127.97C71.4173 127.97 76.4203 132.9323 76.4203 142.857C76.4203 132.9323 81.423 127.97 91.4287 127.97Z" />
      <path d="M87.2063 95.756C78.9027 95.756 74.751 91.638 74.751 83.4013C74.751 91.638 70.5993 95.756 62.2957 95.756C70.5993 95.756 74.751 99.8743 74.751 108.111C74.751 99.8743 78.9027 95.756 87.2063 95.756Z" />
      <path d="M83.513 75.6548L130.62 6.10425L48.5627 65.5245L83.513 75.6548Z" />
    </svg>
  );
}
