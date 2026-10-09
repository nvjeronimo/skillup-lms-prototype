import type { CourseEntry } from "@/lib/courses/kit";
import { content } from "./content";
import { outline } from "./outline";
import { page } from "./page";

/** "Leadership in Remote Teams". */
const course: CourseEntry = { outline, page, content };

export default course;
