import type { Metadata } from "next";
import { TrainingPlans } from "./View";

export const metadata: Metadata = { title: "Plans" };

export default function Page() {
  return <TrainingPlans />;
}
