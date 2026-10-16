import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "sec1-m1-t8": {
    file: { name: "ten-controls-to-classify.xlsx", size: "21 KB" },
    intro:
      "You classify ten security controls by what they are and by what they do. Seeing both shows where an organisation relies on a single kind of protection.",
    steps: [
      { title: "Read the ten controls", detail: "Open the worksheet in the Downloads tab. Each row describes one control in a sentence, such as a door lock, a backup, a training session or a log review." },
      { title: "Say what kind it is", detail: "Mark each control as technical, administrative or physical. Ask what it is made of: a setting, a rule for people, or an object." },
      { title: "Say what it does", detail: "Mark each control as preventive, detective or corrective. Ask when it acts: before something goes wrong, while it happens, or afterwards." },
      { title: "Look at the spread", detail: "Count how many controls fall in each function. Note which function has the fewest." },
      { title: "Check the result", detail: "A good result gives every control one type and one function with a short reason, and ends with the function that is thinnest. A backup is corrective, and a log nobody reads detects nothing." },
    ],
  },
  "sec1-m2-t8": {
    file: { name: "fernhill-threats-and-assets.xlsx", size: "26 KB" },
    intro:
      "You map threats to the assets of Fernhill Bakery, the business of the case file. This is the groundwork for the risk register you build in the assignment that follows.",
    steps: [
      { title: "List the assets", detail: "Open the worksheet in the Downloads tab and the Fernhill Bakery case file from Handouts. List eight things the bakery depends on: the till, the order inbox, the customer list, the supplier accounts, the recipes, and so on." },
      { title: "Say what matters about each", detail: "For each asset mark which matters most: that it stays private, that it stays correct, or that it stays available." },
      { title: "Match realistic threats", detail: "From the list on the second sheet, choose the one or two threats most likely to affect each asset: a fraudulent email, a lost device, ransomware, a mistake by staff, a power cut." },
      { title: "Note what is already in place", detail: "From the case file, write any protection the bakery already has for that asset, or “none found”." },
      { title: "Check the result", detail: "A good map has eight assets, a property and at least one threat for each, and includes threats that are accidents as well as attacks. Each line is one you could turn into a row of the register." },
    ],
  },
  "sec1-m3-t4": {
    file: { name: "twelve-messages-to-sort.pdf", size: "1.1 MB" },
    intro:
      "You sort twelve sample messages into legitimate and suspicious, and say what gave each one away. The habit to build is checking the sender and the request, not hunting for spelling mistakes.",
    steps: [
      { title: "Read each message as the recipient", detail: "Open the file in the Downloads tab. Each of the twelve messages is an email or a text received by someone at a small business. Read the sender, the address behind the name, and what is being asked." },
      { title: "Sort them", detail: "Mark each message as legitimate, suspicious or cannot tell. Cannot tell is a valid answer when you would need to check by another route." },
      { title: "Name the signal", detail: "For each suspicious message write the signal: an address that does not match the name, pressure to act now, a request to change payment details, a link that leads somewhere else." },
      { title: "Say what you would do", detail: "For each suspicious or unclear message write the safe next step: report it, or confirm by phoning a number you already have. Never use the contact details in the message itself." },
      { title: "Check the result", detail: "A good result gives a signal for every suspicious message and a next step for every unclear one. Some well-written messages in the set are suspicious and some clumsy ones are genuine, so tone alone decides nothing." },
    ],
  },
};
