import type { Metadata } from "next";
import { View } from "./View";

export const metadata: Metadata = { title: "Dashboard · C Live + today" };

/** /lab/dashboard/live — Direction C: the dashboard organised by time, like an agenda. */
export default function Page() {
  return <View />;
}
