import type { Course } from "@/lib/courses/kit";

/**
 * "SEO, GEO, and Organic Growth with AI": course 3 of the AI Augmented Digital Marketing
 * program. 43 topics, none done: the learner has not started it, so it opens on its
 * "Course Introduction" video. Module 4 is locked until Module 3 is complete.
 */
export const outline: Course = {
  id: "seo",
  slug: "seo-geo-and-organic-growth-with-ai",
  title: "SEO, GEO, and Organic Growth with AI",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 4,
  modules: [
    {
      id: "seo-m1",
      label: "MODULE 01",
      title: "How Search Works & Keyword Strategy",
      topicsCompleted: 0,
      topicsTotal: 12,
      isCompleted: false,
      lessons: [
        {
          id: "seo-m1-l1",
          label: "Search engines and intent",
          topics: [
            {
              id: "seo-m1-t1",
              type: "Video",
              title: "Course Introduction",
              duration: "6 min",
              completed: false,
              active: true,
              transcript: [
                { id: "seo-m1-t1-ln1", ts: "0:00", text: "Welcome to course 3. This course is about being found without paying for the click: in search results and in the answers AI assistants give." },
                { id: "seo-m1-t1-ln2", ts: "0:17", text: "SEO, search engine optimization, is the work of making pages that a search engine can read, trust and rank for what people look for." },
                { id: "seo-m1-t1-ln3", ts: "0:35", text: "GEO, generative engine optimization, is newer. It is the work of being a source that an AI answer quotes or names." },
                { id: "seo-m1-t1-ln4", ts: "0:52", text: "The two share most of their foundations. Clear pages, real expertise and a good reputation help in both, so we teach them together." },
                { id: "seo-m1-t1-ln5", ts: "1:10", text: "Module 1 covers how search works and how to choose keywords. Module 2 covers the page and the site. Module 3 covers GEO, authority and measurement." },
                { id: "seo-m1-t1-ln6", ts: "1:30", text: "You will use an AI assistant throughout: to expand keyword lists, to draft content briefs and to check pages. You stay the editor." },
                { id: "seo-m1-t1-ln7", ts: "1:48", text: "In Module 4 you build an organic growth plan for one site. The first reading is next: how a search engine crawls, indexes and ranks." },
              ],
            },
            { id: "seo-m1-t2", type: "Reading", title: "How a search engine crawls, indexes and ranks", duration: "approx. 12 min read", completed: false },
            { id: "seo-m1-t3", type: "Video", title: "Reading a results page: links, snippets and AI answers", duration: "14 min", completed: false },
            { id: "seo-m1-t4", type: "Reading", title: "Search intent: informational, navigational, commercial and transactional", duration: "approx. 12 min read", completed: false },
            { id: "seo-m1-t5", type: "Activity", title: "Label the intent behind ten queries", duration: "approx. 20 min", completed: false },
            { id: "seo-m1-t6", type: "Video", title: "Organic growth as a system: demand, content and authority", duration: "12 min", completed: false },
          ],
        },
        {
          id: "seo-m1-l2",
          label: "Keyword research with AI",
          topics: [
            { id: "seo-m1-t7", type: "Video", title: "Building a seed list and expanding it with an AI assistant", duration: "16 min", completed: false },
            { id: "seo-m1-t8", type: "Reading", title: "Volume, difficulty and business value: choosing keywords", duration: "approx. 15 min read", completed: false },
            { id: "seo-m1-t9", type: "Reading", title: "Grouping keywords into topic clusters", duration: "approx. 12 min read", completed: false },
            { id: "seo-m1-t10", type: "Practice Assignment", title: "Practice Quiz: Intent and keywords", duration: "approx. 10 min", completed: false },
            { id: "seo-m1-t11", type: "Graded Assignment", title: "Assignment 01 · Keyword map", duration: "approx. 45 min", completed: false },
            { id: "seo-m1-t12", type: "Quiz", title: "Graded Quiz: Search and keyword strategy", duration: "approx. 15 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "seo-m2",
      label: "MODULE 02",
      title: "On-Page, Technical and Content SEO",
      topicsCompleted: 0,
      topicsTotal: 13,
      isCompleted: false,
      lessons: [
        {
          id: "seo-m2-l1",
          label: "On-page and content",
          topics: [
            { id: "seo-m2-t1", type: "Video", title: "What a page tells a search engine", duration: "14 min", completed: false },
            { id: "seo-m2-t2", type: "Reading", title: "Titles, headings and meta descriptions that earn the click", duration: "approx. 12 min read", completed: false },
            { id: "seo-m2-t3", type: "Video", title: "Writing a content brief from a keyword cluster", duration: "16 min", completed: false },
            { id: "seo-m2-t4", type: "Reading", title: "Helpful content: experience, expertise and trust", duration: "approx. 15 min read", completed: false },
            { id: "seo-m2-t5", type: "Activity", title: "Audit one page against an on-page checklist", duration: "approx. 25 min", completed: false },
            { id: "seo-m2-t6", type: "Reading", title: "Internal links and site structure", duration: "approx. 10 min read", completed: false },
          ],
        },
        {
          id: "seo-m2-l2",
          label: "Technical foundations",
          topics: [
            { id: "seo-m2-t7", type: "Video", title: "Crawling and indexing: robots rules, sitemaps and canonical tags", duration: "18 min", completed: false },
            { id: "seo-m2-t8", type: "Reading", title: "Page speed and loading metrics in plain terms", duration: "approx. 12 min read", completed: false },
            { id: "seo-m2-t9", type: "Video", title: "Structured data: describing a page to machines", duration: "14 min", completed: false },
            { id: "seo-m2-t10", type: "Reading", title: "Mobile-first and accessible pages", duration: "approx. 10 min read", completed: false },
            { id: "seo-m2-t11", type: "Practice Assignment", title: "Practice Quiz: On-page and technical SEO", duration: "approx. 10 min", completed: false },
            { id: "seo-m2-t12", type: "Video", title: "Running a small site audit with a crawler", duration: "20 min", completed: false },
            { id: "seo-m2-t13", type: "Graded Assignment", title: "Assignment 02 · On-page audit", duration: "approx. 45 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "seo-m3",
      label: "MODULE 03",
      title: "GEO, Authority and Measurement",
      topicsCompleted: 0,
      topicsTotal: 12,
      isCompleted: false,
      lessons: [
        {
          id: "seo-m3-l1",
          label: "Generative engine optimization",
          topics: [
            { id: "seo-m3-t1", type: "Video", title: "How AI answer engines choose their sources", duration: "16 min", completed: false },
            { id: "seo-m3-t2", type: "Reading", title: "GEO and SEO: what changes and what stays", duration: "approx. 15 min read", completed: false },
            { id: "seo-m3-t3", type: "Video", title: "Writing content an AI answer can quote", duration: "14 min", completed: false },
            { id: "seo-m3-t4", type: "Activity", title: "Test how AI assistants describe a brand", duration: "approx. 25 min", completed: false },
            { id: "seo-m3-t5", type: "Reading", title: "Entities, mentions and being cited", duration: "approx. 12 min read", completed: false },
          ],
        },
        {
          id: "seo-m3-l2",
          label: "Authority and measurement",
          topics: [
            { id: "seo-m3-t6", type: "Video", title: "Earning links: digital PR and useful resources", duration: "16 min", completed: false },
            { id: "seo-m3-t7", type: "Reading", title: "Link quality and the schemes to avoid", duration: "approx. 10 min read", completed: false },
            { id: "seo-m3-t8", type: "Video", title: "Local search: profiles, reviews and citations", duration: "12 min", completed: false },
            { id: "seo-m3-t9", type: "Reading", title: "Measuring organic growth: impressions, clicks and conversions", duration: "approx. 15 min read", completed: false },
            { id: "seo-m3-t10", type: "Practice Assignment", title: "Practice Quiz: GEO and authority", duration: "approx. 10 min", completed: false },
            { id: "seo-m3-t11", type: "Video", title: "Reading a search performance report", duration: "18 min", completed: false },
            { id: "seo-m3-t12", type: "Quiz", title: "Graded Quiz: GEO, authority and measurement", duration: "approx. 15 min", completed: false },
          ],
        },
      ],
    },
    {
      id: "seo-m4",
      label: "MODULE 04",
      title: "Final Project, Assessment, and Wrap-Up",
      topicsCompleted: 0,
      topicsTotal: 6,
      isCompleted: false,
      lessons: [
        {
          id: "seo-m4-l1",
          label: "Final project",
          topics: [
            { id: "seo-m4-t1", type: "Reading", title: "Final project brief: an organic growth plan", duration: "approx. 15 min read", completed: false, locked: true },
            { id: "seo-m4-t2", type: "Video", title: "Planning your organic growth plan", duration: "14 min", completed: false, locked: true },
            { id: "seo-m4-t3", type: "Project", title: "Final Project: Organic growth plan", duration: "approx. 2 h", completed: false, locked: true },
            { id: "seo-m4-t4", type: "Peer Review", title: "Review two organic growth plans", duration: "approx. 20 min", completed: false, locked: true },
          ],
        },
        {
          id: "seo-m4-l2",
          label: "Assessment and wrap-up",
          topics: [
            { id: "seo-m4-t5", type: "Quiz", title: "Final Assessment", duration: "approx. 20 min", completed: false, locked: true },
            { id: "seo-m4-t6", type: "Video", title: "Course wrap-up and next steps", duration: "5 min", completed: false, locked: true },
          ],
        },
      ],
    },
  ],
};
