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
      lede: "This course exists to test a YouTube video in the player. A course team adds it by pasting YouTube’s official embed code into a Text component in Studio. The last topic puts the same video in a unit with a text and a quick check.",
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
  // Topic 3 (12 Nov 2026): one Open edX unit with three components, as a course team builds it in
  // Studio: a Text component, a Text component with YouTube's embed code, and a Problem component
  // (a single-choice question, ungraded). The page completes with Mark as Complete, like row 9.
  lessonPages: {
    "ytt-m1-t3": {
      intro:
        "One unit, three components: a short text, a YouTube video in its official embed, and a quick check. This is how a course team mixes a YouTube video with its own material.",
      blocks: [
        {
          kind: "text",
          heading: "Before you watch",
          paragraphs: [
            "The video below shows the settings a site can pass to YouTube's embedded player. Two things to look for: which controls stay on the player whatever the site asks, and where the YouTube logo takes you when you select it.",
            "You can watch it here or on YouTube. Either way, nothing is recorded about what you watched, so this page completes when you select Mark as Complete.",
          ],
        },
        {
          kind: "video",
          title: "YouTube Developers Live: Embedded Web Player Customization",
          durationLabel: "22m 24s",
          youtubeId: "M7lc1UVf-VE",
        },
        {
          kind: "knowledge-check",
          question: "A course needs a video that must not open on youtube.com. Where should it be uploaded?",
          options: [
            {
              id: "a",
              label: "To YouTube, with the logo hidden by a player setting",
              feedback: "No player setting removes the logo or its link, and covering it is not allowed.",
            },
            {
              id: "b",
              label: "To Azure, as a SkillUp video",
              correct: true,
              feedback: "Correct. A file SkillUp owns goes to Azure and plays in our player, where its progress is tracked.",
            },
            {
              id: "c",
              label: "To YouTube, as an unlisted video",
              feedback: "An unlisted video still opens on youtube.com from the logo.",
            },
          ],
        },
      ],
    },
  },
  quizzes: {},
  assignments: {},
  ora: {},
};
