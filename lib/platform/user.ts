/** The learner shown on the platform pages (mock; the Figma screens use John Smith). */
export const platformUser = {
  name: "John Smith",
  firstName: "John",
  initials: "JS",
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
