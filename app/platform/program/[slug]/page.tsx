import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformPage } from "@/components/platform/PlatformPage";
import { ProgramDetailView } from "@/components/platform/program/ProgramDetailView";
import { getProgramBySlug } from "@/lib/platform/program";
import { pageTitle } from "@/lib/utils";

type Params = { params: { slug: string } };

export function generateMetadata({ params }: Params): Metadata {
  const program = getProgramBySlug(params.slug);
  return { title: pageTitle(program ? program.title : "Program not found") };
}

/** Program Detail (Figma 6443:18721): a program opened from My Learning. */
export default function ProgramDetailPage({ params }: Params) {
  const program = getProgramBySlug(params.slug);
  if (!program) notFound();

  return (
    <PlatformPage current="my-learning">
      {/* The view reads ?tab= through useSearchParams, which needs a Suspense boundary. */}
      <Suspense fallback={null}>
        <ProgramDetailView program={program} />
      </Suspense>
    </PlatformPage>
  );
}
