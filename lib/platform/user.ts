import { user } from "@/lib/data";
import { deadlinesThisWeek } from "./calendar";

const [firstName = user.name] = user.name.split(" ");

/**
 * The learner shown on the platform pages: the same mock user as the course player and the
 * home page (`lib/data-model.json`), so a test session shows one person throughout: "John
 * Smith", as the Figma screens are drawn (10 Oct 2026; "Olivia Rhye" before).
 */
export const platformUser = {
  name: user.name,
  firstName,
  initials: user.name
    .split(" ")
    .map((word) => word[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join(""),
  role: "Learner · Pro",
} as const;

export type PlatformSection = "dashboard" | "my-learning" | "calendar" | "discussion" | "services";

/** The five sections of `LMS / Platform / Topbar`. Calendar, Discussion and Services are proposals (17 Oct 2026). */
export const PLATFORM_SECTIONS: { id: PlatformSection; label: string; href?: string; count?: number }[] = [
  { id: "dashboard", label: "Dashboard", href: "/platform/dashboard" },
  { id: "my-learning", label: "My Learning", href: "/platform/my-learning", count: 4 },
  // The count: deadlines in the next seven days, as the Calendar shows them.
  { id: "calendar", label: "Calendar", href: "/platform/calendar", count: deadlinesThisWeek },
  { id: "discussion", label: "Discussion", href: "/platform/discussion" },
  { id: "services", label: "Services", href: "/platform/services" },
];
