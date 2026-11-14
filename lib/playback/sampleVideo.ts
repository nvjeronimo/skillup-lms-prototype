/**
 * The one real video every Video topic plays (Nelson, 5 Nov 2026): a SkillUp lesson, Introduction
 * to Digital Marketing (course SUIPSKO-600102), from SkillUp's own video storage. It only fills
 * the picture: the topic keeps its own duration, transcript and 90% completion, run by the
 * player's clock, and the video loops if the topic is longer than it. A YouTube topic keeps its
 * own picture.
 *
 * The storage answers 403 without a signature, and the signature is not kept in this public repo:
 * the full signed address comes from NEXT_PUBLIC_SAMPLE_VIDEO_SRC (Vercel project settings, or
 * .env.local). Without it the address below fails and the player shows the poster, as before.
 */
export const SAMPLE_VIDEO_SRC =
  import.meta.env.NEXT_PUBLIC_SAMPLE_VIDEO_SRC ||
  "https://videos.skillup.online/videos/SUIPSKO-600102_Digital%20Marketing%20Fundamentals%20and%20the%20AI%20Mindset/Introduction%20to%20Digital%20Marketing-600102.008.mp4";
