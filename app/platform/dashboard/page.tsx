import type { Metadata } from "next";
import { DashboardView } from "@/components/platform/dashboard/DashboardView";
import { dashboardResumeRows } from "@/lib/platform/dashboard-resume";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Dashboard") };

export default function DashboardPage() {
  // Read on the server: the module to resume comes from each course's own page data.
  return <DashboardView resume={dashboardResumeRows} />;
}
