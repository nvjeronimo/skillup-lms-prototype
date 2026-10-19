import type { Metadata } from "next";
import { EditProfileView } from "@/components/platform/profile/EditProfileView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Edit profile") };

/** Edit profile (19 Oct 2026): opened from the profile menu; the learner profile and account settings on one page. */
export default function EditProfilePage() {
  return <EditProfileView />;
}
