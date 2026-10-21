/**
 * Course covers arrive (motion-matrix §7.9): a cover fades in once it has loaded, over the
 * placeholder colour that stays until then. Pure, so vitest can pin it; FadeImage holds the
 * state.
 *
 * - `pending`: still loading, shown at opacity 0 (the placeholder shows through).
 * - `loaded`: it loaded while on screen, fades to 1 (short4, standard).
 * - `instant`: it was already complete when it mounted (the browser cache, or it loaded
 *   before hydration): shown at once, no fade.
 * - `failed`: it did not load; stays at opacity 0, so the placeholder stays.
 */
export type ImageArrival = "pending" | "loaded" | "instant" | "failed";

/** What the image element tells us at mount (a subset of HTMLImageElement). */
export interface ImageProbe {
  complete: boolean;
  naturalWidth: number;
}

/**
 * The state at mount. A complete image with a width has decoded already: show it now. A
 * complete image with no width is a broken one (complete is also true after an error).
 */
export function arrivalAtMount(img: ImageProbe | null): ImageArrival {
  if (!img || !img.complete) return "pending";
  return img.naturalWidth > 0 ? "instant" : "failed";
}

/** The state after a load or error event; an image already shown at once stays as it is. */
export function arrivalAfter(current: ImageArrival, event: "load" | "error"): ImageArrival {
  if (current === "instant") return event === "error" ? "failed" : "instant";
  return event === "load" ? "loaded" : "failed";
}

/** True when the image is visible (opacity 1). */
export function isShown(state: ImageArrival): boolean {
  return state === "loaded" || state === "instant";
}
