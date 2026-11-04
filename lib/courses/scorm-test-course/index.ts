import type { CourseEntry } from "@/lib/courses/kit";
import { content } from "./content";
import { outline } from "./outline";
import { page } from "./page";

/** "SCORM Test Course": four real SCORM 1.2 packages to test the Activity player. */
const course: CourseEntry = { outline, page, content };

export default course;
