# Courses and programs: where the sample content lives

A course with content of its own is one folder here plus one entry in `index.ts`. A program
is one file in `lib/programs/` plus one entry in its `index.ts`. Nothing else needs an edit
for the course page and the player to show it.

```
lib/courses/
  index.ts          the registry: COURSES (+ the checks that run when it loads)
  types.ts          CourseEntry, CourseContent
  kit.ts            the only module a course file imports from (helpers + types)
  outline.ts        pure helpers on a player outline (no imports)
  sample-page.ts    SIX_SIGMA and the IBM course: the sample page other pages borrow from
  <slug>/
    index.ts        default export: { outline, page, content }
    outline.ts      export const outline: Course          the player's sidebar
    page.ts         export const page: CourseDetail       /platform/course/<slug>
    content.ts      export const content: CourseContent   topic bodies, byline
    activities.ts   export const activities                the Activity topics, when the course has any
lib/programs/
  index.ts          the registry: PROGRAMS, getProgramBySlug
  types.ts          Program and its parts
  kit.ts            the only module a program file imports from
  <slug>.ts         default export: a Program             /platform/program/<slug>
```

Who reads the registry: `lib/data` (`allCourses`, so the player), `lib/platform/course-detail`
(the page), `lib/content` (topic bodies), `lib/store` (seeded completion). A course of the
catalogue that is not in the registry still works: it shows the Six Sigma sample under its
own title.

## Add a course

1. Copy `ux-research-and-design-thinking/` to `lib/courses/<slug>/`. The slug is the one the
   platform pages already use: the `id` of the card in `lib/platform/my-learning.ts`, or
   `slugify(title)` for a course of a program (`lib/programs/<program>.ts`).
2. Rewrite the three files (below).
3. In `lib/courses/index.ts` add one import and one entry to `COURSES`:
   `import myCourse from "./<slug>";` and `myCourse,`. Keep the list in the order courses
   were added; put the new one last.

### outline.ts

- `id`: a short prefix that no other course uses (`acb`, `uxr`). **Every** id in the file
  starts with `<id>-`: modules `<id>-m1`, lessons `<id>-m1-l1`, topics `<id>-m1-t1`,
  transcript lines `<id>-m1-t1-ln1`. The player finds a course from a topic id alone, and
  the store keys progress by topic id, so ids must be unique across all courses and must
  not change once shipped.
- `slug`, `title`: as on the card. `provider`, `courseType`, `difficulty`, `deliveryMode`.
- Modules use `lessons` (not flat `topics`): the course page prints the lessons.
  `label` is `"MODULE 01"`.
- `completed: true` on a topic is the seeded completion: what is done when the demo starts.
  One topic has `active: true`: where Resume lands (without it, the first topic still to
  do). `locked: true` for locked ones.
- Counters must match the topics: `topicsTotal`, `topicsCompleted`, `isCompleted` per
  module; `modulesTotal`, `modulesCompleted`, `overallProgressPct` on the course.
- A video's transcript, when it has one written, is `transcript: [{ id, ts, text }]` on the topic.

### page.ts

`export const page: CourseDetail`. Take `slug` and `title` from `outline`, the syllabus from
`modulesFromOutline(outline, [...])` (one `{ duration, defaultOpen?, lockReason? }` per
module) and the Resume address from `playerHref(outline)`. Parts you do not rewrite come
from `SIX_SIGMA` (`search`, `mentor`, `tools`, column labels, `qaTab` strings), as the two
existing pages do. Every topic or assignment a date or a grade row names must exist in the
outline under the same title.

### content.ts

`export const content: CourseContent`:

| Field | Read for | Key |
| --- | --- | --- |
| `byline` | every reading of the course | — |
| `quiz` | any Quiz / Practice Assignment with no questions of its own | — |
| `quizzes` | a Quiz / Practice Assignment | topic id |
| `articles` | a Reading (`lede`, `sections`, `pullQuote`, `takeaways`) | topic id |
| `assignments` | a Graded Assignment (`brief`, `requirements`) | topic id |
| `ora` | a Peer-graded / Peer Review / Project | topic id |
| `labs` (optional) | a Lab run on the learner's machine (`kind: "download"`, `intro`, `prerequisites`, `steps`, `files`, `estimatedMinutes`) | topic id |
| `podcasts` (optional) | a Podcast (`host`, `guest`, `episodeLabel`, `summary`, `chapters`); its length is the topic's `duration` | topic id |
| `lessonPages` (optional) | a Lesson Page (`intro`, `blocks`; a `video` block and a recording in `sessions` take an optional `transcript` of `{ ts, text }` lines, which captions their player) | topic id |
| `sessions` (optional) | a VILT-Live Session / VILT-Recording: only the fields that differ from the plain session (`whenLabel`, `host`, `agenda`, …) | topic id |
| `activities` (optional) | an Activity (`intro`, `steps`, the last step saying what a good result looks like, and `file`: the worksheet the Downloads tab lists); written in `activities.ts` of the folder and listed in `content.ts` | topic id |

