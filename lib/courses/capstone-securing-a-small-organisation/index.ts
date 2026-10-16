import type { CourseEntry } from "@/lib/courses/kit";
import { content } from "./content";
import { outline } from "./outline";
import { page } from "./page";

/** "Capstone: Securing a Small Organisation". */
const course: CourseEntry = { outline, page, content };

export default course;
