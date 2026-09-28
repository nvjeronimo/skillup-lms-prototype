import type { Metadata } from "next";
import { CourseHub } from "@/components/views/CourseHub";

export const metadata: Metadata = { title: "My Learning" };

export default function Home() {
  return <CourseHub />;
}
