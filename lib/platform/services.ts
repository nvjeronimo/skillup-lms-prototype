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

/** An open support request (help desk; none is wired yet). */
export interface SupportRequest {
  id: string;
  number: number;
  subject: string;
  /** "opened Thu", "opened today". */
  opened: string;
  course?: string;
  status: { label: string; color: BadgeColor };
}

/**
 * Services, by weight (Nelson, 23 Oct 2026: "too much on one level; what matters most must
 * stand out, the rest in the background"):
 * 1. Help now: the mentor, and support (help center, contact, the learner's open requests).
 * 2. Included with your program: what the learner already has and should use.
 * 3. More from SkillUp: the rest, as compact links.
 */
export const supportMock = "Support requests need a help-desk integration (not chosen yet)";

export const helpCenter: ServiceItem = {
  id: "help",
  icon: LifeBuoy,
  title: "Help center",
  description: "Answers about your account, payments, certificates and the platform.",
  action: "Open the help center",
  external: true,
};

export const contactSupport: ServiceItem = {
  id: "contact",
  icon: Headphones,
  title: "Contact support",
  description: "Tell us what's wrong. We reply by email within one business day.",
  action: "Write to us",
};

export const openRequests: SupportRequest[] = [
  {
    id: "request-4821",
    number: 4821,
    subject: "Video won't load in Module 2",
    opened: "opened Thu",
    course: "AI-Driven Content and Brand Communication",
    status: { label: "In progress", color: "warning" },
  },
];

export const includedMock = "Partner benefits and coaching are agreed per program; the codes and links are samples";

/** What the program already gives the learner: each with its state and one action. */
export const includedServices: ServiceItem[] = [
  { id: "cv", icon: FileText, title: "CV review", description: "A career coach reviews your CV and LinkedIn profile.", action: "Book a review", status: { label: "1 included", color: "info" } },
  { id: "azure", icon: Cloud, title: "Microsoft Azure credits", description: "USD 100 of Azure credit for the labs of your Microsoft courses.", action: "View your code", status: { label: "Claimed", color: "success" } },
  { id: "ibm", icon: BadgeCheck, title: "IBM SkillsBuild badge", description: "A digital badge from IBM when you finish the program.", action: "How to earn it", status: { label: "In progress", color: "info" } },
];

export const moreMock = "Career services are SkillUp's own; none of them has a system behind it yet";

/** Secondary services: one line each, a link. */
export const moreServices: ServiceItem[] = [
  { id: "interview", icon: MessagesSquare, title: "Interview practice", description: "A mock interview with a career coach", action: "Book a practice" },
  { id: "jobs", icon: Briefcase, title: "Job board", description: "Roles from SkillUp's hiring partners", action: "Browse jobs", external: true },
  { id: "linkedin", icon: Linkedin, title: "Share your certificates", description: "Add them to LinkedIn in one step", action: "Add to LinkedIn", external: true },
  { id: "sandbox", icon: Terminal, title: "Python sandbox", description: "A notebook for Business Analytics with Python", action: "Open the sandbox", external: true },
  { id: "certs", icon: Award, title: "Certificates", description: "Download and share your certificates", action: "See certificates", href: "/platform/certificates" },
];
