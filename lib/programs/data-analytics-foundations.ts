import { certificatePageHref, programCertificatePageHref, programCourse, slugify, user } from "./kit";
import type { Program, ProgramCertificate } from "./kit";

/**
 * "Data Analytics Foundations Certificate": the third program of My Learning, and the
 * completed one (DS Program-Card `State=Completed`). Sample data written for the prototype
 * (asked by Nelson on 16 Oct 2026, so that the completed card opens a page like the others);
 * it has no Figma frame of its own. Every FAQ and About section has its body, so nothing here
 * prints CONTENT_PENDING.
 *
 * Today is 16 Oct 2026. The learner finished all five courses: every course row is at 100%
 * with every module complete, each course lists its issued certificate, and the program
 * certificate was issued on 30 Sep 2026, the date the card in lib/platform/my-learning shows.
 * The header's action opens the program certificate. The courses have no folder under
 * lib/courses: each one shows the sample content under its own title.
 */

const SLUG = "data-analytics-foundations";
const TITLE = "Data Analytics Foundations Certificate";

const SIGNATORIES = [
  {
    name: "Priya Raman",
    role: "Head of Learning, SkillUp Online",
    signatureSrc: "/platform/certificate-signature-1.svg",
  },
  {
    // A sample name (the real signatory is not known): the AI program still prints the placeholder.
    name: "Daniel Moreau",
    role: "Programme lead, IBM",
    signatureSrc: "/platform/certificate-signature-2.svg",
  },
];

type IssuedCertificate = Extract<ProgramCertificate, { status: "issued" }>;

/** The issued certificate of course `number`, in the shape of the first program's. */
function courseCertificate(
  number: number,
  title: string,
  summary: string,
  issuedOn: string,
  certificateId: string,
  verifyCode: string,
): IssuedCertificate {
  return {
    status: "issued",
    courseId: `course-${number}`,
    viewHref: certificatePageHref(slugify(title)),
    courseLabel: `Course ${number} · ${title}`,
    title,
    issuedLine: `Issued ${issuedOn}.`,
    document: {
      learner: user.name,
      courseTitle: title,
      summary,
      issuedOn,
      certificateId,
      verifyUrl: `skillup.online/certificates/${verifyCode}`,
      partnerLogoSrc: "/platform/certificate-partner-ibm.svg",
      partnerName: "IBM",
      // The program's second partner, as on its card (16 Oct 2026).
      morePartners: [{ logoSrc: "/platform/partners/microsoft-light.svg", name: "Microsoft" }],
      signatories: SIGNATORIES,
    },
  };
}

