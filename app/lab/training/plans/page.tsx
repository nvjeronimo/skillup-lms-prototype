import type { Metadata } from "@/lib/router";
import { TrainingPlans } from "./View";

export const metadata: Metadata = { title: "Plans" };

export default function Page() {
  return <TrainingPlans />;
}
