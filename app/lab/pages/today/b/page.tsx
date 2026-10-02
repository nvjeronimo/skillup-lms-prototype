import type { Metadata } from "next";
import { TodayAgenda } from "./View";

export const metadata: Metadata = { title: "Today · B Agenda" };

export default function Page() {
  return <TodayAgenda />;
}
