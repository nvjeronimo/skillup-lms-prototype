import type { Metadata } from "next";
import { CourseHub } from "@/components/views/CourseHub";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("My Learning") };

export default function Home() {
  return <CourseHub />;
}
