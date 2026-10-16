import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

export const content: CourseContent = {
  byline: {
    author: "Dr. Marta Silva",
    role: "Lead instructor · UX Research and Design Thinking",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What is the purpose of the Empathize stage in design thinking?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Empathize comes first so that the problem you define is one real people have. Ideas, prototypes and tests all come after it.",
      options: [
        {
          id: "a",
          label: "To understand people's needs and context before defining the problem",
          correct: true,
          feedback: "Correct. The later stages build on what you learn here.",
        },
        { id: "b", label: "To test a finished prototype", feedback: "That is the Test stage, at the other end of the process." },
        { id: "c", label: "To generate as many ideas as possible", feedback: "That is Ideate. It needs a defined problem to work on." },
        { id: "d", label: "To choose the visual style", feedback: "Visual style is a design decision made much later." },
      ],
    },
    {
      question: "Which of these is the strongest evidence for a design decision?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Observed behaviour across several participants is stronger than opinion, prediction or what another product does.",
      options: [
        { id: "a", label: "What one stakeholder believes users want", feedback: "A belief is a hypothesis to test, not evidence." },
        { id: "b", label: "What participants say they would do in future", feedback: "People are poor at predicting their own behaviour." },
        { id: "c", label: "What several participants were observed doing", correct: true, feedback: "Correct. Behaviour, seen more than once, is the firmest ground." },
        { id: "d", label: "What a competitor has launched", feedback: "A competitor's choice tells you about their users and constraints, not yours." },
      ],
    },
    {
      question: "A persona should be based on…",
      explanation:
        "A persona summarises patterns found across research participants. Without that link to evidence it is a character the team invented.",
      options: [
        { id: "a", label: "The team's ideal customer", feedback: "That describes who the team hopes for, not who was found." },
        { id: "b", label: "Demographic data alone", feedback: "Age and location say little about goals and behaviour." },
        { id: "c", label: "Patterns found in research with real users", correct: true, feedback: "Correct. Each trait should trace back to participants." },
        { id: "d", label: "A single memorable interview", feedback: "One person is a case, not a pattern." },
      ],
    },
  ],
  articles: {
    "uxr-m1-t4": {
      lede: "An interview guide is a one-page plan for a conversation. It keeps you on the research question when the conversation wanders, and it makes five interviews comparable. It is not a script to read aloud.",
      sections: [
        {
          heading: "Start from what you need to learn",
          paragraphs: [
            "Write the research question at the top of the page: the thing the team does not know and has to decide on. “How do people choose where to book a table for a group?” is a research question. “Would people use our group-booking feature?” is not: it asks for a prediction, and people are poor at predicting their own behaviour.",
            "Under it, list three or four topics you need to cover. Topics, not questions: how they do it today, what goes wrong, what they have tried, who else is involved.",
          ],
        },
        {
          heading: "Write questions that ask for stories",
          paragraphs: [
            "For each topic, write one opening question about a specific past occasion: “Tell me about the last time you organised a dinner for more than four people.” Then note two or three follow-ups to use if the story stalls: what happened next, what was hard about that, how they decided.",
            "Check each question against three rules. It is open, so it cannot be answered with yes or no. It is neutral, so it does not suggest the answer. It asks one thing at a time.",
          ],
        },
        {
          heading: "Shape the session",
          paragraphs: [
            "Order the guide the way a conversation flows: an introduction that explains the purpose and asks for consent to take notes or record, a warm-up about the person, the main topics from the general to the specific, and a close that asks what you missed.",
            "Run one pilot interview with a colleague before the first real session. You will find the question nobody understands and the topic that takes twice as long as planned. Change the guide, then keep it stable for the rest of the round.",
          ],
        },
      ],
      pullQuote: {
        text: "Ask about the last time, not about next time.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Put the research question at the top; every question in the guide should serve it.",
        "Plan topics first, then one story question and a few follow-ups for each.",
        "Keep questions open, neutral and single.",
        "Pilot the guide once before the first real interview.",
      ],
    },
    "uxr-m1-t2": {
      lede: "UX research is the work of learning how people behave, what they need and why, so that a team makes design decisions on evidence. It is easy to confuse with nearby activities that look similar and answer different questions. This reading draws the lines.",
      sections: [
        {
          heading: "What research is for",
          paragraphs: [
            "Every product decision rests on a belief about people: that they have a certain problem, that they will notice a button, that they will come back. Research replaces the belief with something you observed. Its output is a smaller risk of building the wrong thing.",
            "That makes research a tool for decisions. Before you plan a study, name the decision it will inform and what the team would do differently depending on the answer. If nothing would change, the study is not needed yet.",
          ],
        },
        {
          heading: "What it is not",
          paragraphs: [
            "It is not asking people what they want. People describe solutions they have seen before, and they are unreliable about their own future behaviour. Research asks what they did, and watches what they do.",
            "It is not market research, which estimates how many people might buy and at what price. It is not a satisfaction survey, which tells you that people are unhappy and rarely why. And it is not validation: a study designed to confirm a decision already taken cannot surprise you, so it cannot teach you anything.",
          ],
        },
        {
          heading: "Two questions that sort the methods",
          paragraphs: [
            "The first question is whether you need to know why or how many. Interviews and observation are qualitative: a handful of people, studied closely, explain reasons. Surveys and analytics are quantitative: many people, measured lightly, show how common something is.",
            "The second is whether you are studying what people say or what they do. An interview records attitudes and memories. A usability test or a usage log records behaviour. Strong research plans combine both, because each covers the other's blind spot.",
          ],
        },
        {
          heading: "How much is enough",
          paragraphs: [
            "For discovery, five to eight interviews with people in the same situation usually reveal the main patterns. You can stop when new sessions repeat what you have already heard. A small study done this week is worth more than a perfect one that reports after the decision has been made.",
          ],
        },
      ],
      pullQuote: {
        text: "Research does not tell you what to build. It tells you what is true, so that you can decide.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Start from the decision the research has to inform.",
        "Ask about and observe past and present behaviour, not wishes and predictions.",
        "Qualitative methods explain why; quantitative methods show how many.",
        "A study that cannot change the team's mind is not research.",
      ],
    },
    "uxr-m1-t8": {
      lede: "A persona is a one-page description of a type of user, written so that a team can keep that person in mind while it designs. Built from research, it is a summary of evidence. Built from imagination, it is a fictional character that gives the team's assumptions a face.",
      sections: [
        {
          heading: "Start from patterns, not from a template",
          paragraphs: [
            "Most persona templates begin with a name, a photo and an age. Leave those until last. Begin with your interview notes and look for the ways participants differ in what they do: how often they do the task, how they prepare, which tools they use, what they do when it goes wrong.",
            "Place each participant along those differences. People who sit together on several of them form a group, and each group is a candidate persona. In the case study, three of the five organisers plan weeks ahead and confirm everything twice. The other two decide on the day. That is two patterns of behaviour, and age has nothing to do with either.",
          ],
        },
        {
          heading: "What goes on the page",
          paragraphs: [
            "A useful persona holds four things: the goals the person is trying to reach, the behaviours you observed, the pain points with the situation in which each one occurs, and the context of use. Add one or two direct quotes that carry the tone.",
            "Give the persona a name and a short description so that the team can refer to it. Keep demographic detail to what affects the design. A hobby, a pet or a favourite brand that nobody observed is decoration, and it invites the team to design for a stereotype.",
          ],
        },
        {
          heading: "Keep the evidence attached",
          paragraphs: [
            "Under the persona, or on a second page, list each trait with the participants it came from. A trait supported by one person is marked as a hypothesis. This table is what lets you defend the persona when someone says “our users are not like that”.",
            "Two or three personas are usually enough. If you have six, the differences between them are probably too small to change a design decision.",
          ],
        },
        {
          heading: "When a persona stops being true",
          paragraphs: [
            "A persona describes the people you met, at the time you met them. Review it when the product reaches a new audience or when new research contradicts it. Date the page, so that everyone can see how old the evidence is.",
          ],
        },
      ],
      pullQuote: {
        text: "If you cannot say which participants a trait came from, it does not belong on the persona.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Group participants by behaviour and goals before you think about demographics.",
        "Include goals, behaviours, pain points in context and a quote; leave out invented detail.",
        "Link every trait to at least two participants, and mark the rest as hypotheses.",
        "Date the persona and revisit it when the evidence changes.",
      ],
    },
    "uxr-m2-t2": {
      lede: "Affinity mapping is a way to turn a pile of research notes into themes by grouping notes that belong together. It works because the groups come from the data and not from the categories you had in mind before the research. This reading walks through one session.",
      sections: [
        {
          heading: "Prepare the notes",
          paragraphs: [
            "Write one observation per sticky note: a quote, an action or a fact, in the participant's words where you can. Add a code for the participant, such as P3, in the corner. One idea per note matters, because a note that holds two ideas cannot be placed in two groups.",
            "Expect thirty to fifty notes per interview. Use one colour for all of them, or one colour per participant. Do not colour by topic: that sorts the wall before you have looked at it.",
          ],
        },
        {
          heading: "Group from the bottom up",
          paragraphs: [
            "Put the notes on a wall in no order. Then, in silence, each person moves notes that seem related next to each other. Anyone may move any note. If a note keeps travelling between two groups, copy it and place it in both.",
            "Resist the obvious headings such as “booking”, “payment” and “communication”. Those describe the product, and they hide what you learned. Group by what the notes say about people: “does not trust the headcount until the day”, “pays first and chases friends later”.",
          ],
        },
        {
          heading: "Name the groups",
          paragraphs: [
            "When movement slows, give each group a label that is a full sentence stating what the notes in it have in common. “Reminders” is a topic. “Organisers send reminders by hand because they fear seeming pushy” is a finding you can use.",
            "Then look at the groups themselves. Some belong together under a larger theme. Others turn out to be one participant's story told in six notes: check the participant codes. A theme that rests on a single person is a question for the next round of research.",
          ],
        },
        {
          heading: "Record it before it falls off the wall",
          paragraphs: [
            "Photograph the wall, then list the themes with the number of participants behind each and two representative quotes. This list is the raw material for insights, personas and journey maps. The session takes about ninety minutes for five interviews, and it goes better with two or three people than with one.",
          ],
        },
      ],
      pullQuote: {
        text: "Label a group with a sentence. If a single word fits, you have named a topic and learned nothing.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "One observation per note, with the participant code on it.",
        "Group in silence, from the notes up, and avoid headings that mirror the product.",
        "Name each group with a sentence that states what you learned.",
        "Count the participants behind each theme before you rely on it.",
      ],
    },
    "uxr-m2-t4": {
      lede: "A journey map lays out, step by step, what one persona goes through to reach a goal. It puts the research on a timeline, so that a team can see where the experience breaks and which break hurts most. This reading explains the rows of the map and how to fill them from your notes.",
      sections: [
        {
          heading: "Choose one persona and one goal",
          paragraphs: [
            "A journey map has a single subject and a single scenario, with a clear start and end. “The planner organises a birthday dinner for eight, from the first message to the moment the bill is split” is a scenario. “Using the app” is not.",
            "Draw the journey as it is today, including the parts that happen outside your product: the group chat, the phone call to the restaurant, the bank transfer. Most of what you can improve sits in those gaps.",
          ],
        },
        {
          heading: "Stages, actions, thoughts and feelings",
          paragraphs: [
            "Across the top, write the stages: four to seven phases as the person would name them, such as decide, invite, confirm, attend and settle up. They are steps in the person's life, not screens.",
            "Under each stage add rows. Actions: what the person does, taken from your observations. Touchpoints: the tools, people and channels involved. Thoughts: questions they ask themselves, ideally as quotes. Feelings: a simple line that rises and falls, backed by what participants said or showed.",
          ],
        },
        {
          heading: "Pain points and opportunities",
          paragraphs: [
            "Mark a pain point wherever the feeling line drops, and write what causes it and what it costs the person. “Confirm: two guests have not replied, the restaurant needs a number by six, and the organiser guesses.” A pain point with a cause and a consequence can be prioritised. A vague one cannot.",
            "In the last row, write an opportunity for each pain point as a question, not as a feature. You will turn these into How Might We questions later in this module.",
          ],
        },
        {
          heading: "Keep it honest",
          paragraphs: [
            "Every cell should trace back to research. Where you had to guess, mark the cell as an assumption in a different colour. A map with visible gaps is more useful than a complete one that the team cannot trust, because the gaps tell you what to ask next.",
          ],
        },
      ],
      pullQuote: {
        text: "Map the journey people take today, not the one your product hopes they take.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "One persona, one scenario, with a defined start and end.",
        "Stages are phases in the person's life; include the steps outside your product.",
        "Write each pain point with its cause and its consequence.",
        "Mark assumptions clearly so that the map shows what is known and what is not.",
      ],
    },
    "uxr-m2-t7": {
      lede: "A How Might We question, or HMW, rewrites a problem as an invitation to solve it. It is the bridge between the Define and Ideate stages: specific enough to point in a direction, open enough to allow many answers. Writing a good one takes a few attempts.",
      sections: [
        {
          heading: "Why these three words",
          paragraphs: [
            "“How” assumes that an answer exists. “Might” says that an idea may or may not work, which makes it safe to suggest one. “We” makes the question a shared one. The form is a small device for moving a team from analysing the problem to generating ideas.",
          ],
        },
        {
          heading: "From a problem statement to several questions",
          paragraphs: [
            "Take the statement from the previous video: an organiser needs to know who is coming before the booking deadline, because the restaurant holds the table only until then. One statement gives several questions, each looking at a different part of it.",
            "How might we make replying easier for a guest than staying silent? How might we give the organiser a number they can trust a day earlier? How might we make an uncertain headcount acceptable to the restaurant? Each one will lead a group to different ideas. Write five to ten, then choose two or three to take into ideation.",
          ],
        },
        {
          heading: "Too narrow, too broad",
          paragraphs: [
            "A question is too narrow when it contains the answer. “How might we add a reminder button to the invitation?” allows exactly one idea. Remove the feature and ask about the outcome instead.",
            "It is too broad when no idea could be ruled out. “How might we improve group dining?” gives nobody a place to begin. Add the person, the moment or the obstacle from your research. A quick test: can you think of five quite different answers in two minutes? With none, the question is too narrow or too vague. With fifty that have nothing in common, it is too broad.",
          ],
        },
        {
          heading: "Ways to vary a question",
          paragraphs: [
            "If the questions all sound alike, change the angle. Turn the pain point around: how might we make waiting for replies useful? Question an assumption: how might we remove the need for a final number? Shift the person: how might we help the guest who is unsure? The aim is a set of questions that open different doors.",
          ],
        },
      ],
      pullQuote: {
        text: "A good How Might We question holds the problem and none of the solution.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Write several HMW questions from one problem statement, each from a different angle.",
        "Remove any feature or screen named in the question.",
        "Anchor a broad question with the person, the moment or the obstacle from research.",
        "Keep the two or three questions that suggest many different answers.",
      ],
    },
    "uxr-m3-t2": {
      lede: "A blank page and the instruction “have ideas” rarely produce many. Structured methods give a group a time limit, a format and permission to produce rough work. This reading describes three that need only paper and a timer, and when each one fits.",
      sections: [
        {
          heading: "Crazy 8s: speed over polish",
          paragraphs: [
            "Fold a sheet of paper into eight panels. Set a timer for eight minutes and sketch one idea per panel, one minute each. The time limit is the method: it leaves no room to perfect the first idea, so you are pushed past the obvious ones.",
            "Everyone works alone and in silence. The sketches are boxes, arrows and a few words. Afterwards each person presents their sheet in a minute, and the group marks the panels worth developing. Use it when you have a clear How Might We question and need many visual directions quickly.",
          ],
        },
        {
          heading: "Brainwriting: ideas that build on each other",
          paragraphs: [
            "In brainwriting each person writes three ideas on a sheet in five minutes, then passes the sheet to the next person, who reads them and adds three more: new ideas or developments of what is already there. After a few rounds each sheet holds a chain of ideas from several people.",
            "Because nobody speaks, the quiet members of the group contribute as much as the confident ones, and no single idea anchors the discussion early. Use it with mixed groups, with remote teams on a shared document, or when one voice tends to dominate.",
          ],
        },
        {
          heading: "SCAMPER: seven questions about what exists",
          paragraphs: [
            "SCAMPER is a checklist of seven prompts applied to an existing product, step or idea: Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse. Take the current invitation flow and ask each in turn. What could be eliminated? What if the order were reversed, and the guest proposed the date?",
            "It suits improvement work, where you start from something concrete, and it is a good way to restart a session that has run dry. Not every prompt will produce an idea. Move on after a minute.",
          ],
        },
        {
          heading: "After any method",
          paragraphs: [
            "Collect everything where the group can see it, remove exact duplicates and cluster the rest. Do not evaluate yet. Choosing is a separate step with its own criteria, covered in the video on impact and effort.",
          ],
        },
      ],
      pullQuote: {
        text: "The first ideas are the ones everybody has. The method is there to get you past them.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Crazy 8s: eight sketches in eight minutes, alone, for many directions fast.",
        "Brainwriting: write, pass and build in silence, so that every voice counts.",
        "SCAMPER: seven prompts for rethinking something that already exists.",
        "Generate first and choose later, with criteria.",
      ],
    },
    "uxr-m3-t8": {
      lede: "A prototype is a question in physical form. Its job is to find out something you do not know, as cheaply as possible, before the answer becomes expensive. Teams get into trouble when the prototype turns into a demonstration of how good the idea is.",
      sections: [
        {
          heading: "Write the question first",
          paragraphs: [
            "Before you draw anything, write down what you need to learn and what result would change your mind. “Can a first-time organiser send an invitation without help?” is a question a prototype can answer. “Do people like it?” is not, because almost any reaction can be read as a yes.",
            "The question decides what to build. If it is about whether people understand a concept, a storyboard may be enough. If it is about finding a function, you need the navigation and little else. Everything outside the question can stay rough or be left out.",
          ],
        },
        {
          heading: "The cost of polish",
          paragraphs: [
            "A polished prototype changes the feedback you get. People comment on colours and wording, or they hold back because the work looks finished and criticism feels rude. A sketch invites them to redraw it.",
            "Polish also changes you. After three days on a prototype you will defend it. After an hour you will throw it away as soon as it fails, which is the right response. Keep the effort in proportion to how sure you are: the less you know, the rougher the prototype should be.",
          ],
        },
        {
          heading: "Failing is a result",
          paragraphs: [
            "If four of five people cannot complete the task, the prototype has done its work. You have learned in an afternoon what would otherwise have surfaced after launch. Record what happened, change one thing and test again.",
            "Be suspicious of a test where everything goes well. Check whether the task was too easy, whether you helped without noticing, and whether the participants were people who would really use the product.",
          ],
        },
        {
          heading: "What to show stakeholders",
          paragraphs: [
            "When you present a prototype, present the question, what you observed and what you will change. That keeps the conversation on what was learned. If someone asks for a more impressive version, ask which decision it would help the team to make.",
          ],
        },
      ],
      pullQuote: {
        text: "Build the least you can that will prove you wrong.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "State the question and the result that would change your mind before you build.",
        "Build only what the question needs; leave the rest rough.",
        "Rough prototypes get more honest feedback and are easier to discard.",
        "A failed test is a cheap lesson: record it, change one thing, test again.",
      ],
    },
  },
  quizzes: {
    "uxr-m1-t5": [
      {
        question: "Which of these is a leading question?",
        platformPrompt: "Choose the correct option",
        hints: [
          "A leading question suggests its own answer.",
          "Look for the question that names a feeling the person has not mentioned.",
        ],
        explanation:
          "A leading question carries the answer inside it. Asking what happened, and how it went, lets the person supply the feeling themselves.",
        reviewTopicId: "uxr-m1-t3",
        reviewTopicTitle: "Discovery interview techniques",
        options: [
          { id: "a", label: "Tell me about the last time you booked a table for a group.", feedback: "Open and neutral: it asks for a story." },
          {
            id: "b",
            label: "Don't you find it frustrating when booking sites hide the price?",
            correct: true,
            feedback: "Correct. It tells the person what to feel before they answer.",
          },
          { id: "c", label: "What did you do after the booking failed?", feedback: "A neutral follow-up about what happened." },
          { id: "d", label: "Who else was involved in the decision?", feedback: "Open and neutral." },
        ],
      },
      {
        question: "Why ask about a specific past occasion rather than what someone usually does?",
        platformPrompt: "Choose the correct option",
        explanation:
          "“Usually” invites a tidy summary. A specific occasion brings back the steps, the tools and what went wrong, which is the material you need.",
        reviewTopicId: "uxr-m1-t3",
        reviewTopicTitle: "Discovery interview techniques",
        options: [
          { id: "a", label: "It makes the interview shorter.", feedback: "Stories often take longer. The gain is detail, not time." },
          {
            id: "b",
            label: "A specific occasion gives steps and details; “usually” gives a summary and opinions.",
            correct: true,
            feedback: "Correct. Detail from a real occasion is evidence.",
          },
          { id: "c", label: "People prefer talking about the past.", feedback: "Preference is not the reason. The quality of the detail is." },
          { id: "d", label: "It removes the need for follow-up questions.", feedback: "Follow-ups are still how you get to the reasons." },
        ],
      },
      {
        question: "Where does the research question go in an interview guide?",
        explanation:
          "The research question is for the team: it sits at the top of the guide and every interview question is checked against it. Participants are asked about their own experience.",
        reviewTopicId: "uxr-m1-t4",
        reviewTopicTitle: "Writing an interview guide",
        options: [
          {
            id: "a",
            label: "At the top of the guide, as the test every question has to pass",
            correct: true,
            feedback: "Correct. It keeps the guide, and the conversation, on course.",
          },
          { id: "b", label: "It is the first question you ask the participant", feedback: "Participants get questions about their own experience, not the team's question." },
          { id: "c", label: "In the closing section", feedback: "The close asks what you missed. The research question frames the whole guide." },
          { id: "d", label: "It is agreed by the team but not written down", feedback: "Unwritten, it drifts from one interview to the next." },
        ],
      },
    ],
    "uxr-m1-t9": [
      {
        question: "A team wants to know why new users abandon the sign-up form. Which method answers “why” most directly?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Analytics show where people leave and how many. To learn the reason you have to watch people try, or ask them about a specific attempt.",
        reviewTopicId: "uxr-m1-t2",
        reviewTopicTitle: "What UX research is, and what it is not",
        options: [
          { id: "a", label: "A survey sent to all registered users", feedback: "Registered users finished the form. The people who left are not in that list." },
          { id: "b", label: "Watching five people fill in the form and asking about what you saw", correct: true, feedback: "Correct. Observation shows where they stop, and the follow-up questions bring out the reason." },
          { id: "c", label: "The drop-off rate for each field in analytics", feedback: "That shows where and how many. It does not explain why." },
          { id: "d", label: "Asking the sales team what they think", feedback: "That gives you a hypothesis from people who are not the users." },
        ],
      },
      {
        question: "While observing someone at work, you see a handwritten list of codes taped to their monitor. What is this?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A workaround is something people make for themselves to fill a gap in a tool. It points to a need the product does not meet, and people rarely mention it in an interview because they no longer notice it.",
        reviewTopicId: "uxr-m1-t6",
        reviewTopicTitle: "Observing users in context",
        options: [
          { id: "a", label: "A sign that the person needs more training", feedback: "The list shows that the tool asks people to remember something it could show them." },
          { id: "b", label: "A detail to leave out because it is outside the software", feedback: "What happens around the software is exactly what observation is for." },
          { id: "c", label: "A workaround that marks an unmet need", correct: true, feedback: "Correct. It is evidence of a gap, and a good thing to ask about at the end of the session." },
          { id: "d", label: "A personal preference with no meaning for design", feedback: "People build workarounds when a tool makes them. It is worth a question." },
        ],
      },
      {
        question: "In notes from an observation, why keep what you saw separate from what you think it means?",
        platformPrompt: "Choose the correct option",
        explanation:
          "An observation is a fact others can check. An interpretation is your reading of it, and it may change when you compare notes from other sessions. Mixed together, the two cannot be told apart later.",
        reviewTopicId: "uxr-m1-t6",
        reviewTopicTitle: "Observing users in context",
        options: [
          { id: "a", label: "So that the notes are shorter", feedback: "Two columns are usually longer. The gain is that others can check the facts." },
          { id: "b", label: "Because interpretations are never useful", feedback: "They are useful, as long as they are labelled as interpretations." },
          { id: "c", label: "So that the team can test the interpretation against the facts", correct: true, feedback: "Correct. The observation stays fixed while the reading of it is discussed." },
          { id: "d", label: "Because participants ask to read the notes", feedback: "That is rare, and it is not the reason." },
        ],
      },
      {
        question: "Which statement belongs on a persona that comes from evidence?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A persona trait should describe a goal, a behaviour or a pain point seen in several participants. Invented detail and bare demographics do not help a design decision.",
        reviewTopicId: "uxr-m1-t8",
        reviewTopicTitle: "Personas that come from evidence",
        options: [
          { id: "a", label: "Loves yoga and owns a golden retriever", feedback: "Unless the research found it and it affects the design, it is decoration." },
          { id: "b", label: "Is 34 years old and lives in a large city", feedback: "Demographics alone say little about what the person does or needs." },
          { id: "c", label: "Confirms the headcount twice before booking, as three of five organisers did", correct: true, feedback: "Correct. It is a behaviour, and it is tied to the participants who showed it." },
          { id: "d", label: "Would pay for a premium version", feedback: "That is a prediction, not something that was observed." },
        ],
      },
    ],
    "uxr-m2-t8": [
      {
        question: "Which of these is an insight and not just a finding?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A finding reports what happened. An insight adds why it happens and what it means for the person, without naming a solution.",
        reviewTopicId: "uxr-m2-t1",
        reviewTopicTitle: "From findings to insights",
        options: [
          { id: "a", label: "Four of five organisers counted replies by hand.", feedback: "That is a finding: it reports what was seen." },
          { id: "b", label: "Organisers keep the headcount in their heads because they do not trust any tool to hold the final number.", correct: true, feedback: "Correct. It gives the behaviour and the reason behind it." },
          { id: "c", label: "Users need a headcount widget on the home screen.", feedback: "That is a solution dressed as an insight." },
          { id: "d", label: "One participant said the app was confusing.", feedback: "One comment from one person is a lead to follow up." },
        ],
      },
      {
        question: "During affinity mapping, which label is the most useful for a group of notes?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A label written as a sentence states what the notes have in common, which is the finding. A one-word label names a topic and leaves the learning unsaid.",
        reviewTopicId: "uxr-m2-t2",
        reviewTopicTitle: "Affinity mapping step by step",
        options: [
          { id: "a", label: "Reminders", feedback: "A topic. It does not say what you learned about reminders." },
          { id: "b", label: "Notifications and messaging", feedback: "Still a topic, and one that mirrors the product." },
          { id: "c", label: "Organisers send reminders by hand because they fear seeming pushy", correct: true, feedback: "Correct. A full sentence that states the pattern and its reason." },
          { id: "d", label: "Miscellaneous", feedback: "A group with this label has not been analysed yet." },
        ],
      },
      {
        question: "Which problem statement is well formed?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A problem statement names a specific user, a need written as something they are trying to do, and the reason from research. It contains no feature.",
        reviewTopicId: "uxr-m2-t6",
        reviewTopicTitle: "Writing a problem statement",
        options: [
          { id: "a", label: "Users need a reminder button on the invitation screen.", feedback: "It names a feature, so it is a solution." },
          { id: "b", label: "We should make group dining better for everyone.", feedback: "Too broad: no idea could be ruled out." },
          { id: "c", label: "An organiser of a group meal needs to know who is coming before the booking deadline, because the table is held only until then.", correct: true, feedback: "Correct. A user, a need and a reason, with no solution in it." },
          { id: "d", label: "Our booking conversion is lower than last quarter.", feedback: "That is a business metric, not a user's problem." },
        ],
      },
      {
        question: "“How might we add a countdown timer to the invitation?” What is wrong with this question?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A How Might We question should hold the problem and leave the solution open. This one allows a single idea. Asking about the outcome, such as getting replies before the deadline, opens it up.",
        reviewTopicId: "uxr-m2-t7",
        reviewTopicTitle: "How Might We questions",
        options: [
          { id: "a", label: "It is too broad", feedback: "It is the opposite: it allows only one answer." },
          { id: "b", label: "It already contains the solution", correct: true, feedback: "Correct. Remove the feature and ask about the outcome you want." },
          { id: "c", label: "It should begin with “Why”", feedback: "The form is fine. The content is the problem." },
          { id: "d", label: "Nothing: it is specific, which is good", feedback: "Specific about the problem is good. Specific about the feature closes the question." },
        ],
      },
    ],
  },
  assignments: {},
  ora: {
    "uxr-m1-t10": {
      brief:
        "Using the five interview transcripts of the case study (or your own interviews, if you have run at least three), draft one persona. Show the evidence behind it: the patterns you found across participants, and the quotes or observations that support each one.",
      deliverable:
        "Submit a PDF or DOCX of 1–2 pages: the persona (goals, behaviours, pain points, context) and an evidence table that links each trait to at least two participants.",
      dueLabel: "Due 24 Sep 2026",
      requiredReviews: 1,
      acceptedTypes: [".pdf", ".docx", ".png", ".jpg"],
      overallCommentPrompt: "Which part of your peer's persona was best supported by evidence?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Ground the persona in evidence",
          maxPoints: 6,
          options: [
            { points: 6, label: "Every trait is linked to two or more participants" },
            { points: 4, label: "Most traits are linked to evidence; some rest on one participant" },
            { points: 2, label: "Evidence is mentioned but not linked to traits" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Describe goals and behaviours",
          maxPoints: 5,
          options: [
            { points: 5, label: "Goals and behaviours are specific and come from the interviews" },
            { points: 3, label: "Goals are clear; behaviours are generic" },
            { points: 0, label: "Missing or invented" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Put the pain points in context",
          maxPoints: 5,
          options: [
            { points: 5, label: "Each pain point is tied to a situation and a consequence" },
            { points: 3, label: "Pain points are listed without context" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Keep the persona usable",
          maxPoints: 4,
          options: [
            { points: 4, label: "One page, easy to scan, no invented detail" },
            { points: 2, label: "Complete, but padded with detail the research does not support" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
    "uxr-m3-t10": {
      brief:
        "Build a low-fidelity prototype of one idea from your ideation work: paper sketches, or a simple clickable version. Before you show it to anyone, write the two or three questions it is meant to answer and what result would change your mind. Then test it with at least two people and report what happened.",
      deliverable:
        "Submit a PDF of up to 3 pages: photos or screenshots of the prototype, the questions it was built to answer, what each tester did, and the one change you will make next. You then review one peer's submission.",
      dueLabel: "Due 16 Oct 2026",
      requiredReviews: 1,
      acceptedTypes: [".pdf", ".png", ".jpg"],
      overallCommentPrompt: "Which of your peer's questions did the prototype answer most clearly, and what would you test next?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · State what the prototype is meant to find out",
          maxPoints: 5,
          options: [
            { points: 5, label: "Two or three specific questions, each with the result that would change the design" },
            { points: 3, label: "Questions are stated but could not be answered by a test" },
            { points: 0, label: "No questions stated" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Build only what the questions need",
          maxPoints: 5,
          options: [
            { points: 5, label: "The prototype covers the path under test and leaves the rest rough" },
            { points: 3, label: "The path is covered, with effort spent on detail the questions do not need" },
            { points: 1, label: "The prototype does not let a person attempt the task" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Report what testers did",
          maxPoints: 6,
          options: [
            { points: 6, label: "Describes what each tester did and said, kept apart from interpretation" },
            { points: 4, label: "Reports results in general terms, without the individual sessions" },
            { points: 2, label: "Reports opinions about the prototype, not behaviour" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Decide the next change",
          maxPoints: 4,
          options: [
            { points: 4, label: "One change, justified by what was observed" },
            { points: 2, label: "A change is proposed without a link to the test" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
  activities,
};
