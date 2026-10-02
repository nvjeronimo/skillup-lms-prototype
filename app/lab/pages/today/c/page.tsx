import type { Metadata } from "next";
import { TodayResume } from "./View";

export const metadata: Metadata = { title: "Today · C Resume shelf" };

export default function Page() {
  return <TodayResume />;
}
