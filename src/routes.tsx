/**
 * The prototype's routes, one per App Router file under app/ (28 pages). The URLs are the same
 * as on the Next build, so every link, bookmark and handoff note keeps working.
 */
import * as React from "react";
import { Outlet, redirect, useParams, type RouteObject } from "react-router";
import { ACCOUNT_COOKIE, SIGN_IN_HREF, parseDeletionRequest } from "@/lib/account-deletion";
import { DASHBOARD_HREF } from "@/lib/platform/routes";
import { cookies } from "@/lib/router";
import { DocumentTitle, Layout, Page, RouteError, Template, handleOf, type RouteFile } from "./route-module";

import * as Root from "@/app/layout";
import * as RootNotFound from "@/app/not-found";

import * as AccountDeletionRequested from "@/app/account/deletion-requested/page";
import * as AccountSignIn from "@/app/account/sign-in/page";

import * as CourseCertificate from "@/app/course/[courseSlug]/certificate/page";
import * as TopicsLayout from "@/app/course/[courseSlug]/topic/layout";
import * as TopicLayout from "@/app/course/[courseSlug]/topic/[topicId]/layout";
import * as TopicTemplate from "@/app/course/[courseSlug]/topic/[topicId]/template";
import * as TopicPage from "@/app/course/[courseSlug]/topic/[topicId]/page";
import * as TopicNotes from "@/app/course/[courseSlug]/topic/[topicId]/notes/page";
import * as TopicDownloads from "@/app/course/[courseSlug]/topic/[topicId]/downloads/page";

import * as LabLayout from "@/app/lab/layout";
import * as LabHome from "@/app/lab/page";
import * as LabContinue from "@/app/lab/dashboard/continue/page";
import * as LabLive from "@/app/lab/dashboard/live/page";
import * as LabPace from "@/app/lab/dashboard/pace/page";
import * as LabPortfolio from "@/app/lab/dashboard/portfolio/page";
import * as TrainingLayout from "@/app/lab/training/layout";
import * as TrainingHome from "@/app/lab/training/page";
import * as TrainingPlans from "@/app/lab/training/plans/page";
import * as TrainingSixSigma from "@/app/lab/training/course/six-sigma/page";

import * as Partner from "@/app/partner/[partner]/page";

import * as PlatformLayout from "@/app/platform/layout";
import * as PlatformError from "@/app/platform/error";
import * as PlatformCalendar from "@/app/platform/calendar/page";
import * as PlatformCertificate from "@/app/platform/certificate/[courseSlug]/page";
import * as PlatformProgramCertificate from "@/app/platform/certificate/program/[programSlug]/page";
import * as PlatformCertificates from "@/app/platform/certificates/page";
import * as PlatformCourse from "@/app/platform/course/[slug]/page";
import * as PlatformDashboard from "@/app/platform/dashboard/page";
import * as PlatformDiscussion from "@/app/platform/discussion/page";
import * as PlatformMyLearning from "@/app/platform/my-learning/page";
import * as PlatformProfile from "@/app/platform/profile/page";
import * as PlatformProgram from "@/app/platform/program/[slug]/page";
import * as PlatformProgramNotFound from "@/app/platform/program/[slug]/not-found";
import * as PlatformServices from "@/app/platform/services/page";

const page = (path: string | undefined, file: RouteFile, extra: Partial<RouteObject> = {}): RouteObject => ({
  ...(path === undefined ? { index: true } : { path }),
  element: <Page file={file} />,
  handle: { ...handleOf(file), sameSegment: path === undefined },
  ...extra,
} as RouteObject);

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

/** [topicId]/layout.tsx with its template.tsx around the page, remounted on each navigation. */
function TopicRoute() {
  const LayoutComponent = TopicLayout.default;
  const params = useParams() as { courseSlug: string; topicId: string };
  return (
    <LayoutComponent params={params}>
      <Template file={TopicTemplate as RouteFile}>
        <Outlet />
      </Template>
    </LayoutComponent>
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
          page("account/deletion-requested", AccountDeletionRequested as RouteFile),
          page("account/sign-in", AccountSignIn as RouteFile),

          page("course/:courseSlug/certificate", CourseCertificate as RouteFile),
          {
            path: "course/:courseSlug/topic",
            loader: signedIn,
            element: <Layout file={TopicsLayout as RouteFile} />,
            children: [
              {
                path: ":topicId",
                element: <TopicRoute />,
                handle: handleOf(TopicLayout as RouteFile),
                children: [
                  page(undefined, TopicPage as RouteFile),
                  page("notes", TopicNotes as RouteFile),
                  page("downloads", TopicDownloads as RouteFile),
                ],
              },
            ],
          },

          {
            path: "lab",
            element: <Layout file={LabLayout as RouteFile} />,
            handle: handleOf(LabLayout as RouteFile),
            children: [
              page(undefined, LabHome as RouteFile),
              page("dashboard/continue", LabContinue as RouteFile),
              page("dashboard/live", LabLive as RouteFile),
              page("dashboard/pace", LabPace as RouteFile),
              page("dashboard/portfolio", LabPortfolio as RouteFile),
              {
                path: "training",
                element: <Layout file={TrainingLayout as RouteFile} />,
                handle: handleOf(TrainingLayout as RouteFile),
                children: [
                  page(undefined, TrainingHome as RouteFile),
                  page("plans", TrainingPlans as RouteFile),
                  page("course/six-sigma", TrainingSixSigma as RouteFile),
                ],
              },
            ],
          },

          page("partner/:partner", Partner as RouteFile),

          {
            path: "platform",
            loader: signedIn,
            element: <Layout file={PlatformLayout as RouteFile} />,
            errorElement: (
              <RouteError notFoundFile={RootNotFound as RouteFile} errorFile={PlatformError as RouteFile} />
            ),
            children: [
              { index: true, loader: toDashboard },
              page("calendar", PlatformCalendar as RouteFile),
              page("certificate/program/:programSlug", PlatformProgramCertificate as RouteFile),
              page("certificate/:courseSlug", PlatformCertificate as RouteFile),
              page("certificates", PlatformCertificates as RouteFile),
              page("course/:slug", PlatformCourse as RouteFile),
              page("dashboard", PlatformDashboard as RouteFile),
              page("discussion", PlatformDiscussion as RouteFile),
              page("my-learning", PlatformMyLearning as RouteFile),
              page("profile", PlatformProfile as RouteFile),
              page("program/:slug", PlatformProgram as RouteFile, {
                errorElement: <RouteError notFoundFile={PlatformProgramNotFound as RouteFile} />,
              }),
              page("services", PlatformServices as RouteFile),
            ],
          },

          { path: "*", element: <RootNotFound.default />, handle: handleOf(RootNotFound as RouteFile) },
        ],
      },
    ],
  },
];
