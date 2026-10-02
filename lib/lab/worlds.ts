/**
 * /lab/worlds — four out-of-the-box visual worlds, each carried across the same three pages.
 * Free of the DS on purpose; only the SkillUp logo and teal are fixed.
 */
export type WorldKey = "exhibition" | "album" | "field" | "dawn";
export type WorldPage = "home" | "learning" | "course";

export const WORLDS: { key: WorldKey; letter: string; name: string; idea: string }[] = [
  { key: "exhibition", letter: "A", name: "Exhibition", idea: "Each course is an exhibition you walk through: modules are rooms, topics are wall labels." },
  { key: "album", letter: "B", name: "Album", idea: "Each course is an album: topics are tracks, and picking up where you left off is pressing play." },
  { key: "field", letter: "C", name: "Field", idea: "SkillUp teal owns the whole screen; the interface floats on it as white objects." },
  { key: "dawn", letter: "D", name: "Dawn", idea: "Progress is light: each course moves from night to day as you finish it." },
];

export const WORLD_PAGES: { key: WorldPage; label: string; path: string }[] = [
  { key: "home", label: "Home", path: "" },
  { key: "learning", label: "My Learning", path: "/learning" },
  { key: "course", label: "Course", path: "/course" },
];
