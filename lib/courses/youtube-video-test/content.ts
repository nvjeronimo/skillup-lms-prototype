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
      lede: "This course exists to test a YouTube video in the player. A course team adds it by pasting YouTube’s official embed code into a Text component in Studio.",
      sections: [
        {
          heading: "How a YouTube video is added",
          paragraphs: [
            "Embedded in a Text component: the course team pastes YouTube's embed code. YouTube's own player plays it, with its share button, its quality menu and its logo, which opens the video on youtube.com. We never learn what was watched, so the topic completes with Mark as Complete, and Next asks.",
            "YouTube inside our own player was withdrawn on 12 Nov 2026. YouTube’s policies require its logo and the link to youtube.com to stay visible and clickable; no player setting removes them, and covering the logo or sandboxing the frame is not allowed. Videos that must not open on YouTube are uploaded to Azure instead, and play in our player.",
          ],
        },
        {
          heading: "What to check",
          paragraphs: [
            "That the Info alert under the video says progress is not tracked, that there are no Transcript, Notes or Downloads tabs, and that Next asks whether you have finished the video.",
            "Open the video on youtube.com from its logo, then come back to this tab: until the topic is complete, the alert asks whether you finished the video and points to Mark as Complete.",
          ],
        },
      ],
      pullQuote: {
        text: "Course progress is per topic, and binary.",
        attribution: "SCORM and YouTube meeting, 4 Nov 2026",
      },
      takeaways: [
        "An embed is never measured: Mark as Complete, and Next asks.",
        "Back from YouTube, the alert asks to mark it complete.",
        "Videos that must stay off YouTube go to Azure.",
      ],
    },
  },
  quizzes: {},
  assignments: {},
  ora: {},
};
