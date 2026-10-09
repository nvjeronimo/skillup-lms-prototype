import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Kenji Watanabe",
    role: "Lead instructor · Intro to Product Analytics",
    updated: "August 2026",
  },
  quiz: [
    {
      question: "Two dashboards show different numbers for “sign-ups last week”. What do you check first?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Most disagreements between reports are disagreements of definition: which event, counted per user or per event, in which time zone and over which days.",
      options: [
        {
          id: "a",
          label: "What each one counts: the event, the unit and the dates",
          correct: true,
          feedback: "Correct. Agree on the definition before you look for an error.",
        },
        { id: "b", label: "Which dashboard was built more recently", feedback: "Newer is not the same as correct." },
        { id: "c", label: "Which number is higher", feedback: "The size of a number says nothing about how it was counted." },
        { id: "d", label: "Which one the leadership team uses", feedback: "That tells you which is trusted, not which is right." },
      ],
    },
    {
      question: "Which of these is the best definition of an activated user for a meal-planning app?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Activation marks the first time someone gets the value the product promises. For a meal planner that is a plan made, not an account created or a screen seen.",
      options: [
        { id: "a", label: "Created an account", feedback: "That is a sign-up. The person has not yet got anything from the product." },
        { id: "b", label: "Opened the app three times", feedback: "Opening the app is activity, not value." },
        { id: "c", label: "Saved a first weekly meal plan", correct: true, feedback: "Correct. It is the first moment the product did what it promises." },
        { id: "d", label: "Viewed the pricing page", feedback: "Interest in the price is not use of the product." },
      ],
    },
    {
      question: "What does a retention curve that flattens above zero tell you?",
      explanation:
        "A curve that levels off shows a group of people who keep coming back: the product has lasting value for them. A curve that keeps falling towards zero shows that nobody stays.",
      options: [
        { id: "a", label: "That acquisition has stopped", feedback: "Retention follows a cohort after it joined. It says nothing about new sign-ups." },
        { id: "b", label: "That some users keep getting value and stay", correct: true, feedback: "Correct. The level at which it flattens is the share that stays." },
        { id: "c", label: "That the data has stopped updating", feedback: "A flat curve is a result, not a fault." },
        { id: "d", label: "That every user has churned", feedback: "That would be a curve that reaches zero." },
      ],
    },
  ],
  articles: {
    "ipa-m3-t2": {
      lede: "An overall retention number mixes people who joined last week with people who joined last year. A cohort table separates them: each row is a group that started in the same period, followed week by week. This reading shows how to build one and how to read it in three directions.",
      sections: [
        {
          heading: "Build the table",
          paragraphs: [
            "Decide three things before you count. The cohort: people grouped by the week of their first activation. The return event: what counts as coming back, for example saving a meal plan, not only opening the app. The period: weeks suit a product used every few days, months suit one used a few times a year.",
            "Each row is a cohort. The first column is its size. Each column after that is the share of the cohort that did the return event in week 1, week 2 and so on after joining. Use percentages for reading and keep the counts beside them: 50% of 8 people is not a finding.",
          ],
        },
        {
          heading: "Read along a row",
          paragraphs: [
            "A row is the retention curve of one cohort. Look at where it drops fastest, usually between the first and second period, and at whether it levels off. A row that settles at 25% tells you a quarter of that group found a lasting use for the product.",
            "Recent cohorts have short rows, because their later weeks have not happened yet. The last cell of each row is often incomplete. Leave it out or mark it, or the newest cohorts will look worse than they are.",
          ],
        },
        {
          heading: "Read down a column, then along a diagonal",
          paragraphs: [
            "A column compares cohorts at the same age. If week 4 retention climbs from 22% to 30% over six cohorts, something improved for newer users: onboarding, the product, or the kind of people you now attract. This is the reading that tells you whether changes are working.",
            "A diagonal is one calendar week across all cohorts. A dip along a diagonal points to something that happened on a date, such as an outage, a holiday or a price change, not to something about a cohort. When you see an odd cell, check its diagonal before you explain it.",
          ],
        },
      ],
      pullQuote: {
        text: "Rows show how a group ages. Columns show whether you are getting better. Diagonals show what happened that week.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Fix the cohort, the return event and the period before you count.",
        "Keep cohort sizes beside the percentages.",
        "Compare cohorts down a column, at the same age.",
        "Mark incomplete periods so recent cohorts are not misread.",
      ],
    },
  },
  quizzes: {
    "ipa-m1-t7": [
      {
        question: "Which event name will still make sense to a new analyst in a year?",
        platformPrompt: "Choose the correct option",
        hints: [
          "A good name says what the person did.",
          "Look for an object and a verb in the past tense.",
        ],
        explanation:
          "Name the action the person completed, as object and past-tense verb. Names tied to the interface or to a ticket number lose their meaning when the interface changes.",
        reviewTopicId: "ipa-m1-t3",
        reviewTopicTitle: "Events, users and sessions: how product data is recorded",
        options: [
          { id: "a", label: "button_click_3", feedback: "Which button, and what did it do? The name does not say." },
          { id: "b", label: "meal_plan_saved", correct: true, feedback: "Correct. An object and what happened to it." },
          { id: "c", label: "new_flow_v2", feedback: "Version names describe the build, not the behaviour." },
          { id: "d", label: "event_tuesday_release", feedback: "A release date is not an action." },
        ],
      },
      {
        question: "A team picks “total registered users” as its north star metric. What is the weakness?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A cumulative total can only go up, whatever happens to the product. A north star should rise when users get more value and fall when they get less.",
        reviewTopicId: "ipa-m1-t5",
        reviewTopicTitle: "North star metrics and the inputs that move them",
        options: [
          { id: "a", label: "It is too hard to measure", feedback: "It is one of the easiest numbers to produce." },
          {
            id: "b",
            label: "It only ever goes up, so it cannot show that something got worse",
            correct: true,
            feedback: "Correct. A metric that cannot fall cannot warn you.",
          },
          { id: "c", label: "It changes too quickly", feedback: "A cumulative total changes slowly, and in one direction." },
          { id: "d", label: "It ignores revenue", feedback: "A north star need not be revenue. It needs to follow the value users get." },
        ],
      },
      {
        question: "What belongs in a tracking plan?",
        explanation:
          "A tracking plan is the agreed list of events, when each one fires and which properties it carries. Charts and targets come later and are built on it.",
        reviewTopicId: "ipa-m1-t4",
        reviewTopicTitle: "Writing a tracking plan",
        options: [
          {
            id: "a",
            label: "Each event, when it fires, its properties and who owns it",
            correct: true,
            feedback: "Correct. It is the contract between the people who build and the people who analyse.",
          },
          { id: "b", label: "The dashboards the team wants", feedback: "Dashboards are built from the events. They are not the plan." },
          { id: "c", label: "The quarterly targets", feedback: "Targets are set on metrics. The plan defines the events behind them." },
          { id: "d", label: "Every click in the product", feedback: "Tracking everything gives a pile nobody can read. Track what answers a question." },
        ],
      },
    ],
  },
  assignments: {
    "ipa-m2-t8": {
      brief:
        "Using the event table of the sample meal-planning app in the Downloads tab, build the funnel from first visit to first saved meal plan: visit, sign-up, first recipe added, first plan saved. Report the conversion at each step and overall, then split the funnel by one segment of your choice (device, acquisition channel or sign-up week) and say where the two groups differ most. Submit your work as a PDF or DOCX.",
      requirements: [
        "The funnel as a table and a chart, with counts and percentages at each step",
        "The conversion window you chose, and why",
        "One segment comparison and the step where it differs most",
        "Two sentences on what you would investigate next",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {
    "ipa-m4-t6": {
      brief:
        "Write a product health report for the sample meal-planning app, using the three months of event data in the Downloads tab. Answer three questions: how many new users reach their first saved plan, how many are still planning meals four weeks later, and what one change you would test first. Write for a product manager who has ten minutes.",
      deliverable:
        "Submit a PDF of 2 to 3 pages: one funnel, one cohort table or retention curve, the definitions you used for each metric, and a test proposal with its hypothesis and the metric that would decide it.",
      dueLabel: "Due 9 Sep 2026",
      requiredReviews: 2,
      acceptedTypes: [".pdf", ".docx"],
      overallCommentPrompt: "Which finding in your peer's report would you act on first, and why?",
      criteria: [
        {
          id: "c1",
          label: "Task 1 · Define the metrics",
          maxPoints: 5,
          options: [
            { points: 5, label: "Every metric says what is counted, per what, over which period" },
            { points: 3, label: "Metrics are named; some definitions are missing" },
            { points: 0, label: "Numbers with no definitions" },
          ],
        },
        {
          id: "c2",
          label: "Task 2 · Analyse activation and retention",
          maxPoints: 6,
          options: [
            { points: 6, label: "Funnel and cohort view are correct and read in the text" },
            { points: 4, label: "Both are present; one is misread or left unexplained" },
            { points: 2, label: "Only one of the two is present" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c3",
          label: "Task 3 · Propose a test",
          maxPoints: 5,
          options: [
            { points: 5, label: "A hypothesis that follows from the findings, with the metric that decides it" },
            { points: 3, label: "A change is proposed without a hypothesis or a deciding metric" },
            { points: 0, label: "Not attempted" },
          ],
        },
        {
          id: "c4",
          label: "Task 4 · Write for the reader",
          maxPoints: 4,
          options: [
            { points: 4, label: "The answer comes first; charts have titles that state the finding" },
            { points: 2, label: "Complete, but the reader has to search for the conclusion" },
            { points: 0, label: "Not attempted" },
          ],
        },
      ],
    },
  },
};
