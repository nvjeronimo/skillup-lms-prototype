import type { Metadata } from "next";
import { HomeView } from "./_parts/HomeView";

export const metadata: Metadata = { title: "Home" };

export default function Page() {
  return <HomeView />;
}
