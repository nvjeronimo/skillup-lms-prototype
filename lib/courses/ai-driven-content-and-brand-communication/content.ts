import type { CourseContent } from "@/lib/courses/kit";

export const content: CourseContent = {
  byline: {
    author: "Rajesh Menon",
    role: "Lead instructor · AI Augmented Digital Marketing",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What is a brand voice guide for?",
      platformPrompt: "Choose the correct option",
      explanation:
        "A voice guide describes how the brand sounds, with traits and examples, so that copy stays recognisable whoever drafts it: a colleague, an agency or an AI assistant.",
      options: [
        {
          id: "a",
          label: "Keeping copy recognisable as the same brand, whoever or whatever drafts it",
          correct: true,
          feedback: "Correct. The guide is what a writer, or a prompt, is checked against.",
        },
        { id: "b", label: "Listing the brand's colours and logo sizes", feedback: "That is the visual identity guide. The voice guide is about words." },
        { id: "c", label: "Removing the need to edit AI drafts", feedback: "A guide improves the first draft. Someone still has to check and edit it." },
        { id: "d", label: "Describing the target audience", feedback: "The audience belongs in the content brief. The voice guide describes how the brand speaks." },
      ],
    },
    {
      question: "Which of these belongs in a content brief?",
      platformPrompt: "Choose the correct option",
      explanation:
        "The brief describes the job: the reader, the single action, the one message, the voice and the format. The copy itself comes after.",
      options: [
        { id: "a", label: "The finished copy", feedback: "The brief comes before the copy. It describes the job, not the result." },
        { id: "b", label: "The single action you want the reader to take", correct: true, feedback: "Correct. One reader, one action, one message." },
        { id: "c", label: "Every feature of the product", feedback: "A brief that lists everything gives the draft nothing to lead with." },
        { id: "d", label: "The name of the AI tool you will use", feedback: "The brief should work with any tool, or with a human writer." },
      ],
    },
    {
      question: "Who is responsible for the accuracy of copy drafted with an AI assistant?",
      explanation:
        "The assistant drafts; it does not check facts about your product or your market. Whoever publishes the copy answers for every claim in it.",
      options: [
        { id: "a", label: "The assistant", feedback: "An assistant can state things that are not true of your product. It cannot answer for them." },
        { id: "b", label: "The provider of the tool", feedback: "The provider supplies the tool. What you publish with it is yours." },
        { id: "c", label: "The person or team that publishes it", correct: true, feedback: "Correct. Publishing a claim makes it yours to support." },
        { id: "d", label: "Nobody, if the copy is labelled as AI-assisted", feedback: "A label tells the reader how the copy was made. It does not make a claim true." },
      ],
    },
  ],
  articles: {
    "acb-m2-t4": {
      lede: "An ad has a few seconds and a few words. A prompt that only says “write an ad for our product” leaves every decision that matters to the assistant. This reading shows how to make those decisions yourself and put them in the prompt.",
      sections: [
        {
          heading: "Start from the brief, not from the ad",
          paragraphs: [
            "Ad copy fails for the same reasons with or without AI: it speaks to everyone, it promises several things at once, or it sounds like any other brand. The content brief from the first video of this module answers those three points before a word is drafted: one reader, one action, one message.",
            "Put the brief into the prompt in that order. Name the reader as a person in a situation (“a shop owner who does the accounts on Sunday evening”), not as a demographic. State the single action you want. Give the one message in a plain sentence, the way you would say it aloud.",
          ],
        },
        {
          heading: "Give the assistant the limits of the format",
          paragraphs: [
            "Every ad placement has limits: a headline of a few words, a description of one or two lines, a call to action chosen from a short list. Put the limits in the prompt as numbers, and ask for the output in a labelled layout (Headline, Description, Call to action) so you can compare variants line by line.",
            "Add the voice traits from your voice guide, with one example of copy that is on voice and one that is not. Examples steer an assistant further than adjectives do: “friendly” says little, a sentence you would actually publish says a lot.",
          ],
        },
        {
          heading: "Ask for variants, then edit",
          paragraphs: [
            "Ask for five to ten variants that differ in angle, not in wording: one that leads with the problem, one with the outcome, one with proof, one with a question. Variants that differ only in synonyms give you nothing to test.",
            "Then do the part the assistant cannot. Check every claim against something you can show. Remove anything a competitor could say unchanged. Read the headline alone, since many people will not read further. Keep two or three variants worth testing, and record which prompt produced them.",
          ],
        },
      ],
      pullQuote: {
        text: "What you leave out of a prompt, the assistant decides for you.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Decide one reader, one action and one message before you prompt.",
        "State the format limits as numbers and ask for a labelled layout.",
        "Show the voice with one on-voice and one off-voice example.",
        "Ask for variants that differ in angle, then check every claim yourself.",
      ],
    },
  },
  quizzes: {
    "acb-m2-t5": [
      {
        question: "Which prompt gives an AI assistant the most to work with for a social ad?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Look for the prompt that says who the ad is for.",
          "A format limit stated as a number is a good sign.",
        ],
        explanation:
          "A useful prompt carries the brief: one reader, one action, the format limits and the voice. The other three leave those decisions to the assistant.",
        reviewTopicId: "acb-m2-t2",
        reviewTopicTitle: "Anatomy of an effective prompt",
        options: [
          { id: "a", label: "Write a great ad for our accounting app.", feedback: "No reader, no action and no limits: the assistant has to guess all three." },
          {
            id: "b",
            label: "Write 5 headlines of up to 30 characters for shop owners who do their accounts on Sunday evening. Goal: start a free trial. Voice: plain and direct.",
            correct: true,
            feedback: "Correct. It names the reader, the action, the format limit and the voice.",
          },
          { id: "c", label: "Write an ad that will go viral with our target audience.", feedback: "“Viral” is a hope, not an instruction, and the audience is not described." },
          { id: "d", label: "Write the best possible ad. Be creative.", feedback: "Without a reader or a message, the result is copy any brand could use." },
        ],
      },
      {
        question: "You ask for ten ad variants and get ten that differ only in wording. What is the best next prompt?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Variants are worth testing when they differ in angle: the problem, the outcome, proof, a question. Ask for the angles by name.",
        reviewTopicId: "acb-m2-t4",
        reviewTopicTitle: "Creating impactful ad copy with effective prompts",
        options: [
          { id: "a", label: "Ask for twenty more.", feedback: "More of the same gives you more synonyms, not more ideas." },
          {
            id: "b",
            label: "Ask for variants that each take a different angle: the problem, the outcome, proof, a question.",
            correct: true,
            feedback: "Correct. Naming the angles is what makes the variants different.",
          },
          { id: "c", label: "Ask the assistant to pick the best one.", feedback: "It cannot know which will work with your audience. A test can." },
          { id: "d", label: "Raise the word limit.", feedback: "Longer copy does not change the angle." },
        ],
      },
      {
        question: "An AI draft says your product is “the fastest on the market”. What do you do before publishing?",
        explanation:
          "An assistant writes what sounds plausible. A comparative claim needs evidence you hold; without it, remove the claim or reword it to something you can show.",
        reviewTopicId: "acb-m1-t10",
        reviewTopicTitle: "Responsible use: claims, sources and disclosure",
        options: [
          {
            id: "a",
            label: "Check that you can support the claim, and remove or reword it if you cannot.",
            correct: true,
            feedback: "Correct. A claim you publish is a claim you have to support.",
          },
          { id: "b", label: "Keep it: the assistant must have found it somewhere.", feedback: "An assistant can state things that are not true of your product." },
          { id: "c", label: "Make it stronger with an exclamation mark.", feedback: "Punctuation does not make a claim true." },
          { id: "d", label: "Ask the assistant whether the claim is true.", feedback: "It cannot verify facts about your product. You can." },
        ],
      },
    ],
  },
  assignments: {
    "acb-m2-t10": {
      brief:
        "Choose a brand you know, or use the case-study brand from Module 1. Split its audience into three segments by need or situation, not by age or location alone. For each segment, write the content brief and the prompt you would give an AI assistant for one social post, then add the draft you would publish after editing. Submit your work as a PDF or DOCX.",
      requirements: [
        "One page per segment: who they are, what they need and the one message for them",
        "The prompt and the edited draft for each segment",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
