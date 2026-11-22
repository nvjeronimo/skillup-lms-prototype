import type { Metadata } from "@/lib/router";
import { CoursePlan as View } from "./View";

export const metadata: Metadata = { title: "Six Sigma plan" };

export default function Page() {
  return <View />;
}
