import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "sec3-m1-t8": {
    file: { name: "six-sign-in-scenarios.docx", size: "33 KB" },
    intro:
      "You choose a sign-in method for six scenarios. The right method depends on what the account protects and on the person using it, so there is no single answer for every case.",
    steps: [
      { title: "Read the six scenarios", detail: "Open the file in the Downloads tab. Each scenario describes a person, a device and what the account gives access to, from a shared warehouse tablet to a finance administrator." },
      { title: "Rate what is at stake", detail: "Mark each scenario as low, medium or high according to what someone could do with the account." },
      { title: "Choose the method", detail: "For each one choose from the options on the second page: password with a password manager, an authenticator app, a hardware security key, a passkey, or single sign-on with one of these." },
      { title: "Plan for the bad day", detail: "For each choice write what happens when the phone or the key is lost: who resets access, and how that person confirms identity." },
      { title: "Check the result", detail: "A good result uses a method that resists phishing for every high-stakes account, never relies on a text-message code for an administrator, and has a recovery route for each scenario that is not weaker than the sign-in itself." },
    ],
  },
  "sec3-m2-t8": {
    file: { name: "access-matrix-to-review.xlsx", size: "28 KB" },
    intro:
      "You review an access matrix of twelve people and eight systems and find the permissions nobody needs. Excess access builds up quietly as people change roles, and a review is how it is removed.",
    steps: [
      { title: "Read the roles", detail: "Open the workbook in the Downloads tab. The first sheet lists the twelve people and their current jobs. The second is the matrix: what each person can do in each system." },
      { title: "Compare access with the job", detail: "For each person, mark every permission the job description does not call for. Look hardest at people who changed role and kept their old access." },
      { title: "Look for the usual patterns", detail: "Check for administrator rights on an everyday account, a shared account with no owner, an account for someone who has left, and one person able both to create and to approve a payment." },
      { title: "Propose the change", detail: "For each finding write what to remove or reduce and who must agree to it." },
      { title: "Check the result", detail: "A good review lists at least six findings, each with the person, the system, the reason and the proposed change, and covers all four patterns. You do not remove access that a job really needs." },
    ],
  },
  "sec3-m3-t8": {
    file: { name: "shared-responsibility-worksheet.docx", size: "35 KB" },
    intro:
      "You assign responsibilities for three cloud services: a hosted email service, a platform that runs your application, and a rented virtual server. Who secures what changes with the kind of service, and gaps appear where each side assumes the other is doing it.",
    steps: [
      { title: "Read the three services", detail: "Open the worksheet in the Downloads tab. Note which of the three is software, platform or infrastructure as a service." },
      { title: "Fill in the table", detail: "For each service, mark every row as the provider's job, the customer's job or shared: the building, the hardware, the operating system, the application, the accounts, the data." },
      { title: "Explain the shared rows", detail: "Where you wrote shared, say in one line what each side does. The provider offers multi-factor sign-in; the customer has to turn it on." },
      { title: "List what is always yours", detail: "Write the rows that stay with the customer in all three services." },
      { title: "Check the result", detail: "A good table shows the customer's share growing from the email service to the virtual server, and has accounts, access and data on the customer's side in all three. Every shared row says who does which part." },
    ],
  },
};