const program: Program = {
  slug: SLUG,
  title: TITLE,
  // The placeholder the Figma screens use for this program.
  imageSrc: "/platform/covers/business-analytics-with-python.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { courses: "5 courses", duration: "6 months", org: "SkillUp" },
  progress: {
    percent: 100,
    label: "Program progress",
    status: "Completed · certificate issued 30 Sep 2026",
    cta: "View certificate",
    href: programCertificatePageHref(SLUG),
    footer: "5 of 5 courses complete",
  },

  coursesIntro: {
    title: "Courses in this program",
    lead: "This Certificate Program comprises 5 courses that take you from reading data with confidence to a complete analysis you can present to a decision maker. Each course builds on the one before.",
  },
  courses: [
    programCourse(1, "Data Literacy and Spreadsheet Analysis", "DL", "business-analytics-with-python", {
      progressPct: 100,
      progressMeta: "9 hours total",
      upNext: { certificate: "Issued 9 Apr 2026" },
      cta: "Review",
      position: "4 modules",
      detail: "All complete · 37 topics",
      modules: [
        { number: 1, title: "Module 1 · Thinking with Data", complete: true, topics: "9 topics", duration: "1h 48m" },
        { number: 2, title: "Module 2 · Spreadsheet Essentials", complete: true, topics: "10 topics", duration: "2h 35m" },
        { number: 3, title: "Module 3 · Cleaning and Preparing Data", complete: true, topics: "10 topics", duration: "2h 22m" },
        { number: 4, title: "Module 4 · Summaries, Pivot Tables and Review", complete: true, topics: "8 topics", duration: "2h 15m" },
      ],
    }),
    programCourse(2, "SQL for Data Analysis", "SQ", "intro-to-product-analytics", {
      progressPct: 100,
      progressMeta: "10 hours total",
      upNext: { certificate: "Issued 21 May 2026" },
      cta: "Review",
      position: "4 modules",
      detail: "All complete · 39 topics",
      modules: [
        { number: 1, title: "Module 1 · Databases and Your First Query", complete: true, topics: "9 topics", duration: "1h 52m" },
        { number: 2, title: "Module 2 · Filtering, Sorting and Aggregating", complete: true, topics: "11 topics", duration: "3h 05m" },
        { number: 3, title: "Module 3 · Joining Tables", complete: true, topics: "10 topics", duration: "2h 40m" },
        { number: 4, title: "Module 4 · Subqueries, CTEs and Final Assessment", complete: true, topics: "9 topics", duration: "2h 23m" },
      ],
    }),
    programCourse(3, "Statistics for Business Decisions", "SB", "project-management-with-ai-tools", {
      progressPct: 100,
      progressMeta: "9 hours total",
      upNext: { certificate: "Issued 2 Jul 2026" },
      cta: "Review",
      position: "4 modules",
      detail: "All complete · 37 topics",
      modules: [
        { number: 1, title: "Module 1 · Describing Data", complete: true, topics: "10 topics", duration: "2h 10m" },
        { number: 2, title: "Module 2 · Probability and Sampling", complete: true, topics: "10 topics", duration: "2h 44m" },
        { number: 3, title: "Module 3 · Testing Ideas with Data", complete: true, topics: "9 topics", duration: "2h 18m" },
        { number: 4, title: "Module 4 · Correlation, Regression and Review", complete: true, topics: "8 topics", duration: "1h 58m" },
      ],
    }),
    programCourse(4, "Data Visualisation and Dashboards", "DV", "leadership-in-remote-teams", {
      progressPct: 100,
      progressMeta: "9 hours total",
      upNext: { certificate: "Issued 13 Aug 2026" },
      cta: "Review",
      position: "4 modules",
      detail: "All complete · 37 topics",
      modules: [
        { number: 1, title: "Module 1 · Principles of Visual Design", complete: true, topics: "9 topics", duration: "1h 46m" },
        { number: 2, title: "Module 2 · Choosing the Right Chart", complete: true, topics: "10 topics", duration: "2h 31m" },
        { number: 3, title: "Module 3 · Building a Dashboard", complete: true, topics: "10 topics", duration: "2h 49m" },
        { number: 4, title: "Module 4 · Telling a Story with Data", complete: true, topics: "8 topics", duration: "2h 04m" },
      ],
    }),
    programCourse(5, "Capstone: An End-to-End Analysis", "CP", "program-course-7-capstone", {
      progressPct: 100,
      progressMeta: "12 hours total",
      upNext: { certificate: "Issued 30 Sep 2026" },
      cta: "Review",
      position: "4 modules",
      detail: "All complete · 24 topics",
      modules: [
        { number: 1, title: "Module 1 · The Brief and the Questions", complete: true, topics: "6 topics", duration: "2h 35m" },
        { number: 2, title: "Module 2 · Preparing and Exploring the Data", complete: true, topics: "7 topics", duration: "3h 20m" },
        { number: 3, title: "Module 3 · Analysis and Dashboard", complete: true, topics: "6 topics", duration: "2h 55m" },
        { number: 4, title: "Module 4 · Final Presentation and Peer Review", complete: true, topics: "5 topics", duration: "2h 50m" },
      ],
    }),
  ],

  certificatesIntro: {
    title: "Certificates",
    lead: "Each course issues its own certificate when you pass it.",
  },
  certificates: [
    courseCertificate(
      1,
      "Data Literacy and Spreadsheet Analysis",
      "4 modules  ·  about 9 hours",
      "9 April 2026",
      "SKL-DAF01-2604-3H8Q",
      "3h8q51d0",
    ),
    courseCertificate(2, "SQL for Data Analysis", "4 modules  ·  about 10 hours", "21 May 2026", "SKL-DAF02-2605-9KX2", "9kx2a7e4"),
    courseCertificate(
      3,
      "Statistics for Business Decisions",
      "4 modules  ·  about 9 hours",
      "2 July 2026",
      "SKL-DAF03-2607-5MT7",
      "5mt7c3b9",
    ),
    courseCertificate(
      4,
      "Data Visualisation and Dashboards",
      "4 modules  ·  about 9 hours",
      "13 August 2026",
      "SKL-DAF04-2608-2PW6",
      "2pw6e8f1",
    ),
    courseCertificate(
      5,
      "Capstone: An End-to-End Analysis",
      "4 modules  ·  about 12 hours",
      "30 September 2026",
      "SKL-DAF05-2609-7RZ4",
      "7rz4b2c6",
    ),
  ],
  certificatesNote:
    "You have passed all five courses. Each certificate stays available here, and on its own page, for as long as you have access to the program.",

  // Issued: the page shows it above the course certificates and its own page shows the sheet.
  programCertificate: {
    status: "issued",
    courseId: `program-${SLUG}`,
    courseLabel: "Program certificate",
    title: TITLE,
    issuedLine: "Issued 30 September 2026.",
    viewHref: programCertificatePageHref(SLUG),
    document: {
      learner: user.name,
      kind: "program",
      courseTitle: TITLE,
      summary: "5 courses  ·  about 49 hours",
      issuedOn: "30 September 2026",
      certificateId: "SKL-DAF-2609-4QN8",
      verifyUrl: "skillup.online/certificates/4qn8d6a3",
      partnerLogoSrc: "/platform/certificate-partner-ibm.svg",
      partnerName: "IBM",
      // The program's second partner, as on its card (16 Oct 2026).
      morePartners: [{ logoSrc: "/platform/partners/microsoft-light.svg", name: "Microsoft" }],
      signatories: SIGNATORIES,
    },
  },

  faqsIntro: { title: "FAQs" },
  faqs: [
    {
      id: "faq-1",
      title: "What will I learn in the Data Analytics Foundations Certificate?",
      body: [
        "You learn to turn raw data into answers that a team can act on. The five courses cover data literacy and spreadsheets, SQL, statistics for decisions, visualisation and dashboards, and a capstone in which you carry out one analysis from the first question to the final presentation.",
        "The program is practical throughout: every module ends with work on a real-looking data set, not only with definitions.",
      ],
      defaultOpen: true,
    },
    {
      id: "faq-2",
      title: "Who is this program for?",
      body: [
        "People who want a first role in analytics, and people in operations, finance, marketing or support who already work with reports and want to produce them themselves. It also suits team leads who need to question the numbers they are shown.",
      ],
    },
    {
      id: "faq-3",
      title: "Do I need a background in maths or programming?",
      body: [
        "No. You need school-level arithmetic and to be comfortable with a computer and a browser. Statistics is taught from the start in Course 3, and SQL from the first query in Course 2. No other programming language is used.",
      ],
    },
    {
      id: "faq-4",
      title: "How is the program paced?",
      body: [
        "It is Flexible Learning: there are no live sessions, and you study when it suits you. Each course has a suggested schedule of five to six weeks with due dates for its graded work. Plan for three to four hours a week.",
        "Access to all five courses stays open until 30 Jun 2027, so you can return to any lesson after you finish.",
      ],
    },
    {
      id: "faq-5",
      title: "What software do I need?",
      body: [
        "A computer with a current browser and a spreadsheet program. SQL is practised in a database that runs in the browser, and the dashboards in Course 4 are built in a free tool that the course walks you through. You do not need a paid licence for anything.",
      ],
    },
    {
      id: "faq-6",
      title: "What data do I work with?",
      body: [
        "Prepared sample data sets: the sales records of a small chain of bike shops, the bookings of a community leisure centre and the support tickets of an online retailer. They are realistic in size and in their mistakes, so you also practise cleaning them. No personal data is used.",
      ],
    },
    {
      id: "faq-7",
      title: "How is my work assessed?",
      body: [
        "Courses 1 to 4 each have graded quizzes, one written assignment and one peer assessment. The capstone has three milestones, a final project and two rounds of peer review.",
        "You need a weighted grade of 70% to pass a course. Practice quizzes and activities do not count towards the grade.",
      ],
    },
    {
      id: "faq-8",
      title: "How does the capstone work?",
      body: [
        "You act as the analyst for Northfield Leisure, a fictional leisure centre that wants to know why weekday bookings have fallen. You frame the questions, prepare and explore the data, build a dashboard and present your findings and recommendations in a short report and a five-minute recorded talk.",
      ],
    },
    {
      id: "faq-9",
      title: "What certificates do I receive?",
      body: [
        "Each of the five courses issues its own certificate when you pass it. Passing all five issues the Data Analytics Foundations Certificate itself. All six appear on the Certificates tab of this page, and each has a page of its own with an address an employer can use to verify it.",
      ],
    },
    {
      id: "faq-10",
      title: "Can I go back to the courses after I finish?",
      body: [
        "Yes. Until 30 Jun 2027 you can open every course, watch the videos again and reread the material. Graded work stays as you submitted it, and your certificates do not expire.",
      ],
    },
  ],

  aboutIntro: {
    title: "About this program",
    lead: "Build the everyday skills of a data analyst: reading data critically, querying it with SQL, using statistics to support a decision and presenting the result in a clear dashboard. Finish with a complete analysis you can show to an employer.",
  },
  about: [
    {
      id: "about-1",
      title: "Program Overview",
      body: [
        "The Data Analytics Foundations Certificate prepares you to answer business questions with data, from the first conversation about what someone needs to know to the chart that answers it.",
        "Across five courses you learn to read and clean data in a spreadsheet, query a database, judge whether a difference is real or noise, and design charts and dashboards that people understand at a glance. Each course ends in written work on a sample organisation, so that you practise the decisions as well as the techniques.",
        "The capstone brings the four subjects together in one analysis, presented as you would present it at work.",
      ],
      defaultOpen: true,
    },
    {
      id: "about-2",
      title: "What You Will Learn",
      body: [
        "Course 1, Data Literacy and Spreadsheet Analysis: types of data and where they come from; formulas, lookups and tables; cleaning and preparing data; summaries and pivot tables.",
        "Course 2, SQL for Data Analysis: how relational databases are organised; selecting, filtering and aggregating; joining tables; subqueries and common table expressions.",
        "Course 3, Statistics for Business Decisions: averages, spread and distributions; probability and sampling; confidence intervals and simple tests; correlation and linear regression.",
        "Course 4, Data Visualisation and Dashboards: principles of visual design; choosing a chart for a question; building an interactive dashboard; telling a story with data.",
        "Course 5, Capstone: one complete analysis, built in three milestones and reviewed by peers.",
      ],
    },
    {
      id: "about-3",
      title: "How It Works",
      body: [
        "Each course is made of four modules of short videos, readings, practice quizzes and activities, and each module closes with graded work. Module 4 of a course unlocks when Module 3 is complete.",
        "You study at your own pace within a suggested schedule. A mentor answers questions in the Mentorship Q&A of every course, usually within a day.",
      ],
    },
    {
      id: "about-4",
      title: "Skills You Will Gain",
      body: [
        "Cleaning and structuring data in a spreadsheet. Writing SQL queries that filter, aggregate and join. Describing a data set and testing a simple hypothesis. Choosing the right chart and building a dashboard.",
        "Framing an analysis around a business question. Explaining findings, and their limits, to people who are not analysts.",
      ],
    },
    {
      id: "about-5",
      title: "Who Should Enroll",
      body: [
        "Career starters and career changers aiming at roles such as junior data analyst, reporting analyst or business analyst. Staff in operations, finance or marketing who prepare reports. Managers who want to ask better questions of the data they receive.",
      ],
    },
    {
      id: "about-6",
      title: "Prerequisites",
      body: [
        "None beyond everyday computer skills and school-level arithmetic. If spreadsheets are new to you, allow extra time for Module 2 of Course 1.",
      ],
    },
    {
      id: "about-7",
      title: "Mentoring and Feedback",
      body: [
        "Every course has a mentor in its Mentorship Q&A. Written assignments are graded against a published rubric, and peer assessments give you feedback from another learner as well as practice in reviewing an analysis.",
      ],
    },
    {
      id: "about-8",
      title: "What You Will Create",
      body: [
        "A cleaned and documented spreadsheet with a pivot-table summary, a set of SQL queries that answer a manager's questions, a short statistical report on an A/B test and an interactive sales dashboard.",
        "In the capstone, a complete analysis for Northfield Leisure: the questions, the prepared data, a dashboard, a report of four to six pages and a five-minute recorded presentation.",
      ],
    },
  ],

  dates: [
    {
      id: "started",
      iso: "2026-03-02",
      day: "02",
      month: "MAR",
      title: "Program started",
      detail: "2 Mar 2026",
      relative: "Started",
    },
    {
      id: "completed",
      iso: "2026-09-30",
      day: "30",
      month: "SEP",
      title: "Program completed",
      detail: "30 Sep 2026 · program certificate issued",
      relative: "Completed",
    },
    {
      id: "ends",
      iso: "2027-06-30",
      day: "30",
      month: "JUN",
      title: "Access ends",
      detail: "30 Jun 2027 · access to all courses closes",
      relative: "In 8 months",
    },
  ],
  included: [
    "68 videos",
    "48 readings",
    "12 activities",
    "16 practice quizzes",
    "16 graded quizzes",
    "4 graded assignments",
    "4 peer assessments",
    "3 capstone milestones",
    "2 peer reviews",
    "1 capstone project",
  ],
  instructors: [
    {
      name: "Dr. Helen Marsh",
      role: "Data Analytics Lead & Visiting Lecturer in Applied Statistics",
    },
  ],
};

export default program;
