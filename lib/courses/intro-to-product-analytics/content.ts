import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

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
    "ipa-m1-t2": {
      lede: "Analysis begins with a question someone needs answered in order to decide something. A metric is a way of making that question countable. The path from one to the other has a few steps, and skipping them is how teams end up with dashboards full of numbers that answer nothing.",
      sections: [
        {
          heading: "Find the decision behind the question",
          paragraphs: [
            "Questions arrive vague. “How is onboarding doing?” could mean a dozen things. Ask what will be decided with the answer. Perhaps the team must choose between rebuilding the sign-up flow and improving the first week of emails.",
            "Now the question is sharper. Where do new users of the meal-planning app give up before they save their first plan: during sign-up, or in the days after it? That can be answered with data, and the answer points to one option or the other.",
          ],
        },
        {
          heading: "Turn it into something you can count",
          paragraphs: [
            "A metric needs four things to be defined. What is counted: users, sessions or events. Which action qualifies: saved a meal plan. Over what period: within seven days of signing up. And among whom: users who signed up in the last month.",
            "Put together: the percentage of users who signed up in the last month and saved a meal plan within seven days. Change any of the four and you have a different metric with a different value. Most disagreements between two reports come down to one of these four being different without anyone having said so.",
          ],
        },
        {
          heading: "Prefer rates to totals",
          paragraphs: [
            "A total, such as plans saved this month, goes up when you have more users, whether or not the product is better. A rate, such as the share of new users who save a plan, tells you about the experience of a typical user and can be compared between months of different size.",
            "Totals have their place in sizing a business. For judging whether a change helped, use a rate or a per-user figure, and always state the denominator.",
          ],
        },
        {
          heading: "Check that the metric can be trusted",
          paragraphs: [
            "Ask whether the metric could move for a reason that has nothing to do with what you care about. If “time in app” goes up, are people more engaged or more lost? Ask whether it can be pushed up in a way that harms users. And say what you expect to see before you look. A number viewed with no expectation teaches little, because every result seems reasonable afterwards.",
          ],
        },
      ],
      pullQuote: {
        text: "A metric is a question with its definitions filled in. Leave one blank and two people will fill it in differently.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Start from the decision, then sharpen the question until data can answer it.",
        "Define what is counted, which action, over what period and among whom.",
        "Use rates with a stated denominator to judge a change.",
        "Write down what you expect before you look at the number.",
      ],
    },
    "ipa-m1-t4": {
      lede: "A tracking plan is the document that lists every event a product records, what each one means and what information comes with it. It is written before the code. Without one, each developer names events as they go, and a year later nobody can say what half of them count.",
      sections: [
        {
          heading: "Start from questions, not from screens",
          paragraphs: [
            "The temptation is to track every click “in case it is useful”. The result is hundreds of events, most never looked at, and the important ones buried among them. Start from the questions the team needs to answer and the metrics that follow from them.",
            "For the meal-planning app's activation rate you need to know that someone signed up and that someone saved a plan. That is two events. Add the steps in between where people might drop out: recipe added, plan started. Four or five events cover the whole question.",
          ],
        },
        {
          heading: "One row per event",
          paragraphs: [
            "Lay the plan out as a table. Each row has the event name, a plain description of exactly when it fires, the properties sent with it, and who owns it. “plan_saved: fires when the server confirms that a weekly plan with at least one recipe has been stored. It does not fire when the save button is tapped.”",
            "That last detail is the kind that matters. An event fired on the tap counts attempts, including the ones that failed. An event fired on confirmation counts successes. Both are legitimate. The plan has to say which.",
          ],
        },
        {
          heading: "Naming and properties",
          paragraphs: [
            "Choose one naming pattern and use it everywhere. A common one is object then action in the past tense, in lower case with underscores: recipe_added, plan_saved, subscription_cancelled. Consistency lets someone find an event they have never seen by guessing its name.",
            "Properties describe the event: the number of recipes in the plan, the device type, the screen it happened on. List the allowed values for each. If one team sends “iOS” and another sends “iphone”, every chart by device will split the same users into two groups. Never put personal data such as an email address or a full name into a property.",
          ],
        },
        {
          heading: "Keep it current",
          paragraphs: [
            "The plan is useful only while it matches what the product really sends. Make a change to the plan part of every feature that adds or alters an event. When a new event ships, check a few real records against the plan. Mark retired events as retired, and do not delete their rows, because old data still contains them and someone will need to know what they meant.",
          ],
        },
      ],
      pullQuote: {
        text: "If two people could read an event's description and count different things, the description is not finished.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Derive the events from the questions you need to answer; do not track everything.",
        "Describe exactly when each event fires: on the attempt, or on success.",
        "Use one naming pattern and fixed values for properties.",
        "Update the plan with every release and check real data against it.",
      ],
    },
    "ipa-m2-t2": {
      lede: "Activation is the point at which a new user first gets the value the product exists to give. Before it they are trying the product out. After it they have a reason to return. Defining that moment well is one of the most useful things an analyst can do for a product team.",
      sections: [
        {
          heading: "Value, not activity",
          paragraphs: [
            "Signing up is not activation. Nor is finishing a tutorial or opening the app on three separate days. Those are things the user does for the product. Activation is the first time the product does something for the user.",
            "For the meal-planning app, the promise is a week of dinners sorted out. A user who has saved a first weekly plan has received that. A user who has browsed forty recipes has not, however busy their session looks.",
          ],
        },
        {
          heading: "Finding the moment in the data",
          paragraphs: [
            "Start with candidates: actions a user could take in the first days that plausibly deliver value. Saved a plan. Added five recipes. Generated a shopping list. For each, compare the later retention of new users who did it with those who did not.",
            "Suppose 55 percent of users who saved a plan in their first week are still active after two months, against 8 percent of those who did not. That gap marks saving a plan as a strong candidate. Add a threshold and a time window where they sharpen the signal: one plan within seven days of sign-up.",
          ],
        },
        {
          heading: "Do not mistake the signal for the cause",
          paragraphs: [
            "The comparison shows that people who save a plan stay. It does not prove that getting more people to save a plan will make them stay. Users who save a plan may simply be those who arrived most motivated.",
            "The way to find out is an experiment: change onboarding so that more new users reach the moment, and see whether retention follows. If the team instead forces the action, for example by saving an automatic plan for everyone, the activation number rises and the retention may not move at all. The metric has been reached and the value has not.",
          ],
        },
        {
          heading: "Using the definition",
          paragraphs: [
            "Once agreed, the definition gives the team a rate to watch, the share of new users activated within seven days, and a clear aim for onboarding: shorten the path to that moment. Keep the definition stable so that months can be compared, and revisit it when the product's promise changes.",
          ],
        },
      ],
      pullQuote: {
        text: "Activation is the first time the product keeps its promise to a new user.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Activation is the first moment of value, not sign-up or general activity.",
        "Test candidate actions by comparing later retention of users who did and did not take them.",
        "Define it with an action, a threshold and a time window.",
        "A link with retention is not proof of cause: confirm with an experiment.",
      ],
    },
    "ipa-m2-t5": {
      lede: "An overall number describes an average user who does not exist. Segmentation splits users into groups and compares them. It is how you find out that a flat conversion rate is hiding one group that improved and another that got worse.",
      sections: [
        {
          heading: "Ways to split",
          paragraphs: [
            "Segments come from four kinds of information. Who the user is: plan type, country, household size. How they arrived: search, an advertisement, a friend's invitation. What they use: phone or laptop, app version. And what they have done: saved more than three plans, used the shopping list, never opened a reminder.",
            "Behavioural segments are usually the most revealing, because they describe what people do with the product, not who they are on paper.",
          ],
        },
        {
          heading: "Reading a comparison",
          paragraphs: [
            "Take the sign-up to first-plan conversion of the meal-planning app, at 30 percent overall. Split by device, it is 42 percent on a laptop and 22 percent on a phone. The question has changed from “how do we improve activation?” to “what is harder on a phone?”.",
            "Look at size as well as rate. If phone users are six in ten of all sign-ups, a small improvement there is worth more than a large one on the laptop. A segment with a striking rate and forty users in it is an anecdote.",
          ],
        },
        {
          heading: "When the mix changes",
          paragraphs: [
            "An overall rate can fall while every segment holds steady or even improves, because the mix of segments has shifted. Say a campaign brings in many phone users. They convert at the lower phone rate, so the overall figure drops, although nothing in the product got worse.",
            "Whenever an overall metric moves, check two things before you look for a cause in the product: did the rate change within segments, or did the proportions of the segments change? This check prevents a great many false alarms.",
          ],
        },
        {
          heading: "Discipline",
          paragraphs: [
            "With enough splits you will always find a segment that looks unusual, by chance alone. Decide which segments matter before you look, based on a reason to expect a difference. Treat a surprising gap found by exploring as a hypothesis to confirm on fresh data. And report segments with their sizes, so that readers can judge how much weight each one bears.",
          ],
        },
      ],
      pullQuote: {
        text: "When the overall number moves, ask first whether the users changed or their behaviour did.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Segment by who users are, how they arrived, what they use and what they do.",
        "Compare both the rate and the size of each segment.",
        "A change in the mix of segments can move the overall rate with no change in behaviour.",
        "Choose segments for a reason; confirm surprising gaps on new data.",
      ],
    },
    "ipa-m3-t5": {
      lede: "Churn is the share of customers who stop using or paying for a product in a period. It sounds simple until two teams report different churn figures for the same month. The difference is almost always in the definition, so the definition has to come first.",
      sections: [
        {
          heading: "What counts as gone",
          paragraphs: [
            "In a subscription product there is a clear event: the subscription ends. Even then you must choose. Does a customer churn on the day they cancel, or on the day their paid period runs out? Is a failed card payment churn?",
            "Separate voluntary churn, where the customer decided to leave, from involuntary churn, where a payment failed. They have different causes and different remedies. One calls for a better product. The other calls for a reminder to update a card.",
          ],
        },
        {
          heading: "Churn without a cancel button",
          paragraphs: [
            "Many users leave without cancelling anything. They just stop coming. For them you need an inactivity rule: a user has churned after a set number of days with no meaningful activity.",
            "Set the threshold from the product's natural rhythm. A meal planner is used weekly, so someone absent for four weeks has probably gone. A tax tool is used once a year, so four weeks of silence means nothing. Look at the gaps between visits of users who did return, and choose a threshold that few of them exceeded.",
          ],
        },
        {
          heading: "The calculation",
          paragraphs: [
            "The standard monthly rate is the customers lost during the month, divided by the customers at the start of the month. With 2,000 subscribers on the first day and 100 of them gone by the last, churn is 5 percent. Customers who joined during the month are left out of both numbers, since they were not there at the start.",
            "Customer churn counts people. Revenue churn counts the money they paid. If the customers who leave are mostly on the cheapest plan, revenue churn is lower than customer churn. Say which one you are reporting. A monthly figure also looks small beside what it becomes over a year: 5 percent a month leaves about 54 percent of customers after twelve months.",
          ],
        },
        {
          heading: "Write it down, then keep it",
          paragraphs: [
            "Put the definition in one sentence that anyone can apply: “A subscriber churns on the day their paid access ends without renewal. Failed payments are reported separately.” Record it in the same place as the tracking plan. Changing the definition changes the history, so if you must change it, recalculate past months and show both series for a while.",
          ],
        },
      ],
      pullQuote: {
        text: "Two churn figures that disagree are usually two definitions that nobody compared.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Decide when a customer counts as gone: at cancellation, at expiry or after a period of inactivity.",
        "Report voluntary and involuntary churn separately.",
        "Monthly churn is customers lost during the month over customers at its start.",
        "State whether you mean customers or revenue, and keep the definition stable.",
      ],
    },
    "ipa-m4-t2": {
      lede: "The test has run for its planned duration. Version B shows 33 percent of new users saving a plan, against 30 percent for version A. Before anyone celebrates, three questions need answers: could this be chance, how big is the effect really, and is it worth acting on?",
      sections: [
        {
          heading: "Significance: could it be chance?",
          paragraphs: [
            "Two random groups never behave identically, even when they see the same thing. A significance test asks: if the change made no difference at all, how often would a gap this large appear by luck? That probability is the p-value.",
            "By convention, a p-value below 0.05 is called statistically significant: such a gap would turn up less than one time in twenty if there were no real effect. The p-value is not the probability that B is better, and it says nothing about how much better.",
          ],
        },
        {
          heading: "Effect size: how much?",
          paragraphs: [
            "Look at the difference and at the confidence interval around it. A result reported as “plus 3 percentage points, 95 percent interval from 0.5 to 5.5” tells you that the true effect is probably positive and could be anywhere from slight to substantial.",
            "Be careful with the two ways of stating a change. From 30 to 33 percent is 3 percentage points, and it is also a 10 percent relative increase. Both are correct, and they sound very different. Say which one you mean.",
          ],
        },
        {
          heading: "Patience: do not peek",
          paragraphs: [
            "Early in a test the numbers swing widely. If you check every day and stop the first time the result crosses the significance line, you will declare a winner far more often than one time in twenty, even when nothing is going on. This is the most common way tests mislead.",
            "Fix the sample size and the duration beforehand, and read the result once, at the end. Run for whole weeks. Be wary of a jump in the first days caused by novelty, when existing users click on something simply because it is new.",
          ],
        },
        {
          heading: "From result to decision",
          paragraphs: [
            "Statistical significance does not make a result important. With a very large sample, a difference of 0.1 points can be significant and still not be worth the cost of maintaining the feature. Check the guardrail metrics as well: a version that raises plan saves and also raises cancellations is not a win. A test with no significant difference is a result too. It tells you the change was not worth much, and that is cheaper to learn from a test than from a launch.",
          ],
        },
      ],
      pullQuote: {
        text: "Significance tells you the effect is probably real. Only the effect size tells you whether it matters.",
        attribution: "Course notes, Module 4",
      },
      takeaways: [
        "A p-value is how often a gap this large would appear if there were no real effect.",
        "Report the effect with its confidence interval, and say points or percent.",
        "Set the duration in advance and read the result once, at the end.",
        "Weigh the size of the effect and the guardrail metrics before you ship.",
      ],
    },
    "ipa-m4-t5": {
      lede: "An analysis has done its job when someone decides something because of it. Most analyses never get that far. They are correct and thorough, and they are organised in the order the analyst did the work, which is the opposite of the order a reader needs.",
      sections: [
        {
          heading: "Conclusion first",
          paragraphs: [
            "Open with the answer and the recommendation in two or three sentences. “New users on phones activate at half the rate of those on laptops, and the gap opens at the recipe import step. We recommend redesigning that step for small screens before spending more on acquisition.”",
            "A reader who stops there has what they need. Everything after it is support for those who want to check your reasoning. Do not build up to the finding as though it were the end of a story. Your readers are busy, and they are not reading for suspense.",
          ],
        },
        {
          heading: "One chart per point",
          paragraphs: [
            "Each chart should make one point, and its title should state the point: “Phone users drop out at recipe import”, not “Funnel by device”. Remove everything that does not serve it: extra series, gridlines, a legend that could be a direct label.",
            "Choose the simplest form that shows the comparison, which is usually bars for categories and a line for change over time. Start bar charts at zero. Put the number that matters in the text as well, since a chart can be misread and a sentence less so.",
          ],
        },
        {
          heading: "Say how sure you are",
          paragraphs: [
            "State what the analysis rests on: the period, the number of users, the definitions used. Then say what it cannot tell you. “This shows where people drop out, not why. Five usability sessions on a phone would tell us why.”",
            "Naming the limits does not weaken the report. It tells the reader how much weight the conclusion will bear, and it protects you when someone tries to stretch the finding further than it goes.",
          ],
        },
        {
          heading: "End with the next step",
          paragraphs: [
            "Close with what should happen, who would do it and how you will know whether it worked. For example: redesign the import step, ship it as an A/B test, and measure the seven-day activation rate on phones. Put the method, the queries and the detailed tables in an appendix. Then read the first paragraph once more and ask whether a person who reads nothing else could act on it.",
          ],
        },
      ],
      pullQuote: {
        text: "Write the analysis in the order the reader needs it, which is the reverse of the order you did it.",
        attribution: "Course notes, Module 4",
      },
      takeaways: [
        "Put the answer and the recommendation in the first paragraph.",
        "One point per chart, stated in the chart's title.",
        "State the data, the definitions and what the analysis cannot show.",
        "End with an action, an owner and a measure of success.",
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
    "ipa-m1-t8": [
      {
        question: "A product lead asks, “How is onboarding doing?” What is the analyst's best first move?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A vague question hides a decision. Finding out what will be decided tells you which metric, which period and which users matter.",
        reviewTopicId: "ipa-m1-t2",
        reviewTopicTitle: "From business question to metric",
        options: [
          { id: "a", label: "Build a dashboard with every onboarding number available", feedback: "More numbers do not answer an unclear question." },
          { id: "b", label: "Ask what decision the answer will inform", correct: true, feedback: "Correct. The decision sharpens the question into something data can answer." },
          { id: "c", label: "Report the number of sign-ups last week", feedback: "That answers a different, narrower question." },
          { id: "d", label: "Wait for a more precise request", feedback: "Making the request precise is part of the analyst's job." },
        ],
      },
      {
        question: "Which metric tells you most about whether a redesigned sign-up flow helped new users?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A rate with a clear denominator and time window describes the experience of a typical new user and can be compared between periods of different size. Totals rise with traffic.",
        reviewTopicId: "ipa-m1-t2",
        reviewTopicTitle: "From business question to metric",
        options: [
          { id: "a", label: "Total plans saved this month", feedback: "It rises with the number of users, whatever the flow does." },
          { id: "b", label: "Total registered users", feedback: "A cumulative total that can only go up." },
          { id: "c", label: "The share of new sign-ups who saved a plan within seven days", correct: true, feedback: "Correct. A rate, with its denominator and window stated." },
          { id: "d", label: "Page views of the sign-up screen", feedback: "Views measure traffic, not success." },
        ],
      },
      {
        question: "A tracking plan says “plan_saved fires when the user taps Save”. Why might that be a problem?",
        platformPrompt: "Choose the correct option",
        explanation:
          "An event fired on the tap counts attempts, including the ones that fail. If the metric is meant to count plans really saved, the event should fire when the save is confirmed.",
        reviewTopicId: "ipa-m1-t4",
        reviewTopicTitle: "Writing a tracking plan",
        options: [
          { id: "a", label: "The name should be in capital letters", feedback: "Case is a convention. The meaning is the issue." },
          { id: "b", label: "It counts attempts, including saves that fail", correct: true, feedback: "Correct. The description decides what the number means." },
          { id: "c", label: "Taps cannot be tracked", feedback: "They can. The question is whether a tap is what you want to count." },
          { id: "d", label: "There is no problem", feedback: "A failed save would be counted as a success." },
        ],
      },
      {
        question: "Which is a sound north star metric for the meal-planning app?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A north star follows the value users get, can fall as well as rise, and can be influenced through the product. Saving a weekly plan is the value this app promises.",
        reviewTopicId: "ipa-m1-t5",
        reviewTopicTitle: "North star metrics and the inputs that move them",
        options: [
          { id: "a", label: "Total app downloads", feedback: "Cumulative, and a download is not use." },
          { id: "b", label: "Households that saved a meal plan this week", correct: true, feedback: "Correct. It rises and falls with the value delivered." },
          { id: "c", label: "Number of recipes in the database", feedback: "That measures the catalogue, not what users get from it." },
          { id: "d", label: "Advertising spend", feedback: "That is a cost the company controls, not an outcome for users." },
        ],
      },
    ],
    "ipa-m2-t7": [
      {
        question: "Of 5,000 visitors, 1,000 sign up and 400 save a first plan. What is the overall conversion from visit to plan?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Overall conversion compares the last step with the first: 400 of 5,000 is 8 percent. The step conversions are 20 percent (visit to sign-up) and 40 percent (sign-up to plan).",
        reviewTopicId: "ipa-m2-t1",
        reviewTopicTitle: "The funnel: where people drop out",
        options: [
          { id: "a", label: "40 percent", feedback: "That is the step conversion from sign-up to plan." },
          { id: "b", label: "20 percent", feedback: "That is the step conversion from visit to sign-up." },
          { id: "c", label: "8 percent", correct: true, feedback: "Correct. 400 divided by 5,000." },
          { id: "d", label: "60 percent", feedback: "That adds the two step rates, which has no meaning." },
        ],
      },
      {
        question: "Two analysts build the same funnel from the same data and get different conversion rates. What is the most likely reason?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Funnel numbers depend on definitions: unique users or events, strict order or any order, and the time window allowed. Different choices give different rates from the same data.",
        reviewTopicId: "ipa-m2-t1",
        reviewTopicTitle: "The funnel: where people drop out",
        options: [
          { id: "a", label: "One of them made an arithmetic error", feedback: "Possible, but the definitions are the more common cause." },
          { id: "b", label: "They used different conversion windows or counting rules", correct: true, feedback: "Correct. A one-day window and a thirty-day window give different rates." },
          { id: "c", label: "Funnels are unreliable by nature", feedback: "They are reliable once the definitions are stated." },
          { id: "d", label: "The data changes each time it is queried", feedback: "Past events do not change." },
        ],
      },
      {
        question: "Overall activation falls from 30 to 26 percent in a month. Within each device segment the rate is unchanged. What happened?",
        platformPrompt: "Choose the correct option",
        explanation:
          "When the rate inside each segment holds but the overall rate moves, the proportions of the segments have changed. More users arrived in the segment with the lower rate.",
        reviewTopicId: "ipa-m2-t5",
        reviewTopicTitle: "Segmentation: who behaves differently, and why it matters",
        options: [
          { id: "a", label: "The product got worse for everyone", feedback: "Then the rate inside the segments would have fallen too." },
          { id: "b", label: "The mix shifted towards the segment with the lower rate", correct: true, feedback: "Correct. Behaviour held steady. The population changed." },
          { id: "c", label: "The tracking is broken", feedback: "Nothing here points to that. Check the mix first." },
          { id: "d", label: "It is random noise", feedback: "A four-point move with steady segments has a clear explanation." },
        ],
      },
      {
        question: "Users who save a plan in their first week are far more likely to be active two months later. What can you conclude?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The comparison shows an association. Users who save a plan may have been more motivated from the start. An experiment that brings more users to that moment shows whether retention follows.",
        reviewTopicId: "ipa-m2-t2",
        reviewTopicTitle: "Defining activation: the first moment of value",
        options: [
          { id: "a", label: "Saving a plan causes retention, so save one automatically for everyone", feedback: "Forcing the action can raise the metric without delivering the value." },
          { id: "b", label: "Saving a plan is a strong candidate for the activation moment, to confirm with an experiment", correct: true, feedback: "Correct. A good signal, not yet proof of cause." },
          { id: "c", label: "Nothing: the two are unrelated", feedback: "A large gap in retention is worth acting on." },
          { id: "d", label: "Retention causes plan saving", feedback: "The plan was saved first. The order rules that out." },
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
  activities,
};
