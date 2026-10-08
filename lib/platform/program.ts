import { user } from "@/lib/data";
import type { DeliveryMode, Difficulty } from "@/components/atoms/MetaBadges";
import type { MyLearningCourse } from "@/lib/platform/my-learning";

/**
 * Mock data of the Program page (Figma handoff frame 6728:15050, twelve cards: Courses,
 * Certificates, FAQs and About on desktop, tablet and mobile, as they read on 8 Oct 2026).
 * Copy is verbatim from the frames. Where the design draws an item closed and gives it no
 * body, the body is left out and the page prints CONTENT_PENDING.
 */

/** Printed in place of a body the design does not provide. */
export const CONTENT_PENDING = "Content to be provided.";

export const PROGRAM_TABS = [
  { id: "courses", label: "Courses" },
  { id: "certificates", label: "Certificates" },
  { id: "faqs", label: "FAQs" },
  { id: "about", label: "About" },
] as const;

export type ProgramTabId = (typeof PROGRAM_TABS)[number]["id"];

export const DEFAULT_PROGRAM_TAB: ProgramTabId = "courses";

export function isProgramTab(value: string | null | undefined): value is ProgramTabId {
  return PROGRAM_TABS.some((t) => t.id === value);
}

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
  /** Position in the program, 1-based. */
  number: number;
  /** What the DS `LMS / Course Card` shows. No `href`: the course has no player in the prototype. */
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
  learner: string;
  courseTitle: string;
  summary: string;
  issuedOn: string;
  certificateId: string;
  verifyUrl: string;
  partnerLogoSrc: string;
  partnerName: string;
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
  faqsIntro: { title: string };
  faqs: ProgramDisclosureItem[];
  aboutIntro: { title: string; lead: string };
  about: ProgramDisclosureItem[];
  dates: ProgramDate[];
  included: string[];
  instructors: ProgramPerson[];
}

/** The existing course player; the only course of the program the prototype can open. */
const COURSE_PLAYER_HREF = "/course/six-sigma/topic/m3-t1";

/**
 * A course row of the program. Every course is SkillUp · Beginner · Flexible Learning as
 * drawn; a course not started yet opens on its "Course Introduction" video. The cover is the
 * placeholder picture of the Figma screens (the field is the course's own `course_image`).
 */
function programCourse(
  number: number,
  title: string,
  initials: string,
  cover: string,
  {
    position,
    detail,
    modules,
    defaultOpen,
    ...card
  }: Pick<ProgramCourse, "position" | "detail" | "modules" | "defaultOpen"> &
    Pick<MyLearningCourse, "progressMeta"> &
    Partial<Pick<MyLearningCourse, "progressPct" | "upNext" | "cta" | "href">>,
): ProgramCourse {
  return {
    id: `course-${number}`,
    number,
    card: {
      id: `course-${number}`,
      title,
      initials,
      imageSrc: `/platform/covers/${cover}.jpg`,
      provider: "SkillUp",
      difficulty: "Beginner",
      delivery: "Flexible Learning",
      progressPct: null,
      upNext: { title: "Course Introduction", type: "Video" },
      cta: "Start",
      ...card,
    },
    position,
    detail,
    modules,
    defaultOpen,
  };
}

