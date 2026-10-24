import type { Metadata } from "next";
import { CourseJourneyProposal } from "./View";

export const metadata: Metadata = { title: "Course Journey proposal" };

export default function Page() {
  return <CourseJourneyProposal />;
}
