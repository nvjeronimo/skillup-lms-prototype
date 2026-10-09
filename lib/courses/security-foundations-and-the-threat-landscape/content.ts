import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Security Foundations and the Threat Landscape": one reading, the first
 * practice quiz and the written assignment. The transcripts of the two videos that have one
 * ("Course Introduction" and "Assets, threats and vulnerabilities") are in the outline.
 * Fernhill Bakery is a business made up for the course.
 */
export const content: CourseContent = {
  byline: {
    author: "Dr. Amara Okafor",
    role: "Lead instructor · Cybersecurity Fundamentals",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "Which of these controls is detective rather than preventive?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A preventive control stops an event from happening. A detective control tells you that it happened, or is happening, so that someone can respond.",
      options: [
        { id: "a", label: "Encrypting the disk of every laptop", feedback: "Encryption prevents data from being read if the laptop is lost." },
        { id: "b", label: "Requiring multi-factor authentication at sign-in", feedback: "This prevents a stolen password from being enough." },
        {
          id: "c",
          label: "An alert when an account signs in from a country it has never used",
          correct: true,
          feedback: "Correct. The alert does not stop the sign-in; it brings it to someone's attention.",
        },
        { id: "d", label: "A lock on the server room door", feedback: "A lock prevents entry. The log of who opened it would be detective." },
      ],
    },
    {
      question: "What does the principle of least privilege ask for?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Least privilege limits the harm of a mistake or a stolen account: an account can only damage what it can reach.",
      options: [
        { id: "a", label: "Every employee has the same access, so that nobody is blocked", feedback: "Equal access gives most people far more than their work needs." },
        {
          id: "b",
          label: "Each account has only the access its task needs",
          correct: true,
          feedback: "Correct. Access follows the task and is removed when the task ends.",
        },
        { id: "c", label: "Only managers hold administrator accounts", feedback: "Seniority is not a reason for access. Many managers need less access than their teams." },
        { id: "d", label: "Access is granted on request and never reviewed", feedback: "Without review, access only ever grows." },
      ],
    },
    {
      question: "Why does defence in depth use several layers of control?",
      explanation:
        "Every control fails sometimes. Layers are chosen so that a different kind of control stands behind each one.",
      options: [
        { id: "a", label: "So that each team can own one control", feedback: "Ownership matters, but it is not the reason for layering." },
        { id: "b", label: "Because regulations require a minimum number of controls", feedback: "Frameworks ask for suitable controls, not a count." },
        {
          id: "c",
          label: "So that the failure of one control does not expose the asset",
          correct: true,
          feedback: "Correct. A second, different control is there for the day the first one fails.",
        },
        { id: "d", label: "To make systems harder for staff to use", feedback: "Friction is a cost of some controls, never their purpose." },
      ],
    },
  ],
  articles: {
    "sec1-m1-t4": {
      lede: "A risk register is a table of the things that could go wrong, how likely each one is, how bad it would be, and what you have decided to do about it. It turns a worry into a decision that somebody owns.",
      sections: [
        {
          heading: "Write the risk as a sentence",
          paragraphs: [
            "A useful entry names the asset, the threat and the weakness in one sentence: “Customer records in the booking system could be exposed because staff share one administrator password.” A one-word entry such as “hacking” cannot be rated, owned or fixed.",
            "Keep one risk per row. If the sentence needs the word “and” twice, it is probably two risks.",
          ],
        },
        {
          heading: "Rate likelihood and impact",
          paragraphs: [
            "Likelihood is how probable the event is over a set period, usually a year. Impact is the harm if it happens: money, downtime, legal exposure, harm to people. A small organisation does well with a three-point scale for each (low, medium, high) and one line of text saying what each level means for it.",
            "Combine the two ratings to rank the list. The result is not a measurement. It is a way to agree which five risks get attention first. Write the reasoning next to the rating, so that the next reviewer can disagree with it.",
          ],
        },
        {
          heading: "Decide the treatment and the owner",
          paragraphs: [
            "Each risk gets one of four treatments. Reduce it with a control. Avoid it by stopping the activity. Transfer part of it, for example through insurance or a supplier contract. Or accept it, in writing, when treatment would cost more than the harm.",
            "Every row needs a named owner and a review date. A register without owners is only a list, and a register that is never reviewed describes last year's organisation.",
          ],
        },
      ],
      pullQuote: {
        text: "A risk nobody owns is a risk nobody is reducing.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Write each risk as one sentence: the asset, the threat and the weakness.",
        "Rate likelihood and impact on a simple scale, and record why.",
        "Choose a treatment: reduce, avoid, transfer or accept.",
        "Give every risk an owner and a review date.",
      ],
    },
  },
  quizzes: {
    "sec1-m1-t5": [
      {
        question: "During a system migration, patient records at a clinic are altered by mistake. Which security property was lost?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Nobody outside the clinic saw the records, and the system stayed up.",
          "Ask whether the data can still be trusted to be correct.",
        ],
        explanation:
          "Integrity means that data is accurate and has only been changed in authorised ways. No attacker is needed for it to be lost: a faulty migration is enough.",
        reviewTopicId: "sec1-m1-t2",
        reviewTopicTitle: "Confidentiality, integrity and availability",
        options: [
          { id: "a", label: "Confidentiality", feedback: "Confidentiality is lost when data is seen by someone who should not see it." },
          { id: "b", label: "Integrity", correct: true, feedback: "Correct. The records can no longer be trusted to be accurate." },
          { id: "c", label: "Availability", feedback: "The records are still reachable. They are wrong, not missing." },
          { id: "d", label: "None: no attack took place", feedback: "A security property can be lost through error as well as through attack." },
        ],
      },
      {
        question: "Which of these is a vulnerability?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A vulnerability is a weakness. The criminal group is a threat, the database is an asset, and the chance of exposure with its consequences is the risk.",
        reviewTopicId: "sec1-m1-t3",
        reviewTopicTitle: "Assets, threats and vulnerabilities",
        options: [
          { id: "a", label: "A criminal group that targets small businesses", feedback: "That is a threat: something that could cause harm." },
          {
            id: "b",
            label: "A file server that has missed a year of security updates",
            correct: true,
            feedback: "Correct. It is a weakness that a threat could use.",
          },
          { id: "c", label: "The customer database", feedback: "That is an asset: the thing of value." },
          { id: "d", label: "The chance that records are exposed, and the harm that follows", feedback: "That describes the risk, where asset, threat and weakness meet." },
        ],
      },
      {
        question: "A risk is rated low likelihood and high impact. What does the risk register need next?",
        explanation:
          "A rating is not a decision. The register is complete for a risk only when it says what will be done, who is responsible and when it will be looked at again.",
        reviewTopicId: "sec1-m1-t4",
        reviewTopicTitle: "Likelihood, impact and the risk register",
        options: [
          {
            id: "a",
            label: "A treatment decision, an owner and a review date",
            correct: true,
            feedback: "Correct. Even a decision to accept the risk is recorded and owned.",
          },
          { id: "b", label: "Nothing: low likelihood risks are left out", feedback: "Rare events with high impact are exactly the ones a register must keep in view." },
          { id: "c", label: "The name of the likely attacker", feedback: "The register records the decision, not a suspect." },
          { id: "d", label: "A second rating, until it reaches medium", feedback: "The rating is an input to the decision, not something to adjust." },
        ],
      },
    ],
  },
  assignments: {
    "sec1-m2-t9": {
      brief:
        "Build a risk register for Fernhill Bakery, the fictional twelve-person business described in the case file in Handouts. Identify at least eight risks to its information and systems, rate each one, and propose a treatment. Submit the completed template as an XLSX or a PDF.",
      requirements: [
        "At least 8 risks, each written as asset, threat and weakness",
        "Likelihood and impact on the three-point scale, with one line of reasoning",
        "A treatment, an owner and a review date for every risk",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
