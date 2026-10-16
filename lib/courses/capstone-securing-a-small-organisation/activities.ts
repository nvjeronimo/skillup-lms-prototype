import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "sec5-m1-t6": {
    file: { name: "asset-inventory-draft.xlsx", size: "31 KB" },
    intro:
      "You draft the asset inventory of Tidewater Veterinary Group from the case file. It is the first table of Milestone 1, and every risk in your register has to point back to a line of it.",
    steps: [
      { title: "Read the case file with a marker", detail: "Open the case file from Handouts and the inventory in the Downloads tab. Mark every system, service, device and set of information the documents and interview notes mention." },
      { title: "Enter one asset per row", detail: "Give each asset a name, a type (information, system, service or device), the clinic it belongs to and the person who looks after it." },
      { title: "Say why it matters", detail: "For each asset mark what the practice needs most from it: that it stays private, stays correct or stays available. Add a criticality of high, medium or low." },
      { title: "Record what the case file does not say", detail: "Where the case file is silent, for example on whether the imaging workstation is backed up, write your assumption in the notes column." },
      { title: "Check the result", detail: "A good draft has 12 to 20 assets, includes information and services as well as hardware, gives every row an owner and a criticality, and marks each assumption. The client records and the practice management service are both on it." },
    ],
  },
  "sec5-m2-t3": {
    file: { name: "zone-sketch-template.docx", size: "44 KB" },
    intro:
      "You sketch the target network zones for one Tidewater clinic. It is a first version of the zone diagram for Milestone 2, drawn quickly so that you can test it against your risks before you tidy it.",
    steps: [
      { title: "List what is on the network", detail: "Open the template in the Downloads tab. From your asset inventory, list every device and service at one clinic that connects to the network." },
      { title: "Draw the zones", detail: "Draw four to six boxes: for example staff, clinical equipment, card terminals, client Wi-Fi, and management. The client Wi-Fi and the card terminals each get a zone of their own." },
      { title: "Place every device", detail: "Write each device in one box. Put equipment that cannot be updated in a zone away from the staff laptops." },
      { title: "Draw the allowed connections", detail: "Add an arrow for each connection that must exist, with its purpose. Anything without an arrow is blocked." },
      { title: "Check the result", detail: "A good sketch places every device once, has no arrow from the client Wi-Fi into the clinic, and lets you point at each zone and name the risk in your register that it answers." },
    ],
  },
  "sec5-m2-t4": {
    file: { name: "access-matrix-draft.xlsx", size: "29 KB" },
    intro:
      "You draft the access matrix for Tidewater: its roles against its systems. This is the second half of Milestone 2, and it is where the contractor's administrator access gets contained.",
    steps: [
      { title: "Name the roles", detail: "Open the matrix in the Downloads tab. From the case file, define five to eight roles, such as veterinarian, nurse, receptionist, office manager, owner and contractor. Roles are jobs, not people." },
      { title: "List the systems", detail: "Put the systems of your asset inventory across the top: the practice management service, email, the file share, imaging, payments and the network equipment." },
      { title: "Fill each cell", detail: "For each role and system write none, read, write or administer. Start from none and add only what the job needs." },
      { title: "Contain the administrator access", detail: "Give the contractor a separate administrator account used only for that work, and say who approves and who reviews what it does. No one administers from an everyday account." },
      { title: "Check the result", detail: "A good matrix has five to eight roles, no cell left blank, at most two roles that administer any one system, and a note for each high-risk cell naming the risk in your register it relates to." },
    ],
  },
  "sec5-m3-t3": {
    file: { name: "phishing-playbook-template.docx", size: "37 KB" },
    intro:
      "You write the playbook Tidewater follows when someone reports a suspicious email or has already clicked. It is one of the two playbooks of Milestone 3, sized for an office manager, an owner and a contractor who is on site one day a month.",
    steps: [
      { title: "Set the trigger and the first contact", detail: "Open the template in the Downloads tab. Write what starts the playbook, and who a member of staff tells, by which route, with a second person for when the first is away." },
      { title: "Write the first fifteen minutes", detail: "List what the office manager does first, in order: ask what was clicked or entered, keep the message, and note the time. No step should need the contractor to be present." },
      { title: "Write the branches", detail: "Give the steps for three cases: reported and not opened, link opened, and password or payment details entered. The third includes resetting the password, ending open sessions and checking for new mail forwarding rules." },
      { title: "Say when to escalate and who is told", detail: "Write the conditions for calling the contractor and the owner, and when clients, the bank or the regulator would need to be informed." },
      { title: "Check the result", detail: "A good playbook fits on two pages, names a person for every step, can be followed by someone who is not technical, and ends with what is recorded afterwards. It thanks the person who reported, so that people keep reporting." },
    ],
  },
};
