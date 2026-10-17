import type { Metadata } from "next";
import { CalendarView } from "@/components/platform/calendar/CalendarView";
import { pageTitle } from "@/lib/utils";

export const metadata: Metadata = { title: pageTitle("Calendar") };

/** Calendar (proposal, 17 Oct 2026): every course's dates in one place. */
export default function CalendarPage() {
  return <CalendarView />;
}
