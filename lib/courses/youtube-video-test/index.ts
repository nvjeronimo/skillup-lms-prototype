import type { CourseEntry } from "@/lib/courses/kit";
import { content } from "./content";
import { outline } from "./outline";
import { page } from "./page";

/** "YouTube Video Test": the two ways a YouTube video can be added to a course, and a missing one. */
const course: CourseEntry = { outline, page, content };

export default course;
