import type { Course } from "@/lib/courses/kit";

/**
 * "YouTube Video Test": a course made to test YouTube videos in the player (meeting of 4 Nov 2026;
 * ICP Video Lessons row 9). One module: a reading that says what to check, then a public YouTube
 * video in YouTube's official embed. Row 10 (YouTube inside our player) and its "no longer
 * available" topic were withdrawn on 12 Nov 2026: YouTube's policies keep the logo and its link
 * visible and clickable, so the official embed stays (tech team via Kirti; Nelson decided).
 * Course 1 of the SCORM and YouTube Test Program. Not started, nothing locked.
 *
 * The video is "YouTube Developers Live: Embedded Web Player Customization" (Google for
 * Developers, 22m 24s), the sample of YouTube's own embed documentation: public, and expected to
 * stay up. Any public video would do; the content team's own come later (open question for Vikas).
 */
const VIDEO_ID = "M7lc1UVf-VE";

export const outline: Course = {
  id: "ytt",
  slug: "youtube-video-test",
  title: "YouTube Video Test",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 1,
  modules: [
    {
      id: "ytt-m1",
      label: "MODULE 01",
      title: "YouTube videos in the player",
      topicsCompleted: 0,
      topicsTotal: 3,
      isCompleted: false,
      lessons: [
        {
          id: "ytt-m1-l1",
          label: "Read first",
          topics: [
            { id: "ytt-m1-t1", type: "Reading", title: "What each video tests", duration: "3 min read approx.", completed: false },
          ],
        },
        {
          id: "ytt-m1-l2",
          label: "Embed in a Text component",
          topics: [
            {
              id: "ytt-m1-t2",
              type: "Video",
              title: "YouTube embed: progress not tracked",
              duration: "22m 24s",
              completed: false,
              playbackMeasurable: false,
              youtube: { id: VIDEO_ID, embed: true },
            },
          ],
        },
        {
          id: "ytt-m1-l3",
          label: "A unit with several components",
          topics: [
            {
              id: "ytt-m1-t3",
              type: "Lesson Page",
              title: "Text, a YouTube video and a quick check",
              duration: "10 min approx.",
              completed: false,
            },
          ],
        },
      ],
    },
  ],
};
