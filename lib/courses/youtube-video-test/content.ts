import type { CourseContent } from "@/lib/courses/kit";

/** The reading that opens the course: the two ways to add a YouTube video, and what to check. No quiz. */
export const content: CourseContent = {
  byline: {
    author: "Nelson Jerónimo",
    role: "Design · YouTube Video Test",
    updated: "November 2026",
  },
  quiz: [],
  articles: {
    "ytt-m1-t1": {
      lede: "This course exists to test YouTube videos in the player. The same public video is added the two ways a course team can add one in Studio, and a third topic shows a video that is no longer there.",
      sections: [
        {
          heading: "The two ways to add a YouTube video",
          paragraphs: [
            "Embedded in a Text component: the course team pastes YouTube's embed code. YouTube's own player plays it, with its share button, its quality menu and its logo, which opens the video on youtube.com. We never learn what was watched, so the topic completes with Mark as Complete, and Next asks.",
            "Added as a Video component with its YouTube ID: our player plays it. Playback is measured, so the topic completes by itself once 90% of the video has played. A YouTube video has no transcript in the player, so there are no captions.",
          ],
        },
        {
          heading: "What to check",
          paragraphs: [
            "On the embed, that the Info alert under the video says progress is not tracked, that there are no Transcript, Notes or Downloads tabs, and that Next asks whether you have finished the video.",
            "On the Video component, that the video's own picture shows before it plays and that the topic completes by itself. On the last topic, that the player says the video is not available and you can still move on.",
          ],
        },
      ],
      pullQuote: {
        text: "Course progress is per topic, and binary.",
        attribution: "SCORM and YouTube meeting, 4 Nov 2026",
      },
      takeaways: [
        "An embed is never measured: Mark as Complete, and Next asks.",
        "A Video component with a YouTube ID completes by itself.",
        "Neither has a transcript in the player.",
      ],
    },
  },
  quizzes: {},
  assignments: {},
  ora: {},
};
