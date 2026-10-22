import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The assistant mark (DS `LMS/Platform/Assistant/Assistant-Launcher`), inline so its three
 * sparkles can move: the 160 viewBox of public/assistant-mark.svg. The ball and the plane are
 * the asset's; the three sparkles are the DS vectors (smaller, moved in), scaled 160/48 from
 * the launcher's 48px Mark (Nelson, 21 Oct 2026). Each sparkle spins (2, 3 and 2 turns, in 1.5 to 2 s)
 * round its own centre now and then, on its own cycle (`.sk-sparkle-a/-b/-c`, globals.css); the ball
 * and the plane hold still. Reduced motion holds the sparkles too.
 *
 * Colours: the mark keeps the logo's colours on every skin, like the asset it replaces, so the
 * svg is a light island (`data-theme="light"`, the certificate's pattern) and reads the SKO light
 * tokens whatever the page: the ball border/info-soft (#51bffc), the ink icon/info (#044150).
 * On a dark page the ink turns white (icon/on-media, #ffffff in every theme), as the dark asset
 * did (`.sk-assistant-mark`, globals.css). `overflow="visible"`: a turning star's tip may pass
 * the viewBox edge (the medium one touches y = 160) and must not be clipped.
 */
export function AssistantMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      data-theme="light"
      viewBox="0 0 160 160"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("sk-assistant-mark", className)}
    >
      {/* The ball. */}
      <path
        className="sk-assistant-mark__ball"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M82.8276 157.196C121.193 157.196 152.295 126.095 152.295 87.728C152.295 49.3627 121.193 18.261 82.8276 18.261C44.4609 18.261 13.3592 49.3627 13.3592 87.728C13.3592 126.095 44.4609 157.196 82.8276 157.196Z"
      />
      {/* The paper plane: outline. */}
      <path
        className="sk-assistant-mark__ink"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M133.466 0.821161C135.303 1.97734 136.258 4.12987 135.883 6.26775L118.408 105.799C118.061 107.775 116.636 109.39 114.719 109.981C112.802 110.572 110.716 110.04 109.316 108.603L82.1595 80.7132L46.2394 69.7173C44.2956 69.1222 42.8578 67.4759 42.5299 65.4697C42.2019 63.4635 43.0407 61.445 44.6938 60.262L127.51 0.998072C129.275 -0.2651 131.629 -0.335017 133.466 0.821161ZM59.7043 62.6623L86.5971 70.8947C87.456 71.1577 88.2348 71.6329 88.8614 72.2765L109.687 93.6646L123.095 17.2992L59.7043 62.6623Z"
      />
      {/* The big sparkle, centre ≈ (45.0, 110.32). */}
      <path
        className="sk-assistant-mark__ink sk-sparkle sk-sparkle-a"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45 85C45 101.8783 53.5077 110.3173 70.5233 110.3173C53.5077 110.3173 45 118.7567 45 135.635C45 118.7567 36.4923 110.3173 19.4766 110.3173C36.4923 110.3173 45 101.8783 45 85Z"
      />
      {/* The medium sparkle, centre ≈ (76.42, 127.97). */}
      <path
        className="sk-assistant-mark__ink sk-sparkle sk-sparkle-b"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M91.4287 127.97C81.423 127.97 76.4203 123.0073 76.4203 113.0827C76.4203 123.0073 71.4173 127.97 61.412 127.97C71.4173 127.97 76.4203 132.9323 76.4203 142.857C76.4203 132.9323 81.423 127.97 91.4287 127.97Z"
      />
      {/* The small sparkle, centre ≈ (74.75, 95.76). */}
      <path
        className="sk-assistant-mark__ink sk-sparkle sk-sparkle-c"
        d="M87.2063 95.756C78.9027 95.756 74.751 91.638 74.751 83.4013C74.751 91.638 70.5993 95.756 62.2957 95.756C70.5993 95.756 74.751 99.8743 74.751 108.111C74.751 99.8743 78.9027 95.756 87.2063 95.756Z"
      />
      {/* The paper plane: inner fold. */}
      <path
        className="sk-assistant-mark__ink"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M83.513 75.6548L130.62 6.10425L48.5627 65.5245L83.513 75.6548Z"
      />
    </svg>
  );
}
