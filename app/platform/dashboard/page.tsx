import type { Metadata } from "next";
import { DashboardView } from "@/components/platform/dashboard/DashboardView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Dashboard") };

export default function DashboardPage() {
  return <DashboardView />;
}