const AI_DIGITAL_MARKETING: Program = {
  slug: "ai-driven-digital-marketing",
  title: "Certificate Program in AI Augmented Digital Marketing",
  imageSrc: "/platform/covers/program-ai-digital-marketing.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { courses: "7 courses", duration: "4 months", org: "SkillUp" },
  progress: {
    percent: 14,
    label: "Program progress",
    status: "Course 2 of 7 · in progress",
    cta: "Resume course",
    href: COURSE_PLAYER_HREF,
    footer: "1 of 7 courses complete",
  },

  coursesIntro: {
    title: "Courses in this program",
    lead: "This Certificate Program comprises 7 courses that take you on a journey from the fundamentals to an advanced skill level.",
  },
  courses: [
    programCourse(1, "Digital Marketing Fundamentals and the AI Mindset", "DM", "program-course-1-digital-marketing-fundamentals", {
      progressPct: 100,
      progressMeta: "12 hours total",
      upNext: { certificate: "Issued 12 Sep 2026" },
      cta: "Review",
      position: "4 modules",
      detail: "All complete · 36 topics",
    }),
    programCourse(2, "AI-Driven Content and Brand Communication", "AC", "program-course-2-ai-driven-content", {
      progressPct: 40,
      progressMeta: "13 hours total",
      upNext: { title: "Creating impactful ad copy with effective prompts", type: "Reading" },
      cta: "Resume",
      href: COURSE_PLAYER_HREF,
      position: "Module 2 of 4",
      detail: "AI-Assisted Content Development",
      modules: [
        { number: 1, title: "Module 1 · Brand Strategy & Voice Systems", complete: true, topics: "12 topics", duration: "3h 13m" },
        {
          number: 2,
          title: "Module 2 · AI-Assisted Content Development",
          complete: false,
          topics: "3 of 10 topics",
          duration: "3h 22m",
          current: true,
        },
        { number: 3, title: "Module 3 · AI for Visual Content", complete: false, topics: "10 topics", duration: "3h 04m" },
        {
          number: 4,
          title: "Module 4 · Final Project, Assessment, and Wrap-Up",
          complete: false,
          topics: "6 topics",
          duration: "3h 14m",
        },
      ],
      defaultOpen: true,
    }),
    programCourse(3, "SEO, GEO, and Organic Growth with AI", "SG", "program-course-3-seo-geo-organic-growth", {
      progressMeta: "13 hours total",
      position: "4 modules",
      detail: "43 topics",
    }),
    programCourse(4, "Paid Advertising, Media & AI-Integrated Campaign Strategy", "PA", "program-course-4-paid-advertising", {
      progressMeta: "15 hours total",
      position: "4 modules",
      detail: "54 topics",
    }),
    programCourse(5, "Social Media and Ecommerce Marketing", "SM", "program-course-5-social-media-ecommerce", {
      progressMeta: "16 hours total",
      position: "5 modules",
      detail: "64 topics",
    }),
    programCourse(6, "Email, CRM, and Lifecycle Marketing with AI", "EC", "program-course-6-email-crm-lifecycle", {
      progressMeta: "10 hours total",
      position: "3 modules",
      detail: "34 topics",
    }),
    programCourse(7, "Capstone Project: AI-First Marketing System", "CP", "program-course-7-capstone", {
      progressMeta: "6 hours total",
      position: "4 modules",
      detail: "11 topics",
    }),
  ],

  certificatesIntro: {
    title: "Certificates",
    lead: "Each course issues its own certificate when you pass it.",
  },
  certificates: [
    {
      status: "issued",
      courseId: "course-1",
      courseLabel: "Course 1 · Digital Marketing Fundamentals and the AI Mindset",
      title: "Digital Marketing Fundamentals and the AI Mindset",
      issuedLine: "Issued 12 September 2026.",
      document: {
        learner: user.name,
        courseTitle: "Digital Marketing Fundamentals and the AI Mindset",
        summary: "4 modules  ·  about 12 hours",
        issuedOn: "12 September 2026",
        certificateId: "SKL-ADM01-2609-7F3K",
        verifyUrl: "skillup.online/certificates/7f3k9c2a",
        partnerLogoSrc: "/platform/certificate-partner-ibm.svg",
        partnerName: "IBM",
        signatories: [
          {
            name: "Priya Raman",
            role: "Head of Learning, SkillUp Online",
            signatureSrc: "/platform/certificate-signature-1.svg",
          },
          {
            name: "Signatory name",
            role: "Programme lead, IBM",
            signatureSrc: "/platform/certificate-signature-2.svg",
          },
        ],
      },
    },
    {
      status: "not-earned",
      courseId: "course-2",
      courseLabel: "Course 2 · AI-Driven Content and Brand Communication",
      title: "Not earned yet, keep on track!",
      requirements: [
        { title: "Reach the passing grade", detail: "28% now · 70% needed", percent: 28 },
        { title: "Complete the course content", detail: "14 of 35 topics · 40%", percent: 40 },
      ],
    },
  ],
  certificatesNote:
    "Certificates for the five courses you have not started appear here once you begin them.",

  faqsIntro: { title: "FAQs" },
  faqs: [
    {
      id: "faq-1",
      title: "What will I learn in the AI Augmented Digital Marketing program?",
      body: [
        "This certificate program in AI augmented digital marketing teaches how AI tools transform modern marketing; from audience analysis and content creation to campaign optimization and performance tracking. This helps marketers build smarter and more efficient digital strategies.",
      ],
      defaultOpen: true,
    },
    { id: "faq-2", title: "Who should enroll in this program?" },
    { id: "faq-3", title: "How does AI improve digital marketing strategies?" },
    { id: "faq-4", title: "How can this program help advance my marketing career?" },
    { id: "faq-5", title: "Does the program cover the entire digital marketing process?" },
    { id: "faq-6", title: "Is prior marketing experience required for this program?" },
    { id: "faq-7", title: "What practical skills will I gain from this training?" },
    { id: "faq-8", title: "Will I learn how AI-powered marketing systems work?" },
    { id: "faq-9", title: "What makes this program different from traditional marketing courses?" },
    { id: "faq-10", title: "Will I get a certificate after completing the program?" },
  ],

  aboutIntro: {
    title: "About this program",
    lead: "Build job-ready digital marketing expertise across content, search, paid media, social, ecommerce, and email-marketing while applying AI responsibly and strategically. Graduate with a portfolio-ready capstone that demonstrates end-to-end, real-world marketing capability.",
  },
  about: [
    {
      id: "about-1",
      title: "Program Overview",
      body: [
        "The Certificate Program in AI-Augmented Digital Marketing prepares you to become a workforce-ready marketing professional in an AI-driven economy.",
        "Across seven progressively structured courses, you will develop practical expertise in search engine optimization (SEO), content strategy, search and generative engine optimization (GEO), paid media and performance marketing, social media marketing, ecommerce growth systems, and email marketing. Rather than treating AI as a shortcut, the program teaches you how to supervise, structure, and strategically apply AI within professional marketing workflows.",
        "What sets this program apart is its strong focus on execution. Beyond the hands-on work within each course, you will complete 7 additional portfolio projects that simulate end-to-end marketing execution across channels, helping you build a portfolio aligned with current industry expectations.",
        "Each course builds toward integration, moving from foundations to specialization and finally to strategic orchestration. The program emphasizes decision-making, growth thinking, and responsible AI use in business contexts.",
        "The program is delivered through a blended learning model that combines structured self-paced learning, applied labs, and live virtual instructor-led training (VILT) to ensure active engagement and guided skill development.",
        "Your journey culminates in a capstone project, where you design and defend a complete AI-first marketing system. By the end of the program, you will have a portfolio that clearly demonstrates your readiness to take on modern marketing roles.",
      ],
      defaultOpen: true,
    },
    { id: "about-2", title: "How It Works" },
    { id: "about-3", title: "Skills You Will Gain" },
    { id: "about-4", title: "Who Should Enroll On This Program" },
    { id: "about-5", title: "Prerequisites" },
    { id: "about-6", title: "Human Skills Training" },
    { id: "about-7", title: "Career & Placement Services" },
    { id: "about-8", title: "Personalized Mentoring & Instructor Feedback" },
    { id: "about-9", title: "What You Will Create" },
    { id: "about-10", title: "Exercises to Explore" },
  ],

  dates: [
    {
      id: "started",
      iso: "2026-06-27",
      day: "27",
      month: "JUN",
      title: "Program started",
      detail: "27 Jun 2026",
      relative: "Started",
    },
    {
      id: "ends",
      iso: "2027-10-31",
      day: "31",
      month: "OCT",
      title: "Program ends",
      detail: "31 Oct 2027 · access to all courses closes",
      relative: "In 13 months",
    },
  ],
  included: [
    "76 videos",
    "90 readings",
    "13 podcasts",
    "10 activities",
    "24 hands-on labs",
    "6 final projects",
    "6 final assessments",
    "1 capstone project",
  ],
  instructors: [
    {
      name: "Rajesh Menon",
      role: "Marketing Services Expert, Digital Entrepreneur & University Faculty",
    },
  ],
};

const PROGRAMS: Program[] = [AI_DIGITAL_MARKETING];

export function getProgramBySlug(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}
