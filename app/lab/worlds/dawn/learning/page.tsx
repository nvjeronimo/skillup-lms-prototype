import type { Metadata } from "next";
import { LearningView } from "../_parts/LearningView";

export const metadata: Metadata = { title: "My Learning" };

export default function Page() {
  return <LearningView />;
}
