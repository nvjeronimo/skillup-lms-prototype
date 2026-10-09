import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Security Operations and Incident Response": six readings, three practice
 * quizzes, the graded quiz of Module 1 and the written assignment. The transcripts of the
 * seven videos that have one are in the outline. The account names and the addresses in the
 * questions are invented; the addresses are from ranges reserved for documentation.
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
    "sec4-m1-t2": {
      lede: "A security operations centre, or SOC, is a team and a set of routines more than it is a room. Its work is arranged so that every alert is looked at by someone, hard cases reach people with more experience, and nothing is lost when a shift ends.",
      sections: [
        {
          heading: "The tiers",
          paragraphs: [
            "Tier 1 analysts watch the alert queue. They triage: decide whether an alert is real, add context, close the false positives with a note and pass the rest on. The job rewards speed and consistency, and it is where most people begin.",
            "Tier 2 analysts investigate what tier 1 escalates. They work out how far an incident reaches, which accounts and devices are involved, and what should be contained. Tier 3 is the most senior: people who hunt for activity that no rule has caught, and who handle the incidents with the highest impact.",
          ],
        },
        {
          heading: "The roles around the queue",
          paragraphs: [
            "A detection engineer writes and tunes the rules that produce the alerts. If tier 1 closes the same false positive forty times a week, the detection engineer is the person who should hear about it.",
            "A SOC manager sets priorities, staffing and reporting. During a serious incident an incident lead coordinates the response, so that the analysts can keep investigating while someone else handles decisions and communication.",
          ],
        },
        {
          heading: "Handovers",
          paragraphs: [
            "Work changes hands at two moments: when a case is escalated, and when a shift ends. Both are points where knowledge leaks away. The receiving analyst should be able to continue from the case notes without asking the first analyst anything.",
            "A good handover states four things: what was seen, what was checked, what was concluded and what remains open. At shift change, add the cases in progress, anything being watched, and any actions promised to people outside the team.",
          ],
        },
        {
          heading: "The same functions in a small organisation",
          paragraphs: [
            "A firm of forty people has no tiers. The functions still exist: someone must look at alerts, someone must be able to investigate, and someone must have the authority to act. Often the first is an IT generalist, the second is a managed detection and response provider on contract, and the third is a director.",
            "What matters is that each function has a name next to it, a deputy, and a way to be reached out of hours. An alert that reaches nobody is the same as no alert.",
          ],
        },
      ],
      pullQuote: {
        text: "Write every note for the analyst who picks the case up at three in the morning.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Tier 1 triages, tier 2 investigates, tier 3 hunts and takes the hardest incidents.",
        "Detection engineers tune the rules, and need feedback from the queue.",
        "A handover says what was seen, checked, concluded and left open.",
        "A small organisation needs the same functions, each with a named owner.",
      ],
    },
    "sec4-m1-t7": {
      lede: "Two quiet settings decide whether an investigation is possible at all: whether the clocks of your systems agree, and how long their logs are kept. Both are cheap to get right in advance and impossible to repair afterwards.",
      sections: [
        {
          heading: "Why the clocks must agree",
          paragraphs: [
            "An investigator builds a timeline from several sources: the identity provider, a laptop, the firewall, a cloud service. The order of events is the argument. If the laptop's clock runs four minutes behind, a file appears to have been opened before the sign-in that made it possible.",
            "Computer clocks drift by seconds a day when left alone. Across fifty devices and a year, the differences are large enough to mislead.",
          ],
        },
        {
          heading: "Synchronising in practice",
          paragraphs: [
            "Systems keep time by asking a time server at regular intervals, using the Network Time Protocol, NTP. Point every server, network device and workstation at the same trusted time sources, and include the devices that are easy to forget: cameras, door controllers, printers.",
            "Record events in Coordinated Universal Time, UTC, or with the offset written into the timestamp. A log that says 02:30 with no zone is ambiguous twice a year, when the clocks change, and whenever staff work across countries. Check for drift from time to time: a device that has lost contact with its time source gives no warning.",
          ],
        },
        {
          heading: "Deciding how long to keep logs",
          paragraphs: [
            "Retention is how long a log is kept before it is deleted. Set it from the question you will need to answer. Intrusions are commonly discovered weeks or months after they began, so thirty days of sign-in history often ends before the story starts.",
            "A common arrangement has two levels: recent logs, for example ninety days, kept where they can be searched quickly, and older logs kept for a year or more in cheaper storage that is slower to query. Laws, contracts and insurers may set a minimum for some records, so check before you choose a figure.",
          ],
        },
        {
          heading: "The limits on keeping everything",
          paragraphs: [
            "Logs contain personal data: who signed in, from where, and what they opened. Keeping them for ever is a privacy risk in itself, and in many places it is unlawful. Decide a period, write down the reason, and delete on schedule.",
            "Protect what you keep. Logs should be copied to a place that the administrators of the monitored systems cannot alter, and attempts to delete or change them should raise an alert. An intruder who gains administrator rights will often try to remove the record first.",
          ],
        },
      ],
      pullQuote: {
        text: "You cannot go back and collect the log you did not keep.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Point every system at the same time sources, and check for drift.",
        "Record time in UTC, or with the offset in the timestamp.",
        "Set retention from how late incidents are usually discovered, not from the default.",
        "Logs hold personal data: keep them for a stated period, protect them, then delete them.",
      ],
    },
    "sec4-m2-t2": {
      lede: "Analysts look for two kinds of evidence. An indicator of compromise is a trace that an intrusion has left behind. An indicator of attack is behaviour that shows one in progress. They answer different questions, and they age very differently.",
      sections: [
        {
          heading: "Indicators of compromise",
          paragraphs: [
            "An indicator of compromise, or IoC, is an observable piece of data linked to known malicious activity: the hash of a file, a domain name, an internet address, the name of a scheduled task, the subject line of a phishing message.",
            "IoCs are easy to share and easy to search for. When a trusted source publishes the domain used in a phishing campaign, you can search your DNS logs for it within minutes and learn whether any of your devices looked it up.",
          ],
        },
        {
          heading: "Their short life",
          paragraphs: [
            "The weakness of an IoC is how cheaply it can be changed. A file can be rebuilt with a new hash in seconds. Domains and addresses are replaced within days. An indicator is also backward-looking: it tells you about activity that someone has already seen and analysed.",
            "Treat each one as perishable. Record where it came from, when it was first seen and how far you trust the source, and retire it after a set period. A blocklist that only grows fills with addresses that now belong to someone harmless, and produces false positives.",
          ],
        },
        {
          heading: "Indicators of attack",
          paragraphs: [
            "An indicator of attack, or IoA, describes what is being done, whatever tool is used to do it. A document viewer that starts a command shell. An account that signs in from a new country and creates a mail forwarding rule within minutes. A workstation that connects to forty others in an hour.",
            "Behaviour is much harder for an attacker to change than a file or a domain, because it is tied to what they are trying to achieve. The cost for the defender is that behaviour is harder to describe precisely, and legitimate work sometimes looks the same.",
          ],
        },
        {
          heading: "Using both",
          paragraphs: [
            "Use IoCs for two jobs: blocking what is known to be bad, and searching back through your logs when a new indicator is published. The second job is why log retention matters. An indicator released today may match an event from six weeks ago.",
            "Use IoAs for the detections you expect to last. When an incident is over, write down both: the specific indicators you found, for searching and for sharing, and the behaviour that would have revealed the intrusion earlier, as a candidate for a new rule.",
          ],
        },
      ],
      pullQuote: {
        text: "An indicator of compromise says what was used. An indicator of attack says what was done.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "An IoC is a trace such as a hash, a domain or an address. It is precise, shareable and short-lived.",
        "An IoA is a behaviour. It lasts longer and needs more tuning.",
        "Give every indicator a source, a date and an expiry.",
        "Search past logs when new indicators arrive, and turn behaviours into rules.",
      ],
    },
    "sec4-m2-t4": {
      lede: "Once an alert is judged to be real, three decisions follow. How bad is it? What is worked on first? Who else needs to know? Severity, priority and escalation are the names for those decisions, and a team that defines them in advance makes them faster and more evenly.",
      sections: [
        {
          heading: "Severity: how bad",
          paragraphs: [
            "Severity measures the harm, done or likely. It depends on what is affected and how: the sensitivity of the data, how critical the system is, how many people or devices are involved, and whether the activity succeeded.",
            "A four-level scale is enough for most teams. Low: blocked or contained, with no sign of success. Medium: one ordinary account or device affected. High: a privileged account, sensitive data or several systems. Critical: the business cannot operate, or harm is spreading now. Write one example beside each level, taken from your own organisation.",
          ],
        },
        {
          heading: "Priority: what comes first",
          paragraphs: [
            "Priority is the order of work. It starts from severity and adds urgency. An intrusion that is still in progress outranks a worse one that ended last week, because acting now changes the outcome.",
            "Value matters too. The same malware alert has a different priority on the finance director's laptop than on a spare machine in a store room. That is why enrichment, knowing who owns a device and what it can reach, is worth the effort before triage and not during it.",
          ],
        },
        {
          heading: "Escalation: who else",
          paragraphs: [
            "There are two kinds of escalation. Functional escalation hands the case to someone with more skill or more access, for example from tier 1 to tier 2. Hierarchical escalation informs someone with more authority, because a decision is needed that the analyst cannot take.",
            "Define the triggers so that nobody has to judge under pressure whether to wake a manager. Typical triggers are: any confirmed compromise of a privileged account, any sign that data has left, the same activity on more than one device, anything involving payments, and anything the analyst cannot explain within an agreed time.",
          ],
        },
        {
          heading: "Escalating well",
          paragraphs: [
            "Escalate early and with substance. State what you saw, what you checked, what you believe is happening, what you have already done and what you need. Thirty seconds of that is worth more than a forwarded alert with the word “urgent”.",
            "Severity can change. Record the first rating and the time, and update it as the facts arrive. Lowering a severity is as legitimate as raising one, provided the note says why.",
          ],
        },
      ],
      pullQuote: {
        text: "Severity describes the harm. Priority decides the order. Escalation brings in the people who can act.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Rate severity on a short scale, with a local example for each level.",
        "Priority adds urgency and the value of what is affected.",
        "Agree the escalation triggers before they are needed.",
        "Escalate with what you saw, checked, concluded, did and need.",
      ],
    },
    "sec4-m3-t2": {
      lede: "Incident response follows a sequence that most frameworks describe in much the same way. The names and the grouping vary a little, but the logic does not: get ready, notice, limit, remove, restore, learn.",
      sections: [
        {
          heading: "Preparation, then detection and analysis",
          paragraphs: [
            "Preparation is everything done before an incident: the plan, the roles, the contact list, logging, backups and practice. It is the only phase without time pressure, and it sets the quality of all the others.",
            "Detection and analysis begins when something is noticed, whether by an alert, a member of staff or a customer. The team confirms that it is an incident, estimates its scope and gives it a severity. The first estimate is usually wrong in the details. It needs to be good enough to decide what to contain.",
          ],
        },
        {
          heading: "Containment, eradication and recovery",
          paragraphs: [
            "Containment stops the incident from spreading: isolating devices, disabling accounts, blocking addresses. Evidence is preserved as this is done, because it will be needed in the next step.",
            "Eradication removes the cause: the malware, the intruder's accounts and rules, and the weakness that let them in. Recovery returns systems to service from a known good state, in order of business priority, and watches them closely for signs that the problem has come back. Recovering before eradication is complete is the classic mistake, since it restores the intruder along with the service.",
          ],
        },
        {
          heading: "Post-incident activity",
          paragraphs: [
            "The last phase is the review. Within a week or two, while memories are fresh, the team reconstructs the timeline and asks what would have made the incident shorter or smaller.",
            "The output is a short list of changes, each with an owner and a date: a new detection rule, a correction to the contact list, a control that was missing. Those changes feed preparation, and this is why the lifecycle is drawn as a loop.",
          ],
        },
        {
          heading: "A sequence, with loops",
          paragraphs: [
            "Real incidents do not move through the phases once. Analysis continues during containment. Eradication uncovers a second affected server, and the team returns to scoping. The phases are a way to keep track of what kind of work is being done, and of what must not be skipped.",
            "Two activities run through all of them. Keep a log of decisions and actions, with times. And communicate, on a schedule, with the people who need to know, so that the responders are not interrupted every ten minutes for news.",
          ],
        },
      ],
      pullQuote: {
        text: "An incident that changes nothing afterwards will happen again.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "The phases are preparation, detection and analysis, containment, eradication, recovery and review.",
        "Contain first, remove the cause second, restore third.",
        "The review produces owned, dated changes that feed preparation.",
        "Keep a timed log and a communication schedule throughout.",
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
    "sec4-m1-t9": [
      {
        question: "In a tiered security operations team, what is the main job of a tier 1 analyst?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Tier 1 is the first look at every alert: is it real, what is the context, and does it need to go further? Deep investigation and rule writing belong to other roles.",
        reviewTopicId: "sec4-m1-t2",
        reviewTopicTitle: "Roles, tiers and handovers in a SOC",
        options: [
          {
            id: "a",
            label: "To triage alerts, close false positives with a note and escalate the rest",
            correct: true,
            feedback: "Correct. Tier 1 keeps the queue moving and passes real cases on with context.",
          },
          { id: "b", label: "To write and tune detection rules", feedback: "That is the detection engineer's job, informed by what tier 1 sees." },
          { id: "c", label: "To approve the security budget", feedback: "Budget belongs to the SOC manager and the business." },
          { id: "d", label: "To hunt for activity that no rule has caught", feedback: "Hunting is tier 3 work." },
        ],
      },
      {
        question: "One product records the account as “user”, another as “subject” and a third as “actor”. Which SIEM step makes a single search cover all three?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Normalisation maps the different field names and formats of each source onto one common set, so that an analyst can ask one question of all the data.",
        reviewTopicId: "sec4-m1-t6",
        reviewTopicTitle: "How a SIEM collects, normalises and correlates",
        options: [
          { id: "a", label: "Collection", feedback: "Collection brings the events in, still in their own formats." },
          { id: "b", label: "Normalisation", correct: true, feedback: "Correct. The three names become one field." },
          { id: "c", label: "Correlation", feedback: "Correlation joins related events. It relies on normalisation having been done." },
          { id: "d", label: "Retention", feedback: "Retention is how long the events are kept." },
        ],
      },
      {
        question: "An analyst needs to know which program started on a laptop, and which program launched it. Which group of log sources holds this?",
        explanation:
          "Endpoint logs record what ran on a device: the process, its parent, the account and the files touched. Network and identity sources see the device from the outside only.",
        reviewTopicId: "sec4-m1-t3",
        reviewTopicTitle: "Log sources: endpoints, identity, network and cloud",
        options: [
          { id: "a", label: "Identity sources", feedback: "They record sign-ins and account changes, not processes." },
          { id: "b", label: "Network sources", feedback: "They show which addresses the laptop talked to, not what ran on it." },
          { id: "c", label: "Endpoint sources", correct: true, feedback: "Correct. Process starts and their parents are endpoint events." },
          { id: "d", label: "SaaS audit logs", feedback: "They record actions inside a cloud service." },
        ],
      },
      {
        question: "An intrusion is discovered seven weeks after it began. Sign-in logs are kept for thirty days. What is the consequence?",
        explanation:
          "The first sign-in, which would show how and from where the intruder entered, was deleted before anyone looked. Retention should be set from how late incidents are found, which is often months.",
        reviewTopicId: "sec4-m1-t7",
        reviewTopicTitle: "Time synchronisation and log retention",
        options: [
          { id: "a", label: "None: thirty days is always enough", feedback: "Here it ended almost three weeks too early." },
          {
            id: "b",
            label: "The record of how the intruder first got in no longer exists",
            correct: true,
            feedback: "Correct. The start of the timeline cannot be rebuilt.",
          },
          { id: "c", label: "The clocks of the systems drift apart", feedback: "Drift is a separate problem, solved by time synchronisation." },
          { id: "d", label: "The SIEM stops collecting new events", feedback: "Collection continues. It is the old events that are gone." },
        ],
      },
    ],
    "sec4-m2-t5": [
      {
        question: "A rule fires when one account has more than twenty failed sign-ins in five minutes. What type of detection is this?",
        platformPrompt: "Choose the correct option",
        hints: [
          "The rule does not know anything about the attacker. It counts.",
          "Which type compares a number of events with a limit?",
        ],
        explanation:
          "A threshold rule counts events and fires above a limit. It catches noisy activity and misses an attacker who stays below the number.",
        reviewTopicId: "sec4-m2-t1",
        reviewTopicTitle: "Detection rules: signatures, thresholds and behaviour",
        options: [
          { id: "a", label: "A signature", feedback: "A signature matches a known bad value, such as a file hash." },
          { id: "b", label: "A threshold", correct: true, feedback: "Correct. It counts events against a limit." },
          { id: "c", label: "A behavioural rule", feedback: "A behavioural rule compares activity with a baseline of what is normal." },
          { id: "d", label: "An indicator of compromise", feedback: "An indicator is a piece of evidence, not a type of rule." },
        ],
      },
      {
        question: "Which of these is an indicator of attack and not an indicator of compromise?",
        platformPrompt: "Choose the correct option",
        explanation:
          "An indicator of attack describes behaviour, whatever tool is used. The other three are traces: specific values that an attacker can change cheaply.",
        reviewTopicId: "sec4-m2-t2",
        reviewTopicTitle: "Indicators of compromise and indicators of attack",
        options: [
          { id: "a", label: "The hash of a malicious file", feedback: "A hash is a trace. It changes when the file is rebuilt." },
          { id: "b", label: "A domain name used in a phishing campaign", feedback: "A domain is a trace, and is replaced within days." },
          {
            id: "c",
            label: "An account signs in from a new country and creates a mail forwarding rule within minutes",
            correct: true,
            feedback: "Correct. This is a pattern of behaviour, independent of any one tool or address.",
          },
          { id: "d", label: "The address 198.51.100.7 on a blocklist", feedback: "An address is a trace, and may be reassigned." },
        ],
      },
      {
        question: "Two alerts arrive together. In the first, endpoint protection blocked a known malicious file on an intern's laptop. In the second, the finance director's account signed in successfully from a country the company has never worked in. Which is worked first?",
        explanation:
          "Priority combines severity and urgency. The first event was stopped. The second succeeded, involves an account that can approve payments, and may still be going on.",
        reviewTopicId: "sec4-m2-t4",
        reviewTopicTitle: "Severity, priority and escalation",
        options: [
          { id: "a", label: "The first: malware is always the most serious", feedback: "It was blocked. Confirm that and note it, after the other alert." },
          {
            id: "b",
            label: "The second: the activity succeeded, on an account with high value",
            correct: true,
            feedback: "Correct. A successful sign-in to a high-value account outranks a blocked file.",
          },
          { id: "c", label: "Whichever arrived first in the queue", feedback: "Order of arrival is not priority." },
          { id: "d", label: "Neither, until a manager decides", feedback: "The analyst sets the first priority and escalates the second alert while working on it." },
        ],
      },
      {
        question: "An “impossible travel” alert fires for a sales account. What should the analyst do first?",
        explanation:
          "Triage starts with what the rule actually matched, then adds context: the user, the device, and what happened just before and after. A VPN or a new phone explains many of these alerts, and a forwarding rule created two minutes later explains the rest.",
        reviewTopicId: "sec4-m2-t3",
        reviewTopicTitle: "Triage: is this alert real, and does it matter?",
        options: [
          { id: "a", label: "Close it: these alerts are usually caused by a VPN", feedback: "Usually is not always. The context takes two minutes to check." },
          { id: "b", label: "Disable the account at once", feedback: "That may be the right step later. It is not the first one without any context." },
          {
            id: "c",
            label: "Read what the rule matched, then check the user, the device and the activity either side",
            correct: true,
            feedback: "Correct. Decide once you have the context, and write down what you found.",
          },
          { id: "d", label: "Email the user and wait for an answer", feedback: "If the account is compromised, the reply may not come from the user." },
        ],
      },
    ],
    "sec4-m3-t5": [
      {
        question: "The response team spends an hour around a table working through an imagined ransomware scenario. Which phase of the lifecycle is this?",
        platformPrompt: "Choose the correct option",
        hints: [
          "No incident is taking place.",
          "Which phase happens before anything has gone wrong?",
        ],
        explanation:
          "A tabletop exercise is rehearsal. It belongs to preparation, the phase in which plans, roles and contact lists are built and tested without time pressure.",
        reviewTopicId: "sec4-m3-t1",
        reviewTopicTitle: "Preparation: plans, roles and contact lists",
        options: [
          { id: "a", label: "Preparation", correct: true, feedback: "Correct. The exercise tests the plan while mistakes cost nothing." },
          { id: "b", label: "Detection and analysis", feedback: "Nothing real has been detected." },
          { id: "c", label: "Containment", feedback: "There is nothing to contain in an exercise." },
          { id: "d", label: "Recovery", feedback: "Recovery restores systems after a real incident." },
        ],
      },
      {
        question: "A workstation shows the first signs of ransomware. What is the best first containment step?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Isolation stops the spread to shared drives and other machines. Leaving the device powered keeps the evidence held in memory, which is lost when it is switched off.",
        reviewTopicId: "sec4-m3-t3",
        reviewTopicTitle: "Containment: stop the spread, keep the evidence",
        options: [
          { id: "a", label: "Switch it off and reinstall it", feedback: "That destroys the evidence, and the cause is still unknown." },
          {
            id: "b",
            label: "Isolate it from the network and leave it powered on",
            correct: true,
            feedback: "Correct. The spread stops and the evidence in memory is kept.",
          },
          { id: "c", label: "Restore last night's backup onto it", feedback: "Recovery comes after the cause has been removed." },
          { id: "d", label: "Leave it connected, to watch what happens next", feedback: "Every minute connected puts shared files and other devices at risk." },
        ],
      },
      {
        question: "Why does eradication come before recovery?",
        explanation:
          "If the intruder's access or the original weakness is still present, restored systems are compromised again, sometimes within hours. Remove the cause, then restore.",
        reviewTopicId: "sec4-m3-t4",
        reviewTopicTitle: "Eradication and recovery: back to a known good state",
        options: [
          { id: "a", label: "Because backups take a long time to copy", feedback: "Duration is not the reason for the order." },
          {
            id: "b",
            label: "Because restoring while the cause remains brings the incident back",
            correct: true,
            feedback: "Correct. A clean system needs a closed door.",
          },
          { id: "c", label: "Because the regulator requires that order", feedback: "The order follows from the logic of the work, not from a rule." },
          { id: "d", label: "Because recovery is optional", feedback: "Recovery is the point at which the business gets its systems back." },
        ],
      },
      {
        question: "A rebuilt server has just been returned to service after an incident. What should the team do next?",
        explanation:
          "Recovery includes a period of closer monitoring. If something was missed during eradication, the same indicators will reappear, and it is far better to see them in the first day than in the third week.",
        reviewTopicId: "sec4-m3-t2",
        reviewTopicTitle: "The incident response lifecycle, phase by phase",
        options: [
          { id: "a", label: "Close the incident and delete the notes", feedback: "The notes are needed for the review, and may be needed by the insurer or a regulator." },
          {
            id: "b",
            label: "Watch it closely for the indicators seen during the incident",
            correct: true,
            feedback: "Correct. Heightened monitoring confirms that the cause is really gone.",
          },
          { id: "c", label: "Switch off its logging to improve performance", feedback: "This is the moment when its logs matter most." },
          { id: "d", label: "Give every responder a permanent administrator account on it", feedback: "Temporary access granted for the incident should be removed, not extended." },
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
