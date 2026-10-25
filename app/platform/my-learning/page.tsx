import { Suspense } from "react";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { MyLearningCollection } from "@/components/platform/my-learning/MyLearningCollection";
import { MyLearningHeader } from "@/components/platform/my-learning/MyLearningHeader";
import { MyLearningSkeleton } from "@/components/platform/my-learning/MyLearningSkeleton";
import { myLearningPrograms } from "@/lib/platform/my-learning";
import { myLearningCourseRowsFor } from "@/lib/platform/my-learning-rows";
import { pageTitle } from "@/lib/utils";
import { requestPersonaId } from "@/lib/persona-server";

export const metadata = { title: pageTitle("My Learning") };

/**
 * Platform · My Learning (Figma 6374:114591 and siblings; tablet 6397:17285, mobile
 * 6400:29847). Page padding 40 / 32 / 24 with 80 / 64 / 48 under the content; the Header and
 * the Collection sit 32 / 24 / 20 apart (desktop / tablet / mobile). The content is capped
 * at the 1200 of the desktop frame.
 * The Collection reads the tab and the view from the URL (useSearchParams), hence the
 * Suspense boundary.
 * The course rows are read here, on the server (11 Oct 2026): their modules come from each
 * course's own page data, which stays out of the browser bundle.
 * Arrival (motion-matrix §7.9): MyLearningSkeleton during the simulated load of a first visit,
 * then the title, the tabs, the toolbar and the cards rise in that order.
 */
export default function MyLearningPage() {
  // At the request's synthetic persona, if one is on (Nelson, 25 Oct 2026; lib/persona-server).
  const myLearningCourseRows = myLearningCourseRowsFor(requestPersonaId());
  return (
    <PlatformPage
      current="my-learning"
      className="px-layout-page-x pb-12 pt-layout-page-top md:pb-16 lg:pb-20"
      skeleton={<MyLearningSkeleton courses={myLearningCourseRows.length} programs={myLearningPrograms.length} />}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-layout-section">
        <MyLearningHeader />
        <Suspense fallback={null}>
          <MyLearningCollection courseRows={myLearningCourseRows} />
        </Suspense>
      </div>
    </PlatformPage>
  );
}
