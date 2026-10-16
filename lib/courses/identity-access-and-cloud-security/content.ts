import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

/**
 * Topic bodies of "Identity, Access and Cloud Security": six readings, three practice
 * quizzes, the graded quiz of Module 1 and the written assignment. The transcripts of the
 * seven videos that have one are in the outline. Quillhaven Publishing is a company made up
 * for the course.
 */
export const content: CourseContent = {
  byline: {
    author: "Dr. Amara Okafor",
    role: "Lead instructor · Identity, Access and Cloud Security",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "A company uses a SaaS application for its customer records. Under the shared responsibility model, who decides which accounts can see those records?",
      platformPrompt: "Choose the correct option",
      explanation:
        "The provider secures the service it runs. The customer remains responsible for its own data, its accounts and the access it grants, in every service model.",
      options: [
        { id: "a", label: "The SaaS provider", feedback: "The provider runs the application. It does not know who in your company should see what." },
        { id: "b", label: "The customer", correct: true, feedback: "Correct. Accounts, access and data stay with the customer." },
        { id: "c", label: "The internet service provider", feedback: "The connection carries the traffic. It has no part in the application's access." },
        { id: "d", label: "Nobody: SaaS access is open by design", feedback: "Access is configurable, and configuring it is the customer's job." },
      ],
    },
    {
      question: "What is the purpose of a periodic access review?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Access tends to accumulate as people change roles and projects end. A review asks the owner of each system to confirm, or remove, what each account holds.",
      options: [
        { id: "a", label: "To reset every password", feedback: "A review looks at what accounts can do, not at their passwords." },
        {
          id: "b",
          label: "To confirm that each account still needs the access it has",
          correct: true,
          feedback: "Correct. Whatever is no longer needed is removed.",
        },
        { id: "c", label: "To add access before people ask for it", feedback: "That would work against least privilege." },
        { id: "d", label: "To count the licences in use", feedback: "A licence count may fall out of the review, but it is not the purpose." },
      ],
    },
    {
      question: "An employee moves from the finance team to the sales team. What should happen to their finance access?",
      explanation:
        "A move is two changes: access for the new role is added, and access for the old role is taken away. Skipping the second half is how people end up with access from every job they have held.",
      options: [
        { id: "a", label: "It stays, in case they need to help their old team", feedback: "Access kept just in case is the main source of excess privilege." },
        { id: "b", label: "It is removed as part of the move", correct: true, feedback: "Correct. The mover process removes the old role and adds the new one." },
        { id: "c", label: "It is removed at the next annual review", feedback: "That leaves months of access with no reason behind it." },
        { id: "d", label: "It is shared with their replacement", feedback: "Access is granted to a person's own account, never passed on." },
      ],
    },
  ],
  articles: {
    "sec3-m1-t4": {
      lede: "Most account takeovers start with a person typing a secret into the wrong page. Phishing-resistant sign-in removes the secret that can be typed, so the wrong page has nothing to collect.",
      sections: [
        {
          heading: "Why codes are not enough",
          paragraphs: [
            "A one-time code proves that the person holds a device at that moment. It does not prove where the code is being typed. A convincing copy of a sign-in page can ask for the password and the code, and pass both to the real site within seconds.",
            "Approval prompts have the same weakness in another form: the user is asked to approve a sign-in they did not start, and some will. Number matching and showing the location of the sign-in reduce this and are worth turning on, but the user still makes the decision.",
          ],
        },
        {
          heading: "What passkeys and security keys do differently",
          paragraphs: [
            "A passkey or a hardware security key holds a private key that never leaves the device. At sign-in the site sends a challenge, and the device signs it only if the request comes from the address the key was registered for. A look-alike address gets no signature.",
            "The user unlocks the key with a fingerprint, a face or a PIN, which stays on the device. Nothing that can be reused crosses the network, and there is no code to read out to a caller.",
          ],
        },
        {
          heading: "Rolling it out in a small organisation",
          paragraphs: [
            "Start with the accounts that can do the most damage: the administrators of the email system, the identity provider and the finance tools. Give each of them two keys, one to carry and one stored safely, so that a lost key does not lock them out.",
            "Then plan recovery before anyone needs it. A reset process that hands a new sign-in method to whoever phones the help desk undoes the whole design. Decide how identity is checked before a reset, and write it down.",
          ],
        },
      ],
      pullQuote: {
        text: "The safest secret is the one the user never has to type.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "One-time codes and approval prompts can be relayed, or approved by mistake.",
        "Passkeys and security keys sign only for the real address of the site.",
        "Protect administrator accounts first, with a spare key for each.",
        "Design account recovery as carefully as sign-in.",
      ],
    },
    "sec3-m1-t2": {
      lede: "Three words describe what happens between a person arriving at a system and that person opening a file: identification, authentication and authorisation. They are separate steps, and a failure in each one looks different.",
      sections: [
        {
          heading: "Identification: a claim",
          paragraphs: [
            "Identification is saying who you are. A username, an email address or a staff number is a claim, and it is not a secret. Anyone can type someone else's email address into a sign-in page.",
            "A good identifier is unique and belongs to one person. Shared identifiers such as “reception” or “admin” break everything that follows, because the system can no longer tell which human acted.",
          ],
        },
        {
          heading: "Authentication: proof of the claim",
          paragraphs: [
            "Authentication is the evidence that the claim is true: a password, a code from a device, a fingerprint, a security key. Its strength depends on how hard that evidence is to steal or to copy.",
            "The result of authentication is usually a session. The system gives the browser a token so that the user does not have to prove themselves on every click. That token is as valuable as the password until it expires, which is why signing out and short session lifetimes matter on shared computers.",
          ],
        },
        {
          heading: "Authorisation: what this identity may do",
          paragraphs: [
            "Authorisation is the decision about what an authenticated identity is allowed to do. It is checked on each request: may this account read this folder, approve this payment, delete this user?",
            "Strong authentication does not repair weak authorisation. An intern at Quillhaven Publishing who signs in with a security key and can then open every author contract in the company has been authenticated very well and authorised very badly.",
          ],
        },
        {
          heading: "Accounting: the record of what was done",
          paragraphs: [
            "A fourth step is often added: accounting, or audit. The system records which identity did what, and when. The record is only useful if the first three steps are sound, since a log entry for a shared account names nobody.",
            "When something goes wrong, the questions come in the same order. Whose account was it? How did they prove it? Should that account have been able to do this? Where is the record? Keeping the four steps apart tells you which one to fix.",
          ],
        },
      ],
      pullQuote: {
        text: "Authentication tells you who is at the door. Authorisation decides which rooms they may enter.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Identification is a claim, authentication proves it, authorisation decides what it may do.",
        "One identifier per person: shared accounts make the audit record meaningless.",
        "A session token is as valuable as the password while it lasts.",
        "Strong sign-in does not make up for access that is too wide.",
      ],
    },
    "sec3-m1-t7": {
      lede: "A directory is the organisation's list of who exists: every person, group, device and service that can sign in. If the list is accurate, access can be managed. If it is not, nothing built on top of it can be trusted.",
      sections: [
        {
          heading: "What a directory holds",
          paragraphs: [
            "Each entry in a directory is an account with attributes: name, department, manager, job title, whether the account is enabled. Groups collect accounts so that access can be given to “Editorial” once, and not to nineteen people one at a time.",
            "The directory is the source that other systems consult. With single sign-on, an application asks the directory who the user is and which groups they are in. One accurate directory is therefore worth more than careful settings in fifteen separate applications.",
          ],
        },
        {
          heading: "The lifecycle of an identity",
          paragraphs: [
            "An identity has a life. It is created when a person joins, changed when their role changes, suspended during a long absence and removed when they leave. Each of these moments is a point at which access is either corrected or left to drift.",
            "The reliable way to run the lifecycle is to connect it to the record that already knows about these moments, which is usually the HR system or, in a small company, the person who does payroll. A new starter in that record creates the account. An end date disables it.",
          ],
        },
        {
          heading: "Where it goes wrong",
          paragraphs: [
            "Three kinds of account cause most of the trouble. Orphaned accounts belong to people who have left. Dormant accounts have not signed in for months. Duplicate accounts give one person two identities with different permissions.",
            "All three are found the same way: compare the directory with the current staff list, and list the accounts with no sign-in in ninety days. At Quillhaven Publishing, a first comparison of this kind found accounts for two former freelancers and a test account that nobody could explain.",
          ],
        },
        {
          heading: "Good practice for a small organisation",
          paragraphs: [
            "Give every person exactly one everyday account, named in a consistent way. Give access through groups, never to individuals directly, so that changing someone's role means changing their group membership.",
            "Disable an account on the person's last day and delete it after a set period, once files and mail have been handed over. Record who asked for each account and who approved it. These habits take minutes, and they are what an auditor or an insurer will ask to see.",
          ],
        },
      ],
      pullQuote: {
        text: "You cannot control the access of accounts you do not know you have.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "The directory is the single list of identities that other systems rely on.",
        "Tie account creation and removal to the record that knows when people join and leave.",
        "Look for orphaned, dormant and duplicate accounts on a schedule.",
        "Grant access to groups, and keep one everyday account per person.",
      ],
    },
    "sec3-m2-t2": {
      lede: "An access control model is the method an organisation uses to decide who can do what. Two models cover most of what you will meet: access by role, and access by attributes. Most organisations end up using both.",
      sections: [
        {
          heading: "Role-based access control",
          paragraphs: [
            "In role-based access control, or RBAC, permissions are attached to roles and people are assigned to roles. An “Editor” role may read and edit manuscripts. A “Finance” role may see royalty statements. Nobody is given a permission as an individual.",
            "Its strength is that it can be read. A manager can look at a list of roles and understand who can do what, and a new starter gets the right access by being given the right role. Reviews are simple, because the question is only whether each person still belongs in each role.",
          ],
        },
        {
          heading: "Where roles strain",
          paragraphs: [
            "Roles work until exceptions pile up. An editor who should see only one imprint, a contractor who should have access only until June, a finance clerk who may approve payments only up to a limit. If each exception becomes a new role, the company soon has more roles than people. This is known as role explosion.",
            "The opposite failure is the role that is too broad: one “Staff” role with access to almost everything, because defining narrower ones seemed like too much work.",
          ],
        },
        {
          heading: "Attribute-based access control",
          paragraphs: [
            "Attribute-based access control, or ABAC, decides each request from attributes of the user, of the resource and of the situation. A rule might say that a user may open a manuscript if their imprint matches the manuscript's imprint, their contract has not ended, and they are on a managed device.",
            "One such rule replaces dozens of roles, and it adapts by itself when an attribute changes. The price is that the rules are harder to read and to test, and they are only as good as the attributes. If the “imprint” field in the directory is wrong, the access is wrong.",
          ],
        },
        {
          heading: "Choosing for a small organisation",
          paragraphs: [
            "Start with a handful of roles drawn from real jobs, between five and eight for a company the size of Quillhaven Publishing. Write down for each role what it can reach and why.",
            "Then add a few attribute conditions where they earn their place: an end date for contractors, a managed device for sensitive systems, multi-factor authentication for anything administrative. Whatever the model, apply it through groups in the directory, so that there is one place to look and one place to change.",
          ],
        },
      ],
      pullQuote: {
        text: "A role should describe a job, not a person.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "RBAC attaches permissions to roles. It is easy to read and to review.",
        "Too many exceptions cause role explosion. One broad role defeats least privilege.",
        "ABAC decides from attributes and conditions. It is flexible but harder to test.",
        "Begin with five to eight roles and add a few conditions where they matter.",
      ],
    },
    "sec3-m3-t2": {
      lede: "When an organisation moves to the cloud, security does not move with it as a whole. The provider takes over some duties and the customer keeps others. The shared responsibility model is the name for where that line falls, and most cloud incidents happen on the customer's side of it.",
      sections: [
        {
          heading: "What the provider secures",
          paragraphs: [
            "The provider is responsible for the security of the cloud: the buildings, the hardware, the network between its data centres and the software that keeps one customer apart from another. You cannot inspect these yourself, so you rely on the provider's independent audit reports and certifications.",
            "How much more the provider does depends on the service model. In IaaS it stops at the virtual machine. In PaaS it also runs the operating system and the runtime. In SaaS it runs the whole application.",
          ],
        },
        {
          heading: "What always stays with the customer",
          paragraphs: [
            "The customer is responsible for security in the cloud. Whatever the model, four things stay with you: your data, your accounts and how they sign in, the access you grant, and the settings you choose.",
            "A file-sharing service will store documents safely and will also, if you tell it to, publish a folder of author contracts to anyone with the link. The service worked as designed. The exposure is a customer setting.",
          ],
        },
        {
          heading: "The line moves with the model",
          paragraphs: [
            "With a virtual machine, patching the operating system is your job, and so are its firewall rules and what is installed on it. With a managed database you no longer patch, but you still decide which networks may connect, who has an account and whether backups are kept.",
            "With SaaS, the list shrinks to identity, sharing, the third-party applications you connect and the logs you switch on. It is shorter, and for a company like Quillhaven Publishing it is nearly the whole of its security work.",
          ],
        },
        {
          heading: "Making the split explicit",
          paragraphs: [
            "For each service, write a short table with three columns: the duty, who holds it, and who inside the company does it. Patching, backup, access review, log review and incident contact are a reasonable set of rows to begin with.",
            "Pay attention to rows where the honest answer is “we assumed the provider did that”. Backup is the usual one: many SaaS services protect against their own failures, and not against a customer who deletes the wrong folder. Read the provider's responsibility document. Do not rely on the sales page.",
          ],
        },
      ],
      pullQuote: {
        text: "The provider secures the service. You secure how you use it.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "The provider is responsible for the cloud itself, the customer for what they put and configure in it.",
        "Data, accounts, access and settings stay with the customer in every model.",
        "The higher the service model, the shorter the customer's list, but it is never empty.",
        "Write down who holds each duty, and check the ones you assumed.",
      ],
    },
    "sec3-m3-t4": {
      lede: "Most cloud exposures are caused by a setting, not by a flaw in the provider's software. The same few misconfigurations appear again and again, and each one has a known fix that costs little.",
      sections: [
        {
          heading: "Storage and links open to the public",
          paragraphs: [
            "Storage locations and shared folders can be made readable by anyone on the internet, sometimes with a single switch. It is done for a quick transfer and then forgotten.",
            "The fix is a guardrail and a habit. Turn on the account-wide setting that blocks public access, so that an exception has to be made on purpose. For file sharing, make “people in the company” the default for a new link and give outside links an expiry date. Then list what is already public and close what should not be.",
          ],
        },
        {
          heading: "Identities with too much power",
          paragraphs: [
            "The second pattern is over-broad permission: a policy with a wildcard, an everyday account that is also the global administrator, an access key created years ago that never expires and sits in a script.",
            "Fix it by giving administrators a separate account, requiring multi-factor authentication on every human sign-in, replacing long-lived keys with temporary credentials where the service allows it, and rotating the keys that remain. Use the provider's report of unused permissions to trim what is granted.",
          ],
        },
        {
          heading: "Doors left open and logs left off",
          paragraphs: [
            "Management ports for remote administration are often opened to the whole internet for convenience. Automated scans find them within hours. Restrict them to known addresses, or better, reach them through the provider's managed access service or a VPN.",
            "Audit logging is frequently off by default, or kept for too short a time. Without it, nobody can say afterwards what an intruder did. Switch it on for every account and region, send it to a location that ordinary administrators cannot change, and keep it for months.",
          ],
        },
        {
          heading: "Catching drift",
          paragraphs: [
            "Settings do not stay fixed. People make exceptions under pressure, and new services arrive with their own defaults. A configuration that was sound in January may not be in June.",
            "Use the provider's built-in security checks, which compare your account with a published baseline and list the differences. Review the list every month, fix the items of high severity first, and record the exceptions you have chosen to keep, with the reason.",
          ],
        },
      ],
      pullQuote: {
        text: "In the cloud, a breach is more often a setting than a break-in.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Block public access at account level and make internal sharing the default.",
        "Separate administrator accounts, require multi-factor authentication and retire long-lived keys.",
        "Close management ports to the internet and switch audit logging on everywhere.",
        "Check configuration against a baseline every month, because settings drift.",
      ],
    },
  },
  quizzes: {
    "sec3-m1-t5": [
      {
        question: "Which sign-in uses two different authentication factors?",
        platformPrompt: "Choose the correct option",
        hints: [
          "The three kinds are something you know, something you have and something you are.",
          "Two items of the same kind count as one factor.",
        ],
        explanation:
          "A password is something you know; the authenticator app is on a device you have. The other options pair two items of the same kind.",
        reviewTopicId: "sec3-m1-t3",
        reviewTopicTitle: "Authentication factors and how they fail",
        options: [
          { id: "a", label: "A password and a security question", feedback: "Both are things you know." },
          {
            id: "b",
            label: "A password and a code from an authenticator app",
            correct: true,
            feedback: "Correct. Something you know, and something you have.",
          },
          { id: "c", label: "A fingerprint and a face scan", feedback: "Both are things you are." },
          { id: "d", label: "Two different passwords", feedback: "Both are things you know, and both can be stolen the same way." },
        ],
      },
      {
        question: "Why does a passkey resist a fake sign-in page?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The device checks the address of the site before it signs anything. A page at another address receives nothing it could pass on to the real site.",
        reviewTopicId: "sec3-m1-t4",
        reviewTopicTitle: "Phishing-resistant sign-in: passkeys and security keys",
        options: [
          { id: "a", label: "It uses a longer password", feedback: "A passkey is not a password. No secret is typed at all." },
          {
            id: "b",
            label: "It signs only for the site address it was registered with",
            correct: true,
            feedback: "Correct. A look-alike address gets no signature.",
          },
          { id: "c", label: "It sends the code by email instead of by text message", feedback: "No code is sent anywhere." },
          { id: "d", label: "It blocks the user from opening links", feedback: "The user can still open the link. The fake page simply gains nothing." },
        ],
      },
      {
        question: "A user receives an approval prompt on their phone for a sign-in they did not start. What should they do?",
        explanation:
          "An unexpected prompt means that someone else has entered the right password. Denying it stops this attempt; reporting it lets the password be changed and the sign-in log be checked.",
        reviewTopicId: "sec3-m1-t3",
        reviewTopicTitle: "Authentication factors and how they fail",
        options: [
          { id: "a", label: "Approve it, to make the prompts stop", feedback: "That gives the other person access to the account." },
          { id: "b", label: "Ignore it and wait", feedback: "The prompt will time out, but nobody will learn that the password is known to someone else." },
          {
            id: "c",
            label: "Deny it and report it: someone may have their password",
            correct: true,
            feedback: "Correct. The report matters as much as the denial.",
          },
          { id: "d", label: "Turn off multi-factor authentication for a while", feedback: "That would remove the one control that just worked." },
        ],
      },
    ],
    "sec3-m1-t9": [
      {
        question: "A user types their email address into a sign-in page and has not yet entered anything else. Which step has taken place?",
        platformPrompt: "Choose the correct option",
        explanation:
          "An email address is a claim about who you are. It is not secret and proves nothing until the user supplies evidence, which is authentication.",
        reviewTopicId: "sec3-m1-t2",
        reviewTopicTitle: "Identification, authentication and authorisation",
        options: [
          { id: "a", label: "Identification", correct: true, feedback: "Correct. The user has claimed an identity and not yet proved it." },
          { id: "b", label: "Authentication", feedback: "Authentication is the proof, such as a password or a security key." },
          { id: "c", label: "Authorisation", feedback: "Authorisation is decided after the identity is proven." },
          { id: "d", label: "Accounting", feedback: "Accounting is the record of what an identity did." },
        ],
      },
      {
        question: "What is the main security benefit of single sign-on?",
        platformPrompt: "Choose the correct option",
        explanation:
          "With single sign-on, the identity provider is the one place where sign-in rules are enforced and where an account is disabled. The same fact makes that account the one to protect best.",
        reviewTopicId: "sec3-m1-t6",
        reviewTopicTitle: "Single sign-on and federation",
        options: [
          { id: "a", label: "Each application keeps its own copy of the password", feedback: "The opposite: applications never see the password." },
          {
            id: "b",
            label: "Sign-in rules such as multi-factor authentication are set once and apply to every connected application",
            correct: true,
            feedback: "Correct. One place to enforce, and one place to switch an account off.",
          },
          { id: "c", label: "Users no longer need to authenticate", feedback: "They authenticate once, to the identity provider." },
          { id: "d", label: "It removes the need for access reviews", feedback: "Single sign-on proves identity. What each identity may do still needs review." },
        ],
      },
      {
        question: "A comparison of the directory with the staff list finds an enabled account for a freelancer whose contract ended four months ago. What is this account called, and what should happen?",
        explanation:
          "An account whose owner has left is orphaned. It still works for anyone who knows or guesses its password, and nobody would notice its use. Disable it first, then decide what happens to its files.",
        reviewTopicId: "sec3-m1-t7",
        reviewTopicTitle: "Directories and the identity lifecycle",
        options: [
          { id: "a", label: "A service account: leave it running", feedback: "A service account belongs to software. This one belonged to a person." },
          { id: "b", label: "An orphaned account: disable it now", correct: true, feedback: "Correct. Disable on the last day, delete after the handover period." },
          { id: "c", label: "A break-glass account: store its password in the safe", feedback: "A break-glass account is created on purpose for emergencies." },
          { id: "d", label: "A duplicate account: merge it with the manager's", feedback: "It is not a second account of a current member of staff." },
        ],
      },
      {
        question: "Which accounts should be moved to a phishing-resistant sign-in method first?",
        explanation:
          "Order the rollout by what an account could do if it were taken over. Administrator and finance accounts can change settings, read everything or move money, so they come first.",
        reviewTopicId: "sec3-m1-t4",
        reviewTopicTitle: "Phishing-resistant sign-in: passkeys and security keys",
        options: [
          { id: "a", label: "Accounts chosen in alphabetical order", feedback: "The order should follow risk, not names." },
          { id: "b", label: "Accounts that sign in least often", feedback: "Rare use does not make an account powerful." },
          {
            id: "c",
            label: "Administrator and finance accounts",
            correct: true,
            feedback: "Correct. Start where a takeover would do the most harm.",
          },
          { id: "d", label: "Accounts of the newest members of staff", feedback: "New starters matter, but their accounts usually reach the least." },
        ],
      },
    ],
    "sec3-m2-t5": [
      {
        question: "At Quillhaven Publishing, one person can add a new supplier's bank details and also approve the first payment to that supplier. Which principle is missing?",
        platformPrompt: "Choose the correct option",
        hints: [
          "The person may need both permissions for their job. The problem is that nobody else is involved.",
          "Which principle splits a sensitive action between two people?",
        ],
        explanation:
          "Separation of duties splits a sensitive action so that no single person, and no single stolen account, can complete it alone.",
        reviewTopicId: "sec3-m2-t1",
        reviewTopicTitle: "Least privilege and separation of duties",
        options: [
          { id: "a", label: "Separation of duties", correct: true, feedback: "Correct. Entry and approval should sit with two different people." },
          { id: "b", label: "Single sign-on", feedback: "Single sign-on concerns how people authenticate." },
          { id: "c", label: "Encryption at rest", feedback: "Encryption protects stored data. It does not divide a task." },
          { id: "d", label: "Availability", feedback: "The system is available. It allows too much to one person." },
        ],
      },
      {
        question: "The company has created a new role for almost every exception, and now has forty-one roles for thirty people. What is this problem called, and what eases it?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Role explosion happens when each exception becomes a role. A few attribute conditions, such as imprint or contract end date, express the exceptions without multiplying the roles.",
        reviewTopicId: "sec3-m2-t2",
        reviewTopicTitle: "Role-based and attribute-based access control",
        options: [
          { id: "a", label: "Privilege creep, eased by longer passwords", feedback: "Privilege creep is access that builds up over time, and passwords do not address it." },
          {
            id: "b",
            label: "Role explosion, eased by a few attribute-based conditions on a small set of roles",
            correct: true,
            feedback: "Correct. Conditions carry the exceptions, and roles go back to describing jobs.",
          },
          { id: "c", label: "Federation, eased by removing single sign-on", feedback: "Federation is trust between organisations and is unrelated here." },
          { id: "d", label: "Shared responsibility, eased by changing provider", feedback: "That model describes cloud duties, not roles." },
        ],
      },
      {
        question: "Why should an administrator use a separate account for email and browsing?",
        explanation:
          "Email and the web are where phishing and malware arrive. Keeping privilege off the account that faces them means that one bad click does not hand over the whole environment.",
        reviewTopicId: "sec3-m2-t3",
        reviewTopicTitle: "Privileged accounts and how to contain them",
        options: [
          { id: "a", label: "Because licences are cheaper that way", feedback: "Cost is not the reason, and a second account may cost more." },
          {
            id: "b",
            label: "So that a phishing message or a malicious page reaches an account with no administrative rights",
            correct: true,
            feedback: "Correct. The exposed account is the one with the least power.",
          },
          { id: "c", label: "So that the administrator can avoid multi-factor authentication", feedback: "Both accounts use it, and the privileged one uses the strongest method." },
          { id: "d", label: "Because two mailboxes are easier to manage", feedback: "The privileged account should have no mailbox at all." },
        ],
      },
      {
        question: "A designer moves from the production team to marketing. What should the mover process do with their access?",
        explanation:
          "A move is a removal as well as a grant. If only the new access is added, the person keeps both sets, and after a few moves they hold far more than any one job needs.",
        reviewTopicId: "sec3-m2-t4",
        reviewTopicTitle: "Joiners, movers and leavers",
        options: [
          { id: "a", label: "Add marketing access and keep production access in case it is needed", feedback: "This is how access accumulates." },
          {
            id: "b",
            label: "Remove production access and add marketing access, on an agreed date",
            correct: true,
            feedback: "Correct. If a handover period is needed, give it an end date.",
          },
          { id: "c", label: "Create a second account for the new role", feedback: "One person keeps one everyday account. Its group membership changes." },
          { id: "d", label: "Nothing until the next annual review", feedback: "A year is a long time to hold access that is no longer needed." },
        ],
      },
    ],
    "sec3-m3-t5": [
      {
        question: "Quillhaven Publishing runs its own application on a virtual machine rented from a cloud provider. Who is responsible for patching the operating system of that machine?",
        platformPrompt: "Choose the correct option",
        hints: [
          "A rented virtual machine is infrastructure as a service.",
          "In that model the provider's duties stop below the operating system.",
        ],
        explanation:
          "In IaaS, the provider runs the hardware and the virtualisation layer. The operating system, and everything installed on it, belongs to the customer.",
        reviewTopicId: "sec3-m3-t2",
        reviewTopicTitle: "The shared responsibility model",
        options: [
          { id: "a", label: "The cloud provider", feedback: "The provider patches the layer underneath, not the customer's operating system." },
          { id: "b", label: "Quillhaven Publishing", correct: true, feedback: "Correct. In IaaS the operating system is the customer's." },
          { id: "c", label: "The company that wrote the operating system", feedback: "It publishes the patches. Someone still has to apply them." },
          { id: "d", label: "Nobody: virtual machines do not need patching", feedback: "A virtual machine runs an ordinary operating system with ordinary flaws." },
        ],
      },
      {
        question: "Which service model leaves the customer with the fewest settings to manage?",
        platformPrompt: "Choose the correct option",
        explanation:
          "In SaaS the provider runs the whole application. The customer's remaining duties are identity, sharing, connected applications and logging. Few, and still essential.",
        reviewTopicId: "sec3-m3-t1",
        reviewTopicTitle: "Cloud service models: IaaS, PaaS and SaaS",
        options: [
          { id: "a", label: "IaaS", feedback: "IaaS leaves the most with the customer: the operating system and everything above it." },
          { id: "b", label: "PaaS", feedback: "PaaS removes the operating system from the customer's list, but not the application." },
          { id: "c", label: "SaaS", correct: true, feedback: "Correct. The list is the shortest, and it is never empty." },
          { id: "d", label: "They are all the same", feedback: "The division of work is the whole difference between the models." },
        ],
      },
      {
        question: "A policy in a cloud account allows every action on every resource. It was added to make an error message go away. What is the right fix?",
        explanation:
          "A wildcard policy gives whoever holds that identity the whole account. Compare what the identity actually uses with what it is granted, and keep only the former.",
        reviewTopicId: "sec3-m3-t3",
        reviewTopicTitle: "Cloud identity: roles, policies and conditions",
        options: [
          { id: "a", label: "Leave it: the application works", feedback: "It works, and so would an intruder who obtained that identity." },
          {
            id: "b",
            label: "Replace it with the specific actions and resources the identity really uses",
            correct: true,
            feedback: "Correct. The provider's report of used permissions shows what to keep.",
          },
          { id: "c", label: "Copy the policy to every other identity so that they are consistent", feedback: "That spreads the problem across the account." },
          { id: "d", label: "Rename the policy so that it is harder to find", feedback: "A name changes nothing about what the policy allows." },
        ],
      },
      {
        question: "Which setting best prevents a storage location from being exposed to the internet by accident?",
        explanation:
          "A guardrail set at account level means that public access needs a deliberate exception. It protects against the quick change made under pressure and then forgotten.",
        reviewTopicId: "sec3-m3-t4",
        reviewTopicTitle: "Common cloud misconfigurations and their fixes",
        options: [
          { id: "a", label: "A long name for the storage location", feedback: "Names are found by automated searches. Obscurity is not a control." },
          {
            id: "b",
            label: "The account-wide setting that blocks public access",
            correct: true,
            feedback: "Correct. The safe state becomes the default for every location.",
          },
          { id: "c", label: "A reminder in the team calendar", feedback: "A reminder depends on memory. A guardrail does not." },
          { id: "d", label: "A larger storage quota", feedback: "Capacity has no effect on who can read the contents." },
        ],
      },
    ],
  },
  assignments: {
    "sec3-m2-t9": {
      brief:
        "Design the access model for Quillhaven Publishing, the fictional thirty-person company described in the case file in Handouts. Define its roles, say what each role can reach, and set the rules for privileged accounts and for people who join, move or leave. Submit the role matrix and a one-page rationale as one PDF or DOCX.",
      requirements: [
        "A role matrix: 5 to 8 roles against the systems in the case file",
        "No person holds an administrator role on their everyday account",
        "A joiner, mover and leaver checklist, with an owner for each step",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
  activities,
};
