import type { Metadata } from "next";
import { TodayFocus } from "./View";

export const metadata: Metadata = { title: "Today · A Focus" };

export default function Page() {
  return <TodayFocus />;
}
