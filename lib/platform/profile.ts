import { user } from "@/lib/data";

/**
 * The Edit profile page's mock (19 Oct 2026). Field names follow Open edX: the learner profile
 * (`country`, `language_proficiencies`, `level_of_education`, `bio` up to 300 characters,
 * `social_links`, `account_privacy` all_users / private) and the account settings (`name`,
 * `email`, `pref-lang`, `time_zone`, `year_of_birth`, `gender`). The username is read-only in Open edX.
 * The career fields (Nelson, 29 Oct 2026) are SkillUp's own, from the skillup.online profile: Open edX
 * has no such fields, so they need a custom build (decision 035) and hide in `?scope=edx`.
 */
export const BIO_MAX = 300;

export interface EditProfileForm {
  fullName: string;
  username: string;
  email: string;
  country: string;
  spokenLanguage: string;
  education: string;
  bio: string;
  linkedin: string;
  visibility: "all_users" | "private";
  siteLanguage: string;
  timeZone: string;
  yearOfBirth: string;
  gender: string;
  /** SkillUp only. */
  phone: string;
  interests: string[];
  workStatus: string;
  workExperience: string;
}

/** Open edX stores no value when the learner leaves a field empty. */
export const NOT_SPECIFIED = "Not specified";

/** Open edX accepts years from 1900 to this year; the list starts at a plausible youngest age. */
const BIRTH_YEARS = Array.from({ length: 2013 - 1930 + 1 }, (_, i) => String(2013 - i));

export const PROFILE_OPTIONS = {
  country: ["India", "Portugal", "United Kingdom", "United States", "Switzerland", "Germany"],
  language: ["English", "Hindi", "Portuguese", "Spanish", "French", "German"],
  education: [
    "Doctorate",
    "Master's or professional degree",
    "Bachelor's degree",
    "Associate degree",
    "Secondary / high school",
    "Other education",
  ],
  siteLanguage: ["English"],
  timeZone: [
    "Default (browser time zone)",
    "Asia/Kolkata (UTC+5:30)",
    "Europe/Lisbon (UTC+1)",
    "Europe/London (UTC+1)",
    "America/New_York (UTC−4)",
  ],
  yearOfBirth: [NOT_SPECIFIED, ...BIRTH_YEARS],
  /** Open edX's three values: f, m, o. */
  gender: [NOT_SPECIFIED, "Female", "Male", "Other / prefer not to say"],
  interests: [
    "Data & analytics",
    "AI & machine learning",
    "Cloud computing",
    "Cybersecurity",
    "Software development",
    "Project management",
    "Quality & Six Sigma",
    "Business & leadership",
  ],
  workStatus: [
    NOT_SPECIFIED,
    "Employed full-time",
    "Employed part-time",
    "Self-employed",
    "Student",
    "Looking for work",
    "Not working",
  ],
  workExperience: [
    NOT_SPECIFIED,
    "No experience yet",
    "Less than 1 year",
    "1–3 years",
    "3–5 years",
    "5–10 years",
    "More than 10 years",
  ],
} as const;

export const editProfileSeed: EditProfileForm = {
  fullName: user.name,
  username: "john.smith",
  email: "john.smith@example.com",
  country: "United Kingdom",
  spokenLanguage: "English",
  education: "Bachelor's degree",
  bio: "Quality engineer moving into data. Working through Six Sigma Green Belt and the Data Analytics program.",
  linkedin: "",
  visibility: "all_users",
  siteLanguage: "English",
  timeZone: "Default (browser time zone)",
  yearOfBirth: NOT_SPECIFIED,
  gender: NOT_SPECIFIED,
  phone: "",
  interests: [],
  workStatus: NOT_SPECIFIED,
  workExperience: NOT_SPECIFIED,
};
