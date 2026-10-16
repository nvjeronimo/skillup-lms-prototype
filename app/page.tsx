import { redirect } from "next/navigation";
import { DASHBOARD_HREF } from "@/lib/platform/routes";

/** The site opens on the Dashboard, the learner's home (platform-navigation-flow.md). */
export default function Home() {
  redirect(DASHBOARD_HREF);
}
