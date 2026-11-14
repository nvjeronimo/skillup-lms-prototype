/**
 * Routing for the prototype on React Router (the development team's router, 13 Nov 2026).
 *
 * The pages were written for Next's App Router; this module keeps the call sites they use
 * (`<Link href>`, `useRouter().push`, `notFound()`, `redirect()`) and runs them on React Router,
 * so the move changes imports, not page code. New code can use react-router directly.
 */
import * as React from "react";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from "react-router";

type Href = string | { pathname?: string; query?: Record<string, string | number | undefined>; hash?: string };

function toPath(href: Href): string {
  if (typeof href === "string") return href;
  const qs = href.query
    ? new URLSearchParams(
        Object.entries(href.query)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : "";
  return `${href.pathname ?? ""}${qs ? `?${qs}` : ""}${href.hash ? `#${href.hash.replace(/^#/, "")}` : ""}`;
}

const isExternal = (to: string) => /^(https?:|mailto:|tel:)/i.test(to) || to.startsWith("#");

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: Href;
  replace?: boolean;
  /** `false` keeps the scroll position, like Next's `scroll={false}`. */
  scroll?: boolean;
  /** Next-only hint; React Router has no prefetch for client routes. Ignored. */
  prefetch?: boolean | null;
};

/** `<Link href>` on React Router. External, mailto and in-page hash links stay plain anchors. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, replace, scroll, prefetch: _prefetch, ...rest },
  ref,
) {
  const to = toPath(href);
  if (isExternal(to)) return <a ref={ref} href={to} {...rest} />;
  return <RouterLink ref={ref} to={to} replace={replace} preventScrollReset={scroll === false} {...rest} />;
});

export default Link;

type NavigateOptions = { scroll?: boolean };

/** `useRouter()` with the methods the pages call: push, replace, back, forward, refresh, prefetch. */
export function useRouter() {
  const navigate = useNavigate();
  return React.useMemo(
    () => ({
      push: (href: string, opts?: NavigateOptions) => navigate(href, { preventScrollReset: opts?.scroll === false }),
      replace: (href: string, opts?: NavigateOptions) =>
        navigate(href, { replace: true, preventScrollReset: opts?.scroll === false }),
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => navigate(0),
      prefetch: (_href: string) => {},
    }),
    [navigate],
  );
}

export function usePathname(): string {
  return useLocation().pathname;
}

/** Read-only search params, as Next returns them. */
export function useSearchParams(): URLSearchParams {
  return useRouterSearchParams()[0];
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return useRouterParams() as T;
}

/** Thrown by `notFound()` during render; the route's error element shows the not-found page. */
export class NotFoundSignal extends Error {
  constructor() {
    super("NEXT_NOT_FOUND");
  }
}

/** Thrown by `redirect()` during render; the route's error element navigates to `href`. */
export class RedirectSignal extends Error {
  constructor(readonly href: string) {
    super(`REDIRECT ${href}`);
  }
}

export function notFound(): never {
  throw new NotFoundSignal();
}

export function redirect(href: string): never {
  throw new RedirectSignal(href);
}

/** The cookies the browser holds, with the `cookies().get(name)?.value` shape the pages use. */
export function cookies() {
  const jar = new Map<string, string>();
  if (typeof document !== "undefined") {
    for (const part of document.cookie.split(";")) {
      const i = part.indexOf("=");
      if (i < 0) continue;
      jar.set(decodeURIComponent(part.slice(0, i).trim()), decodeURIComponent(part.slice(i + 1).trim()));
    }
  }
  return { get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined) };
}

/** Page metadata: only the title is used (WCAG 2.4.2). */
export type Metadata = {
  title?: string | { absolute: string } | { template: string; default: string };
  description?: string;
};
