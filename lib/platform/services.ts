import { Award, BadgeCheck, Briefcase, Cloud, FileText, Headphones, LifeBuoy, Linkedin, MessagesSquare, Terminal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BadgeColor } from "@/components/atoms/Badge";
import { MENTOR } from "@/lib/courses/ai-driven-content-and-brand-communication/page";

/**
 * Services (proposal, 17 Oct 2026): what SkillUp gives the learner besides the courses —
 * mentoring, career help, support and the benefits of their programs (Nelson, 17 Oct 2026).
 * None of it is Open edX: each service is SkillUp's own, and every block says what it needs.
 */

export const servicesMentor = {
  // The mentor of AI-Driven Content and Brand Communication, the course in progress of the program.
  name: MENTOR.name,
  role: `Your mentor · ${MENTOR.role}`,
  promise: "Typically replies within 1 day",
  last: { from: MENTOR.name, text: "Aim for one page people will actually read: three traits, a do/don't for each…", when: "Fri 9:30 AM" },
  /** ADR 007: 1:1 asynchronous messages. Phase 2; who the mentor is per learner is still open. */
  mock: "Mentor messaging is Phase 2, and who mentors whom is not decided yet",
} as const;

export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** What the learner can do; a toast in the prototype unless `href` is set. */
  action: string;
  href?: string;
  /** Opens elsewhere (a partner site, the help centre). */
  external?: boolean;
  status?: { label: string; color: BadgeColor };
}

export interface ServiceSection {
  id: string;
  title: string;
  emphasis: string;
  items: ServiceItem[];
  mock: string;
}

export const serviceSections: ServiceSection[] = [
  {
    id: "career",
    title: "Career",
    emphasis: "next steps",
    mock: "Career services are SkillUp's own; none of them has a system behind it yet",
    items: [
      { id: "cv", icon: FileText, title: "CV review", description: "A career coach reviews your CV and LinkedIn profile. One review is included with your program.", action: "Book a review", status: { label: "1 included", color: "info" } },
      { id: "interview", icon: MessagesSquare, title: "Interview practice", description: "A mock interview for your field with a career coach, then feedback on your answers.", action: "Book a practice" },
      { id: "jobs", icon: Briefcase, title: "Job board", description: "Roles from SkillUp's hiring partners that match your programs.", action: "Browse jobs", external: true },
      { id: "linkedin", icon: Linkedin, title: "Share your certificates", description: "Add your certificates to LinkedIn in one step.", action: "Add to LinkedIn", external: true },
    ],
  },
  {
    id: "support",
    title: "Support",
    emphasis: "and help",
    mock: "Support requests need a help-desk integration (not chosen yet)",
    items: [
      { id: "help", icon: LifeBuoy, title: "Help center", description: "Answers about your account, payments, certificates and the platform.", action: "Open the help center", external: true },
      { id: "contact", icon: Headphones, title: "Contact support", description: "Tell us what's wrong. We reply within one business day.", action: "Write to us" },
      { id: "request", icon: FileText, title: "Video won't load in Module 2", description: "Request 4821 · opened Thu · AI-Driven Content and Brand Communication", action: "View request", status: { label: "In progress", color: "warning" } },
    ],
  },
  {
    id: "benefits",
    title: "Benefits",
    emphasis: "and tools",
    mock: "Partner benefits are agreed per program; the codes and links are samples",
    items: [
      { id: "azure", icon: Cloud, title: "Microsoft Azure credits", description: "USD 100 of Azure credit for the labs of your Microsoft courses.", action: "View your code", status: { label: "Claimed", color: "success" } },
      { id: "ibm", icon: BadgeCheck, title: "IBM SkillsBuild badge", description: "A digital badge from IBM when you finish the program.", action: "How to earn it", status: { label: "In progress", color: "info" } },
      { id: "sandbox", icon: Terminal, title: "Python sandbox", description: "A ready-to-use notebook for Business Analytics with Python, no install needed.", action: "Open the sandbox", external: true },
      { id: "certs", icon: Award, title: "Certificates", description: "Your course and program certificates, ready to download and share.", action: "See certificates", href: "/platform/certificates" },
    ],
  },
];
