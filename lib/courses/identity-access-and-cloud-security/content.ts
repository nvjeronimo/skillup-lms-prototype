import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Identity, Access and Cloud Security": one reading, the first practice quiz
 * and the written assignment. The transcripts of the two videos that have one ("Course
 * introduction" and "Authentication factors and how they fail") are in the outline.
 * Quillhaven Publishing is a company made up for the course.
 */
export const content: CourseContent = {
  byline: {
    author: "Dr. Amara Okafor",
    role: "Lead instructor · Cybersecurity Fundamentals",
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
  },
  assignments: {
    "sec3-m2-t9": {
      brief:
        "Design the access model for Quillhaven Publishing, the fictional thirty-person company described in the case file in Handouts. Define its roles, say what each role can reach, and set the rules for privileged accounts and for people who join, move or leave. Submit the role matrix and a one-page rationale.",
      requirements: [
        "A role matrix: 5 to 8 roles against the systems in the case file",
        "No person holds an administrator role on their everyday account",
        "A joiner, mover and leaver checklist, with an owner for each step",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
