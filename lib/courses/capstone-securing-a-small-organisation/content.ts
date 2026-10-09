import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Capstone: Securing a Small Organisation": the brief (a reading), the
 * practice quiz on it, the first milestone and the final project with its rubric. The
 * transcripts of the two videos that have one ("Capstone Kickoff" and "Scoping an
 * assessment and agreeing its limits") are in the outline. Tidewater Veterinary Group is a
 * practice made up for the course.
 */
export const content: CourseContent = {
  byline: {
    author: "Dr. Amara Okafor",
    role: "Lead instructor · Cybersecurity Fundamentals",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "In a security plan, what should each recommendation be traced back to?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A control is worth its cost only for the risk it reduces. Naming that risk lets the owner weigh the recommendation and lets a reviewer check that nothing important is left uncovered.",
      options: [
        { id: "a", label: "A product the adviser knows well", feedback: "Familiarity is not a reason the client can weigh." },
        { id: "b", label: "A risk in the register that it reduces", correct: true, feedback: "Correct. No risk, no reason for the control." },
        { id: "c", label: "The longest list of controls available", feedback: "A small team cannot run a long list. Relevance comes first." },
        { id: "d", label: "What a larger organisation does", feedback: "Another organisation's controls answer its risks and its resources." },
      ],
    },
    {
      question: "Which control answers most directly the incident that led Tidewater to ask for a plan?",
      platformPrompt: "Choose the correct option",
      explanation:
        "The incident was an email account taken over after its password was typed into a fake page. Sign-in that cannot be phished removes that path; the other controls are useful, but for other risks.",
      options: [
        { id: "a", label: "A new firewall at each clinic", feedback: "The account was taken over through a web page, not through the clinic network." },
        {
          id: "b",
          label: "Phishing-resistant multi-factor authentication on email accounts",
          correct: true,
          feedback: "Correct. A stolen password alone would no longer open the account.",
        },
        { id: "c", label: "Encrypting the imaging workstation", feedback: "Worth considering, but for the risk of a lost or stolen device." },
        { id: "d", label: "A longer password policy", feedback: "A longer password is given away on a fake page just as easily." },
      ],
    },
    {
      question: "Why is the waiting-room Wi-Fi placed in a zone of its own?",
      explanation:
        "Client devices are unmanaged and unknown. In their own zone they reach the internet and nothing else, so a problem on one of them cannot touch reception computers, tablets or payment terminals.",
      options: [
        { id: "a", label: "To give clients a faster connection", feedback: "Speed is not the reason for the boundary." },
        { id: "b", label: "So that visitors' devices cannot reach clinic systems", correct: true, feedback: "Correct. Guests get internet access and nothing more." },
        { id: "c", label: "Because the insurer asked for it", feedback: "The insurer's three requirements are about sign-in, backups and incident response." },
        { id: "d", label: "To record which sites clients visit", feedback: "Monitoring clients is neither the aim nor appropriate." },
      ],
    },
  ],
  articles: {
    "sec5-m1-t2": {
      lede: "Tidewater Veterinary Group is a fictional practice created for this course. Its owner has asked for a security plan that she can understand, afford and hand to the people who will carry it out. This page is your brief.",
      sections: [
        {
          heading: "The organisation",
          paragraphs: [
            "Tidewater runs two clinics twelve kilometres apart, with twenty-eight staff: vets, nurses, receptionists, an office manager and the owner. Client and patient records are held in a cloud practice management service. Email and shared files are in a cloud office suite.",
            "Each clinic has one network that carries everything: reception computers, consulting room tablets, the imaging workstation, card terminals, printers and the Wi-Fi offered to clients in the waiting room. An outside IT contractor visits once a month and has an administrator account on every system.",
          ],
        },
        {
          heading: "What prompted the request",
          paragraphs: [
            "Last quarter a receptionist typed her email password into a fake sign-in page. The account was used to send invoices with changed bank details to four clients before anyone noticed. No money was lost, but the owner learned that nobody could say what else the account had reached.",
            "The practice's insurer now asks for three things by the next renewal, in five months: multi-factor authentication, tested backups and an incident response plan.",
          ],
        },
        {
          heading: "What you will deliver",
          paragraphs: [
            "Three milestones and a final plan. Milestone 1 is an asset inventory and a risk register. Milestone 2 is a network and access design. Milestone 3 is a monitoring and incident response plan. The final project joins them with a twelve-month roadmap and a one-page summary for the owner.",
            "Work within the limits of the practice: no security staff, a contractor for one day a month, and the modest budget set out in the case file. A plan the practice cannot run scores lower than a smaller plan that it can.",
          ],
        },
      ],
      pullQuote: {
        text: "A plan the practice cannot run is not a plan.",
        attribution: "Capstone brief",
      },
      takeaways: [
        "The client is fictional: work only from the case file, and state your assumptions.",
        "The trigger was a phished email account, followed by three requirements from the insurer.",
        "Three milestones build the final plan: assess, design, then detect and respond.",
        "Fit every recommendation to a team with no security staff.",
      ],
    },
  },
  quizzes: {
    "sec5-m1-t4": [
      {
        question: "Which of these is in scope for the capstone assessment?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Scope covers what the practice owns or configures.",
          "The supplier runs its own infrastructure, but the practice chooses its own settings.",
        ],
        explanation:
          "The practice is responsible for how it has configured the services it uses: accounts, roles, sharing and sign-in. The supplier's infrastructure and other people's devices and networks are outside the agreed scope.",
        reviewTopicId: "sec5-m1-t3",
        reviewTopicTitle: "Scoping an assessment and agreeing its limits",
        options: [
          { id: "a", label: "The software supplier's own data centres", feedback: "Out of scope: the practice neither owns nor controls them." },
          {
            id: "b",
            label: "The practice's settings in its cloud practice management service",
            correct: true,
            feedback: "Correct. Accounts, roles and sign-in settings are the practice's to manage.",
          },
          { id: "c", label: "Staff personal phones that hold no practice data", feedback: "Out of scope, as long as they never touch practice data." },
          { id: "d", label: "The home networks of the practice's clients", feedback: "Out of scope: they belong to other people." },
        ],
      },
      {
        question: "The case file does not say whether the imaging workstation is backed up. What should you do?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A gap in the information is a finding in itself. State what you assumed and why, and list it as a question for the client, so that the reader can correct it.",
        reviewTopicId: "sec5-m1-t3",
        reviewTopicTitle: "Scoping an assessment and agreeing its limits",
        options: [
          { id: "a", label: "Assume that it is backed up and move on", feedback: "A silent assumption can hide one of the largest risks in the plan." },
          { id: "b", label: "Leave the workstation out of the inventory", feedback: "It holds patient images. It belongs in the inventory whatever its backup state." },
          {
            id: "c",
            label: "State the assumption you made and why, and flag it as a question for the client",
            correct: true,
            feedback: "Correct. The reader can then confirm it or correct it.",
          },
          { id: "d", label: "Test the workstation yourself to find out", feedback: "The capstone works from documents only. You do not test any system." },
        ],
      },
      {
        question: "Which set of requirements comes from the practice's insurer?",
        explanation:
          "The brief lists three: multi-factor authentication, tested backups and an incident response plan, all due by the renewal in five months. Your roadmap has to show each of them in place before that date.",
        reviewTopicId: "sec5-m1-t2",
        reviewTopicTitle: "Capstone brief: Tidewater Veterinary Group",
        options: [
          {
            id: "a",
            label: "Multi-factor authentication, tested backups and an incident response plan",
            correct: true,
            feedback: "Correct. All three are due by the renewal.",
          },
          { id: "b", label: "A security team of three people", feedback: "The practice has no security staff and no plan to hire any." },
          { id: "c", label: "A new practice management system", feedback: "Nothing in the brief asks for the system to be replaced." },
          { id: "d", label: "Certification against an international standard", feedback: "The insurer asks for three specific controls, not for a certification." },
        ],
      },
    ],
  },
  assignments: {
    "sec5-m1-t7": {
      brief:
        "Using the case file, list the information, systems and services that Tidewater Veterinary Group depends on, then build the risk register for them. This is the foundation of the plan: Milestones 2 and 3 must trace back to the risks you record here. Submit both tables in the milestone template, as an XLSX or a PDF.",
      requirements: [
        "An inventory of at least 15 assets, with an owner and a sensitivity for each",
        "At least 10 risks, each written as asset, threat and weakness, and rated",
        "The five highest risks marked, with a proposed treatment",
        "A list of the assumptions you made. Counts toward your final grade",
      ],
    },
  },
  ora: {
    "sec5-m4-t3": {
      brief:
        "Bring your three milestones together into one security plan for Tidewater Veterinary Group. Revise them with the feedback you received, add a twelve-month roadmap, and open with a one-page summary written for the practice owner.",
      deliverable:
        "Submit one PDF of 8 to 12 pages: the owner's summary, the risk register, the network and access design, the monitoring and incident response plan, and the roadmap with an owner and a cost band for each action.",
      dueLabel: "Due 7 Feb 2027",
      requiredReviews: 2,
      acceptedTypes: [".pdf", ".docx"],
      overallCommentPrompt: "Which recommendation in your peer's plan would reduce the most risk for the least effort?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Trace the controls to the risks",
          maxPoints: 10,
          options: [
            { points: 10, label: "Every recommendation names the risk it reduces" },
            { points: 6, label: "Most recommendations are traced; some stand alone" },
            { points: 3, label: "Controls are listed without reference to the register" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Design the network and the access model",
          maxPoints: 10,
          options: [
            { points: 10, label: "Zones, flows and roles are complete and agree with each other" },
            { points: 6, label: "A sound design with gaps, such as remote access or the contractor's account" },
            { points: 3, label: "A diagram or a matrix, without the rules behind it" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Plan detection and response",
          maxPoints: 10,
          options: [
            { points: 10, label: "Log sources, alerts and playbooks cover the top risks, with named roles" },
            { points: 6, label: "A response plan is present; the monitoring is generic" },
            { points: 3, label: "Tools are listed without saying who does what" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Fit the plan to the organisation",
          maxPoints: 6,
          options: [
            { points: 6, label: "The roadmap fits the staff, time and budget in the case file" },
            { points: 3, label: "Sound advice that the practice could not resource" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c5",
          label: "Task 5 · Write for the owner",
          maxPoints: 4,
          options: [
            { points: 4, label: "One page, in plain language, stating the decisions needed" },
            { points: 2, label: "Accurate, but written for specialists" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
};
