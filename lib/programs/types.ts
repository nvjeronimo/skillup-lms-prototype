import type { DeliveryMode, Difficulty } from "@/components/atoms/MetaBadges";
import type { MyLearningCourse } from "@/lib/platform/my-learning";

/** The shape of a program page. Re-exported by lib/platform/program, where the page reads it. */

/** One module of a course outline, as the DS `Module-Row` shows it inside a course row. */
export interface ProgramModule {
  number: number;
  /** As drawn, "Module N · Title". */
  title: string;
  complete: boolean;
  /** "12 topics", or "3 of 10 topics" on the module the learner is in. */
  topics: string;
  /** "3h 13m". Nobody authors `effort_time` yet (open question 2), so this is sample data. */
  duration: string;
  /** The module the learner left off in. */
  current?: boolean;
}

/**
 * One row of the Courses tab (DS `LMS/Platform/Program-Detail/Course-Row`): the DS Course
 * Card, a modules bar that says where the learner is, and the course outline once the row
 * is expanded (one call per course, made when the row opens).
 */
export interface ProgramCourse {
  id: string;
  /** The course's slug: its page is /platform/course/<slug>, its player /course/<slug>/…. */
  slug: string;
  /** Position in the program, 1-based. */
  number: number;
  /** What the DS `LMS / Course Card` shows: the title opens the course page, the button the player. */
  card: MyLearningCourse;
  /** Modules bar, in body-medium/Semibold: "4 modules", or "Module 2 of 4" for the course in progress. */
  position: string;
  /** Modules bar, in text/subtle: the topic count, or the name of the module the learner is in. */
  detail: string;
  /** The outline. Only the course in progress is drawn open; the rest print CONTENT_PENDING. */
  modules?: ProgramModule[];
  /** Open when the page loads (as drawn). */
  defaultOpen?: boolean;
}

export interface ProgramDate {
  id: string;
  /** ISO date, for <time>. */
  iso: string;
  day: string;
  month: string;
  title: string;
  detail: string;
  /** Relative badge; computed by the product, not sent by the platform. */
  relative: string;
}

export interface ProgramPerson {
  name: string;
  role: string;
}

export interface CertificateRequirement {
  title: string;
  detail: string;
  /** 0–100. */
  percent: number;
}

export interface CertificateDocumentData {
  /** Left out, the sheet prints the signed-in learner (`user` of lib/data, through lib/platform/user). */
  learner?: string;
  /** "program" changes the sentence above the title; a course certificate when absent. */
  kind?: "course" | "program";
  courseTitle: string;
  summary: string;
  issuedOn: string;
  certificateId: string;
  verifyUrl: string;
  /** A certificate without a partner prints the SkillUp logo alone (both optional since 10 Oct 2026). */
  partnerLogoSrc?: string;
  partnerName?: string;
  signatories: { name: string; role: string; signatureSrc: string }[];
}

export type ProgramCertificate =
  | {
      status: "issued";
      courseId: string;
      /** The line above the card, "Course N · Title". */
      courseLabel: string;
      title: string;
      issuedLine: string;
      document: CertificateDocumentData;
      /** Where View goes: the certificate's own page. */
      viewHref?: string;
    }
  | {
      status: "not-earned";
      courseId: string;
      courseLabel: string;
      title: string;
      requirements: CertificateRequirement[];
    };

/** One FAQ or one About section. `body` is a list of paragraphs. */
export interface ProgramDisclosureItem {
  id: string;
  title: string;
  body?: string[];
  defaultOpen?: boolean;
}

export interface Program {
  slug: string;
  title: string;
  imageSrc: string;
  deliveryMode: DeliveryMode;
  difficulty: Difficulty;
  stats: { courses: string; duration: string; org: string };
  progress: {
    percent: number;
    label: string;
    status: string;
    cta: string;
    href: string;
    footer: string;
  };
  coursesIntro: { title: string; lead: string };
  courses: ProgramCourse[];
  certificatesIntro: { title: string; lead: string };
  certificates: ProgramCertificate[];
  certificatesNote: string;
  /**
   * PROPOSAL, NOT DESIGNED (10 Oct 2026). The certificate of the program itself, once issued.
   * Left out, the page derives the not-earned state from the courses (lib/platform/catalog,
   * `getProgramCertificate`): no sample program is complete, so no program file sets it.
   */
  programCertificate?: Extract<ProgramCertificate, { status: "issued" }>;
  faqsIntro: { title: string };
  faqs: ProgramDisclosureItem[];
  aboutIntro: { title: string; lead: string };
  about: ProgramDisclosureItem[];
  dates: ProgramDate[];
  included: string[];
  instructors: ProgramPerson[];
}
