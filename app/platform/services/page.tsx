import type { Metadata } from "next";
import { ServicesView } from "@/components/platform/services/ServicesView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Services") };

/** Services (proposal, 17 Oct 2026): mentoring, career, support, benefits and tools. */
export default function ServicesPage() {
  return <ServicesView />;
}
