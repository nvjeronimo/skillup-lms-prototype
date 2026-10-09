import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Security Foundations and the Threat Landscape": six readings, three
 * practice quizzes, the graded quiz of Module 1 and the written assignment. The transcripts
 * of the seven videos that have one are in the outline. Fernhill Bakery is a business made
 * up for the course.
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
    "sec1-m1-t2": {
      lede: "Almost every security decision protects one of three properties of information: that only the right people can see it, that it is correct, and that it is there when it is needed. Together they are known as the CIA triad.",
      sections: [
        {
          heading: "Confidentiality: only the right people can see it",
          paragraphs: [
            "Confidentiality is lost when information reaches someone who should not have it. That can be a criminal copying a customer database, and it can equally be a payslip left on a shared printer or a spreadsheet emailed to the wrong address.",
            "The controls that protect it decide who may read: access permissions, encryption of data on disks and in transit, and classification labels that tell staff how a document may be shared.",
          ],
        },
        {
          heading: "Integrity: it is correct, and changes are authorised",
          paragraphs: [
            "Integrity means that information is accurate and has been changed only by people and processes allowed to change it. A recipe database in which an allergen flag has been cleared by mistake is an integrity failure, and nobody has to have attacked anything for it to happen.",
            "The controls here limit who may write and make changes visible: edit permissions, approval steps, version history, checksums that show whether a file has changed, and logs that record who changed what.",
          ],
        },
        {
          heading: "Availability: it is there when it is needed",
          paragraphs: [
            "Availability is lost when people cannot reach the information or the system they need, for any reason: ransomware, a failed disk, a power cut, an expired subscription. If Fernhill Bakery cannot open its order system on a Saturday morning, the cause matters less to the customers than the closed till.",
            "The controls are backups that have been tested, spare capacity, maintenance done on time, and a written plan for working without the system for a day.",
          ],
        },
        {
          heading: "Using the triad to ask better questions",
          paragraphs: [
            "The three properties sometimes pull against each other. Encrypting everything protects confidentiality, and a lost key then destroys availability. Giving everyone edit rights keeps work moving, and integrity suffers. A good control improves one property without quietly removing another.",
            "For any asset, ask the three questions in turn. Who must not see this? What would happen if it were wrong? How long could we manage without it? The answers differ by asset, and they tell you where to spend effort. A public price list needs integrity and availability, and no confidentiality at all.",
          ],
        },
      ],
      pullQuote: {
        text: "Ask of every asset: who must not see it, what if it were wrong, and how long could we manage without it?",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Confidentiality is about who can read, integrity about who can change, availability about being able to reach it.",
        "Each property can be lost by accident as well as by attack.",
        "Different assets need the three in different measure.",
        "Check that a control for one property does not weaken another.",
      ],
    },
    "sec1-m1-t7": {
      lede: "No control works every time. Two design principles accept that fact and plan for it: defence in depth puts a second control behind the first, and least privilege limits what is lost when both fail.",
      sections: [
        {
          heading: "Layers that fail differently",
          paragraphs: [
            "Defence in depth means that an asset is protected by several controls, so that one failure does not expose it. The layers are usually described from the outside in: the people, the network, the device, the application, the account and the data itself.",
            "The layers must be of different kinds. Two spam filters from two vendors fail in much the same way. A spam filter, a member of staff who knows how to report a suspicious message, and a sign-in that needs a second factor fail for three unrelated reasons, and it is unlikely that all three fail on the same day.",
          ],
        },
        {
          heading: "A worked example",
          paragraphs: [
            "Take the customer order records at Fernhill Bakery. A phishing email has to pass the mail filter. The person reading it has to enter a password on a fake page. The stolen password then has to get past multi-factor authentication. The account, once in, can only reach what its role allows. And an alert on a sign-in from a new device tells the owner that something is wrong.",
            "None of these layers is strong enough to be relied on alone. Together they mean that an attacker needs several things to go right, and the bakery needs only one of them to go wrong for the attacker.",
          ],
        },
        {
          heading: "Least privilege: limit what one account can do",
          paragraphs: [
            "Least privilege gives every person, and every piece of software, only the access the task needs, for as long as the task lasts. The Saturday counter assistant can take orders. They cannot export the customer list or change supplier bank details.",
            "The principle matters most on the day an account is stolen or a mistake is made. The harm is bounded by what that account could reach. This is why administrators keep a separate account for administration, and why “give them the same access as the manager” is a request to refuse.",
          ],
        },
        {
          heading: "Keeping both principles alive",
          paragraphs: [
            "Access grows by itself. People change roles and keep the old permissions, and temporary access is seldom taken back. A review every few months, in which the owner of each system confirms who still needs what, is the control that keeps least privilege true.",
            "Layers decay too. A control that nobody tests may have stopped working months ago. Pick one layer each quarter and check it: restore a file, send a test alert, try to sign in without the second factor.",
          ],
        },
      ],
      pullQuote: {
        text: "Plan for the day a control fails, because it will be an ordinary day.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Use several layers of different kinds, so that they do not fail together.",
        "Give each account only the access its task needs, and only for as long as it needs it.",
        "Administration is done from a separate account.",
        "Review access and test one layer on a regular schedule.",
      ],
    },
    "sec1-m2-t2": {
      lede: "An intrusion is rarely a single event. It is a sequence of steps that can take days or weeks, and each step is a chance for a defender to notice and interrupt it. This reading walks through the usual stages and names the controls that act at each one.",
      sections: [
        {
          heading: "Before entry: looking and getting in",
          paragraphs: [
            "Most intrusions begin with reconnaissance. The attacker learns what the organisation exposes: its website, its staff names and email format, the remote access services visible from the internet. Much of this is automated and aimed at thousands of organisations at once. The defence is to know your own exposure first: keep a list of what faces the internet and remove what does not need to.",
            "Initial access is the first foothold. For small organisations three routes account for most cases: a stolen or guessed password, a phishing message, and an internet-facing system that has not been patched. Multi-factor authentication, staff who report suspicious messages and prompt patching each close one of these doors.",
          ],
        },
        {
          heading: "Inside: staying and spreading",
          paragraphs: [
            "Once in, the attacker tries to keep access even if the first route is closed. This is called persistence, and typical signs are a new account, a mail forwarding rule or a newly installed remote access tool. Alerts on new accounts and new rules are cheap and catch a great deal.",
            "Next comes privilege escalation and lateral movement: gaining more rights, and moving from the first device to more valuable ones. Least privilege, separate administrator accounts and a network divided into zones all slow this stage. It is often the longest, and so it gives detection the most time to work.",
          ],
        },
        {
          heading: "The objective",
          paragraphs: [
            "Finally the attacker does what they came for. That may be copying data out, encrypting files for ransom, or redirecting a payment. By this point prevention has failed, and what limits the harm is detective and corrective: alerts on unusual data transfers, backups the attacker cannot reach, and a rehearsed response.",
            "The time between entry and objective is called dwell time. Shortening it is one of the most useful goals a security team can set, because every stage an intruder does not reach is harm that does not happen.",
          ],
        },
        {
          heading: "Why defenders study the sequence",
          paragraphs: [
            "The attacker has to succeed at every stage. The defender has to break the chain only once. Mapping your controls to the stages shows where you have several and where you have none.",
            "Many small organisations find the same picture: plenty at the entrance, and almost nothing that would notice an intruder who is already inside. That gap is usually cheaper to close than it looks, and you will look for it when you map threats to the assets of Fernhill Bakery.",
          ],
        },
      ],
      pullQuote: {
        text: "The attacker has to succeed at every stage. The defender has to break the chain only once.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "An intrusion moves through stages: reconnaissance, initial access, persistence, escalation and movement, then the objective.",
        "Stolen passwords, phishing and unpatched internet-facing systems are the common ways in.",
        "New accounts, new forwarding rules and unusual sign-ins are early signs of an intruder inside.",
        "Map your controls to the stages to find the stage with none.",
      ],
    },
    "sec1-m3-t2": {
      lede: "A phishing message tries to make you click a link, open a file, send money or reveal a password. No single sign proves that a message is false, but seven signals, taken together, catch most of them.",
      sections: [
        {
          heading: "Signals in who it is from",
          paragraphs: [
            "One: the sender's address does not match the name shown. The display name says “Accounts Team” and the address behind it is a personal mailbox or a domain you have never dealt with.",
            "Two: the domain is a near miss of a real one, with a swapped letter, an added word or a different ending. Three: the message is unexpected. You have no order, no ticket and no conversation that this would be a reply to.",
          ],
        },
        {
          heading: "Signals in what it asks",
          paragraphs: [
            "Four: pressure. A deadline in hours, a threat that an account will be closed, or a request to keep the matter quiet. Five: the request is for something that is never properly asked for by email, such as a password, a sign-in code, gift cards or a change of bank details.",
            "These two signals matter more than spelling or layout. Well-written phishing is now common, and a message with perfect grammar and the right logo can still be false. Judge the request, not the polish.",
          ],
        },
        {
          heading: "Signals in where it leads",
          paragraphs: [
            "Six: the link goes somewhere other than it claims. On a computer, rest the pointer on the link without clicking and read the address that appears. On a phone, press and hold. What counts is the part just before the first single slash: that is the real site.",
            "Seven: an attachment you did not ask for, especially one that wants you to enable something, enter a password to view it or sign in again. An invoice does not need your email password.",
          ],
        },
        {
          heading: "What to do with a suspicious message",
          paragraphs: [
            "Do not use anything inside the message to check it. Do not reply, do not call the number in the signature, do not follow the link “to verify”. Reach the sender by a route you already have: the supplier's number in your records, or the website you type in yourself.",
            "Then report it in the way your organisation asks, even if you are not sure, and even if you have already clicked. A report made in the first few minutes lets the message be removed from other mailboxes, and lets a password be changed before it is used.",
          ],
        },
      ],
      pullQuote: {
        text: "Judge the request, not the polish.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Check the sender's real address and domain, and whether you expected the message.",
        "Pressure, and requests for passwords, codes or payment changes, are the strongest signals.",
        "Read where a link really leads before you follow it.",
        "Verify by a route you already trust, and report the message even after a click.",
      ],
    },
    "sec1-m3-t7": {
      lede: "Multi-factor authentication asks for a second proof besides the password, so that a stolen password is not enough to sign in. The methods differ a good deal in how well they resist the two common attacks: intercepting the second proof, and tricking the user into handing it over.",
      sections: [
        {
          heading: "Codes by text message or voice call",
          paragraphs: [
            "A code sent to a phone number is the easiest method to roll out, since everyone has a phone and nothing needs installing. It stops the most common attack, in which a criminal tries passwords leaked from another site.",
            "Its weaknesses are the phone network and the user. A number can be moved to another SIM card by deceiving the mobile operator, and a code can be read out to a caller who claims to be from support. Use it where nothing better is available, and never for administrator accounts.",
          ],
        },
        {
          heading: "Authenticator apps",
          paragraphs: [
            "An authenticator app produces a new six-digit code every thirty seconds from a secret stored on the phone. Nothing travels over the phone network, so the code cannot be intercepted on the way, and the method works with no signal.",
            "The remaining weakness is that the code can still be typed into a fake page, which passes it on at once. Staff need to know that a code is as secret as a password, and that nobody from support will ever ask for it.",
          ],
        },
        {
          heading: "Approval prompts",
          paragraphs: [
            "A push prompt asks the user to approve the sign-in on their phone. It is quick, and that is also its weakness: a user who receives prompt after prompt may approve one to make them stop.",
            "The fix is number matching. The sign-in page shows a two-digit number that the user must enter in the app, so a prompt cannot be approved by someone who is not looking at the real sign-in. Turn it on wherever the service offers it, and teach one rule: a prompt you did not start means that someone has your password. Deny it and report it.",
          ],
        },
        {
          heading: "Security keys and passkeys",
          paragraphs: [
            "A hardware security key, or a passkey held on a phone or a laptop, proves possession with cryptography and checks the address of the site before it answers. A look-alike page receives nothing it can reuse. These are the methods described as phishing-resistant.",
            "They cost more to introduce: keys must be bought, spares issued and a recovery process agreed. A sensible order for a small organisation is to switch on some form of multi-factor authentication for every account this month, then move the accounts with the most power to phishing-resistant methods: administrators, finance and the owner.",
          ],
        },
      ],
      pullQuote: {
        text: "Any second factor is far better than none. The best ones cannot be handed to a fake page.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Text message codes stop password reuse attacks but can be intercepted or read out to a caller.",
        "App codes avoid the phone network, yet can still be typed into a fake page.",
        "Use number matching with approval prompts, and deny any prompt you did not start.",
        "Move administrator and finance accounts to security keys or passkeys first.",
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
    "sec1-m1-t9": [
      {
        question: "Ransomware encrypts the shared drive of a small firm. The firm restores yesterday's files from a backup. Which type of control is the restore?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A corrective control acts after an event to limit the damage and return to normal. The backup did not stop the ransomware and did not announce it. It made recovery possible.",
        reviewTopicId: "sec1-m1-t6",
        reviewTopicTitle: "Preventive, detective and corrective controls",
        options: [
          { id: "a", label: "Preventive", feedback: "A preventive control would have stopped the ransomware from running." },
          { id: "b", label: "Detective", feedback: "A detective control reports the event. It does not bring the files back." },
          { id: "c", label: "Corrective", correct: true, feedback: "Correct. The restore repairs the damage after the event." },
          { id: "d", label: "Physical", feedback: "Physical describes what a control is made of, such as a lock. It is not one of the three types by timing." },
        ],
      },
      {
        question: "The online order form of Fernhill Bakery is offline all Saturday morning because a subscription was not renewed. Which security property was lost?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Availability means that a system or its information can be reached when it is needed. It can be lost through an administrative slip as easily as through an attack.",
        reviewTopicId: "sec1-m1-t2",
        reviewTopicTitle: "Confidentiality, integrity and availability",
        options: [
          { id: "a", label: "Confidentiality", feedback: "Nobody saw anything they should not have seen." },
          { id: "b", label: "Integrity", feedback: "No order was altered. The form could not be reached at all." },
          { id: "c", label: "Availability", correct: true, feedback: "Correct. Customers could not reach the service when they needed it." },
          { id: "d", label: "None: it was not a security matter", feedback: "Availability is a security property whatever the cause of the outage." },
        ],
      },
      {
        question: "A temporary assistant, hired for two weeks to take telephone orders, is given a copy of the manager's permissions “to save time”. Which principle does this ignore?",
        explanation:
          "Least privilege gives an account only what its task needs, for as long as the task lasts. Copying a senior person's permissions hands over access to payroll, suppliers and settings that taking orders never requires.",
        reviewTopicId: "sec1-m1-t7",
        reviewTopicTitle: "Defence in depth and least privilege",
        options: [
          { id: "a", label: "Defence in depth", feedback: "Defence in depth is about layering controls. The problem here is the size of one account's access." },
          { id: "b", label: "Least privilege", correct: true, feedback: "Correct. The account can reach far more than the task needs." },
          { id: "c", label: "Availability", feedback: "The assistant can work. The access is too wide, not too narrow." },
          { id: "d", label: "Risk transfer", feedback: "Transfer is a way to treat a risk, for example through insurance." },
        ],
      },
      {
        question: "The owner decides that a week of lost trading after a fire would be too costly to bear alone, and buys insurance that covers it. Which risk treatment is this?",
        explanation:
          "Transfer moves part of the financial consequence to another party. The risk has not gone away: the fire is as likely as before, and the owner still needs the controls the policy requires.",
        reviewTopicId: "sec1-m1-t4",
        reviewTopicTitle: "Likelihood, impact and the risk register",
        options: [
          { id: "a", label: "Reduce", feedback: "Reducing would mean a control that makes the fire less likely or less damaging, such as alarms or an off-site backup." },
          { id: "b", label: "Avoid", feedback: "Avoiding would mean stopping the activity that creates the risk." },
          { id: "c", label: "Transfer", correct: true, feedback: "Correct. The insurer carries part of the financial impact." },
          { id: "d", label: "Accept", feedback: "Accepting would mean recording the risk and carrying the whole cost if it happens." },
        ],
      },
    ],
    "sec1-m2-t5": [
      {
        question: "A twelve-person business has a remote access service open to the internet with a weak password. Which threat actor is most likely to find and use it?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Think about who searches the whole internet for easy openings, not who would choose this business by name.",
          "The motive is money, and the victim is whoever turns up in the search.",
        ],
        explanation:
          "Financially motivated criminals scan very large numbers of addresses for exposed, weakly protected services. A small business is rarely chosen. It is found.",
        reviewTopicId: "sec1-m2-t1",
        reviewTopicTitle: "Threat actors and their motives",
        options: [
          { id: "a", label: "A state-backed group seeking intelligence", feedback: "Such groups pick targets for what they hold. A small business is seldom one of them." },
          {
            id: "b",
            label: "A financially motivated criminal who found it by automated scanning",
            correct: true,
            feedback: "Correct. Easy access is the selection criterion.",
          },
          { id: "c", label: "A hacktivist protesting against the business", feedback: "Hacktivists choose targets linked to a cause." },
          { id: "d", label: "Nobody: the business is too small to matter", feedback: "Size does not hide an exposed service from an automated search." },
        ],
      },
      {
        question: "A member of staff installs a free “invoice viewer” from a link in an email. It works, and it also gives a stranger remote control of the computer. What kind of malware is it?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A trojan presents itself as something useful so that the user installs it. What it does afterwards, here remote control, is a separate matter from how it arrived.",
        reviewTopicId: "sec1-m2-t3",
        reviewTopicTitle: "Malware families: what each one does",
        options: [
          { id: "a", label: "A worm", feedback: "A worm spreads across a network by itself, with no user action." },
          { id: "b", label: "A trojan", correct: true, feedback: "Correct. It was installed by the user because it looked useful." },
          { id: "c", label: "A cryptominer", feedback: "A cryptominer uses the processor to earn currency. It does not give remote control." },
          { id: "d", label: "A virus", feedback: "A virus attaches itself to other files and spreads when they are opened." },
        ],
      },
      {
        question: "An intruder has signed in with a stolen password. Which of these is an early sign that they are trying to keep their access?",
        explanation:
          "Persistence is the stage in which an intruder makes sure they can return. A forwarding rule keeps copies of mail flowing to them even after the password is changed, which is why an alert on new rules is so useful.",
        reviewTopicId: "sec1-m2-t2",
        reviewTopicTitle: "How an intrusion unfolds, stage by stage",
        options: [
          { id: "a", label: "The website receives more visitors than usual", feedback: "Visitor numbers say nothing about an account that is already compromised." },
          {
            id: "b",
            label: "A new rule forwards the account's incoming mail to an outside address",
            correct: true,
            feedback: "Correct. The rule survives a password change unless someone removes it.",
          },
          { id: "c", label: "A laptop installs its monthly updates", feedback: "That is normal maintenance." },
          { id: "d", label: "A member of staff forgets their password once", feedback: "One forgotten password is routine." },
        ],
      },
      {
        question: "Which control most limits the harm once ransomware has already encrypted a file server?",
        explanation:
          "After encryption, prevention has failed. What decides the outcome is whether clean copies exist that the ransomware could not reach, and whether anyone has practised restoring them.",
        reviewTopicId: "sec1-m2-t4",
        reviewTopicTitle: "Ransomware: why it works and what limits it",
        options: [
          { id: "a", label: "A stronger password policy", feedback: "Useful beforehand. It does not bring the files back." },
          {
            id: "b",
            label: "A tested backup that the server could not reach or change",
            correct: true,
            feedback: "Correct. A backup on the same network is often encrypted with everything else.",
          },
          { id: "c", label: "A notice on the staff board", feedback: "Awareness helps before the event, not after it." },
          { id: "d", label: "A faster internet connection", feedback: "Speed has no bearing on recovery." },
        ],
      },
    ],
    "sec1-m3-t5": [
      {
        question: "A message that appears to come from the owner says: “I am in a meeting. Pay this supplier within the hour and do not call me.” Which two levers of social engineering does it use?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Who does the message claim to be from?",
          "What does the one-hour deadline do to the reader?",
        ],
        explanation:
          "The sender borrows the owner's authority so that the request is not questioned, and adds a deadline so that there is no time to check. The instruction not to call removes the one step that would expose it.",
        reviewTopicId: "sec1-m3-t1",
        reviewTopicTitle: "Why social engineering works",
        options: [
          { id: "a", label: "Authority and urgency", correct: true, feedback: "Correct. A senior name and a short deadline, together." },
          { id: "b", label: "Curiosity and reward", feedback: "Nothing is offered to the reader." },
          { id: "c", label: "Familiarity and humour", feedback: "The message relies on rank and time pressure." },
          { id: "d", label: "None: it is an ordinary request", feedback: "A payment request that forbids verification is never ordinary." },
        ],
      },
      {
        question: "An email from a regular supplier says that its bank details have changed and gives a new account number. What is the right next step?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A change of payment details is confirmed through a second channel that the message did not supply. A reply, or a call to a number in the email, reaches whoever sent it.",
        reviewTopicId: "sec1-m3-t3",
        reviewTopicTitle: "Pretexting, vishing and business email compromise",
        options: [
          { id: "a", label: "Reply to the email and ask whether it is genuine", feedback: "If the mailbox is compromised or imitated, the reply goes to the criminal." },
          { id: "b", label: "Call the number in the email's signature", feedback: "The signature is part of the message you are trying to verify." },
          {
            id: "c",
            label: "Call the supplier on the number already held in your records",
            correct: true,
            feedback: "Correct. Verify by a route you trusted before the message arrived.",
          },
          { id: "d", label: "Update the details, since the email looks professional", feedback: "A professional look proves nothing about the sender." },
        ],
      },
      {
        question: "Which of these is the strongest signal that a message is phishing?",
        explanation:
          "Layout, grammar and logos are easy to copy. Where a link really leads is much harder to disguise, and a sign-in link that goes to a different site has no innocent explanation.",
        reviewTopicId: "sec1-m3-t2",
        reviewTopicTitle: "Recognising phishing: seven signals",
        options: [
          { id: "a", label: "It contains a spelling mistake", feedback: "Genuine messages contain mistakes, and many false ones contain none." },
          {
            id: "b",
            label: "Its sign-in link leads to an address that is not the service's own",
            correct: true,
            feedback: "Correct. Read the real address before you follow a link.",
          },
          { id: "c", label: "It arrived outside office hours", feedback: "Timing alone tells you very little." },
          { id: "d", label: "It uses the company logo", feedback: "A logo can be copied in seconds." },
        ],
      },
      {
        question: "A colleague realises that five minutes ago they entered their password on a page that was not the real sign-in. What should they do first?",
        explanation:
          "Speed matters more than certainty. An early report lets the password be changed and the sessions ended before the account is used, and lets the same message be removed from other mailboxes.",
        reviewTopicId: "sec1-m3-t9",
        reviewTopicTitle: "Building a reporting culture",
        options: [
          { id: "a", label: "Wait and see whether anything unusual happens", feedback: "Waiting gives the criminal the time they need." },
          { id: "b", label: "Delete the email so that nobody finds out", feedback: "The message is evidence, and others may have received it." },
          {
            id: "c",
            label: "Report it at once and change the password",
            correct: true,
            feedback: "Correct. A report in the first minutes limits the harm for everyone.",
          },
          { id: "d", label: "Run a virus scan and carry on", feedback: "A scan does not help with a password that has been given away." },
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
