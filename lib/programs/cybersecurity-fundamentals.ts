import { coursePlayerHref, programCourse, slugify } from "./kit";
import type { Program } from "./kit";

/**
 * "Cybersecurity Fundamentals Certificate": the second program of My Learning, enrolled and
 * not started. Sample data written for the prototype (it has no Figma frame of its own): the
 * page is the Program page of the first program with this content. Every FAQ and About
 * section has its body, so nothing here prints CONTENT_PENDING.
 *
 * Today is 24 Sep 2026 and the program starts on 5 Oct 2026, the date the card in
 * lib/platform/my-learning shows. No course is started: no certificate card is listed (the
 * Certificates tab shows its note alone) and the header's action starts course 1. Each course
 * row agrees with the outline of its folder under lib/courses: module titles, topic counts
 * and durations.
 */

/** Course 1, where the program starts: the header's Start opens its player on the first topic. */
const COURSE_PLAYER_HREF = coursePlayerHref(slugify("Security Foundations and the Threat Landscape"));

const program: Program = {
  slug: "cybersecurity-fundamentals",
  title: "Cybersecurity Fundamentals Certificate",
  // No picture was made for this program: it borrows one of the placeholder covers.
  imageSrc: "/platform/covers/program-ai-digital-marketing.jpg",
  deliveryMode: "Flexible Learning",
  difficulty: "Beginner",
  stats: { courses: "5 courses", duration: "4 months", org: "SkillUp" },
  progress: {
    percent: 0,
    label: "Program progress",
    status: "Not started · starts 5 Oct 2026",
    cta: "Start course",
    href: COURSE_PLAYER_HREF,
    footer: "0 of 5 courses complete",
  },

  coursesIntro: {
    title: "Courses in this program",
    lead: "This Certificate Program comprises 5 courses that take you from the principles of security to a complete security plan for a small organisation. Take them in order: each one builds on the one before.",
  },
  courses: [
    programCourse(1, "Security Foundations and the Threat Landscape", "SF", "business-analytics-with-python", {
      progressMeta: "9 hours total",
      upNext: { title: "Course Introduction", type: "Video" },
      position: "4 modules",
      detail: "39 topics",
      modules: [
        { number: 1, title: "Module 1 · Security Principles and Risk", complete: false, topics: "9 topics", duration: "1h 42m" },
        { number: 2, title: "Module 2 · The Threat Landscape", complete: false, topics: "10 topics", duration: "2h 56m" },
        { number: 3, title: "Module 3 · The Human Factor", complete: false, topics: "10 topics", duration: "1h 57m" },
        { number: 4, title: "Module 4 · Frameworks, Law and Ethics", complete: false, topics: "10 topics", duration: "2h 22m" },
      ],
      defaultOpen: true,
    }),
    programCourse(2, "Network Security and Defence", "NS", "program-ai-digital-marketing", {
      progressMeta: "9 hours total",
      upNext: { title: "Course Introduction", type: "Video" },
      position: "4 modules",
      detail: "39 topics",
      modules: [
        { number: 1, title: "Module 1 · How Networks Work", complete: false, topics: "9 topics", duration: "1h 45m" },
        {
          number: 2,
          title: "Module 2 · Network Threats and Segmentation",
          complete: false,
          topics: "10 topics",
          duration: "2h 54m",
        },
        {
          number: 3,
          title: "Module 3 · Firewalls, Detection and Monitoring",
          complete: false,
          topics: "10 topics",
          duration: "2h 06m",
        },
        {
          number: 4,
          title: "Module 4 · Secure Communication and Wireless",
          complete: false,
          topics: "10 topics",
          duration: "2h 29m",
        },
      ],
    }),
    programCourse(3, "Identity, Access and Cloud Security", "IA", "project-management-with-ai-tools", {
      progressMeta: "9 hours total",
      upNext: { title: "Course Introduction", type: "Video" },
      position: "4 modules",
      detail: "39 topics",
      modules: [
        { number: 1, title: "Module 1 · Identity and Authentication", complete: false, topics: "9 topics", duration: "1h 43m" },
        { number: 2, title: "Module 2 · Access Control", complete: false, topics: "10 topics", duration: "2h 54m" },
        { number: 3, title: "Module 3 · Cloud Security Fundamentals", complete: false, topics: "10 topics", duration: "2h 00m" },
        { number: 4, title: "Module 4 · Protecting Data", complete: false, topics: "10 topics", duration: "2h 25m" },
      ],
    }),
    programCourse(4, "Security Operations and Incident Response", "SO", "intro-to-product-analytics", {
      progressMeta: "10 hours total",
      upNext: { title: "Course Introduction", type: "Video" },
      position: "4 modules",
      detail: "39 topics",
      modules: [
        { number: 1, title: "Module 1 · Inside Security Operations", complete: false, topics: "9 topics", duration: "1h 41m" },
        { number: 2, title: "Module 2 · Detection and Triage", complete: false, topics: "10 topics", duration: "3h 11m" },
        {
          number: 3,
          title: "Module 3 · The Incident Response Lifecycle",
          complete: false,
          topics: "10 topics",
          duration: "2h 01m",
        },
        {
          number: 4,
          title: "Module 4 · Evidence, Communication and Learning",
          complete: false,
          topics: "10 topics",
          duration: "2h 39m",
        },
      ],
    }),
    programCourse(5, "Capstone: Securing a Small Organisation", "CP", "program-course-7-capstone", {
      progressMeta: "12 hours total",
      upNext: { title: "Capstone Kickoff", type: "Video" },
      position: "4 modules",
      detail: "25 topics",
      modules: [
        { number: 1, title: "Module 1 · The Brief and the Assessment", complete: false, topics: "7 topics", duration: "2h 51m" },
        { number: 2, title: "Module 2 · Designing the Controls", complete: false, topics: "7 topics", duration: "3h 32m" },
        { number: 3, title: "Module 3 · Detect, Respond, Recover", complete: false, topics: "6 topics", duration: "2h 47m" },
        { number: 4, title: "Module 4 · Final Submission and Review", complete: false, topics: "5 topics", duration: "3h 08m" },
      ],
    }),
  ],

  certificatesIntro: {
    title: "Certificates",
    lead: "Each course issues its own certificate when you pass it.",
  },
  // One card per course the learner has started: none yet.
  certificates: [],
  certificatesNote:
    "You have not started a course yet. The certificate of each of the five courses appears here once you begin it.",

  faqsIntro: { title: "FAQs" },
  faqs: [
    {
      id: "faq-1",
      title: "What will I learn in the Cybersecurity Fundamentals Certificate?",
      body: [
        "You learn how organisations protect their information and systems, and how they notice and handle an incident. The five courses cover security principles and risk, network defence, identity and cloud security, security operations and incident response, and a capstone in which you write a security plan for a small organisation.",
        "The program is defensive throughout. Attacks are studied so that you can prevent, detect and respond to them.",
      ],
      defaultOpen: true,
    },
    {
      id: "faq-2",
      title: "Who is this program for?",
      body: [
        "People who want a first role in security, IT staff who have been handed security duties, and managers of small organisations who need to make informed decisions about risk. It also suits career changers from office, support or operations roles.",
      ],
    },
    {
      id: "faq-3",
      title: "Do I need a technical background?",
      body: [
        "No. You need to be comfortable using a computer, a browser and a spreadsheet. Networking and cloud concepts are taught from the start in Courses 2 and 3.",
      ],
    },
    {
      id: "faq-4",
      title: "When does the program start, and how is it paced?",
      body: [
        "The program starts on 5 Oct 2026. It is Flexible Learning: there are no live sessions, and you study when it suits you.",
        "Each course has a suggested schedule of three to five weeks with due dates for its graded work, and the courses follow one another until mid February 2027. Plan for three to four hours a week. Access to all five courses stays open until 30 Sep 2027.",
      ],
    },
    {
      id: "faq-5",
      title: "Will I practise attacking systems?",
      body: [
        "No. This is a defensive program. You analyse how attacks work at the level a defender needs, using diagrams, sample logs and case files, and you never test or scan a real system.",
      ],
    },
    {
      id: "faq-6",
      title: "What software or equipment do I need?",
      body: [
        "A computer with a current browser, and a program that opens spreadsheets and documents. Every exercise uses prepared material: packet capture summaries, firewall rule tables, exported cloud settings and a sample alert queue. You do not need lab hardware, a cloud subscription or a licence for a security tool.",
      ],
    },
    {
      id: "faq-7",
      title: "How is my work assessed?",
      body: [
        "Courses 1 to 4 each have graded quizzes, one written assignment and one peer assessment. The capstone has three milestones, a checkpoint quiz, a final project and two rounds of peer review.",
        "You need a weighted grade of 70% to pass a course. Practice quizzes and activities do not count towards the grade.",
      ],
    },
    {
      id: "faq-8",
      title: "How does the capstone work?",
      body: [
        "You act as the security adviser to Tidewater Veterinary Group, a fictional practice with two clinics and no security staff. Working from its case file, you deliver an asset inventory and risk register, a network and access design, and a monitoring and incident response plan, then combine them into one security plan with a twelve-month roadmap.",
      ],
    },
    {
      id: "faq-9",
      title: "What certificates do I receive?",
      body: [
        "Each of the five courses issues its own certificate when you pass it. Passing all five completes the Cybersecurity Fundamentals Certificate. Certificates appear on the Certificates tab of this page.",
      ],
    },
    {
      id: "faq-10",
      title: "Does the program prepare me for an industry certification exam?",
      body: [
        "It covers much of the ground that entry-level security certifications test, so it is a sound base for one. It is not an exam preparation course and it is not affiliated with any certification body.",
      ],
    },
  ],

  aboutIntro: {
    title: "About this program",
    lead: "Build a working foundation in defensive security: how risk is assessed, how networks, identities and cloud services are protected, and how incidents are detected and handled. Finish with a security plan for a small organisation that you can show to an employer.",
  },
  about: [
    {
      id: "about-1",
      title: "Program Overview",
      body: [
        "The Cybersecurity Fundamentals Certificate prepares you to take part in the security work of an organisation, from the first risk conversation to the review after an incident.",
        "Across five courses you build the vocabulary of the field, learn how a network is defended, see how identity has become the main boundary in cloud services, and follow an alert from detection to recovery. Each course ends in written work on a fictional organisation, so that you practise the decisions and not only the definitions.",
        "The capstone brings the four subjects together. You assess one small organisation and write the security plan its owner will act on.",
      ],
      defaultOpen: true,
    },
    {
      id: "about-2",
      title: "What You Will Learn",
      body: [
        "Course 1, Security Foundations and the Threat Landscape: confidentiality, integrity and availability; assets, threats and risk; how intrusions unfold; social engineering; frameworks, law and ethics.",
        "Course 2, Network Security and Defence: how networks carry data; segmentation and trust zones; firewalls, intrusion detection and network logs; TLS, VPNs, email authentication and Wi-Fi.",
        "Course 3, Identity, Access and Cloud Security: authentication and phishing-resistant sign-in; least privilege and access reviews; the shared responsibility model; encryption, keys and backups.",
        "Course 4, Security Operations and Incident Response: log sources and the SIEM; detection and triage; containment, eradication and recovery; evidence, communication and the post-incident review.",
        "Course 5, Capstone: a complete security plan for a small organisation, built in three milestones and reviewed by peers.",
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
        "Writing and maintaining a risk register. Designing network zones and a firewall rule base. Choosing sign-in methods and building a role-based access model. Reading the shared responsibility model for a cloud service and reviewing its settings.",
        "Reading logs, triaging alerts and writing a clear alert note. Following and writing incident response playbooks. Explaining security decisions to people who are not specialists.",
      ],
    },
    {
      id: "about-5",
      title: "Who Should Enroll",
      body: [
        "Career starters and career changers aiming at roles such as security analyst, IT support with security duties or compliance assistant. IT generalists in small organisations. Team leads and owners who are accountable for security and want to understand what they are asked to approve.",
      ],
    },
    {
      id: "about-6",
      title: "Prerequisites",
      body: [
        "None beyond everyday computer skills. No programming is required. If networking is new to you, allow extra time for Module 1 of Course 2.",
      ],
    },
    {
      id: "about-7",
      title: "Mentoring and Feedback",
      body: [
        "Every course has a mentor in its Mentorship Q&A. Written assignments are graded against a published rubric, and peer assessments give you feedback from another learner as well as practice in reviewing security work.",
      ],
    },
    {
      id: "about-8",
      title: "What You Will Create",
      body: [
        "A risk register for a small business, a segmentation plan for a two-site office, an access model for a thirty-person company and a triage report on three alerts.",
        "In the capstone, a security plan of eight to twelve pages for Tidewater Veterinary Group: risk register, network and access design, monitoring and incident response plan, a twelve-month roadmap and a one-page summary for the owner.",
      ],
    },
  ],

  dates: [
    {
      id: "starts",
      iso: "2026-10-05",
      day: "05",
      month: "OCT",
      title: "Program starts",
      detail: "5 Oct 2026 · Course 1 begins",
      relative: "In 11 days",
    },
    {
      id: "ends",
      iso: "2027-09-30",
      day: "30",
      month: "SEP",
      title: "Program ends",
      detail: "30 Sep 2027 · access to all courses closes",
      relative: "In 12 months",
    },
  ],
  included: [
    "60 videos",
    "55 readings",
    "14 activities",
    "2 hands-on labs",
    "1 podcast",
    "1 lesson page",
    "17 practice quizzes",
    "17 graded quizzes",
    "4 graded assignments",
    "4 peer assessments",
    "3 capstone milestones",
    "2 peer reviews",
    "1 capstone project",
  ],
  instructors: [
    {
      name: "Dr. Amara Okafor",
      role: "Security Operations Lead & University Lecturer",
    },
  ],
};

export default program;
