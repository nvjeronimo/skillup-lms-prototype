import { flattenOutline, moduleTopics } from "./outline";
import type { CourseEntry } from "./types";
import aiDrivenContentAndBrandCommunication from "./ai-driven-content-and-brand-communication";
import uxResearchAndDesignThinking from "./ux-research-and-design-thinking";
import projectManagementWithAiTools from "./project-management-with-ai-tools";
import leadershipInRemoteTeams from "./leadership-in-remote-teams";
import introToProductAnalytics from "./intro-to-product-analytics";
import businessAnalyticsWithPython from "./business-analytics-with-python";
import digitalMarketingFundamentalsAndTheAiMindset from "./digital-marketing-fundamentals-and-the-ai-mindset";
import seoGeoAndOrganicGrowthWithAi from "./seo-geo-and-organic-growth-with-ai";
import paidAdvertisingMediaAndAiIntegratedCampaignStrategy from "./paid-advertising-media-and-ai-integrated-campaign-strategy";
import socialMediaAndEcommerceMarketing from "./social-media-and-ecommerce-marketing";
import emailCrmAndLifecycleMarketingWithAi from "./email-crm-and-lifecycle-marketing-with-ai";
import capstoneProjectAiFirstMarketingSystem from "./capstone-project-ai-first-marketing-system";
import securityFoundationsAndTheThreatLandscape from "./security-foundations-and-the-threat-landscape";
import networkSecurityAndDefence from "./network-security-and-defence";
import identityAccessAndCloudSecurity from "./identity-access-and-cloud-security";
import securityOperationsAndIncidentResponse from "./security-operations-and-incident-response";
import capstoneSecuringASmallOrganisation from "./capstone-securing-a-small-organisation";

/**
 * The registry of courses with content of their own. To add one, add its folder next to this
 * file and one import and one entry here (lib/courses/README.md): the player (lib/data), the
 * course page (lib/platform/course-detail), the topic bodies (lib/content) and the seeded
 * completion (lib/store) all read this list, so no other shared file changes.
 *
 * Six Sigma, the original sample, is not listed: its outline is lib/data-model.json, its page
 * lib/courses/sample-page and its topic bodies the generators of lib/content.
 */
export const COURSES: CourseEntry[] = [
  aiDrivenContentAndBrandCommunication,
  uxResearchAndDesignThinking,
  projectManagementWithAiTools,
  leadershipInRemoteTeams,
  introToProductAnalytics,
  businessAnalyticsWithPython,
  digitalMarketingFundamentalsAndTheAiMindset,
  seoGeoAndOrganicGrowthWithAi,
  paidAdvertisingMediaAndAiIntegratedCampaignStrategy,
  socialMediaAndEcommerceMarketing,
  emailCrmAndLifecycleMarketingWithAi,
  capstoneProjectAiFirstMarketingSystem,
  securityFoundationsAndTheThreatLandscape,
  networkSecurityAndDefence,
  identityAccessAndCloudSecurity,
  securityOperationsAndIncidentResponse,
  capstoneSecuringASmallOrganisation,
];

/** Ids and slugs taken by the sample courses of lib/data (Six Sigma topics are "m1-t1", unprefixed). */
const RESERVED = ["six-sigma", "cap", "capstone", "qs", "quick-start", "m1", "m2", "m3", "m4", "ln"];

/**
 * What the readers of the registry take for granted, checked once when it loads so that
 * `next build` (and the dev server) stops on a course that breaks it, naming the course.
 */
function problems(entries: CourseEntry[]): string[] {
  const found: string[] = [];
  const seen = new Map<string, string>();
  const claim = (key: string, owner: string) => {
    if (seen.has(key)) found.push(`"${key}" is used by ${seen.get(key)} and by ${owner}`);
    seen.set(key, owner);
  };
  RESERVED.forEach((key) => claim(key, "the sample courses"));

  for (const { outline, page, content } of entries) {
    const name = outline.slug;
    claim(outline.slug, name);
    if (outline.id !== outline.slug) claim(outline.id, name);
    if (page.slug !== outline.slug) found.push(`${name}: page.slug is "${page.slug}"`);
    if (page.title !== outline.title) found.push(`${name}: page.title and outline.title differ`);

    const prefix = `${outline.id}-`;
    const topics = flattenOutline(outline);
    const ids = [
      ...outline.modules.map((m) => m.id),
      ...outline.modules.flatMap((m) => (m.lessons ?? []).map((l) => l.id)),
      ...topics.map((t) => t.id),
      ...topics.flatMap((t) => (t.transcript ?? []).map((line) => line.id)),
    ];
    for (const id of ids) {
      if (!id.startsWith(prefix)) found.push(`${name}: id "${id}" does not start with "${prefix}"`);
      claim(id, name);
    }

    for (const mod of outline.modules) {
      const own = moduleTopics(mod);
      const done = own.filter((t) => t.completed).length;
      if (mod.topicsTotal !== own.length || mod.topicsCompleted !== done || mod.isCompleted !== (done === own.length)) {
        found.push(`${name}: ${mod.id} says ${mod.topicsCompleted} of ${mod.topicsTotal}, its topics say ${done} of ${own.length}`);
      }
    }
    const modulesDone = outline.modules.filter((m) => m.isCompleted).length;
    if (outline.modulesTotal !== outline.modules.length || outline.modulesCompleted !== modulesDone) {
      found.push(`${name}: modulesCompleted / modulesTotal do not match its modules`);
    }

    const byId = new Map(topics.map((t) => [t.id, t]));
    // Each map of content and, for the optional ones, the topic types that read it: a lab
    // written for a topic that is still an Activity would never be shown.
    const groups: [Record<string, unknown> | undefined, string[] | null][] = [
      [content.articles, null],
      [content.quizzes, null],
      [content.assignments, null],
      [content.ora, null],
      [content.labs, ["Lab"]],
      [content.podcasts, ["Podcast"]],
      [content.lessonPages, ["Lesson Page"]],
      [content.sessions, ["VILT-Live Session", "VILT-Recording"]],
    ];
    for (const [group, types] of groups) {
      for (const id of Object.keys(group ?? {})) {
        const topic = byId.get(id);
        if (!topic) found.push(`${name}: content is written for "${id}", which is not a topic of the course`);
        else if (types && !types.includes(topic.type)) {
          found.push(`${name}: content for a ${types[0]} is written for "${id}", which is a ${topic.type}`);
        }
      }
    }
  }
  return found;
}

const found = problems(COURSES);
if (found.length > 0) throw new Error(`lib/courses: ${found.join("; ")}`);
