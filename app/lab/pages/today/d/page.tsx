import type { Metadata } from "next";
import { TodayChecklist } from "./View";

export const metadata: Metadata = { title: "Today · D Checklist" };

export default function Page() {
  return <TodayChecklist />;
}
