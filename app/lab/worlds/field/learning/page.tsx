import type { Metadata } from "next";
import { LearningView } from "../_parts/LearningView";

export const metadata: Metadata = { title: "My Learning · C · Field" };

export default function Page() {
  return <LearningView />;
}
