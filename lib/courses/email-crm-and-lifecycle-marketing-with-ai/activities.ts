import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "crm-m1-t6": {
    file: { name: "sending-domain-check.docx", size: "36 KB" },
    intro:
      "You check a sending domain against the deliverability checklist, using the sample records and message header in the file. Authentication is the first thing a mailbox provider looks at, before it reads a word of your email.",
    steps: [
      { title: "Read the sample records", detail: "Open the file in the Downloads tab. It shows the SPF, DKIM and DMARC records of a fictional shop's sending domain, and the header of one email it sent." },
      { title: "Check SPF and DKIM", detail: "Confirm that the SPF record lists the service that sent the email, and that the header shows a DKIM signature that passed for the same domain." },
      { title: "Check DMARC and alignment", detail: "Read the DMARC policy. Check that the domain in the From address matches the domain that passed SPF or DKIM." },
      { title: "Check the rest of the list", detail: "Go through the remaining items: a working unsubscribe link in one click, a reply address someone reads, and a complaint rate under the limit in the checklist." },
      { title: "Check the result", detail: "A good result marks each item of the checklist as pass or fail with the line of the record or header that shows it, and lists the fixes in the order you would make them. The sample has two faults to find." },
    ],
  },
  "crm-m2-t5": {
    file: { name: "sample-contacts-segments.xlsx", size: "96 KB" },
    intro:
      "You build three segments from the sample contact list of 500 records. A segment defined by what people did, and when, can be rebuilt by anyone and updates itself.",
    steps: [
      { title: "Look at the columns", detail: "Open the workbook in the Downloads tab. Note the columns you can segment on: sign-up date, last order date, number of orders, last email opened, and consent." },
      { title: "Define three segments", detail: "Write a rule for each: new subscribers who have not ordered, active customers, and lapsed customers. Each rule names a column, a condition and a time window." },
      { title: "Filter and count", detail: "Apply each rule with a filter and write down how many of the 500 contacts it returns. Leave out everyone without marketing consent." },
      { title: "Check for overlap", detail: "Make sure no contact is in two segments. If someone is, tighten the rule and say which segment wins." },
      { title: "Check the result", detail: "A good result is three rules another person could apply and get the same counts, no contact in two segments, and a note on how many contacts fit none. Consent is part of every rule." },
    ],
  },
};
