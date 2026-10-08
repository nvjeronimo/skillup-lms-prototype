import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { CourseDetailView } from "@/components/platform/course/CourseDetailView";
import { getCourseDetailBySlug } from "@/lib/platform/course-detail";
import { pageTitle } from "@/lib/utils";

type Params = { params: { slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const course = getCourseDetailBySlug(params.slug);
  return { title: pageTitle(course ? course.title : "Course not found") };
}

/** Course Detail, self-paced (Figma 6146:10226): a course opened from My Learning. */
export default function CourseDetailPage({ params }: Params) {
  const course = getCourseDetailBySlug(params.slug);
  if (!course) notFound();

  return (
    <PlatformPage current="my-learning">
      {/* The view reads ?tab= and ?thread= through useSearchParams, which needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <CourseDetailView course={course} />
      </Suspense>
    </PlatformPage>
  );
}
