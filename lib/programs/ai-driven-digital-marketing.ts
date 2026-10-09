import { certificatePageHref, coursePlayerHref, programCourse, slugify, user } from "./kit";
import type { Program } from "./kit";

/**
 * Mock data of the Program page (Figma handoff frame 6728:15050, twelve cards: Courses,
 * Certificates, FAQs and About on desktop, tablet and mobile, as they read on 8 Oct 2026).
 * Copy that the frames draw is verbatim. The design draws most FAQ and About items closed, with
 * no body, and the module lists of the courses not in progress are not drawn either: those are
 * sample content written for the prototype (asked by Nelson on 9 Oct 2026), pending the vendor's.
 */

/** The course the learner is in (course 2): the header's Resume opens its player. */
const COURSE_PLAYER_HREF = coursePlayerHref(slugify("AI-Driven Content and Brand Communication"));

const program: Program = {
  slug: "ai-driven-digital-marketing",
  title: "Certificate Program in AI Augmented Digital Marketing",
  imageSrc: "/platform/covers/program-ai-digital-marketing.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { courses: "7 courses", duration: "10 months", org: "SkillUp" },
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
      modules: [
        { number: 1, title: "Module 1 · The Digital Marketing Landscape", complete: true, topics: "10 topics", duration: "2h 53m" },
        { number: 2, title: "Module 2 · Goals, Funnels and Measurement", complete: true, topics: "10 topics", duration: "3h 21m" },
        { number: 3, title: "Module 3 · The AI Mindset for Marketers", complete: true, topics: "10 topics", duration: "2h 40m" },
        { number: 4, title: "Module 4 · Final Project, Assessment, and Wrap-Up", complete: true, topics: "6 topics", duration: "3h 14m" },
      ],
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
      modules: [
        { number: 1, title: "Module 1 · How Search Works & Keyword Strategy", complete: false, topics: "12 topics", duration: "3h 09m" },
        { number: 2, title: "Module 2 · On-Page, Technical and Content SEO", complete: false, topics: "13 topics", duration: "3h 41m" },
        { number: 3, title: "Module 3 · GEO, Authority and Measurement", complete: false, topics: "12 topics", duration: "2h 58m" },
        { number: 4, title: "Module 4 · Final Project, Assessment, and Wrap-Up", complete: false, topics: "6 topics", duration: "3h 14m" },
      ],
    }),
    programCourse(4, "Paid Advertising, Media & AI-Integrated Campaign Strategy", "PA", "program-course-4-paid-advertising", {
      progressMeta: "15 hours total",
      position: "4 modules",
      detail: "54 topics",
      modules: [
        { number: 1, title: "Module 1 · Paid Media Foundations & Search Advertising", complete: false, topics: "16 topics", duration: "4h 05m" },
        { number: 2, title: "Module 2 · Social, Display and Video Advertising", complete: false, topics: "16 topics", duration: "4h 10m" },
        { number: 3, title: "Module 3 · Measurement, Optimization & AI-Integrated Strategy", complete: false, topics: "16 topics", duration: "3h 37m" },
        { number: 4, title: "Module 4 · Final Project, Assessment, and Wrap-Up", complete: false, topics: "6 topics", duration: "3h 14m" },
      ],
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
    {
      id: "faq-2",
      title: "Who should enroll in this program?",
      body: [
        "Marketers, founders, career changers and recent graduates who want to plan and run digital marketing with AI tools. It starts from the fundamentals, so it also suits people who run marketing alongside another job and want a structured method.",
      ],
    },
    {
      id: "faq-3",
      title: "How does AI improve digital marketing strategies?",
      body: [
        "AI speeds up the slow parts of marketing work: researching an audience, drafting and adapting content, grouping keywords, testing ad variations and reading campaign data. The program teaches you to brief these tools, check what they produce and decide what to keep, so the strategy stays yours.",
      ],
    },
    {
      id: "faq-4",
      title: "How can this program help advance my marketing career?",
      body: [
        "You finish with seven portfolio projects and a capstone that show a complete marketing system, from audience and content to paid media and lifecycle email. Each course also issues its own certificate, so you can show progress before you complete the program.",
      ],
    },
    {
      id: "faq-5",
      title: "Does the program cover the entire digital marketing process?",
      body: [
        "Yes. The seven courses follow the full process: fundamentals and measurement, content and brand, search and generative engine optimization, paid media, social media and ecommerce, email and CRM, and a capstone that joins them into one plan.",
      ],
    },
    {
      id: "faq-6",
      title: "Is prior marketing experience required for this program?",
      body: [
        "No. Course 1 covers the fundamentals of digital marketing before any specialist topic. You need to be comfortable using a browser, a spreadsheet and a document editor.",
      ],
    },
    {
      id: "faq-7",
      title: "What practical skills will I gain from this training?",
      body: [
        "You will write audience and channel plans, build a keyword map, draft and edit content with AI assistance, plan search and social campaigns with a budget, set up a lifecycle email sequence and read the numbers that tell you whether each one worked.",
      ],
    },
    {
      id: "faq-8",
      title: "Will I learn how AI-powered marketing systems work?",
      body: [
        "Yes, at the level a marketer needs. You learn what generative models, recommendation systems and automated bidding do, where they go wrong, and how to supervise them. The program does not teach you to build models.",
      ],
    },
    {
      id: "faq-9",
      title: "What makes this program different from traditional marketing courses?",
      body: [
        "Every course has you do the work, with AI in the workflow from the first module, and ends in a project you can show. The capstone asks you to design and defend a complete AI-first marketing system, not to sit a final exam alone.",
      ],
    },
    {
      id: "faq-10",
      title: "Will I get a certificate after completing the program?",
      body: [
        "Yes. Each course issues its own certificate when you pass it, and you receive the program certificate when all seven courses are complete.",
      ],
    },
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
    {
      id: "about-2",
      title: "How It Works",
      body: [
        "The program has seven courses that you take in order. Each one is made of modules with videos, readings, activities, practice quizzes, graded assignments and a final project.",
        "Learning is flexible: there is a suggested weekly pace and due dates to keep you on track, and you study at the times that suit you. Mentors answer questions in each course's Mentorship Q&A.",
        "You pass a course with a grade of 70% or more. Passing a course issues its certificate and opens the next step of the program.",
      ],
    },
    {
      id: "about-3",
      title: "Skills You Will Gain",
      body: [
        "Audience research and customer journey mapping.",
        "Content strategy, brand voice and AI-assisted content production.",
        "Search engine optimization and generative engine optimization.",
        "Paid search, social, display and video advertising, with budgeting and measurement.",
        "Social media, social commerce and ecommerce growth.",
        "Email, CRM and lifecycle marketing.",
        "Responsible use of AI: briefing, reviewing and correcting what the tools produce.",
      ],
    },
    {
      id: "about-4",
      title: "Who Should Enroll On This Program",
      body: [
        "People starting a career in digital marketing.",
        "Marketers who want to bring AI into the work they already do.",
        "Founders and small business owners who run their own marketing.",
        "Professionals moving into marketing from sales, communications or design.",
      ],
    },
    {
      id: "about-5",
      title: "Prerequisites",
      body: [
        "No previous marketing experience is required. You need basic computer skills, access to a computer with an internet connection, and enough English to read course materials and write short assignments.",
      ],
    },
    {
      id: "about-6",
      title: "Human Skills Training",
      body: [
        "Alongside the marketing courses, the program builds the skills employers ask for in every role: clear writing, presenting a recommendation, giving and receiving feedback in peer reviews, and working to a deadline.",
      ],
    },
    {
      id: "about-7",
      title: "Career & Placement Services",
      body: [
        "You can ask for a review of your CV and portfolio, and practise interview questions for entry-level marketing roles. These services support your job search; they are not a guarantee of placement.",
      ],
    },
    {
      id: "about-8",
      title: "Personalized Mentoring & Instructor Feedback",
      body: [
        "Each course has a mentor who answers questions in the Mentorship Q&A, usually within two working days. Graded assignments come back with written feedback against the rubric, and final projects are reviewed by your peers as well.",
      ],
    },
    {
      id: "about-9",
      title: "What You Will Create",
      body: [
        "A customer journey map and channel plan.",
        "A content calendar and a set of AI-assisted brand assets.",
        "A keyword map and an on-page optimization plan.",
        "A paid campaign plan with budget and measurement.",
        "A social commerce plan and a lifecycle email sequence.",
        "A capstone: one complete AI-first marketing system for a business of your choice.",
      ],
    },
    {
      id: "about-10",
      title: "Exercises to Explore",
      body: [
        "Each module includes ungraded activities you can repeat as often as you like: labelling search intent, calculating funnel conversion rates, rewriting AI drafts in a brand voice, and comparing ad variations. They prepare you for the graded work that follows.",
      ],
    },
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
    // Counted from the seven course outlines (lib/courses), not from the frames.
    "97 videos",
    "87 readings",
    "27 activities",
    "20 practice quizzes",
    "18 graded quizzes",
    "17 graded assignments",
    "6 final projects",
    "7 peer reviews",
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
