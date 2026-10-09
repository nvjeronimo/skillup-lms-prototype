import type { Course } from "@/lib/courses/kit";

/**
 * "Paid Advertising, Media & AI-Integrated Campaign Strategy": course 4 of the AI Augmented
 * Digital Marketing program. 54 topics, none done: the learner has not started it, so it
 * opens on its "Course Introduction" video. Module 4 is locked until Module 3 is complete.
 */
export const outline: Course = {
  id: "paid",
  slug: "paid-advertising-media-and-ai-integrated-campaign-strategy",
  title: "Paid Advertising, Media & AI-Integrated Campaign Strategy",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 4,
  modules: [
    {
      id: "paid-m1",
      label: "MODULE 01",
      title: "Paid Media Foundations & Search Advertising",
      topicsCompleted: 0,
      topicsTotal: 16,
      isCompleted: false,
      lessons: [
        {
          id: "paid-m1-l1",
          label: "How paid media works",
          topics: [
            {
              id: "paid-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "6 min",
              completed: false,
              active: true,
              transcript: [
                { id: "paid-m1-t1-ln1", ts: "0:00", text: "Welcome to course 4. In course 3 you earned attention. In this course you buy it, and you learn to buy it carefully." },
                { id: "paid-m1-t1-ln2", ts: "0:16", text: "Paid media is any placement you pay for: an ad above the search results, a post in a social feed, a banner on a news site, a video before another video." },
                { id: "paid-m1-t1-ln3", ts: "0:35", text: "Most of it is sold by auction, and most of the bidding is now automated. That changes your job from setting bids to setting goals, budgets and limits." },
                { id: "paid-m1-t1-ln4", ts: "0:54", text: "Module 1 covers how auctions work and how to build a search campaign. Module 2 covers social, display and video, and how to plan a budget across them." },
                { id: "paid-m1-t1-ln5", ts: "1:13", text: "Module 3 is about measurement and testing, and about working with automated campaigns: what you control, what you do not, and the guardrails you set." },
                { id: "paid-m1-t1-ln6", ts: "1:32", text: "You do not need an advertising account or a budget. Every exercise uses the sample accounts and reports in the Handouts." },
                { id: "paid-m1-t1-ln7", ts: "1:48", text: "In Module 4 you plan an integrated campaign for one product. The first reading is next: paid media in the marketing mix." },
              ],
            },
            { id: "paid-m1-t2", type: "Reading", title: "Paid media in the marketing mix", duration: "approx. 10 min read", completed: false },
            { id: "paid-m1-t3", type: "Video", title: "How an ad auction works: bids, quality and rank", duration: "14 min", completed: false },
            { id: "paid-m1-t4", type: "Reading", title: "Pricing models: cost per thousand, per click and per action", duration: "approx. 10 min read", completed: false },
            { id: "paid-m1-t5", type: "Video", title: "Campaign structure: accounts, campaigns and ad groups", duration: "12 min", completed: false },
            { id: "paid-m1-t6", type: "Activity", title: "Sort twenty keywords into ad groups", duration: "approx. 20 min", completed: false },
          ],
        },
        {
          id: "paid-m1-l2",
          label: "Search campaigns",
          topics: [
            { id: "paid-m1-t7", type: "Video", title: "Keywords and match types", duration: "14 min", completed: false },
            { id: "paid-m1-t8", type: "Reading", title: "Negative keywords and the search terms report", duration: "approx. 10 min read", completed: false },
            { id: "paid-m1-t9", type: "Video", title: "Writing search ads with an AI assistant", duration: "16 min", completed: false },
            { id: "paid-m1-t10", type: "Reading", title: "Landing pages that keep the promise of the ad", duration: "approx. 12 min read", completed: false },
            { id: "paid-m1-t11", type: "Activity", title: "Draft three ad variants from one brief", duration: "approx. 25 min", completed: false },
          ],
        },
        {
          id: "paid-m1-l3",
          label: "Budgets and bidding",
          topics: [
            { id: "paid-m1-t12", type: "Video", title: "Budgets, bid strategies and automated bidding", duration: "16 min", completed: false },
            { id: "paid-m1-t13", type: "Reading", title: "Quality signals and what lowers your cost per click", duration: "approx. 10 min read", completed: false },
            { id: "paid-m1-t14", type: "Practice Assignment", title: "Practice Quiz: Auctions and search ads", duration: "approx. 10 min", completed: false },
            { id: "paid-m1-t15", type: "Graded Assignment", title: "Assignment 01 · Search campaign plan", duration: "approx. 45 min", completed: false },
            { id: "paid-m1-t16", type: "Quiz", title: "Graded Quiz: Paid media foundations", duration: "approx. 15 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "paid-m2",
      label: "MODULE 02",
      title: "Social, Display and Video Advertising",
      topicsCompleted: 0,
      topicsTotal: 16,
      isCompleted: false,
      lessons: [
        {
          id: "paid-m2-l1",
          label: "Paid social",
          topics: [
            { id: "paid-m2-t1", type: "Video", title: "How paid social differs from search", duration: "12 min", completed: false },
            { id: "paid-m2-t2", type: "Reading", title: "Audiences: interests, customer lists and lookalikes", duration: "approx. 12 min read", completed: false },
            { id: "paid-m2-t3", type: "Video", title: "Creative that stops the scroll: hook, proof and offer", duration: "14 min", completed: false },
            { id: "paid-m2-t4", type: "Reading", title: "Ad formats: image, carousel, short video and stories", duration: "approx. 10 min read", completed: false },
            { id: "paid-m2-t5", type: "Activity", title: "Write hooks for one product and three audiences", duration: "approx. 20 min", completed: false },
            { id: "paid-m2-t6", type: "Video", title: "Generating creative variants with AI tools", duration: "14 min", completed: false },
          ],
        },
        {
          id: "paid-m2-l2",
          label: "Display, video and retargeting",
          topics: [
            { id: "paid-m2-t7", type: "Video", title: "Display and programmatic buying in plain terms", duration: "14 min", completed: false },
            { id: "paid-m2-t8", type: "Reading", title: "Brand safety, placements and exclusions", duration: "approx. 10 min read", completed: false },
            { id: "paid-m2-t9", type: "Video", title: "Video advertising: skippable, in-feed and connected TV", duration: "14 min", completed: false },
            { id: "paid-m2-t10", type: "Reading", title: "Retargeting and frequency caps", duration: "approx. 10 min read", completed: false },
            { id: "paid-m2-t11", type: "Reading", title: "Privacy, consent and advertising without third-party cookies", duration: "approx. 12 min read", completed: false },
          ],
        },
        {
          id: "paid-m2-l3",
          label: "Media planning",
          topics: [
            { id: "paid-m2-t12", type: "Video", title: "Reach, frequency and the media plan", duration: "16 min", completed: false },
            { id: "paid-m2-t13", type: "Reading", title: "Splitting a budget across channels", duration: "approx. 12 min read", completed: false },
            { id: "paid-m2-t14", type: "Practice Assignment", title: "Practice Quiz: Social, display and video", duration: "approx. 10 min", completed: false },
            { id: "paid-m2-t15", type: "Activity", title: "Build a one-month media plan", duration: "approx. 25 min", completed: false },
            { id: "paid-m2-t16", type: "Graded Assignment", title: "Assignment 02 · Paid social campaign brief", duration: "approx. 45 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "paid-m3",
      label: "MODULE 03",
      title: "Measurement, Optimization & AI-Integrated Strategy",
      topicsCompleted: 0,
      topicsTotal: 16,
      isCompleted: false,
      lessons: [
        {
          id: "paid-m3-l1",
          label: "Tracking and attribution",
          topics: [
            { id: "paid-m3-t1", type: "Video", title: "Conversion tracking: tags, pixels and events", duration: "14 min", completed: false },
            { id: "paid-m3-t2", type: "Reading", title: "Naming campaigns and tagging links", duration: "approx. 10 min read", completed: false },
            { id: "paid-m3-t3", type: "Video", title: "Attribution models and what each one hides", duration: "14 min", completed: false },
            { id: "paid-m3-t4", type: "Reading", title: "Return on ad spend, cost per acquisition and incrementality", duration: "approx. 12 min read", completed: false },
            { id: "paid-m3-t5", type: "Activity", title: "Read a campaign report and find the waste", duration: "approx. 20 min", completed: false },
          ],
        },
        {
          id: "paid-m3-l2",
          label: "Testing and optimization",
          topics: [
            { id: "paid-m3-t6", type: "Video", title: "Designing an A/B test for ads", duration: "14 min", completed: false },
            { id: "paid-m3-t7", type: "Reading", title: "Sample size and when to stop a test", duration: "approx. 10 min read", completed: false },
            { id: "paid-m3-t8", type: "Video", title: "Optimization routines: daily, weekly and monthly", duration: "12 min", completed: false },
            { id: "paid-m3-t9", type: "Reading", title: "Landing page tests that move the conversion rate", duration: "approx. 10 min read", completed: false },
            { id: "paid-m3-t10", type: "Practice Assignment", title: "Practice Quiz: Measurement and testing", duration: "approx. 10 min", completed: false },
          ],
        },
        {
          id: "paid-m3-l3",
          label: "AI-integrated campaign strategy",
          topics: [
            { id: "paid-m3-t11", type: "Video", title: "Automated campaign types: what you control and what you do not", duration: "16 min", completed: false },
            { id: "paid-m3-t12", type: "Reading", title: "Feeding the algorithm: signals, creative and budgets", duration: "approx. 12 min read", completed: false },
            { id: "paid-m3-t13", type: "Video", title: "An AI-assisted campaign workflow, from brief to report", duration: "18 min", completed: false },
            { id: "paid-m3-t14", type: "Reading", title: "Guardrails: brand, budget and policy checks", duration: "approx. 10 min read", completed: false },
            { id: "paid-m3-t15", type: "Activity", title: "Write the guardrails for an automated campaign", duration: "approx. 20 min", completed: false },
            { id: "paid-m3-t16", type: "Quiz", title: "Graded Quiz: Measurement and AI-integrated strategy", duration: "approx. 15 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "paid-m4",
      label: "MODULE 04",
      title: "Final Project, Assessment, and Wrap-Up",
      topicsCompleted: 0,
      topicsTotal: 6,
      isCompleted: false,
      lessons: [
        {
          id: "paid-m4-l1",
          label: "Final project",
          topics: [
            { id: "paid-m4-t1", type: "Reading", title: "Final project brief: an integrated campaign plan", duration: "approx. 15 min read", completed: false, locked: true },
            { id: "paid-m4-t2", type: "Video", title: "Planning your integrated campaign plan", duration: "14 min", completed: false, locked: true },
            { id: "paid-m4-t3", type: "Project", title: "Final Project: Integrated campaign plan", duration: "approx. 2 h", completed: false, locked: true },
            { id: "paid-m4-t4", type: "Peer Review", title: "Review two campaign plans", duration: "approx. 20 min", completed: false, locked: true },
          ],
        },
        {
          id: "paid-m4-l2",
          label: "Assessment and wrap-up",
          topics: [
            { id: "paid-m4-t5", type: "Quiz", title: "Final Assessment", duration: "approx. 20 min", completed: false, locked: true },
            { id: "paid-m4-t6", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
