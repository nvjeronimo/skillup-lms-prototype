import type { Metadata } from "@/lib/router";
import { TrainingToday } from "./View";

export const metadata: Metadata = { title: { absolute: "Today · The Training Block · Lab · SkillUp" } };

export default function Page() {
  return <TrainingToday />;
}
