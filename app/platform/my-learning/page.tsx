import { Suspense } from "react";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { MyLearningCollection } from "@/components/platform/my-learning/MyLearningCollection";
import { MyLearningHeader } from "@/components/platform/my-learning/MyLearningHeader";
import { pageTitle } from "@/lib/utils";

export const metadata = { title: pageTitle("My Learning") };

/**
 * Platform · My Learning (Figma 6374:114591 and siblings; tablet 6397:17285, mobile
 * 6400:29847). Page padding 40 / 32 / 24 with 80 / 64 / 48 under the content; the Header and
 * the Collection sit 32 / 24 / 20 apart (desktop / tablet / mobile). The content is capped
 * at the 1200 of the desktop frame.
 * The Collection reads the tab and the view from the URL (useSearchParams), hence the
 * Suspense boundary.
 */
export default function MyLearningPage() {
  return (
    <PlatformPage current="my-learning" className="px-6 pb-12 pt-6 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 md:gap-6 lg:gap-8">
        <MyLearningHeader />
        <Suspense fallback={null}>
          <MyLearningCollection />
        </Suspense>
      </div>
    </PlatformPage>
  );
}
