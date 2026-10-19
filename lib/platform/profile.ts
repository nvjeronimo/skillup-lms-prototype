import { user } from "@/lib/data";

/**
 * The Edit profile page's mock (19 Oct 2026). Field names follow Open edX: the learner profile
 * (`country`, `language_proficiencies`, `level_of_education`, `bio` up to 300 characters,
 * `social_links`, `account_privacy` all_users / private) and the account settings (`name`,
 * `email`, `pref-lang`, `time_zone`). The username is read-only in Open edX.
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
}

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
};
