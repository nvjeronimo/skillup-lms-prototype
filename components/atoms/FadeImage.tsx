"use client";

import * as React from "react";
import { arrivalAfter, arrivalAtMount, isShown, type ImageArrival } from "@/lib/motion/imageArrival";
import { cn } from "@/lib/utils";

// useLayoutEffect on the client (a cached image is shown before the first paint), useEffect on the server.
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export type FadeImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * A course or program cover that fades in once it has loaded (motion-matrix §7.9), so it never
 * pops in over its placeholder. The placeholder is the caller's: a background colour (or the
 * initials) on the element behind the image, which shows through while the image is at
 * opacity 0 and stays if the image fails.
 * - Loads while on screen: opacity 0 → 1, short4, standard (`.sk-fade-image`, app/globals.css).
 * - Already complete at mount (the browser cache, or loaded before hydration): shown at once.
 * - Fails: stays at opacity 0; the caller's `onError` still runs.
 * Every other attribute (alt, loading, decoding, sizes…) passes through unchanged.
 */
export const FadeImage = React.forwardRef<HTMLImageElement, FadeImageProps>(function FadeImage(
  { className, onLoad, onError, src, ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLImageElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLImageElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  const [state, setState] = React.useState<ImageArrival>("pending");
  // At mount and on a new source: an image the browser already has is shown at once.
  useIsoLayoutEffect(() => {
    setState(arrivalAtMount(innerRef.current));
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- alt passes through from the caller
    <img
      ref={setRefs}
      src={src}
      {...rest}
      data-image={state}
      onLoad={(e) => {
        setState((s) => arrivalAfter(s, "load"));
        onLoad?.(e);
      }}
      onError={(e) => {
        setState((s) => arrivalAfter(s, "error"));
        onError?.(e);
      }}
      className={cn("sk-fade-image", isShown(state) ? "opacity-100" : "opacity-0", className)}
    />
  );
});
