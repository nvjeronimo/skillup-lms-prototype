import type { Course } from "@/lib/courses/kit";

/**
 * "Social Media and Ecommerce Marketing": course 5 of the AI Augmented Digital Marketing
 * program, not started. 64 topics in 5 modules, none done; Module 5 is locked until
 * Module 4 is complete. It opens on "Course Introduction", as the Program page says.
 */
export const outline: Course = {
  id: "smec",
  slug: "social-media-and-ecommerce-marketing",
  title: "Social Media and Ecommerce Marketing",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 5,
  modules: [
    {
      id: "smec-m1",
      label: "MODULE 01",
      title: "Social Media Strategy & Platform Fundamentals",
      topicsCompleted: 0,
      topicsTotal: 14,
      isCompleted: false,
      lessons: [
        {
          id: "smec-m1-l1",
          label: "Strategy before platforms",
          topics: [
            {
              id: "smec-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "6 min",
              completed: false,
              transcript: [
                { id: "smec-m1-t1-ln1", ts: "0:00", text: "Welcome to course 5 of the program. So far you have worked on content, search and paid media. This course is about the two places where a customer meets the brand most often: the social feed and the store." },
                { id: "smec-m1-t1-ln2", ts: "0:19", text: "We treat them as one journey. A post earns attention, a profile or a shop turns that attention into a visit, and a product page turns the visit into an order." },
                { id: "smec-m1-t1-ln3", ts: "0:37", text: "There are five modules. The first two cover social media: strategy and platforms, then content, community and creators." },
                { id: "smec-m1-t1-ln4", ts: "0:52", text: "Modules 3 and 4 cover ecommerce: selling inside social platforms, the storefront itself, and then conversion, retention and measurement." },
                { id: "smec-m1-t1-ln5", ts: "1:08", text: "You will use an AI assistant throughout: to audit a profile, to draft a week of posts, to rewrite a product page. Each time, you write the brief and you check the result." },
                { id: "smec-m1-t1-ln6", ts: "1:26", text: "Four assignments count towards your grade, one per module. In Module 5 you bring them together in a launch plan for one product, which two peers review." },
                { id: "smec-m1-t1-ln7", ts: "1:44", text: "Pick a business to work on now: your own, your employer's, or the case-study shop in Handouts. You will use the same one in every assignment." },
                { id: "smec-m1-t1-ln8", ts: "2:01", text: "Let's start with the question most teams skip: what is social media for, in this business?" },
              ],
            },
            { id: "smec-m1-t2", type: "Reading", title: "What social media is for: reach, relationship and revenue", duration: "approx. 10 min read", completed: false },
            { id: "smec-m1-t3", type: "Video", title: "Choosing platforms by audience and job, not by trend", duration: "12 min", completed: false },
            { id: "smec-m1-t4", type: "Reading", title: "How feeds rank content: signals you can and cannot influence", duration: "approx. 12 min read", completed: false },
            { id: "smec-m1-t5", type: "Video", title: "Setting social objectives and the metrics behind them", duration: "12 min", completed: false },
            { id: "smec-m1-t6", type: "Activity", title: "Map three audiences to the platforms they use", duration: "approx. 15 min", completed: false },
            { id: "smec-m1-t7", type: "Practice Assignment", title: "Practice Quiz: Platforms and objectives", duration: "approx. 10 min", completed: false },
          ],
        },
        {
          id: "smec-m1-l2",
          label: "Profiles, pillars and listening",
          topics: [
            { id: "smec-m1-t8", type: "Video", title: "Profiles that turn a visit into a follow", duration: "10 min", completed: false },
            { id: "smec-m1-t9", type: "Reading", title: "Content pillars: what the brand talks about, and what it does not", duration: "approx. 10 min read", completed: false },
            { id: "smec-m1-t10", type: "Video", title: "Auditing a social presence with an AI assistant", duration: "14 min", completed: false },
            { id: "smec-m1-t11", type: "Reading", title: "Social listening: what your audience already says", duration: "approx. 12 min read", completed: false },
            { id: "smec-m1-t12", type: "Activity", title: "Compare two competitors with the audit template", duration: "approx. 20 min", completed: false },
            { id: "smec-m1-t13", type: "Graded Assignment", title: "Assignment 01 · Platform and audience audit", duration: "approx. 40 min", completed: false },
            { id: "smec-m1-t14", type: "Quiz", title: "Graded Quiz: Social strategy and platforms", duration: "approx. 10 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "smec-m2",
      label: "MODULE 02",
      title: "Content, Community & Creator Partnerships",
      topicsCompleted: 0,
      topicsTotal: 14,
      isCompleted: false,
      lessons: [
        {
          id: "smec-m2-l1",
          label: "Content that earns attention",
          topics: [
            { id: "smec-m2-t1", type: "Video", title: "Formats and what each is good at: short video, carousels, stories, live", duration: "14 min", completed: false },
            { id: "smec-m2-t2", type: "Reading", title: "Hooks, captions and calls to action", duration: "approx. 10 min read", completed: false },
            { id: "smec-m2-t3", type: "Video", title: "Drafting a week of posts with an AI assistant", duration: "14 min", completed: false },
            { id: "smec-m2-t4", type: "Reading", title: "Repurposing one idea across platforms", duration: "approx. 10 min read", completed: false },
            { id: "smec-m2-t5", type: "Activity", title: "Turn one article into five social posts", duration: "approx. 20 min", completed: false },
            { id: "smec-m2-t6", type: "Video", title: "The content calendar and the approval flow", duration: "12 min", completed: false },
            { id: "smec-m2-t7", type: "Practice Assignment", title: "Practice Quiz: Formats and calendars", duration: "approx. 10 min", completed: false },
          ],
        },
        {
          id: "smec-m2-l2",
          label: "Community and creators",
          topics: [
            { id: "smec-m2-t8", type: "Reading", title: "Community management: replies, moderation and response times", duration: "approx. 12 min read", completed: false },
            { id: "smec-m2-t9", type: "Video", title: "Sorting comments and messages with AI, and where a person takes over", duration: "12 min", completed: false },
            { id: "smec-m2-t10", type: "Reading", title: "Working with creators: briefs, usage rights and disclosure", duration: "approx. 12 min read", completed: false },
            { id: "smec-m2-t11", type: "Video", title: "Choosing creators by fit and engagement, not follower count", duration: "12 min", completed: false },
            { id: "smec-m2-t12", type: "Activity", title: "Write a creator brief for one product", duration: "approx. 15 min", completed: false },
            { id: "smec-m2-t13", type: "Reading", title: "Answering a complaint in public: a worked case", duration: "approx. 8 min read", completed: false },
            { id: "smec-m2-t14", type: "Graded Assignment", title: "Assignment 02 · Two-week content calendar", duration: "approx. 40 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "smec-m3",
      label: "MODULE 03",
      title: "Social Commerce & Ecommerce Storefronts",
      topicsCompleted: 0,
      topicsTotal: 14,
      isCompleted: false,
      lessons: [
        {
          id: "smec-m3-l1",
          label: "Selling where people scroll",
          topics: [
            { id: "smec-m3-t1", type: "Video", title: "From post to purchase: how social commerce works", duration: "12 min", completed: false },
            { id: "smec-m3-t2", type: "Reading", title: "Shops, product tags and catalogues: the moving parts", duration: "approx. 12 min read", completed: false },
            { id: "smec-m3-t3", type: "Video", title: "Setting up a product catalogue and keeping it in sync", duration: "14 min", completed: false },
            { id: "smec-m3-t4", type: "Reading", title: "Live shopping and shoppable video: when they pay off", duration: "approx. 10 min read", completed: false },
            { id: "smec-m3-t5", type: "Activity", title: "Tag products in three sample posts", duration: "approx. 15 min", completed: false },
            { id: "smec-m3-t6", type: "Practice Assignment", title: "Practice Quiz: Social commerce basics", duration: "approx. 10 min", completed: false },
          ],
        },
        {
          id: "smec-m3-l2",
          label: "The storefront",
          topics: [
            { id: "smec-m3-t7", type: "Video", title: "Anatomy of a product page that sells", duration: "14 min", completed: false },
            { id: "smec-m3-t8", type: "Reading", title: "Writing product titles and descriptions with an AI assistant", duration: "approx. 12 min read", completed: false },
            { id: "smec-m3-t9", type: "Video", title: "Product photos and generated imagery: what must stay true", duration: "12 min", completed: false },
            { id: "smec-m3-t10", type: "Reading", title: "Marketplace or your own store: fees, control and customer data", duration: "approx. 12 min read", completed: false },
            { id: "smec-m3-t11", type: "Activity", title: "Rewrite a product page from customers' questions", duration: "approx. 20 min", completed: false },
            { id: "smec-m3-t12", type: "Reading", title: "Reviews and customer content as proof", duration: "approx. 8 min read", completed: false },
            { id: "smec-m3-t13", type: "Graded Assignment", title: "Assignment 03 · Product page and shop listing", duration: "approx. 40 min", completed: false },
            { id: "smec-m3-t14", type: "Quiz", title: "Graded Quiz: Social commerce and storefronts", duration: "approx. 10 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "smec-m4",
      label: "MODULE 04",
      title: "Ecommerce Growth: Conversion, Retention & Analytics",
      topicsCompleted: 0,
      topicsTotal: 14,
      isCompleted: false,
      lessons: [
        {
          id: "smec-m4-l1",
          label: "Conversion",
          topics: [
            { id: "smec-m4-t1", type: "Video", title: "The ecommerce funnel: sessions, carts, checkouts, orders", duration: "12 min", completed: false },
            { id: "smec-m4-t2", type: "Reading", title: "Reading a funnel report: where shoppers leave, and why", duration: "approx. 12 min read", completed: false },
            { id: "smec-m4-t3", type: "Video", title: "Checkout friction: delivery costs, payment and trust", duration: "12 min", completed: false },
            { id: "smec-m4-t4", type: "Reading", title: "Abandoned carts: reminders that help and reminders that annoy", duration: "approx. 10 min read", completed: false },
            { id: "smec-m4-t5", type: "Activity", title: "Find the biggest leak in a sample funnel", duration: "approx. 20 min", completed: false },
            { id: "smec-m4-t6", type: "Video", title: "Testing one change at a time in a small store", duration: "12 min", completed: false },
            { id: "smec-m4-t7", type: "Practice Assignment", title: "Practice Quiz: Funnel metrics", duration: "approx. 10 min", completed: false },
          ],
        },
        {
          id: "smec-m4-l2",
          label: "Retention and measurement",
          topics: [
            { id: "smec-m4-t8", type: "Reading", title: "Average order value, repeat rate and customer lifetime value", duration: "approx. 12 min read", completed: false },
            { id: "smec-m4-t9", type: "Video", title: "Bundles, cross-sells and AI recommendations", duration: "14 min", completed: false },
            { id: "smec-m4-t10", type: "Reading", title: "Attribution for social: tagged links, platform reports and their limits", duration: "approx. 12 min read", completed: false },
            { id: "smec-m4-t11", type: "Video", title: "A weekly ecommerce dashboard you will actually read", duration: "12 min", completed: false },
            { id: "smec-m4-t12", type: "Activity", title: "Tag five campaign links and find them in a report", duration: "approx. 15 min", completed: false },
            { id: "smec-m4-t13", type: "Reading", title: "Customer data, consent and privacy in ecommerce", duration: "approx. 10 min read", completed: false },
            { id: "smec-m4-t14", type: "Graded Assignment", title: "Assignment 04 · Funnel and retention analysis", duration: "approx. 40 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "smec-m5",
      label: "MODULE 05",
      title: "Final Project, Assessment, and Wrap-Up",
      topicsCompleted: 0,
      topicsTotal: 8,
      isCompleted: false,
      lessons: [
        {
          id: "smec-m5-l1",
          label: "Final project",
          topics: [
            { id: "smec-m5-t1", type: "Reading", title: "Final project brief: a social commerce launch plan", duration: "approx. 12 min read", completed: false, locked: true },
            { id: "smec-m5-t2", type: "Video", title: "Planning a launch: channels, calendar and budget", duration: "12 min", completed: false, locked: true },
            { id: "smec-m5-t3", type: "Activity", title: "Draft the launch timeline", duration: "approx. 15 min", completed: false, locked: true },
            { id: "smec-m5-t4", type: "Project", title: "Final Project: Social commerce launch plan", duration: "approx. 90 min", completed: false, locked: true },
            { id: "smec-m5-t5", type: "Peer Review", title: "Review two launch plans", duration: "approx. 20 min", completed: false, locked: true },
          ],
        },
        {
          id: "smec-m5-l2",
          label: "Assessment and wrap-up",
          topics: [
            { id: "smec-m5-t6", type: "Reading", title: "How the final assessment works", duration: "approx. 6 min read", completed: false, locked: true },
            { id: "smec-m5-t7", type: "Quiz", title: "Final Assessment", duration: "approx. 20 min", completed: false, locked: true },
            { id: "smec-m5-t8", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