A topic with no entry gets plain wording that names no subject (end of `lib/content.ts`), so
write bodies for the topics a learner lands on (the resume topic, the due assignment) and
leave the maps empty (`{}`) for the rest (the optional ones can be left out). `reviewTopicId`
in a quiz question is a topic id of the same course. An entry in an optional map must sit
under a topic of that type: a lab written for a topic that is still an `Activity` stops the build.

A video shows its `duration` as the length of the player, and its transcript as captions,
one line at a time. A video with no transcript written has no captions (its Transcript tab
still gets the plain wording). Durations read "12 min" or "3m 20s".

### What must agree with the shared files

These files are shared; change them only if the card or row is wrong, and say so in the PR.

| In the course folder | Must equal |
| --- | --- |
| `outline.slug`, `outline.title` | the card in `my-learning.ts` (`id`, `title`) or the program's `programCourse(n, title, …)` |
| share of `completed` topics, `page.progress.percent`, `overallProgressPct` | the card's `progressPct` (`null` = no topic completed, `100` = all) |
| the `active` topic's title and type (the first topic, for a course not started) | the card's `upNext` |
| `page.stats.duration` | the card's `progressMeta` ("10 hours total") |
| `page.imageSrc` | the card's `imageSrc` |
| `page.program` (`slug`, `title`) | the program file, for a course of a program; left out otherwise |
| module titles, topic counts, durations | the `modules` of the course row in the program file, when it has them |
| topic ids and titles of due work | `dashboardDue` in `lib/platform/dashboard.ts` (its `href` names a topic id) |
| `page.progress.percent` | `dashboardResume` in `dashboard.ts`, if the course is listed there |

### Rules

- A course file imports from `@/lib/courses/kit` and from its own folder only. Importing
  `lib/data`, `lib/content`, `lib/store`, `lib/platform/*` or the registry closes an import
  cycle; `next lint` refuses it. A helper that is missing belongs in `kit.ts`.
- No store change: the store seeds completion from the outline, and a browser that already
  holds stored progress receives the seeded completion of a course it has never seen
  (`withNewCourses` in `lib/store.ts`). Do not bump the store version for a new course.
- Do not rewrite the copy of a course that is already here.

## Add a program

1. Copy `lib/programs/ai-driven-digital-marketing.ts` to `lib/programs/<slug>.ts` and rewrite
   it. It default-exports a `Program`; `slug` is the address `/platform/program/<slug>`.
2. Its courses are rows built with `programCourse(number, title, initials, cover, {...})`
   from `./kit`: the course's slug is `slugify(title)`, so a course folder with that slug
   gives it its own content, and any other row shows the sample under its title.
   `cover` is a file name under `public/platform/covers/` (without `.jpg`).
3. In `lib/programs/index.ts` add one import and one entry to `PROGRAMS`.
4. Shared file to keep in step: the program card in `myLearningPrograms`
   (`lib/platform/my-learning.ts`): `id` = slug, `title`, `courses`, `progressPct`,
   `upNext`, and `href: "/platform/program/<slug>"`.

A program file imports from `./kit` only (types, `programCourse`, `user`, `slugify`,
`coursePlayerHref`, `coursePageHref`, `certificatePageHref`), never from
`lib/platform/program`, `catalog` or `course-detail`.

## Check

```bash
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/next lint          # also refuses a forbidden import
node scripts/check-tokens.mjs
./node_modules/.bin/next build         # stops on a registry check, naming the course
```

The registry checks, on load: unique slugs and ids, the id prefix, `page.slug` / `page.title`
against the outline, module and course counters against the topics, that every content
key is a topic of the course, and that a lab, podcast, lesson page, session or activity is written
for a topic of that type. Then open `/platform/course/<slug>` on its four tabs
(`?tab=progress|dates|qa`), the resume topic and the due assignment in the player
(`/course/<slug>/topic/<topicId>`), and the card on `/platform/my-learning` or the program page.
