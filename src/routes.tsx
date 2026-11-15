/**
 * The prototype's routes, one per App Router file under app/ (28 pages). The URLs are the same
 * as on the Next build, so every link, bookmark and handoff note keeps working.
 *
 * Pages and layouts load with `route.lazy` (15 Nov 2026). A static import of every page put
 * the whole app in one 2.2 MB chunk; each route is now its own chunk, and a shared module is
 * fetched only by the routes that use it. The root layout stays eager: `main.tsx` already
 * runs its pre-paint script, and the 404 has to render without a second fetch.
 */
import * as React from "react";
import { Outlet, redirect, useParams, type RouteObject } from "react-router";
import { ACCOUNT_COOKIE, SIGN_IN_HREF, parseDeletionRequest } from "@/lib/account-deletion";
import { DASHBOARD_HREF } from "@/lib/platform/routes";
import { cookies } from "@/lib/router";
import { DocumentTitle, Layout, Page, RouteError, Template, handleOf, type RouteFile } from "./route-module";

import * as Root from "@/app/layout";
import * as RootNotFound from "@/app/not-found";
import * as PlatformError from "@/app/platform/error";
import * as PlatformProgramNotFound from "@/app/platform/program/[slug]/not-found";

const page = (path: string | undefined, load: () => Promise<unknown>, extra: Partial<RouteObject> = {}): RouteObject => ({
  ...(path === undefined ? { index: true } : { path }),
  lazy: async () => {
    const file = (await load()) as RouteFile;
    function LazyPage() {
      return <Page file={file} />;
    }
    return { Component: LazyPage, handle: { ...handleOf(file), sameSegment: path === undefined } };
  },
  ...extra,
} as RouteObject);

const layout = (load: () => Promise<unknown>) => ({
  lazy: async () => {
    const file = (await load()) as RouteFile;
    function LazyLayout() {
      return <Layout file={file} />;
    }
    return { Component: LazyLayout, handle: handleOf(file) };
  },
});

/** The root layout, with the document title kept in step with the matched route. */
function RootRoute() {
  const RootLayout = Root.default;
  return (
    <>
      <DocumentTitle />
      <RootLayout />
    </>
  );
}

/**
 * Redirects run in loaders, before anything renders: the site opens on the Dashboard, and an
 * account with a pending deletion is signed out of the platform and the player
 * (lib/account-deletion). The layouts keep their own check as a second line.
 */
const toDashboard = () => redirect(DASHBOARD_HREF);
const signedIn = () =>
  parseDeletionRequest(cookies().get(ACCOUNT_COOKIE)?.value) ? redirect(SIGN_IN_HREF) : null;

const notFound = <RouteError notFoundFile={RootNotFound as RouteFile} />;

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootRoute />,
    handle: handleOf(Root as RouteFile),
    errorElement: notFound,
    children: [
      { index: true, loader: toDashboard },
      {
        // Errors below render inside the root layout (shell, title), like Next's not-found.
        errorElement: notFound,
        children: [
          page("account/deletion-requested", () => import("@/app/account/deletion-requested/page")),
          page("account/sign-in", () => import("@/app/account/sign-in/page")),

          page("course/:courseSlug/certificate", () => import("@/app/course/[courseSlug]/certificate/page")),
          {
            path: "course/:courseSlug/topic",
            loader: signedIn,
            ...layout(() => import("@/app/course/[courseSlug]/topic/layout")),
            children: [
              {
                path: ":topicId",
                // The layout and its template load together: the template wraps the page and
                // remounts on each navigation, and the layout keeps the player shell.
                lazy: async () => {
                  const [layoutMod, templateMod] = await Promise.all([
                    import("@/app/course/[courseSlug]/topic/[topicId]/layout"),
                    import("@/app/course/[courseSlug]/topic/[topicId]/template"),
                  ]);
                  function TopicSegment() {
                    const params = useParams() as { courseSlug: string; topicId: string };
                    const LayoutComponent = layoutMod.default;
                    return (
                      <LayoutComponent params={params}>
                        <Template file={templateMod as RouteFile}>
                          <Outlet />
                        </Template>
                      </LayoutComponent>
                    );
                  }
                  return { Component: TopicSegment, handle: handleOf(layoutMod as RouteFile) };
                },
                children: [
                  page(undefined, () => import("@/app/course/[courseSlug]/topic/[topicId]/page")),
                  page("notes", () => import("@/app/course/[courseSlug]/topic/[topicId]/notes/page")),
                  page("downloads", () => import("@/app/course/[courseSlug]/topic/[topicId]/downloads/page")),
                ],
              },
            ],
          },

          {
            path: "lab",
            ...layout(() => import("@/app/lab/layout")),
            children: [
              page(undefined, () => import("@/app/lab/page")),
              page("dashboard/continue", () => import("@/app/lab/dashboard/continue/page")),
              page("dashboard/live", () => import("@/app/lab/dashboard/live/page")),
              page("dashboard/pace", () => import("@/app/lab/dashboard/pace/page")),
              page("dashboard/portfolio", () => import("@/app/lab/dashboard/portfolio/page")),
              {
                path: "training",
                ...layout(() => import("@/app/lab/training/layout")),
                children: [
                  page(undefined, () => import("@/app/lab/training/page")),
                  page("plans", () => import("@/app/lab/training/plans/page")),
                  page("course/six-sigma", () => import("@/app/lab/training/course/six-sigma/page")),
                ],
              },
            ],
          },

          page("partner/:partner", () => import("@/app/partner/[partner]/page")),

          {
            path: "platform",
            loader: signedIn,
            ...layout(() => import("@/app/platform/layout")),
            errorElement: (
              <RouteError notFoundFile={RootNotFound as RouteFile} errorFile={PlatformError as RouteFile} />
            ),
            children: [
              { index: true, loader: toDashboard },
              page("calendar", () => import("@/app/platform/calendar/page")),
              page("certificate/program/:programSlug", () => import("@/app/platform/certificate/program/[programSlug]/page")),
              page("certificate/:courseSlug", () => import("@/app/platform/certificate/[courseSlug]/page")),
              page("certificates", () => import("@/app/platform/certificates/page")),
              page("course/:slug", () => import("@/app/platform/course/[slug]/page")),
              page("dashboard", () => import("@/app/platform/dashboard/page")),
              page("discussion", () => import("@/app/platform/discussion/page")),
              page("my-learning", () => import("@/app/platform/my-learning/page")),
              page("profile", () => import("@/app/platform/profile/page")),
              page("program/:slug", () => import("@/app/platform/program/[slug]/page"), {
                errorElement: <RouteError notFoundFile={PlatformProgramNotFound as RouteFile} />,
              }),
              page("services", () => import("@/app/platform/services/page")),
            ],
          },

          { path: "*", element: <RootNotFound.default />, handle: handleOf(RootNotFound as RouteFile) },
        ],
      },
    ],
  },
];
