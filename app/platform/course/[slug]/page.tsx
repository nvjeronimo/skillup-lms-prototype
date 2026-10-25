import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { CourseDetailView } from "@/components/platform/course/CourseDetailView";
import { CourseSkeleton } from "@/components/platform/course/CourseSkeleton";
import { getCourseDetailBySlug } from "@/lib/platform/course-detail";
import { requestPersonaId } from "@/lib/persona-server";
import { pageTitle } from "@/lib/utils";

type Params = { params: { slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const course = getCourseDetailBySlug(params.slug, requestPersonaId());
  return { title: pageTitle(course ? course.title : "Course not found") };
}

/** Course Detail, self-paced (Figma 6146:10226): a course opened from My Learning. */
export default function CourseDetailPage({ params }: Params) {
  const course = getCourseDetailBySlug(params.slug, requestPersonaId());
  if (!course) notFound();

  return (
    <PlatformPage current="my-learning" skeleton={<CourseSkeleton course={course} />}>
      {/* The view reads ?tab= and ?thread= through useSearchParams, which needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <CourseDetailView course={course} />
      </Suspense>
    </PlatformPage>
  );
}
