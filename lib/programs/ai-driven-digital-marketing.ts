import { certificatePageHref, coursePlayerHref, programCourse, slugify, user } from "./kit";
import type { Program } from "./kit";

/**
 * Mock data of the Program page (Figma handoff frame 6728:15050, twelve cards: Courses,
 * Certificates, FAQs and About on desktop, tablet and mobile, as they read on 8 Oct 2026).
 * Copy is verbatim from the frames. Where the design draws an item closed and gives it no
 * body, the body is left out and the page prints CONTENT_PENDING.
 */

/** The course the learner is in (course 2): the header's Resume opens its player. */
const COURSE_PLAYER_HREF = coursePlayerHref(slugify("AI-Driven Content and Brand Communication"));

const program: Program = {
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
      modules: [
        { number: 1, title: "Module 1 · Social Media Strategy & Platform Fundamentals", complete: false, topics: "14 topics", duration: "3h 13m" },
        { number: 2, title: "Module 2 · Content, Community & Creator Partnerships", complete: false, topics: "14 topics", duration: "3h 21m" },
        { number: 3, title: "Module 3 · Social Commerce & Ecommerce Storefronts", complete: false, topics: "14 topics", duration: "3h 21m" },
        { number: 4, title: "Module 4 · Ecommerce Growth: Conversion, Retention & Analytics", complete: false, topics: "14 topics", duration: "3h 23m" },
        { number: 5, title: "Module 5 · Final Project, Assessment, and Wrap-Up", complete: false, topics: "8 topics", duration: "3h 00m" },
      ],
    }),
    programCourse(6, "Email, CRM, and Lifecycle Marketing with AI", "EC", "program-course-6-email-crm-lifecycle", {
      progressMeta: "10 hours total",
      position: "3 modules",
      detail: "34 topics",
      modules: [
        { number: 1, title: "Module 1 · Email Foundations & Deliverability", complete: false, topics: "12 topics", duration: "3h 07m" },
        { number: 2, title: "Module 2 · CRM, Segmentation & Lifecycle Automation", complete: false, topics: "12 topics", duration: "3h 25m" },
        { number: 3, title: "Module 3 · AI Personalisation, Final Project, and Wrap-Up", complete: false, topics: "10 topics", duration: "3h 38m" },
      ],
    }),
    programCourse(7, "Capstone Project: AI-First Marketing System", "CP", "program-course-7-capstone", {
      progressMeta: "6 hours total",
      position: "4 modules",
      detail: "11 topics",
      modules: [
        { number: 1, title: "Module 1 · Project Brief & Planning", complete: false, topics: "3 topics", duration: "51m" },
        { number: 2, title: "Module 2 · Build: Strategy, Channels & Content", complete: false, topics: "3 topics", duration: "2h 27m" },
        { number: 3, title: "Module 3 · Measure, Document & Check", complete: false, topics: "3 topics", duration: "1h 07m" },
        { number: 4, title: "Module 4 · Final Submission & Peer Review", complete: false, topics: "2 topics", duration: "1h 45m" },
      ],
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
      viewHref: certificatePageHref(slugify("Digital Marketing Fundamentals and the AI Mindset")),
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
        { title: "Complete the course content", detail: "15 of 38 topics · 40%", percent: 40 },
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

export default program;
