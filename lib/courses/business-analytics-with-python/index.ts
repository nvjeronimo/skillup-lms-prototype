import type { CourseEntry } from "@/lib/courses/kit";
import { content } from "./content";
import { outline } from "./outline";
import { page } from "./page";

/** "Business Analytics with Python". */
const course: CourseEntry = { outline, page, content };

export default course;
