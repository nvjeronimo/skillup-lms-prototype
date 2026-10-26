import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The assistant's small mark: the DS "SkillUp AI Assistant Mark - V2" (Figma 23495:201816; Nelson,
 * 26 Oct 2026): the paper plane and three sparkles on its 48 grid, in `currentColor`. It marks the
 * search + Assistant module everywhere: the bars' Assistant button and search button, and the
 * window's header and greeting. Sized like an icon (16–24); the sparkles hold still.
 */
export function AssistantGlyph({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="4 3 42 44"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.3019 6.24635C35.853 6.5932 36.1396 7.23896 36.027 7.88033L30.7844 37.7397C30.6803 38.3325 30.253 38.817 29.6779 38.9944C29.1028 39.1717 28.4768 39.012 28.0569 38.5808L19.9099 30.214L9.1339 26.9152C8.55077 26.7367 8.11942 26.2428 8.02104 25.6409C7.92266 25.0391 8.17428 24.4335 8.67022 24.0786L33.5151 6.29942C34.0446 5.92047 34.7508 5.89949 35.3019 6.24635ZM13.1734 24.7987L21.2412 27.2684C21.4989 27.3473 21.7325 27.4899 21.9205 27.6829L28.1683 34.0994L32.1907 11.1898L13.1734 24.7987Z"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M20.3159 28.6965L34.448 7.8313L9.83081 25.6574L20.3159 28.6965Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.657 31C12.657 36.0635 15.2094 38.5952 20.3141 38.5952C15.2094 38.5952 12.657 41.127 12.657 46.1905C12.657 41.127 10.1047 38.5952 5 38.5952C10.1047 38.5952 12.657 36.0635 12.657 31Z"
      />
      <path d="M45.005 30.4662C42.0033 30.4662 40.5025 28.9774 40.5025 26C40.5025 28.9774 39.0017 30.4662 36 30.4662C39.0017 30.4662 40.5025 31.9549 40.5025 34.9323C40.5025 31.9549 42.0033 30.4662 45.005 30.4662Z" />
      <path d="M18.005 8.46617C15.0033 8.46617 13.5025 6.97744 13.5025 4C13.5025 6.97744 12.0017 8.46617 9 8.46617C12.0017 8.46617 13.5025 9.95489 13.5025 12.9323C13.5025 9.95489 15.0033 8.46617 18.005 8.46617Z" />
    </svg>
  );
}
