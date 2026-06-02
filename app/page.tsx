import { redirect } from "next/navigation";
import { DEFAULT_COURSE_SLUG, DEFAULT_TOPIC_ID } from "@/lib/data";

export default function Home() {
  redirect(`/course/${DEFAULT_COURSE_SLUG}/topic/${DEFAULT_TOPIC_ID}`);
}
