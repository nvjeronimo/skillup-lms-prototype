import { user } from "@/lib/data";

const [firstName = user.name] = user.name.split(" ");

/**
 * The learner shown on the platform pages: the same mock user as the course player and the
 * home page (`lib/data-model.json`), so a test session shows one person throughout. The Figma
 * platform screens are drawn with "John Smith"; the name is sample data either way.
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

/** The five sections of `LMS / Platform / Topbar`. Only the first two have pages in the prototype. */
export const PLATFORM_SECTIONS: { id: PlatformSection; label: string; href?: string; count?: number }[] = [
  { id: "dashboard", label: "Dashboard", href: "/platform/dashboard" },
  { id: "my-learning", label: "My Learning", href: "/platform/my-learning", count: 4 },
  { id: "calendar", label: "Calendar", count: 3 },
  { id: "discussion", label: "Discussion" },
  { id: "services", label: "Services" },
];
