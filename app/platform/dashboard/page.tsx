import type { Metadata } from "next";
import { DashboardView } from "@/components/platform/dashboard/DashboardView";
import { dashboardResumeRowsFor } from "@/lib/platform/dashboard-resume";
import { pageTitle } from "@/lib/utils";
import { requestPersonaId } from "@/lib/persona-server";

export const metadata: Metadata = { title: pageTitle("Dashboard") };

export default function DashboardPage() {
  // Read on the server: the module to resume comes from each course's own page data; at the
  // request's synthetic persona, if one is on (Nelson, 25 Oct 2026).
  return <DashboardView resume={dashboardResumeRowsFor(requestPersonaId())} />;
}
