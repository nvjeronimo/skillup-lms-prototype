import type { Metadata } from "next";
import { DeletionRequestedView } from "@/components/account/DeletionRequestedView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Account deletion requested") };

/** After "Delete my account" (next-release item 3, 30 Oct 2026). */
export default function DeletionRequestedPage() {
  return <DeletionRequestedView />;
}
