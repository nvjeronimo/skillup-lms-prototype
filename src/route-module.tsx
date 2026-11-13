/**
 * Turns the App Router files under app/ (page, layout, template, error, not-found) into React
 * Router route elements, so each file keeps the props it was written for:
 * - pages get `{ params, searchParams }`, layouts get `{ params, children }` (an <Outlet />);
 * - `metadata` / `generateMetadata` set the document title, with the nearest layout's template;
 * - `notFound()` and `redirect()` thrown while rendering land in the route's error element.
 */
import * as React from "react";
import { Navigate, Outlet, isRouteErrorResponse, useLocation, useMatches, useParams, useRouteError } from "react-router";
import { NotFoundSignal, RedirectSignal, type Metadata } from "@/lib/router";

type Params = Record<string, string>;
type MetaFn = (args: { params: Params }) => Metadata;

export type RouteFile = {
  default: React.ComponentType<any>;
  metadata?: Metadata;
  generateMetadata?: MetaFn;
};

/** What a route carries for the title: its metadata, read in `<DocumentTitle />`. */
export type RouteHandle = {
  metadata?: Metadata;
  generateMetadata?: MetaFn;
  /** An index page shares its layout's segment: Next applies that layout's template only below it. */
  sameSegment?: boolean;
};

export const handleOf = (file: RouteFile): RouteHandle => ({
  metadata: file.metadata,
  generateMetadata: file.generateMetadata,
});

function usePageProps() {
  const params = useParams() as Params;
  const { search } = useLocation();
  const searchParams = React.useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]);
  return { params, searchParams };
}

export function Page({ file }: { file: RouteFile }) {
  const Component = file.default;
  return <Component {...usePageProps()} />;
}

export function Layout({ file }: { file: RouteFile }) {
  const Component = file.default;
  return (
    <Component params={useParams() as Params}>
      <Outlet />
    </Component>
  );
}

/** Next mounts a template afresh on every navigation; the pathname key does the same. */
export function Template({ file, children }: { file: RouteFile; children: React.ReactNode }) {
  const Component = file.default;
  return <Component key={useLocation().pathname}>{children}</Component>;
}

/**
 * Error element: a `notFound()` shows `notFoundFile`, a `redirect()` navigates, and anything
 * else shows `errorFile` (an App Router error.tsx) or rethrows to the parent route.
 */
export function RouteError({ notFoundFile, errorFile }: { notFoundFile: RouteFile; errorFile?: RouteFile }) {
  const error = useRouteError();
  if (error instanceof RedirectSignal) return <Navigate to={error.href} replace />;
  if (error instanceof NotFoundSignal || (isRouteErrorResponse(error) && error.status === 404)) {
    const NotFound = notFoundFile.default;
    return <NotFound />;
  }
  if (errorFile) {
    const ErrorView = errorFile.default;
    return <ErrorView error={error as Error} reset={() => window.location.reload()} />;
  }
  throw error;
}

function titleText(t: Metadata["title"], template: string | undefined): string | undefined {
  if (!t) return undefined;
  if (typeof t === "string") return template ? template.replace("%s", t) : t;
  if ("absolute" in t) return t.absolute;
  return t.default;
}

/** Sets document.title from the deepest route that has metadata, with its parents' template. */
export function DocumentTitle() {
  const matches = useMatches();
  const title = React.useMemo(() => {
    let template: string | undefined;
    let outer: string | undefined; // the template in force above the parent layout
    let parentSetTemplate = false;
    let result: string | undefined;
    for (const m of matches) {
      const h = m.handle as RouteHandle | undefined;
      const meta = h && (h.generateMetadata ? h.generateMetadata({ params: m.params as Params }) : h.metadata);
      const t = meta?.title;
      if (t) {
        const own = titleText(t, h?.sameSegment && parentSetTemplate ? outer : template);
        if (own) result = own;
      }
      parentSetTemplate = !!t && typeof t === "object" && "template" in t;
      if (parentSetTemplate) {
        outer = template;
        template = (t as { template: string }).template;
      }
    }
    return result;
  }, [matches]);
  React.useEffect(() => {
    if (title) document.title = title;
  }, [title]);
  return null;
}
