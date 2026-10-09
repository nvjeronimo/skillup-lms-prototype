import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Security Operations and Incident Response": one reading, the first
 * practice quiz and the written assignment. The transcripts of the two videos that have one
 * ("Course Introduction" and "Triage: is this alert real, and does it matter?") are in the
 * outline. The account name and the address in the first question are invented; the address
 * is from a range reserved for documentation.
 */
export const content: CourseContent = {
  byline: {
    author: "Dr. Amara Okafor",
    role: "Lead instructor · Cybersecurity Fundamentals",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What is the first goal of containment during an incident?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Containment limits the damage while the team is still learning what happened. Done carefully, it keeps the evidence that eradication and the later review depend on.",
      options: [
        { id: "a", label: "To find out who is responsible", feedback: "Attribution comes much later, if at all." },
        {
          id: "b",
          label: "To stop the incident from spreading while preserving evidence",
          correct: true,
          feedback: "Correct. Isolate first, and avoid wiping what the investigation needs.",
        },
        { id: "c", label: "To restore every system from backup at once", feedback: "Restoring before the cause is removed invites the same incident again." },
        { id: "d", label: "To write the final report", feedback: "The report belongs to the last phase." },
      ],
    },
    {
      question: "An alert fires on activity that turns out to be legitimate. What is this called?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A false positive is an alert without a real problem behind it. Too many of them hide the true positives, which is why detection rules are tuned.",
      options: [
        { id: "a", label: "A true positive", feedback: "A true positive is an alert on real malicious activity." },
        { id: "b", label: "A false positive", correct: true, feedback: "Correct. It is closed with a note saying why, and the rule may need tuning." },
        { id: "c", label: "A false negative", feedback: "A false negative is real activity that produced no alert." },
        { id: "d", label: "An indicator of compromise", feedback: "An indicator is a piece of evidence, not the outcome of an alert." },
      ],
    },
    {
      question: "What is the purpose of a blameless post-incident review?",
      explanation:
        "People describe what they saw and did more openly when the review is not looking for someone to punish. That openness is what shows which process, tool or assumption needs to change.",
      options: [
        { id: "a", label: "To decide who made the mistake", feedback: "Looking for a culprit makes people hold back the detail the review needs." },
        {
          id: "b",
          label: "To find what in the system allowed the incident, and how to change it",
          correct: true,
          feedback: "Correct. The outcome is a short list of changes, each with an owner.",
        },
        { id: "c", label: "To show the regulator that someone was disciplined", feedback: "Notification duties are separate from the internal review." },
        { id: "d", label: "To close the incident ticket faster", feedback: "The review takes place after the incident is closed." },
      ],
    },
  ],
  articles: {
    "sec4-m1-t4": {
      lede: "A log line is a claim that something happened. It is useful to an investigator only if it says when, who, what and where, in a form that can be compared with other logs.",
      sections: [
        {
          heading: "The four things every event needs",
          paragraphs: [
            "When: a timestamp with its time zone, from a clock that is synchronised. Who: the account, and the device or address it acted from. What: the action, and whether it succeeded. Where: the system and the object the action touched.",
            "An event that says “login failed” is noise. An event that says which account failed to sign in, from which address, to which service, at which second, can be joined to the firewall record and the identity record of the same moment.",
          ],
        },
        {
          heading: "Choosing what to collect first",
          paragraphs: [
            "No small team can collect everything. Start with the sources that answer the most questions: sign-in and administration events from the identity provider, alerts and process starts from endpoint protection, DNS and firewall records, and the audit log of the email and file services.",
            "For each source, check three settings before you rely on it: that auditing is turned on, since many services ship with it off; how long records are kept; and whether administrators can delete them.",
          ],
        },
        {
          heading: "Keeping logs trustworthy",
          paragraphs: [
            "Send copies to a place that the monitored systems cannot change. If the only record of an administrator's actions sits on a server that the same administrator controls, it proves little.",
            "Synchronise the clocks of every system. A timeline built from machines that disagree by four minutes will put effects before their causes. And set retention from the question you need to answer: intrusions are often found weeks after they begin, so a week of history is rarely enough.",
          ],
        },
      ],
      pullQuote: {
        text: "If you cannot say who did what, when and to what, you have a line of text, not evidence.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "A useful event states when, who, what and where.",
        "Collect identity, endpoint, DNS and firewall, and email and file audit logs first.",
        "Check that auditing is on, how long records are kept and who can delete them.",
        "Synchronised clocks and a protected copy make logs usable as evidence.",
      ],
    },
  },
  quizzes: {
    "sec4-m1-t5": [
      {
        question: "Which event record is the most useful to an investigator?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Look for the record that answers when, who, what and where.",
          "A record with no account and no source cannot be joined to other logs.",
        ],
        explanation:
          "Only one record gives the time with its zone, the account, the action and its result, the service and the source address. The others cannot be matched against any other log.",
        reviewTopicId: "sec4-m1-t4",
        reviewTopicTitle: "What makes a log useful: time, identity, action",
        options: [
          { id: "a", label: "Login failed", feedback: "No time, no account, no source: nothing to join it to." },
          { id: "b", label: "A user had trouble signing in this afternoon", feedback: "A description from memory, not a record." },
          {
            id: "c",
            label: "14:02:11 UTC, account j.okoye, sign-in failed, mail service, from 203.0.113.45",
            correct: true,
            feedback: "Correct. When, who, what and where are all present.",
          },
          { id: "d", label: "Error code 4625", feedback: "A code alone says what kind of event it was, and nothing else." },
        ],
      },
      {
        question: "Why must clocks be synchronised across the systems that send logs?",
        platformPrompt: "Choose the correct option",
        explanation:
          "An investigation is a timeline assembled from several sources. If their clocks disagree, the order of events is wrong, and so are the conclusions drawn from it.",
        reviewTopicId: "sec4-m1-t7",
        reviewTopicTitle: "Time synchronisation and log retention",
        options: [
          { id: "a", label: "So that logs take up less storage", feedback: "Clock accuracy has no effect on size." },
          {
            id: "b",
            label: "So that events from different sources can be placed in the right order",
            correct: true,
            feedback: "Correct. Cause has to come before effect in the timeline.",
          },
          { id: "c", label: "So that users see the correct time on screen", feedback: "Convenient, but not why investigators care." },
          { id: "d", label: "So that backups run at night", feedback: "Scheduling is a separate matter from evidence." },
        ],
      },
      {
        question: "Which source best shows that an account signed in from an unusual location?",
        explanation:
          "The identity provider records every sign-in with its account, time, address and result. It is the first place to look for any question about who signed in, and from where.",
        reviewTopicId: "sec4-m1-t3",
        reviewTopicTitle: "Log sources: endpoints, identity, network and cloud",
        options: [
          { id: "a", label: "The printer's job log", feedback: "It shows what was printed, not who signed in to a service." },
          { id: "b", label: "The identity provider's sign-in log", correct: true, feedback: "Correct. It holds the account, the address and the result of each sign-in." },
          { id: "c", label: "The backup schedule", feedback: "A schedule is configuration, not a record of activity." },
          { id: "d", label: "The DHCP lease table", feedback: "It maps office devices to local addresses. It does not see sign-ins to a cloud service." },
        ],
      },
    ],
  },
  assignments: {
    "sec4-m2-t9": {
      brief:
        "Triage the three alerts of the sample queue in Handouts, which come from the sign-in, endpoint and email logs of a fictional company. For each alert, decide whether it is a true or a false positive, give it a severity, and say what you would do next. Submit one report as a PDF or a DOCX.",
      requirements: [
        "For each alert: what fired, the context you checked and your verdict",
        "A severity with its reason, and whether you would escalate",
        "The next two actions for every true positive",
        "One page per alert at most. Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
