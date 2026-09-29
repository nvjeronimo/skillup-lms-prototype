import type { Metadata } from "next";
import { CourseView } from "../_parts/CourseView";

export const metadata: Metadata = { title: "Six Sigma for Process Improvement" };

export default function Page() {
  return <CourseView />;
}
