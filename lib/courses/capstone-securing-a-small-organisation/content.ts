import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

/**
 * Topic bodies of "Capstone: Securing a Small Organisation": the brief and six more
 * readings, the practice quiz on the brief, the checkpoint quiz, the three milestones, the
 * peer review of the designs and the final project with its rubric. The transcripts of the
 * five videos that have one are in the outline. Tidewater Veterinary Group is a practice
 * made up for the course.
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
    "sec5-m1-t5": {
      lede: "You cannot protect what you have not listed. The asset inventory is the first table of your plan, and every risk in your register will point back to a row in it. This reading shows how to build it from the Tidewater case file.",
      sections: [
        {
          heading: "What counts as an asset",
          paragraphs: [
            "An asset is anything the practice needs in order to work, or would be harmed by losing. Devices are the obvious ones: reception computers, tablets, the imaging workstation, card terminals. The less obvious ones matter more: client and patient records, the practice management service, the email accounts, the ability to take card payments.",
            "Include what the practice does not own but depends on. The cloud office suite, the internet connection at each clinic, the domain name, and the IT contractor with an administrator account on every system are all assets or dependencies in this sense.",
          ],
        },
        {
          heading: "The columns to record",
          paragraphs: [
            "Keep the table narrow enough to maintain. For each asset record its name, what kind of thing it is, where it is, who owns it, how sensitive it is and how long the practice could work without it. The owner is a role at the practice, such as the office manager or the head nurse, and not the supplier.",
            "Use a three-level scale for sensitivity and say what the levels mean for Tidewater. Client contact and payment details are high. The staff rota is medium. The price list on the website is low. A scale that you have defined can be challenged. A scale that you have not defined cannot be used.",
          ],
        },
        {
          heading: "Finding the assets in the case file",
          paragraphs: [
            "Do not start from a list of hardware. Follow the work. Trace one appointment from the booking to the invoice, and write down every system, account and piece of information it touches. Then do the same for a card payment, for a new member of staff joining, and for an X-ray taken at one clinic and read at the other.",
            "Read the interview notes as closely as the equipment list. People mention things that no list of hardware contains: a shared mailbox, a spreadsheet kept by one person, a laptop used at home. Informal assets of this kind are often where the highest risks sit.",
          ],
        },
        {
          heading: "Common gaps",
          paragraphs: [
            "Reviewers of past inventories most often find four things missing: accounts, especially shared and administrator accounts; data held in cloud services, as distinct from the service itself; paper records; and suppliers.",
            "Where the case file does not say, do not invent. Add the asset with the field marked as an assumption or as unknown, and list it among your assumptions. An honest unknown is itself a finding: if nobody at the practice can say whether a system is backed up, that sentence belongs in the risk register.",
          ],
        },
      ],
      pullQuote: {
        text: "Follow the work, not the hardware list.",
        attribution: "Capstone notes, Module 1",
      },
      takeaways: [
        "List information, services, accounts and suppliers as well as devices.",
        "Give each asset an owner at the practice, a sensitivity and a tolerable downtime.",
        "Trace real tasks through the case file to find what the equipment list leaves out.",
        "Mark unknowns as unknowns, and carry them into the risk register.",
      ],
    },
    "sec5-m2-t2": {
      lede: "Most of the controls you have learned in this program would reduce risk at Tidewater. Very few of them can be run by an office manager and a contractor who visits once a month. Choosing well means judging each control by what it costs to keep working, and not only by how much risk it removes.",
      sections: [
        {
          heading: "Four questions for every control",
          paragraphs: [
            "Who operates it, by name or role? How many hours does it take each month once it is installed? What happens when it fails: does it fail safely and visibly, or silently? And does it rely on something the practice already has, or on a new product with its own licence and its own learning curve?",
            "A control with good answers to all four will still be working in a year. A control that needs a daily review by someone with security training will be abandoned by the third week, however good it looked in the design.",
          ],
        },
        {
          heading: "Prefer settings to products",
          paragraphs: [
            "Begin with what the practice already pays for. The office suite and the practice management service both include multi-factor authentication, sharing controls, audit logs and alerting. Turning these on costs time, not money, and adds nothing new to maintain.",
            "Prefer controls that are set once and then checked: automatic updates, disk encryption, a default that blocks sharing outside the practice. Each needs a monthly check that it is still on. None needs anyone to watch it.",
          ],
        },
        {
          heading: "Buy in what needs a specialist",
          paragraphs: [
            "Some work does need skill and attention that the practice does not have: watching endpoint alerts, for example, or keeping the firewall configuration current. Where a risk in your top five depends on such a control, propose it as a managed service and say so plainly, with its cost band.",
            "Extend the contractor's role with care. One day a month is enough to carry out a checklist. It is not enough to respond to an alert on the day it fires. Your design should say which tasks are scheduled, which are on call, and what on-call response the present contract actually covers.",
          ],
        },
        {
          heading: "What to leave out",
          paragraphs: [
            "A design is judged as much by what it leaves out. For each control you decided against, write one line: the risk it would have reduced, why it does not fit, and what limits that risk in the meantime.",
            "Order the remainder by risk reduced per hour of upkeep. For most Tidewater plans the first rows are the same: multi-factor authentication everywhere, a separate administrator account for the contractor, tested backups, and the client Wi-Fi moved off the clinic network. They are also, not by accident, close to what the insurer asked for.",
          ],
        },
      ],
      pullQuote: {
        text: "A control is worth what it reduces, divided by what it costs to keep running.",
        attribution: "Capstone notes, Module 2",
      },
      takeaways: [
        "Judge each control by who runs it, the monthly hours, how it fails and what it depends on.",
        "Turn on what the existing services already include before proposing new products.",
        "Use a managed service where a top risk needs daily specialist attention.",
        "Record the controls you rejected, with the reason and the interim measure.",
      ],
    },
    "sec5-m2-t5": {
      lede: "Your network and access design will be approved, or not, by a practice owner who has never configured a firewall. If she cannot follow it, she cannot approve it, and a design that is not approved protects nobody. This reading is about writing the design so that the decision is easy to make.",
      sections: [
        {
          heading: "Lead with the decision",
          paragraphs: [
            "Open with what you are asking for, in three or four sentences: what changes, what it protects against, what it costs and when it would be done. The owner should be able to stop reading after that paragraph and still know what she is agreeing to.",
            "Put the detail after it and the reference material last. The zone diagram and the access matrix are evidence for the request. They are not the request.",
          ],
        },
        {
          heading: "Make the diagram readable",
          paragraphs: [
            "Draw one diagram per clinic with four or five zones, named for what is in them: Reception and consulting, Payments, Imaging, Guest Wi-Fi. Avoid addresses and device model numbers on the main diagram. Show what may talk to what with a few labelled arrows, and state in a sentence that everything else is blocked.",
            "Add a legend, and a caption that says what the diagram proves: “A phone on the waiting-room Wi-Fi cannot reach the reception computers or the card terminals.” A reader who understands the caption has understood the design.",
          ],
        },
        {
          heading: "Explain each rule by its reason",
          paragraphs: [
            "Give each rule in the access matrix one line of reasoning that names a risk in your register. “Receptionists can view and create client records but cannot export the client list, risk R4” is a rule the owner can weigh. “Receptionist: read and write, no export” is a setting.",
            "Say what changes for staff. Who will have to sign in differently, who loses access they have today, and what a nurse should do when she needs something the matrix does not allow. Most objections to a design are about daily inconvenience, and they are better answered on paper than in the corridor.",
          ],
        },
        {
          heading: "Be exact about cost, effort and limits",
          paragraphs: [
            "For each change, give a cost band and the hours needed from the contractor and from staff. Say what must happen out of hours, and how long each clinic would be disrupted.",
            "Close with what the design does not solve, and with a clear request for approval: a name and a date. Use plain words throughout, and explain a technical term the first time it appears. If you need “VLAN”, write “a separate section of the network (a VLAN)” once, and then use the short form.",
          ],
        },
      ],
      pullQuote: {
        text: "If the owner cannot explain your design to her staff, she has not really approved it.",
        attribution: "Capstone notes, Module 2",
      },
      takeaways: [
        "State the request, the benefit, the cost and the date in the first paragraph.",
        "Draw few zones, name them for their contents and caption what the diagram proves.",
        "Tie every access rule to a risk, and say what changes for staff.",
        "Give cost bands, hours and limits, then ask for approval by name and date.",
      ],
    },
    "sec5-m3-t2": {
      lede: "Tidewater cannot collect every log and has nobody to read them if it did. The useful question is narrower: which few records would have answered the owner's question after the phishing incident, and which would answer the next one?",
      sections: [
        {
          heading: "Start from the questions",
          paragraphs: [
            "After the receptionist's account was misused, nobody could say what else it had reached. That is a logging failure with a precise shape. The practice needed to know which sign-ins were not hers, what was read or sent, and whether any rule or setting was changed.",
            "Write down the five or six questions that your top risks would raise. Who signed in to this account, and from where? What did the contractor's administrator account change this month? Was the client list exported? Did last night's backup finish? Each question points to a log.",
          ],
        },
        {
          heading: "The first three sources",
          paragraphs: [
            "First, the audit log of the office suite. It records sign-ins, mailbox rules, file sharing and administrator actions, and it covers the incident that actually happened. Check that it is switched on, how many days it keeps, and whether the practice's licence allows longer.",
            "Second, the audit log of the practice management service: who opened, changed or exported client and patient records. Third, the backup reports. They are not a security log in the usual sense, but a failed backup is the signal with the largest consequence if it is missed.",
          ],
        },
        {
          heading: "What can wait",
          paragraphs: [
            "Firewall and Wi-Fi logs at each clinic are useful to an investigator, and nobody at the practice can read them day to day. Make sure they are kept for a reasonable period so that the contractor can consult them after an event, and do not build a routine around them.",
            "Detailed logs from every workstation are beyond this team. If your plan includes managed endpoint protection, its provider reads those. If it does not, say that this is a gap you have accepted, and why.",
          ],
        },
        {
          heading: "Make the logs usable",
          paragraphs: [
            "For each source you choose, record four things in your plan: where the log is, how long it is kept, who can read it, and who can delete it. If the contractor's administrator account can clear the record of its own actions, say so and propose a fix, such as a copy sent to a mailbox that the owner controls.",
            "Then connect the logs to the alerts from the previous video. A log that nobody looks at until something goes wrong is still worth having. A log that turns out to have been switched off is not.",
          ],
        },
      ],
      pullQuote: {
        text: "Choose the logs by the questions you will be asked on a bad day.",
        attribution: "Capstone notes, Module 3",
      },
      takeaways: [
        "List the questions your top risks would raise, then find the log that answers each.",
        "Begin with the office suite audit log, the practice management audit log and the backup reports.",
        "Keep network logs for the contractor, without a daily routine around them.",
        "Record where each log is, how long it is kept, and who can read or delete it.",
      ],
    },
    "sec5-m3-t4": {
      lede: "The insurer asked Tidewater for tested backups, and the word that matters is “tested”. A backup that has never been restored is a hope. This reading covers what the recovery plan must state, and how to prove that it works.",
      sections: [
        {
          heading: "Set the two objectives first",
          paragraphs: [
            "For each important system, agree two numbers with the owner. The recovery point objective, RPO, is how much recent work the practice can afford to lose, measured in time. An RPO of twenty-four hours means that a nightly backup is enough. The recovery time objective, RTO, is how long the practice can go without the system.",
            "The numbers differ by system and are business decisions, not technical ones. A clinic may manage for a day without shared files, and hardly an hour without the appointment diary. Ask what the staff would do during the outage. The answer shows how much the downtime really costs.",
          ],
        },
        {
          heading: "Know what is backed up, and where",
          paragraphs: [
            "List each store of data and who backs it up. The practice management service and the office suite are run by their providers, who protect against their own failures. That is not the same as being able to recover a folder that a member of staff deleted two months ago, or records encrypted through a compromised account. Check what each service offers and whether an independent copy is needed.",
            "A widely used rule of thumb is three copies of the data, on two different kinds of storage, with one kept somewhere else. Add a further condition: at least one copy that cannot be changed or deleted from the practice's ordinary accounts, including the administrator's. Ransomware and intruders go for the backups first.",
          ],
        },
        {
          heading: "Test the restore",
          paragraphs: [
            "A restore test has a scope, a schedule and a record. Each month, restore a few files chosen at random and open them. Twice a year, restore a whole system to a spare device or a test area, and time it from the decision to the moment a member of staff can work again.",
            "Compare that time with the RTO. If a restore takes nine hours and the objective was four, either the method or the objective has to change, and it is far better to learn this in a test. Keep a one-line record of every test: the date, what was restored, how long it took, who did it and what went wrong.",
          ],
        },
        {
          heading: "Write it so that someone else can do it",
          paragraphs: [
            "The recovery plan should be usable by a person who did not write it, on a day when the contractor cannot be reached. Give the steps in order, where the credentials for the backup service are held, who may authorise a restore, and which system comes back first.",
            "Keep a printed copy at each clinic. A recovery plan stored only on the system that has failed is the most common flaw in plans of this kind, and the easiest one to avoid.",
          ],
        },
      ],
      pullQuote: {
        text: "You do not have a backup until you have restored from it.",
        attribution: "Capstone notes, Module 3",
      },
      takeaways: [
        "Agree an RPO and an RTO for each important system with the owner.",
        "Check what the cloud providers really recover, and keep one copy that ordinary accounts cannot change.",
        "Restore sample files every month and a whole system twice a year, and time it.",
        "Write the steps for someone else to follow, and keep a copy off the system.",
      ],
    },
    "sec5-m4-t1": {
      lede: "You have three milestones, written weeks apart and reviewed by different peers. The final project asks for one plan. Assembling it is editing work: making the parts agree with each other, and then arranging the actions over twelve months that the practice can actually get through.",
      sections: [
        {
          heading: "One document, five parts",
          paragraphs: [
            "The plan has a fixed order: the one-page summary for the owner, the risk register, the network and access design, the monitoring and incident response plan, and the roadmap. Write the summary last, although it comes first.",
            "Give every risk, control and action a short reference, and use the same references in every part. A reader should be able to pick any action in the roadmap and follow it back to a control in the design and to a risk in the register.",
          ],
        },
        {
          heading: "Check that the parts agree",
          paragraphs: [
            "Read the plan once in each direction. Forwards: does every one of your top risks have at least one control, and a way to detect it? Backwards: does every action in the roadmap reduce a risk that you recorded? An action that traces to nothing is either unnecessary or a sign that the register is missing a row.",
            "Apply the feedback from your two peer reviews, and note where you chose not to. Then look for contradictions that arose between milestones, such as an access matrix that names a role your playbook never mentions, or a backup schedule that cannot meet the recovery objective.",
          ],
        },
        {
          heading: "Build the roadmap",
          paragraphs: [
            "Arrange the actions by quarter. The first thirty days hold the changes that are quick and reduce the most risk. The insurer's three requirements must be complete before the renewal in five months, so place them and their dependencies first and work outwards.",
            "Each action has five fields: what is done, who owns it, a cost band, the effort in hours and what must be finished before it. Watch the load on people. If the roadmap gives the office manager six actions in the same month, it will slip, and you should say which ones can move.",
          ],
        },
        {
          heading: "Leave the practice able to continue",
          paragraphs: [
            "End the roadmap with the routines that keep the plan alive after month twelve: a review of the risk register twice a year, a restore test, an access review, a tabletop exercise. Name an owner for each.",
            "Finally, write the owner's summary. One page: the three decisions you need from her, what they cost, what they reduce and what happens next. If she reads only that page, the plan should still move forward.",
          ],
        },
      ],
      pullQuote: {
        text: "Every action in the roadmap should lead back to a risk in the register.",
        attribution: "Capstone notes, Module 4",
      },
      takeaways: [
        "Use one set of references across the register, the design, the response plan and the roadmap.",
        "Read the plan forwards and backwards to find risks without controls and actions without risks.",
        "Place the insurer's requirements first, and check the load on each person.",
        "Finish with the recurring routines and their owners, then write the one-page summary.",
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
    "sec5-m3-t6": [
      {
        question: "Which entry in an asset inventory is complete enough to build a risk on?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A usable row names the asset, says where it is, who at the practice owns it, how sensitive it is and how long the practice could work without it. A category, a supplier or a device type alone cannot be rated.",
        reviewTopicId: "sec5-m1-t5",
        reviewTopicTitle: "How to build the asset inventory",
        options: [
          { id: "a", label: "Computers", feedback: "A category, with no owner, location or sensitivity." },
          {
            id: "b",
            label: "Client records in the practice management service; owner: office manager; sensitivity: high; tolerable downtime: 2 hours",
            correct: true,
            feedback: "Correct. Each field gives the risk register something to work from.",
          },
          { id: "c", label: "The IT contractor looks after the servers", feedback: "A statement about a supplier, not an asset with an owner at the practice." },
          { id: "d", label: "Tablet, consulting room", feedback: "A device and a place. What it holds and who answers for it are missing." },
        ],
      },
      {
        question: "Which line in a control plan is evidence that a control is working?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A setting describes an intention. Evidence is an observation, made on a date by a named person, that the control did its job.",
        reviewTopicId: "sec5-m2-t1",
        reviewTopicTitle: "Turning risks into a control plan",
        options: [
          { id: "a", label: "Backups are configured", feedback: "That is a setting. It does not show that a restore works." },
          { id: "b", label: "Multi-factor authentication is recommended for all staff", feedback: "A recommendation is neither a control nor evidence." },
          {
            id: "c",
            label: "On the first Monday of the month, the office manager restored three files and opened them",
            correct: true,
            feedback: "Correct. A dated observation by a named role.",
          },
          { id: "d", label: "The contractor is responsible for security", feedback: "Responsibility is not evidence that anything happened." },
        ],
      },
      {
        question: "Two controls would reduce the same risk by about the same amount. The first needs a trained person to review its output every day. The second is a setting that is turned on once and checked every month. Which fits Tidewater, and why?",
        explanation:
          "Tidewater has no security staff and a contractor for one day a month. A control that depends on daily specialist attention will stop being run. The plan is graded on whether the practice can keep it going.",
        reviewTopicId: "sec5-m2-t2",
        reviewTopicTitle: "Choosing controls a small team can run",
        options: [
          { id: "a", label: "The first, because more attention means more security", feedback: "Only if the attention is really given. Here nobody is available to give it." },
          {
            id: "b",
            label: "The second, because the practice can keep it running",
            correct: true,
            feedback: "Correct. For the same benefit, choose the lower upkeep.",
          },
          { id: "c", label: "Both, to be safe", feedback: "The first would be abandoned, and the plan would then describe a control that does not exist." },
          { id: "d", label: "Neither: the risk should be accepted", feedback: "A workable control exists, so acceptance is not justified." },
        ],
      },
      {
        question: "Which log should Tidewater switch on and check first?",
        explanation:
          "The incident that prompted the plan was a misused email account, and nobody could say what it had reached. The office suite audit log records sign-ins, mailbox rules, sharing and administrator actions.",
        reviewTopicId: "sec5-m3-t2",
        reviewTopicTitle: "What to log first when you cannot log everything",
        options: [
          { id: "a", label: "The print server's job log", feedback: "It answers none of the questions raised by the practice's top risks." },
          {
            id: "b",
            label: "The audit log of the cloud office suite",
            correct: true,
            feedback: "Correct. It covers the incident that actually happened.",
          },
          { id: "c", label: "Detailed process logs from every workstation", feedback: "Nobody at the practice could read them." },
          { id: "d", label: "The guest Wi-Fi connection log", feedback: "Worth keeping, but it does not come first." },
        ],
      },
      {
        question: "The recovery plan sets a recovery point objective of 24 hours for shared files. What does that commit the practice to?",
        explanation:
          "The recovery point objective is the amount of recent work that may be lost, measured in time. It sets how often backups must run. How quickly service returns is a different number, the recovery time objective.",
        reviewTopicId: "sec5-m3-t4",
        reviewTopicTitle: "Backup and recovery plan: testing the restore",
        options: [
          { id: "a", label: "Files will be restored within 24 hours of a failure", feedback: "That describes the recovery time objective." },
          {
            id: "b",
            label: "At most one day of changes may be lost, so backups run at least daily",
            correct: true,
            feedback: "Correct. The objective fixes the longest gap between backups.",
          },
          { id: "c", label: "Backups are kept for 24 hours and then deleted", feedback: "That would be a retention period, and a very short one." },
          { id: "d", label: "A restore test takes place every 24 hours", feedback: "Test frequency is set separately." },
        ],
      },
    ],
  },
  assignments: {
    "sec5-m1-t7": {
      brief:
        "Using the case file, list the information, systems and services that Tidewater Veterinary Group depends on, then build the risk register for them. This is the foundation of the plan: Milestones 2 and 3 must trace back to the risks you record here. Fill in both tables in the milestone template, then submit them as one PDF or DOCX.",
      requirements: [
        "An inventory of at least 15 assets, with an owner and a sensitivity for each",
        "At least 10 risks, each written as asset, threat and weakness, and rated",
        "The five highest risks marked, with a proposed treatment",
        "A list of the assumptions you made. Counts toward your final grade",
      ],
    },
    "sec5-m2-t6": {
      brief:
        "Design the network and the access model that answer the risks in your Milestone 1 register. For each clinic, divide the single network into zones and say what may talk to what. For the practice as a whole, define the roles, what each role can reach, and how the contractor's administrator access is contained. Submit the zone diagram, the flow table and the access matrix as one PDF or DOCX.",
      requirements: [
        "A zone diagram per clinic, with the client Wi-Fi and the card terminals each in a zone of their own",
        "A flow table: the allowed connections between zones, each with its reason",
        "An access matrix of 5 to 8 roles against the systems in the case file, including the contractor",
        "Every design choice traced to a risk in your register. Counts toward your final grade",
      ],
    },
    "sec5-m3-t5": {
      brief:
        "Write the plan that tells Tidewater how it will notice a problem, respond to it and recover. Size it for the people in the case file: an office manager, an owner and a contractor for one day a month. Include the monitoring table, two playbooks and the backup and recovery plan. Submit them as one PDF or DOCX.",
      requirements: [
        "A monitoring table: at least 5 signals, each with its source, who sees it, the first action and when to escalate",
        "Two playbooks of one page each: a reported phishing message, and ransomware on one workstation",
        "A recovery plan with an RPO and an RTO for three systems, and a restore test schedule",
        "A contact list by role, usable when email is unavailable. Counts toward your final grade",
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
    "sec5-m2-t7": {
      brief:
        "Review the network and access designs of two peers. You are reading as the practice owner's adviser: could Tidewater approve this design and run it? Score each design against the rubric, and write comments that the author can act on before the final project.",
      deliverable:
        "First upload the design you submitted for Milestone 2, as a PDF or DOCX, so that it can be shared with your reviewers. Then complete two reviews: a score for each criterion and a comment of at least three sentences for each design.",
      dueLabel: "Due 27 Jan 2027",
      requiredReviews: 2,
      acceptedTypes: [".pdf", ".docx"],
      overallCommentPrompt: "Which single change would most improve your peer's design before the final project?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Check the network zones",
          maxPoints: 6,
          options: [
            { points: 6, label: "Zones separate guests, payments and clinical systems, and the allowed flows are stated" },
            { points: 4, label: "Zones are sensible; some flows between them are not stated" },
            { points: 2, label: "A diagram is present, but the network is still effectively flat" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Check the access model",
          maxPoints: 6,
          options: [
            { points: 6, label: "Roles follow real jobs, and the contractor's administrator access is contained" },
            { points: 4, label: "Roles are clear; privileged access is not addressed" },
            { points: 2, label: "Access is listed person by person, without roles" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Trace the design to the risks",
          maxPoints: 4,
          options: [
            { points: 4, label: "Every design choice names the risk it answers" },
            { points: 2, label: "Some choices are traced; others stand alone" },
            { points: 0, label: "No reference to the risk register" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Judge whether the practice could run it",
          maxPoints: 4,
          options: [
            { points: 4, label: "The owner could follow it, and the staff in the case file could operate it" },
            { points: 2, label: "A sound design that needs skills or hours the practice does not have" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
  activities,
};
