import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

// SkillUp DS (v2.0): Montserrat is the single family for body + display. Inter
// (the old UUI default) is retired.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillUp LMS — Video Lesson",
  description: "Prototype of the SkillUp LMS video lesson flow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
