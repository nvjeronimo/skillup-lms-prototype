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
    "acb-m1-t2": {
      lede: "A brand strategy is a small set of decisions about who the brand is for, what it offers them and why they should believe it. It is easy to mistake for a logo, a slogan or a mood board. Those express the strategy. The strategy is what they have to agree with.",
      sections: [
        {
          heading: "The decisions it makes",
          paragraphs: [
            "A strategy answers four questions. Who are we for? Not everyone, but a defined group with a need. What do we offer them that the alternatives do not? Why should they believe us? And how do we behave and sound while doing it?",
            "The answers are the audience, the positioning, the proof and the personality. Each should fit in a sentence or two. A strategy that needs forty slides has not finished deciding.",
          ],
        },
        {
          heading: "A strategy excludes",
          paragraphs: [
            "The test of a strategic decision is that it rules something out. “We serve busy households who want to reduce waste” means the brand does not write for commercial cleaning companies and does not compete on being the cheapest.",
            "This is uncomfortable, because every excluded group looks like lost sales. But a brand that tries to appeal to everyone gives nobody a reason to choose it. Saying no at the level of strategy is what makes every later choice of content easier.",
          ],
        },
        {
          heading: "What it is not",
          paragraphs: [
            "A mission statement says why the company exists and is written mainly for the people inside it. A visual identity is how the brand looks. A campaign is a message for one season. All three should follow from the strategy, and none of them can stand in for it.",
            "A value such as “quality” or “innovation” is not a strategy either. Every competitor claims the same. A useful check: would any sensible company say the opposite? If not, the statement decides nothing.",
          ],
        },
        {
          heading: "Why it matters more with AI tools",
          paragraphs: [
            "An AI assistant can produce a hundred pieces of content in an afternoon. With no strategy behind them they will be fluent, pleasant and interchangeable with any competitor's. The strategy is what you give the tool so that the hundredth piece still says the same thing, to the same people, as the first. The rest of this module turns it into something a tool can follow.",
          ],
        },
      ],
      pullQuote: {
        text: "A strategy is finished when it tells you what not to say.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "A brand strategy decides the audience, the positioning, the proof and the personality.",
        "Each decision should rule something out.",
        "Mission, visual identity and campaigns follow from the strategy; they are not the strategy.",
        "With AI tools, the strategy is what keeps a large volume of content consistent.",
      ],
    },
    "acb-m1-t4": {
      lede: "A brand voice is the consistent personality in everything a brand writes. Readers may not be able to describe it, but they notice when it is missing: the cheerful app whose error message reads like a legal notice. This reading shows how to define a voice precisely enough for someone else to write in it.",
      sections: [
        {
          heading: "Traits: three, each with an edge",
          paragraphs: [
            "Describe the voice with three traits. Fewer than three is flat. More than four cannot be held in mind while writing. Choose traits that set the brand apart. “Friendly” and “professional” describe almost every company and guide almost nothing.",
            "Sharpen each trait by saying where it stops: “plain-spoken, but not blunt”, “warm, but not gushing”, “confident, but never superior”. The second half is what a writer needs at the moment of choosing a word.",
          ],
        },
        {
          heading: "Voice stays, tone moves",
          paragraphs: [
            "Voice is who the brand is. Tone is how that personality adjusts to the moment. A person has one character and speaks differently at a celebration and at a funeral. A brand should do the same.",
            "Map a few situations and the tone for each. A welcome message: light and encouraging. A payment failure: calm, direct, no jokes. A reply to a complaint: plain and humble, starting with what will be done. The traits are present in all three, turned up or down.",
          ],
        },
        {
          heading: "Vocabulary",
          paragraphs: [
            "Much of a voice is carried by word choice. List the words the brand uses and the ones it avoids, with the reason. Brightwell Refill says “refill” and “bottle”, not “replenishment” and “vessel”. It says “plastic saved” with a number, never “eco-friendly” on its own.",
            "Add the small conventions that make text look like it came from one place: how product names are written, whether you use contractions, how numbers and dates appear, whether exclamation marks are allowed and how often.",
          ],
        },
        {
          heading: "Test it on real sentences",
          paragraphs: [
            "A definition is proven by use. Take three pieces of existing copy and rewrite each in the voice. Then give the definition to someone who was not involved and ask them to do the same. If their versions sound like yours, the voice is defined. If they do not, find the trait they read differently and sharpen it.",
          ],
        },
      ],
      pullQuote: {
        text: "A trait without its limit is an adjective. With its limit, it is an instruction.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Three distinctive traits, each with a “but not” that marks its limit.",
        "Voice is constant; tone adapts to the situation.",
        "List the words to use and to avoid, and the writing conventions.",
        "Test the definition by having someone else write from it.",
      ],
    },
    "acb-m1-t7": {
      lede: "Voice guidelines written for people leave a lot unsaid, because people fill the gaps with judgement and with what they already know about the brand. An AI assistant has neither. Guidelines an assistant can follow are more explicit and more concrete, and they are built around examples.",
      sections: [
        {
          heading: "Say it as an instruction",
          paragraphs: [
            "Replace description with direction. “Our voice is approachable” describes. “Write in the second person. Use contractions. Keep sentences under twenty words. Explain any technical term the first time it appears” directs.",
            "Go through the voice chart line by line and ask what a writer would actually do differently. Write that down. Where a guideline cannot be turned into an action, it is probably a feeling about the brand and not a rule.",
          ],
        },
        {
          heading: "Show pairs of examples",
          paragraphs: [
            "Assistants learn a pattern from examples faster than from rules. For each trait, give a pair: a sentence that is off voice, and the same sentence on voice. “Our innovative solution reduces environmental impact” becomes “One bottle, refilled twelve times. That is eleven you do not throw away.”",
            "Include two or three complete short pieces of approved copy in different formats, such as an email opening, a product description and a social post. Choose them with care. The assistant will imitate whatever you show it, weaknesses included.",
          ],
        },
        {
          heading: "State the limits explicitly",
          paragraphs: [
            "List what must never appear: banned words, claims the brand cannot support, topics it stays out of, competitors it does not name. An assistant will not infer these. Be specific: “Do not use: eco-friendly, green, sustainable solution, game-changing.”",
            "Say what to do in place of the banned thing, too. An instruction that only forbids leaves the assistant to guess the alternative. “Do not say eco-friendly. State the measurable fact instead, for example the number of bottles reused.”",
          ],
        },
        {
          heading: "Keep it short and maintained",
          paragraphs: [
            "Long guidelines are followed less well than short ones, by people and by tools. Aim for one page that can be pasted into a prompt: who we are, the traits as instructions, the vocabulary, the limits, the examples. Keep a dated master copy in one place. When the brand changes a term or adds a product, update the copy that day, because every prompt that uses the old version will repeat the old wording.",
          ],
        },
      ],
      pullQuote: {
        text: "A person reads between the lines of a guideline. An assistant reads only the lines.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Turn each description of the voice into an instruction a writer can act on.",
        "Give before and after pairs and a few full examples of approved copy.",
        "List banned words and claims, and say what to write instead.",
        "Keep the guidelines to one page, with one dated master copy.",
      ],
    },
    "acb-m1-t10": {
      lede: "An AI assistant will write that your product is the best, cite a study that does not exist and invent a customer quote, all in excellent prose. The brand that publishes it is responsible for every word. This reading covers the three areas where AI-assisted content most often goes wrong: claims, sources and disclosure.",
      sections: [
        {
          heading: "Claims need evidence",
          paragraphs: [
            "Any statement a customer could rely on when deciding to buy is a claim: “cuts plastic waste by 90 percent”, “dermatologically tested”, “the fastest delivery”. Advertising rules in most countries require that you can substantiate a claim before you publish it.",
            "Assistants generate claims freely, because superlatives are common in the marketing text they learned from. Keep a short list of approved claims, each with its evidence, and include it in your briefing with the instruction to use no others. In review, treat any claim that is not on the list as an error until someone proves it.",
          ],
        },
        {
          heading: "Sources must exist",
          paragraphs: [
            "When an assistant gives a statistic, a quotation or a reference, it may be accurate, slightly wrong or entirely made up, and the three look identical. Open every source yourself. If you cannot find it, remove the statement.",
            "The reliable method is to work the other way round: give the assistant the facts and the sources, and ask it to write from them. Never publish a testimonial, a review or a quote from a named person that the assistant produced. Invented endorsements are deceptive, however realistic they sound.",
          ],
        },
        {
          heading: "Disclosure",
          paragraphs: [
            "Whether you must tell your audience that content was made with AI depends on the kind of content, the platform and the law where you publish, and these rules are changing. Check the current requirements of each platform you use and take legal advice for regulated sectors.",
            "As a working principle, disclose when a reasonable person would feel misled if they found out later. A realistic image of a scene that never happened, or a synthetic voice presented as a real person, calls for a label. An email that a person briefed, edited and approved, with drafting help from a tool, generally does not. Write your team's rule down so that the decision is not made afresh every time.",
          ],
        },
        {
          heading: "A review step with a name on it",
          paragraphs: [
            "Responsibility needs an owner. For each piece of content, one named person checks the claims against the approved list, the facts against their sources and the text against the voice guide, then approves it. Also keep customer data and confidential plans out of prompts unless your organisation has approved the tool for that use.",
          ],
        },
      ],
      pullQuote: {
        text: "The assistant wrote the sentence. The brand made the claim.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Use only claims you can substantiate; keep an approved list with the evidence.",
        "Verify every statistic, quote and reference, or supply them yourself.",
        "Never publish invented testimonials or quotes.",
        "Set a written disclosure rule, and name the person who approves each piece.",
      ],
    },
    "acb-m2-t2": {
      lede: "A prompt is a set of instructions to an assistant. A weak one gets you a generic draft. A good one gets a draft worth editing. The difference is rarely clever wording. It is whether the prompt contains the information a writer would need, in an order that is easy to follow.",
      sections: [
        {
          heading: "The parts",
          paragraphs: [
            "A complete prompt for brand copy has six parts, and they correspond to the content brief from the previous video. The context: who the brand is, with the voice block. The audience: who will read this and what they already know. The goal: the one thing the reader should do or understand.",
            "Then the message: the single point the piece must make, with the facts that support it. The format: the channel, the length, the structure. And the constraints: what to avoid, the claims allowed, anything that must be included word for word.",
          ],
        },
        {
          heading: "Order and layout",
          paragraphs: [
            "Put the standing information first, meaning the brand and the voice, and the specific task after it. Separate the parts with clear labels or blank lines. An assistant, like a person, follows a structured brief more reliably than one long paragraph.",
            "State instructions in the positive where you can. “Write in short sentences” works better than “do not write long sentences”. Put the most important instruction near the end as well, because very long prompts can lose their early details.",
          ],
        },
        {
          heading: "Examples and output shape",
          paragraphs: [
            "Where you have an approved piece in the same format, include it and say what to take from it: “Match the length and rhythm of this example. Do not reuse its content.” Without that instruction the assistant may copy the example's subject as well as its style.",
            "Say exactly what you want back: “Give three versions, each under 60 words, numbered, with no introduction or commentary.” A precise request for the output saves a round of tidying.",
          ],
        },
        {
          heading: "Iterate by diagnosing",
          paragraphs: [
            "The first output is a test of the prompt. When it misses, work out which part was missing or unclear. Too formal? The voice block needs an example. Wrong emphasis? The message was not singled out. Then change that part of the prompt and run it again. Do not patch the draft with a string of small corrections. Save the prompts that work as templates, with the parts that change marked.",
          ],
        },
      ],
      pullQuote: {
        text: "Write the prompt you would need if you were the one who had to write the copy.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Six parts: context, audience, goal, message, format, constraints.",
        "Standing information first, the task after it, clearly separated.",
        "Give an example and say what to take from it; specify the shape of the output.",
        "When a draft misses, fix the prompt, then keep it as a template.",
      ],
    },
    "acb-m2-t8": {
      lede: "An AI draft reads well at first sight, and that is the risk. Fluent text gets a lighter check than rough text, and the errors in it are confident ones. Editing an AI draft is a separate job with its own order of work: first whether it is true, then whether it sounds like the brand, then whether it is honest about how it was made.",
      sections: [
        {
          heading: "First pass: accuracy",
          paragraphs: [
            "Read the draft once, marking every statement that could be wrong: numbers, dates, names, product details, prices, comparisons, anything attributed to a person or a study. Then check each one against a source you trust, such as the product page, the approved claims list or the original report.",
            "Watch for errors that sound right: a feature the product nearly has, a statistic rounded in a flattering direction, a “recent study” with no name. Look also for what the assistant added that was not in your brief. Extra benefits and reassurances appear because they are common in marketing text, not because they are true of your product. If you cannot verify a statement, cut it.",
          ],
        },
        {
          heading: "Second pass: tone",
          paragraphs: [
            "Read the piece aloud with the voice chart beside you. AI drafts drift towards a recognisable average: openings that announce the topic, groups of three adjectives, phrases such as “in today's fast-paced world”, and a closing line that repeats what was just said.",
            "Cut the opening sentence and see whether the piece improves. It usually does. Replace abstract words with the concrete fact behind them. Vary the sentence length. Check the vocabulary list for words the brand avoids. Then ask the question the voice chart exists for: could a competitor have published this unchanged? If so, it is not yet in your voice.",
          ],
        },
        {
          heading: "Third pass: disclosure and rights",
          paragraphs: [
            "Apply your team's disclosure rule from Module 1: does this piece, on this platform, need a label saying AI was used? Check that the draft does not present anything invented as real, such as a customer story, a quote or a scenario shown as something that happened.",
            "Look for text that seems lifted. Assistants occasionally reproduce a well-known phrase or a competitor's slogan. If a sentence sounds familiar, search for it. Confirm as well that nothing confidential from your prompt has ended up in the copy.",
          ],
        },
        {
          heading: "Make the edit repeatable",
          paragraphs: [
            "Turn the three passes into a short checklist and use it on every piece: claims verified against the list, facts checked against sources, read aloud against the voice chart, banned words searched for, disclosure rule applied, approver's name recorded. Note the corrections you make most often and add them to the briefing, so that the next draft starts closer. The aim over time is a shorter edit. The edit itself never goes away.",
          ],
        },
      ],
      pullQuote: {
        text: "Fluent is not the same as correct. Read an AI draft as you would read a confident stranger's.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Edit in three passes: accuracy, then tone, then disclosure and rights.",
        "Verify every factual statement; cut what you cannot verify.",
        "Remove generic openings and filler, and check the draft against the voice chart.",
        "Use a checklist, record who approved, and feed recurring fixes back into the briefing.",
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
    "acb-m1-t9": [
      {
        question: "Which trait is defined well enough to guide a writer?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A trait becomes usable when it states its limit. “Plain-spoken, but not blunt” tells a writer where to stop. A bare adjective does not.",
        reviewTopicId: "acb-m1-t4",
        reviewTopicTitle: "Defining a brand voice: traits, tone and vocabulary",
        options: [
          { id: "a", label: "Friendly", feedback: "Almost every brand says so, and it gives no limit." },
          { id: "b", label: "Professional", feedback: "Generic, and open to any reading." },
          { id: "c", label: "Plain-spoken, but not blunt", correct: true, feedback: "Correct. The limit turns the adjective into an instruction." },
          { id: "d", label: "High quality", feedback: "That describes the product, not the way the brand speaks." },
        ],
      },
      {
        question: "A brand is cheerful in its welcome email and calm and direct in a message about a failed payment. What has changed?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Voice is the brand's constant personality. Tone is how it adapts to the situation. A consistent brand keeps the voice and shifts the tone.",
        reviewTopicId: "acb-m1-t4",
        reviewTopicTitle: "Defining a brand voice: traits, tone and vocabulary",
        options: [
          { id: "a", label: "The voice", feedback: "The voice stays the same across situations." },
          { id: "b", label: "The tone", correct: true, feedback: "Correct. The tone adapts to the moment. The voice does not." },
          { id: "c", label: "The positioning", feedback: "Positioning is who the brand is for and why. It did not change." },
          { id: "d", label: "Nothing: the brand is being inconsistent", feedback: "Adjusting tone to the situation is consistency done well." },
        ],
      },
      {
        question: "In a voice chart, which column tells a writer where a trait goes too far?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The “do not” column marks the point at which a trait tips over, for example where warm becomes gushing. It is the column writers consult most.",
        reviewTopicId: "acb-m1-t5",
        reviewTopicTitle: "Turning a voice into a system: the voice chart",
        options: [
          { id: "a", label: "The trait name", feedback: "The name alone sets no limit." },
          { id: "b", label: "The “do not” column", correct: true, feedback: "Correct. It shows where the trait tips over." },
          { id: "c", label: "The brand's mission statement", feedback: "That is not part of the chart." },
          { id: "d", label: "The list of channels", feedback: "Channels affect tone and format, not the limit of a trait." },
        ],
      },
      {
        question: "Which guideline can an AI assistant follow most reliably?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Assistants follow explicit instructions and examples. A description of a feeling leaves them to guess what to do.",
        reviewTopicId: "acb-m1-t7",
        reviewTopicTitle: "Voice guidelines an AI assistant can follow",
        options: [
          { id: "a", label: "Our voice feels like a chat with a good friend.", feedback: "A feeling. It names no action." },
          { id: "b", label: "Use the second person and contractions; keep sentences under twenty words.", correct: true, feedback: "Correct. Each part is something a writer can do." },
          { id: "c", label: "Be authentic.", feedback: "Too abstract to act on." },
          { id: "d", label: "Sound on brand.", feedback: "That is the goal, not a guideline." },
        ],
      },
    ],
    "acb-m1-t12": [
      {
        question: "Which statement is a positioning?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A positioning names the audience, the category and what sets the brand apart from the alternatives. Values and slogans do not do that.",
        reviewTopicId: "acb-m1-t3",
        reviewTopicTitle: "Positioning, promise and proof",
        options: [
          { id: "a", label: "We believe in quality and innovation.", feedback: "No company would claim the opposite, so it positions nothing." },
          { id: "b", label: "For households that want less plastic without extra effort, the cleaning subscription that arrives before you run out", correct: true, feedback: "Correct. Audience, category and difference are all there." },
          { id: "c", label: "Clean made simple.", feedback: "A slogan. It may express a positioning, but it is not one." },
          { id: "d", label: "Our logo is green because we care.", feedback: "That is a note on visual identity." },
        ],
      },
      {
        question: "What is the test of a real strategic decision about a brand?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A strategy chooses, and choosing excludes. If a statement rules nothing out, it has decided nothing.",
        reviewTopicId: "acb-m1-t2",
        reviewTopicTitle: "What a brand strategy decides",
        options: [
          { id: "a", label: "Everyone in the company likes it", feedback: "Agreement is pleasant, but it is not the test." },
          { id: "b", label: "It rules something out", correct: true, feedback: "Correct. A decision that excludes nothing guides nothing." },
          { id: "c", label: "It fits on a poster", feedback: "Brevity helps, but a short empty statement is still empty." },
          { id: "d", label: "It names the competitors", feedback: "It may, but that is not what makes it a decision." },
        ],
      },
      {
        question: "An assistant's draft says the product “cuts household plastic by 90 percent”. Your approved claims list has no such figure. What do you do?",
        platformPrompt: "Choose the correct option",
        explanation:
          "A claim a customer could rely on has to be substantiated before it is published. If the figure is not on the approved list with its evidence, it comes out or is replaced by a claim that is.",
        reviewTopicId: "acb-m1-t10",
        reviewTopicTitle: "Responsible use: claims, sources and disclosure",
        options: [
          { id: "a", label: "Keep it: it sounds plausible", feedback: "Plausible is not the same as substantiated." },
          { id: "b", label: "Soften it to “up to 90 percent”", feedback: "A softened claim with no evidence is still unsupported." },
          { id: "c", label: "Remove it, or replace it with an approved claim", correct: true, feedback: "Correct. Only claims with evidence are published." },
          { id: "d", label: "Add “according to studies”", feedback: "Citing a source that does not exist makes it worse." },
        ],
      },
      {
        question: "What makes the briefing block you give an AI tool most effective?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Examples of approved copy show rhythm and word choice better than any description. A good briefing combines the brand summary, the voice as instructions, the vocabulary and a few examples.",
        reviewTopicId: "acb-m1-t8",
        reviewTopicTitle: "Briefing AI tools with brand context",
        options: [
          { id: "a", label: "Telling the tool to be creative", feedback: "That invites it to move away from the brand." },
          { id: "b", label: "Two or three short examples of approved copy alongside the voice rules", correct: true, feedback: "Correct. The assistant picks up the pattern from them." },
          { id: "c", label: "Pasting in the full customer database for context", feedback: "Customer data never belongs in a briefing." },
          { id: "d", label: "Making it as long as possible", feedback: "Long briefings are followed less well than short ones." },
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
    "acb-m1-t11": {
      brief:
        "Write a one-page brand voice guide that a colleague, an agency or an AI assistant could work from. Use the case-study brand, Brightwell Refill, or a brand you know (if you use a real one, base the guide on its published copy and say so). Start from the template in the Downloads tab. Then test the guide: give it to an AI assistant with a short task, and include the output together with the one change the test led you to make. Submit your work as a PDF or DOCX.",
      requirements: [
        "A positioning in one or two sentences, with the promise and two proof points",
        "A voice chart of three traits: meaning, do, do not, and an on-voice and off-voice example for each",
        "Tone for three situations, and a vocabulary list of words to use and to avoid",
        "The test: your prompt, the assistant's output and what you changed in the guide",
        "Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
