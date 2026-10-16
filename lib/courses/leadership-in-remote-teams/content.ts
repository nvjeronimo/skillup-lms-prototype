import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

export const content: CourseContent = {
  byline: {
    author: "Nadia Petrova",
    role: "Lead instructor · Leadership in Remote Teams",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What does a team working agreement record?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A working agreement writes down how the team has chosen to work: hours, channels, response times, how decisions are made. In an office these are picked up by watching. At a distance they have to be said.",
      options: [
        {
          id: "a",
          label: "How the team has agreed to work: hours, channels, response times and decisions",
          correct: true,
          feedback: "Correct. It replaces what people used to learn by sitting near each other.",
        },
        { id: "b", label: "Each person's objectives for the quarter", feedback: "Objectives say what to achieve. The agreement says how the team works together." },
        { id: "c", label: "The company's remote work policy", feedback: "The policy comes from the company. The agreement is written by the team, for the team." },
        { id: "d", label: "The rules the manager expects people to follow", feedback: "An agreement the manager writes alone is a rulebook. The team has to shape it." },
      ],
    },
    {
      question: "Which message is best sent asynchronously?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Information that people need to read, think about and refer back to belongs in writing. Disagreement, bad news and anything personal are handled better live.",
      options: [
        { id: "a", label: "Feedback on a colleague's behaviour in a meeting", feedback: "Personal feedback needs tone and a chance to respond. Do it on a call." },
        { id: "b", label: "A disagreement between two people about priorities", feedback: "Disagreement escalates in text. Talk first, then write down what was agreed." },
        {
          id: "c",
          label: "A proposal with the options and a date by which comments are due",
          correct: true,
          feedback: "Correct. People can read it in their own hours and answer with thought.",
        },
        { id: "d", label: "News that a project has been cancelled", feedback: "Bad news that affects people's work should be heard, with room for questions." },
      ],
    },
    {
      question: "A remote team member's output has dropped over three weeks. What is the first step?",
      explanation:
        "At a distance you see results, not circumstances. A private conversation that starts with a question finds the cause, which may be workload, unclear priorities or something outside work.",
      options: [
        { id: "a", label: "Ask them to report their hours each day", feedback: "Monitoring answers a question you have not asked yet, and it costs trust." },
        { id: "b", label: "Raise it in the team meeting", feedback: "A performance concern is private." },
        { id: "c", label: "A private conversation that starts by asking how things are going", correct: true, feedback: "Correct. Find the cause before you choose the response." },
        { id: "d", label: "Wait another month to see whether it improves", feedback: "Three weeks is already a pattern. Waiting leaves the person alone with it." },
      ],
    },
  ],
  articles: {
    "lrt-m3-t2": {
      lede: "A remote team's calendar fills up for an understandable reason: a meeting is the easiest way to feel in touch. Across time zones each one is paid for in someone's early morning or evening. This reading gives you a way to go through the calendar and decide, meeting by meeting, what to keep, shorten or replace.",
      sections: [
        {
          heading: "Ask what each meeting is for",
          paragraphs: [
            "Take last week's calendar and write one word beside each recurring meeting: inform, decide, create or connect. A meeting that informs passes on news. One that decides ends with a choice. One that creates produces something together. One that connects is there so people know each other.",
            "If you need two words, the meeting is doing two jobs and probably neither well. If you cannot find a word, ask the people who attend what they would miss if it stopped. Sometimes the honest answer is nothing.",
          ],
        },
        {
          heading: "Replace, shorten or keep",
          paragraphs: [
            "Meetings that inform are the first to replace. A written update, read in each person's own hours, carries the same news and leaves a record. The async standup from the previous video is the daily version of this.",
            "Meetings that decide can usually be shortened. Send the proposal and the options two working days before, ask for comments in writing, and use the call only for the points still open. A one-hour decision meeting often becomes twenty minutes.",
            "Meetings that create or connect are the ones to keep and protect. Planning a quarter, working through a disagreement, welcoming a new colleague: these need voices and faces. Put them inside the hours the whole team shares.",
          ],
        },
        {
          heading: "Share the cost of the clock",
          paragraphs: [
            "List the working hours of each person in one row per time zone and mark the overlap. Everything live goes there first. If the overlap is short, it is the most valuable time of the week: do not spend it on status.",
            "When a meeting has to fall outside someone's day, rotate it. If the same two people take the late call every week, the team has decided whose time counts less, without anyone saying so. Record every live meeting that people may miss, and write the decisions in the place the team already reads.",
          ],
        },
      ],
      pullQuote: {
        text: "If the same people always take the late call, the team has decided whose time counts less.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Label each recurring meeting: inform, decide, create or connect.",
        "Replace meetings that inform with a written update.",
        "Shorten meetings that decide by sending the proposal first.",
        "Keep meetings that create or connect, inside the shared hours, and rotate the awkward times.",
      ],
    },
    "lrt-m1-t2": {
      lede: "Moving a team out of a shared office does not only change where people sit. It removes a set of things that used to happen without anyone arranging them, and it makes other things possible for the first time. A leader who sees both sides can replace what was lost on purpose and make use of what was gained.",
      sections: [
        {
          heading: "What disappears",
          paragraphs: [
            "The first loss is ambient information. In an office you overhear that a client is unhappy, you see that a colleague looks stuck, and you learn who knows what by watching. None of it is scheduled, and all of it stops.",
            "The second is the quick repair. A misread message in an office is corrected by a glance or a word at the next desk. In a remote team it can sit for a day and harden into a grievance. The third is chance contact: the conversations with people outside your immediate work that build wider trust and carry ideas across the organisation.",
          ],
        },
        {
          heading: "What becomes possible",
          paragraphs: [
            "The gains are as real. People get long stretches of uninterrupted time, which most knowledge work needs and most offices destroy. The team can hire the best person for the role, not the best person within commuting distance.",
            "People have more control over their day, and that matters a great deal to carers, to people with disabilities and to anyone whose best hours are not nine to five. A team that works in writing also produces a record as a by-product: decisions and reasons that a new joiner can read.",
          ],
        },
        {
          heading: "Replace by design",
          paragraphs: [
            "Each loss has a deliberate replacement. Ambient information becomes work made visible: a shared board, written updates and decisions posted where everyone can find them. The quick repair becomes a norm: when a message lands badly, call within the hour.",
            "Chance contact has to be given a place, such as an optional weekly chat with no agenda or a pairing of people from different parts of the team. These feel artificial at first. They are artificial, in the same way a calendar is, and they work for the same reason.",
          ],
        },
        {
          heading: "What not to do",
          paragraphs: [
            "The common mistake is to rebuild the office online: a camera always on, a status light watched by a manager, a meeting for everything that used to be a chat. This keeps the costs of both worlds. It takes away the focus time that remote work offers and returns none of the ease of being in one room.",
          ],
        },
      ],
      pullQuote: {
        text: "In an office, a lot of leadership happens by accident. At a distance, you have to do it on purpose.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Remote work removes ambient information, quick repair and chance contact.",
        "It adds focus time, a wider pool of talent, flexibility and a written record.",
        "Replace each loss deliberately; do not expect it to return by itself.",
        "Do not rebuild the office online with surveillance and constant meetings.",
      ],
    },
    "lrt-m1-t4": {
      lede: "A team working agreement is a short document in which a team writes down how it works together: when people are available, how they communicate, how decisions are made. In an office these things are absorbed by watching. In a remote team, unwritten rules are invisible, and new members break them without knowing.",
      sections: [
        {
          heading: "What it covers",
          paragraphs: [
            "Keep it to one or two pages under a few headings. Availability: core hours, how to signal that you are away, what counts as urgent. Communication: which channel for what, and the expected response times. Meetings: which exist, who must attend, whether cameras are expected.",
            "Then decisions: who decides what, and where decisions are recorded. Work: where tasks live and what “done” means. And conflict: what a person should do when something bothers them. Write behaviour, not values. “We respect each other's time” cannot be checked. “We do not expect replies outside the recipient's working hours” can.",
          ],
        },
        {
          heading: "Write it with the team",
          paragraphs: [
            "An agreement handed down by the lead is a policy, and people comply with policies only when someone is watching. Run a session of sixty to ninety minutes instead. Before it, ask each person to note what helps them work well and what gets in their way.",
            "In the session, take one heading at a time. Collect proposals in a shared document, discuss where they differ and settle on a wording everyone can live with. The lead takes part as one voice and speaks last, because the lead's first sentence tends to become the answer.",
          ],
        },
        {
          heading: "Make it specific enough to use",
          paragraphs: [
            "Test every line by asking whether a new joiner would know what to do after reading it. “Be responsive” fails the test. “Reply in the team channel within four working hours, and say so if you need longer” passes.",
            "Include the uncomfortable cases: what happens when someone is repeatedly late to the overlap call, or how to disagree with a decision after it has been made. If the agreement covers only the easy situations, it will be silent exactly when it is needed.",
          ],
        },
        {
          heading: "Keep it alive",
          paragraphs: [
            "Put the agreement where the team already works and link it in the onboarding notes. Review it every three months and whenever someone joins or leaves, since the team is then a different team. Anyone may propose a change at any time. When a line is ignored for weeks, either the team recommits to it or the line is removed. An agreement nobody follows teaches people that written rules do not count.",
          ],
        },
      ],
      pullQuote: {
        text: "Write down what a new colleague would otherwise learn by getting it wrong.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Cover availability, channels, meetings, decisions, work and conflict in one or two pages.",
        "The team writes it together; the lead contributes last.",
        "Each line describes a behaviour that someone could check.",
        "Review it every quarter and when the team changes.",
      ],
    },
    "lrt-m2-t2": {
      lede: "Many meetings exist because a message was not clear enough to act on. A written message that carries its own context, states what is needed and makes the reply easy can replace the call, and can be read at any hour in any time zone.",
      sections: [
        {
          heading: "Put the request first",
          paragraphs: [
            "Start with what you need from the reader and by when. “Please approve option B below by Wednesday 17:00 your time” tells the reader at once why they are reading. The background follows for those who need it.",
            "Most messages are written in the order the writer thought of things: history first, request last. Reverse it. Many readers will act on the first two lines and read no further, and that is a success.",
          ],
        },
        {
          heading: "Carry the context",
          paragraphs: [
            "The reader cannot lean over and ask what you meant, and their reply may take eight hours to arrive. Include what they need to answer in one go: a link to the document, the relevant figure, what has already been tried, what you have already ruled out.",
            "Check your message for words that only make sense inside your head: “the issue from yesterday”, “the usual file”, “as discussed”. Name the thing. Someone who was not in yesterday's conversation, or who is reading on a phone between two other tasks, should be able to follow.",
          ],
        },
        {
          heading: "Make the reply easy",
          paragraphs: [
            "Offer options the reader can choose between, and say which one you recommend and why. “A, B or C? I suggest B because it keeps the launch date” can be answered in one word. “What do you think we should do?” needs a meeting.",
            "Say what happens if there is no reply: “If I do not hear by Thursday, I will go ahead with B.” Use this only for decisions that can be reversed. It keeps work moving across time zones and respects the reader's right not to answer everything.",
          ],
        },
        {
          heading: "Format for scanning",
          paragraphs: [
            "Keep one topic per message, so that each can be answered and found again separately. Use short paragraphs, a list for parallel items and bold for a deadline. In a group message, name who needs to act, because a request addressed to everyone is answered by no one. Read it once as the recipient before you send.",
          ],
        },
      ],
      pullQuote: {
        text: "If a message needs a call to explain it, rewrite the message.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Lead with the request and the deadline, in the reader's time zone.",
        "Include the links, figures and background needed to answer in one reply.",
        "Offer options with a recommendation, and say what happens if nobody replies.",
        "One topic per message, with a named person for each action.",
      ],
    },
    "lrt-m2-t5": {
      lede: "In an office, a team's knowledge lives in people, and you reach it by asking. In a remote team the person who knows may be asleep. Documentation is how the team remembers without waking anyone, and how a new member becomes useful in weeks instead of months.",
      sections: [
        {
          heading: "What to write down",
          paragraphs: [
            "Not everything. Document what is asked repeatedly, what is costly to get wrong and what only one person knows. That usually means how recurring tasks are done, how the systems fit together, who to ask about what, the decisions the team has made and why, and the working agreement.",
            "A useful trigger is the second time you answer the same question. Write the answer where it can be found and send the link. The third person will not need to ask.",
          ],
        },
        {
          heading: "One home, easy to search",
          paragraphs: [
            "Choose one place for team documentation and resist every second one. Knowledge spread over chat threads, personal drives and three different tools is, in effect, lost. People give up searching and ask a colleague, which is the cost the documentation was supposed to remove.",
            "Structure it by what people are trying to do, with titles a newcomer would type into the search box: “How to request access to the reporting tool”, not “Access v2 final”. Start every page with a line that says what it is for and when it was last checked.",
          ],
        },
        {
          heading: "Good enough, and current",
          paragraphs: [
            "A short page that is correct today is better than a complete one that is a year old. Outdated documentation does more damage than none, because people act on it. Give each page an owner and a review date, and let anyone correct an error they find, on the spot.",
            "Lower the bar for writing. A numbered list of steps with two screenshots is documentation. So is a recorded five-minute walkthrough with a few lines of summary. Polished prose is not the goal.",
          ],
        },
        {
          heading: "Make it a habit of the team",
          paragraphs: [
            "Documentation survives only where leaders use it. Answer questions with a link. When there is no page to link to, write it together with the person who asked. Count documenting as part of finishing a task, and thank people for it in public. New joiners are the best test: ask each one to note every point where the documentation failed them in their first two weeks, and to fix what they can.",
          ],
        },
      ],
      pullQuote: {
        text: "Answer a question twice in chat and it is time to answer it once in a document.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Document what is asked often, costly to get wrong, or known by one person.",
        "Keep one home for documentation, organised by task and easy to search.",
        "Prefer short and current to complete and stale; give pages an owner and a date.",
        "Leaders set the habit by answering with links and writing the missing pages.",
      ],
    },
    "lrt-m3-t5": {
      lede: "People do their best work in teams where they feel they belong: where they are known, where they would be missed, and where they can speak without calculating the risk. In an office some of that grows through proximity. At a distance it has to be given room, and it cannot be forced.",
      sections: [
        {
          heading: "Why it is harder remotely",
          paragraphs: [
            "Remote communication is mostly about tasks. The small talk that surrounds work in an office drops away: the weekend, the joke about the printer, the shared lunch. What remains is efficient and thin. People know each other's output and little else.",
            "The effect is uneven. Someone who joined when the team shared an office has years of relationships to draw on. Someone hired remotely last month has none. When part of a team sits together and part is remote, those at a distance can become second-class without anyone intending it.",
          ],
        },
        {
          heading: "Create occasions, keep them optional",
          paragraphs: [
            "Give informal contact a place. Leave five minutes at the start of a weekly call for a question that is not about work. Open a channel for things outside work. Each fortnight, pair two people at random for a twenty-minute conversation. Run a short session in which one person shows something they care about.",
            "Keep these optional and inside working hours. A mandatory “fun” event on a Friday evening serves the people who enjoy such things and burdens everyone else, especially those with children or in a time zone where it falls at night. Offer several kinds of contact, so that quiet people have an option that suits them.",
          ],
        },
        {
          heading: "Belonging is built in the work too",
          paragraphs: [
            "Social events help less than the ordinary experience of being included. Is my opinion asked before a decision is taken? Is my work mentioned by name? When I was absent, did someone tell me what I missed? These moments carry more weight than any quiz night.",
            "Check who speaks in meetings and who is thanked in public. If the same three names always come up, the others are learning where they stand. Rotate who facilitates, who presents and who takes the awkward call time.",
          ],
        },
        {
          heading: "Meeting in person",
          paragraphs: [
            "If the budget allows the team to meet once or twice a year, use the time for what distance does badly: getting to know each other, working through a hard question together, eating at the same table. Do not fill the days with presentations that could have been documents. The goodwill built in two days together lasts for months of remote work.",
          ],
        },
      ],
      pullQuote: {
        text: "Belonging comes less from the social hour than from being asked, being named and being missed.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Informal contact does not happen by itself at a distance; give it a place.",
        "Keep social occasions optional, varied and inside working hours.",
        "Inclusion in daily work builds more belonging than events do.",
        "Watch for a gap between people who are co-located and people who are remote.",
      ],
    },
  },
  quizzes: {
    "lrt-m2-t4": [
      {
        question: "A colleague eight hours ahead of you needs a decision from you to start their day. What should your team's norms make possible?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Think about what they can do while you are asleep.",
          "The answer does not need anyone to change their working hours.",
        ],
        explanation:
          "Across a large time difference a question and its answer can cost a full day each way. Writing the request with its context and a default lets work continue without waiting.",
        reviewTopicId: "lrt-m2-t3",
        reviewTopicTitle: "Time zones, overlap hours and response times",
        options: [
          { id: "a", label: "That they call you when their day starts", feedback: "That is the middle of your night. The norm should not depend on it." },
          {
            id: "b",
            label: "That the request states the context, the deadline and what they will do if they hear nothing",
            correct: true,
            feedback: "Correct. A stated default means nobody loses a day waiting.",
          },
          { id: "c", label: "That you check messages before you go to sleep", feedback: "A norm that relies on one person being always available does not last." },
          { id: "d", label: "That decisions are only taken in the weekly meeting", feedback: "Then every decision waits up to a week." },
        ],
      },
      {
        question: "Which response-time norm is the most useful to write into a communication charter?",
        platformPrompt: "Choose the correct option",
        explanation:
          "One response time for everything makes every channel urgent or none. A norm per channel tells people where to post and how long they can stay focused before checking.",
        reviewTopicId: "lrt-m2-t1",
        reviewTopicTitle: "Sync or async: choosing the channel for the message",
        options: [
          { id: "a", label: "Reply to everything within the hour", feedback: "That makes deep work impossible and treats every message as urgent." },
          { id: "b", label: "Reply when you can", feedback: "Nobody can plan around that." },
          {
            id: "c",
            label: "A time per channel: chat within the working day, email within two, a phone call for what cannot wait",
            correct: true,
            feedback: "Correct. People know where to post and how long they can stay focused.",
          },
          { id: "d", label: "Reply at once to the manager, and to others when possible", feedback: "A norm based on rank teaches people to interrupt each other upward." },
        ],
      },
      {
        question: "You are about to send “Can we talk?” to someone on your team. What is the better message?",
        explanation:
          "A message with no topic leaves the other person to imagine the worst until you speak. Say what it is about, how long it takes and how urgent it is.",
        reviewTopicId: "lrt-m2-t2",
        reviewTopicTitle: "Writing messages that do not need a meeting",
        options: [
          { id: "a", label: "“Call me when you see this.”", feedback: "Still no topic, and now it sounds urgent." },
          {
            id: "b",
            label: "“Can we take 15 minutes today or tomorrow on the release date? Nothing is wrong, I want your view before I answer the client.”",
            correct: true,
            feedback: "Correct. Topic, length, urgency and reassurance, in two sentences.",
          },
          { id: "c", label: "“Are you free?”", feedback: "It asks for a commitment before saying what for." },
          { id: "d", label: "A calendar invitation with no description", feedback: "An unexplained invitation from a manager is the same message, with a time attached." },
        ],
      },
    ],
    "lrt-m1-t6": [
      {
        question: "A colleague in another country always delivers what they promise, on the day they promised it. Which part of trust does this build?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Reliability is doing what you said you would, when you said. At a distance it is the most visible part of trust, because people see results and not effort.",
        reviewTopicId: "lrt-m1-t3",
        reviewTopicTitle: "Trust without the corridor: reliability, openness and care",
        options: [
          { id: "a", label: "Reliability", correct: true, feedback: "Correct. Kept promises are what reliability means." },
          { id: "b", label: "Openness", feedback: "Openness is about sharing information, reasons and mistakes." },
          { id: "c", label: "Care", feedback: "Care is about seeing the person as well as the output." },
          { id: "d", label: "Authority", feedback: "Authority comes with a role. It is not a part of trust." },
        ],
      },
      {
        question: "Which loss does a team feel first when it stops sharing an office?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Ambient information is what people pick up without a meeting: who is stuck, what a client said, who knows what. It has to be replaced by making work visible in writing.",
        reviewTopicId: "lrt-m1-t2",
        reviewTopicTitle: "What a remote team loses, and what it gains",
        options: [
          { id: "a", label: "The ability to do focused work", feedback: "Focus time usually improves away from the office." },
          { id: "b", label: "Information people used to pick up by being near each other", correct: true, feedback: "Correct. Nobody scheduled it, so nobody notices it has gone until problems appear." },
          { id: "c", label: "Access to documents", feedback: "Documents are, if anything, easier to reach." },
          { id: "d", label: "The team's goals", feedback: "Goals do not depend on location." },
        ],
      },
      {
        question: "Which line belongs in a team working agreement?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A working agreement describes behaviour that a person could check. Values and slogans cannot be checked, so they do not guide anyone.",
        reviewTopicId: "lrt-m1-t4",
        reviewTopicTitle: "Writing a team working agreement",
        options: [
          { id: "a", label: "We value respect and transparency.", feedback: "A value. Nobody can tell whether it was followed." },
          { id: "b", label: "We reply in the team channel within four working hours, or say that we need longer.", correct: true, feedback: "Correct. A behaviour, with a measure." },
          { id: "c", label: "Communication is important to us.", feedback: "True of every team, and no help to a new joiner." },
          { id: "d", label: "Everyone should try their best.", feedback: "Not something a person can act on." },
        ],
      },
      {
        question: "Who should write the team working agreement?",
        platformPrompt: "Choose the correct option",
        explanation:
          "People keep agreements they helped to make. The lead takes part as one voice, and speaks last so that the team's views are heard first.",
        reviewTopicId: "lrt-m1-t4",
        reviewTopicTitle: "Writing a team working agreement",
        options: [
          { id: "a", label: "The team lead, who then announces it", feedback: "That is a policy. People follow it only when watched." },
          { id: "b", label: "The HR department", feedback: "HR does not know how this team works day to day." },
          { id: "c", label: "The whole team together, the lead included", correct: true, feedback: "Correct. Shared authorship is what makes it an agreement." },
          { id: "d", label: "The newest member, as an onboarding task", feedback: "They can test it. They cannot yet know what it should say." },
        ],
      },
    ],
    "lrt-m3-t6": [
      {
        question: "What is the purpose of a standup, whether live or async?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A standup exists so that team members can coordinate with each other and bring blockers into the open. It is not a report to the manager.",
        reviewTopicId: "lrt-m3-t1",
        reviewTopicTitle: "Async standups",
        options: [
          { id: "a", label: "To let the manager check that people are working", feedback: "That turns it into surveillance, and people stop writing anything real." },
          { id: "b", label: "To let people coordinate and raise what is in their way", correct: true, feedback: "Correct. Coordination and blockers are the point." },
          { id: "c", label: "To record hours worked", feedback: "Time tracking is a different thing." },
          { id: "d", label: "To replace the task board", feedback: "The board shows status. The standup shows what needs attention." },
        ],
      },
      {
        question: "Your one-to-ones have turned into a list of task updates. What is the best fix?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Status belongs on the board and in the standup. A one-to-one is the team member's meeting. Read the status beforehand and open with a question that hands over the agenda.",
        reviewTopicId: "lrt-m3-t4",
        reviewTopicTitle: "One-to-ones that are not status updates",
        options: [
          { id: "a", label: "Cancel them: the updates are already on the board", feedback: "Then the person loses their only regular conversation with you." },
          { id: "b", label: "Read the status beforehand and open with “What is on your mind?”", correct: true, feedback: "Correct. The time becomes theirs again." },
          { id: "c", label: "Lengthen them to an hour to fit everything in", feedback: "More time for the wrong content does not help." },
          { id: "d", label: "Hold them once a month", feedback: "Less often means less trust, and the same problem." },
        ],
      },
      {
        question: "A weekly meeting exists only so that five people can read out their updates. Following the keep, shorten or replace test, what should happen to it?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A meeting whose only purpose is to pass on information can be replaced by a written update. Keep live time for discussion, decisions and connection.",
        reviewTopicId: "lrt-m3-t2",
        reviewTopicTitle: "Which meetings to keep, shorten or replace",
        options: [
          { id: "a", label: "Keep it: it is a habit the team knows", feedback: "Habit is not a purpose." },
          { id: "b", label: "Replace it with a written update in a shared thread", correct: true, feedback: "Correct. Information travels well in writing, at any hour." },
          { id: "c", label: "Move it to a later hour so that more people can join", feedback: "That raises the cost and keeps the problem." },
          { id: "d", label: "Make attendance optional and change nothing else", feedback: "The updates would still be read aloud to fewer people." },
        ],
      },
      {
        question: "A team runs a compulsory social quiz on Friday evenings to build belonging. What is the main problem?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Belonging cannot be forced. A compulsory event outside working hours burdens carers and people in other time zones. Optional and varied occasions inside working hours include more people.",
        reviewTopicId: "lrt-m3-t5",
        reviewTopicTitle: "Belonging and informal contact at a distance",
        options: [
          { id: "a", label: "Quizzes are not fun", feedback: "Some people enjoy them. The format is not the problem." },
          { id: "b", label: "It is compulsory and outside working hours", correct: true, feedback: "Correct. It excludes the people it is meant to include." },
          { id: "c", label: "It should be longer", feedback: "Length is not the issue." },
          { id: "d", label: "Social contact is not a leader's concern", feedback: "It is. The question is how to make room for it." },
        ],
      },
    ],
  },
  assignments: {
    "lrt-m2-t7": {
      brief:
        "Write the communication charter for a remote team: your own, or the case-study team of nine people in three time zones described in the Downloads tab. The charter says which channel is used for what, how fast people are expected to answer in each one, where decisions are recorded and which hours the team shares. Write it so that someone joining next month could follow it without asking. Submit your work as a PDF or DOCX.",
      requirements: [
        "One or two pages, written as agreements (“we…”), not as rules",
        "A channel table: purpose, expected response time, and what does not belong there",
        "The shared hours, and where decisions are written down",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {
    "lrt-m4-t4": {
      brief:
        "You take over a remote team next month: use your own team, or the case-study team from Assignment 01. Write the plan for your first 30 days. Say what you will learn about the team and how, which rituals you will keep, change or start, how the team will know what is expected of each person, and how you will notice if someone is overloaded or isolated.",
      deliverable:
        "Submit a PDF or DOCX of 2 to 3 pages: the plan week by week, the weekly calendar you propose with its time zones, and one paragraph on what you will not change in the first month and why.",
      dueLabel: "Due 18 Oct 2026",
      requiredReviews: 2,
      acceptedTypes: [".pdf", ".docx"],
      overallCommentPrompt: "Which part of your peer's plan would you use with your own team?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Learn before changing",
          maxPoints: 5,
          options: [
            { points: 5, label: "The first weeks name who is listened to, about what, and how" },
            { points: 3, label: "Listening is planned but stays general" },
            { points: 0, label: "The plan starts with changes" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Design the rituals",
          maxPoints: 6,
          options: [
            { points: 6, label: "Each meeting or async ritual has a purpose and fits the shared hours" },
            { points: 4, label: "Rituals are listed with a purpose; time zones are not accounted for" },
            { points: 2, label: "A calendar with no stated purposes" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Make expectations visible",
          maxPoints: 5,
          options: [
            { points: 5, label: "Outcomes per person or role, and where progress can be seen" },
            { points: 3, label: "Expectations are stated as activity or hours" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Look after the people",
          maxPoints: 4,
          options: [
            { points: 4, label: "Specific signs of overload or isolation, and what the lead does on seeing them" },
            { points: 2, label: "Wellbeing is mentioned without signs or actions" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
  activities,
};
