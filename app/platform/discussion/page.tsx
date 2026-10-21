import { Suspense } from "react";
import type { Metadata } from "next";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { DiscussionSkeleton, DiscussionView } from "@/components/platform/discussion/DiscussionView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Discussion") };

/** Discussion (proposal, 17 Oct 2026): every course's conversations in one inbox. */
export default function DiscussionPage() {
  return (
    <PlatformPage current="discussion" skeleton={<DiscussionSkeleton />}>
      {/* The view reads ?thread= through useSearchParams, which needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <DiscussionView />
      </Suspense>
    </PlatformPage>
  );
}
