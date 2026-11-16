import type { CourseEntry } from "@/lib/courses/kit";
import { content } from "./content";
import { outline } from "./outline";
import { page } from "./page";

/** One module, one video. Course 7 of the SCORM and YouTube Test Program. */
const course: CourseEntry = { outline, page, content };

export default course;
