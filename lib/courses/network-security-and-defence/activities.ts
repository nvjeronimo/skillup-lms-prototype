import type { CourseActivity } from "@/lib/courses/kit";

/** The Activity topics of the course, by topic id (lib/courses/README.md). */
export const activities: Record<string, CourseActivity> = {
  "sec2-m2-t8": {
    file: { name: "twenty-devices-to-zone.xlsx", size: "24 KB" },
    intro:
      "You place the twenty devices of a small office into network zones. Segmentation limits how far a problem on one device can spread, and it starts with deciding what belongs together.",
    steps: [
      { title: "Read the device list", detail: "Open the worksheet in the Downloads tab. Each row is a device with its user, its purpose and what it needs to reach: laptops, a file server, printers, phones, a door controller, visitors' devices." },
      { title: "Define the zones", detail: "Choose four or five zones, for example staff, servers, printers and other office equipment, guests, and management. Write one sentence on what each zone is for." },
      { title: "Place each device", detail: "Put every device in one zone. Group by how much you trust it and what it must reach, not by where it stands in the building." },
      { title: "Write the allowed flows", detail: "For each pair of zones that must talk, write the direction and the purpose, such as staff to printers for printing. Anything you do not list is blocked." },
      { title: "Check the result", detail: "A good result has all twenty devices placed, guests able to reach the internet and nothing else, devices that cannot be updated kept away from staff laptops, and a short list of flows each with a reason." },
    ],
  },
};
