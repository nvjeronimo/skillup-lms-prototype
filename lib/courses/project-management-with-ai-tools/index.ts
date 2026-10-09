import type { CourseEntry } from "@/lib/courses/kit";
import { content } from "./content";
import { outline } from "./outline";
import { page } from "./page";

/** "Project Management with AI Tools". */
const course: CourseEntry = { outline, page, content };

export default course;
