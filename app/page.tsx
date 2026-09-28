import type { Metadata } from "next";
import { CourseHub } from "@/components/views/CourseHub";

// The root template doesn't apply to a page in the root layout's own segment,
// so the product suffix is written out here.
export const metadata: Metadata = { title: { absolute: "My Learning · SkillUp" } };

export default function Home() {
  return <CourseHub />;
}
