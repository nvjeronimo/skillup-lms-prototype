import type { Course } from "@/lib/courses/kit";

/**
 * "Capstone: Securing a Small Organisation": the capstone of the Cybersecurity Fundamentals
 * Certificate, not started. 25 topics in 4 modules, none done: the player opens on
 * the first topic. Module 4 is locked until Module 3 is complete.
 */
export const outline: Course = {
  id: "sec5",
  slug: "capstone-securing-a-small-organisation",
  title: "Capstone: Securing a Small Organisation",
  provider: "SkillUp",
  courseType: "Course",
  difficulty: "Beginner",
  deliveryMode: "Flexible Learning",
  overallProgressPct: 0,
  modulesCompleted: 0,
  modulesTotal: 4,
  modules: [
    {
      id: "sec5-m1",
      label: "MODULE 01",
      title: "The Brief and the Assessment",
      topicsCompleted: 0,
      topicsTotal: 7,
      isCompleted: false,
      lessons: [
        {
          id: "sec5-m1-l1",
          label: "Meet the organisation",
          topics: [
            {
              id: "sec5-m1-t1",
              type: "Video",
              title: "Capstone Kickoff",
              duration: "8 min",
              completed: false,
              transcript: [
                {
                  id: "sec5-m1-t1-ln1",
                  ts: "0:00",
                  text: "Welcome to the capstone of the Cybersecurity Fundamentals Certificate. In this course you act as the security adviser to one small organisation.",
                },
                {
                  id: "sec5-m1-t1-ln2",
                  ts: "0:20",
                  text: "Your client is Tidewater Veterinary Group, a fictional practice with two clinics and twenty-eight staff. It has no security team: an office manager and an outside IT contractor share the work.",
                },
                {
                  id: "sec5-m1-t1-ln3",
                  ts: "0:40",
                  text: "You will produce a security plan in three milestones and a final submission. Milestone 1 is the asset inventory and the risk register.",
                },
                {
                  id: "sec5-m1-t1-ln4",
                  ts: "0:55",
                  text: "Milestone 2 is the design: network zones and an access model the practice can actually run. Milestone 3 is the monitoring and incident response plan.",
                },
                {
                  id: "sec5-m1-t1-ln5",
                  ts: "1:15",
                  text: "The final project brings the three together with a twelve-month roadmap and a one-page summary written for the practice owner.",
                },
                {
                  id: "sec5-m1-t1-ln6",
                  ts: "1:30",
                  text: "Twice you will review the work of two peers. Reading other plans for the same client is one of the best ways to see what yours has missed.",
                },
                {
                  id: "sec5-m1-t1-ln7",
                  ts: "1:50",
                  text: "There is no single right answer. You are graded on whether your choices follow from the risks you found, and whether a small team could carry them out. Read the brief next.",
                },
              ],
            },
            {
              id: "sec5-m1-t2",
              type: "Reading",
              title: "Capstone brief: Tidewater Veterinary Group",
              duration: "approx. 15 min read",
              completed: false,
            },
            {
              id: "sec5-m1-t3",
              type: "Video",
              title: "Scoping an assessment and agreeing its limits",
              duration: "10 min",
              completed: false,
              transcript: [
                {
                  id: "sec5-m1-t3-ln1",
                  ts: "0:00",
                  text: "Before you assess anything, agree what is in scope. Scope is the list of sites, systems and data you will look at, and it is written down.",
                },
                {
                  id: "sec5-m1-t3-ln2",
                  ts: "0:20",
                  text: "For Tidewater, the scope is both clinics, the practice management service, email and file storage, the payment terminals, and the devices staff use for work.",
                },
                {
                  id: "sec5-m1-t3-ln3",
                  ts: "0:40",
                  text: "Just as important is what is out. Personal phones that never touch practice data are out. The software supplier's own infrastructure is out, though the practice's settings in it are in.",
                },
                {
                  id: "sec5-m1-t3-ln4",
                  ts: "0:55",
                  text: "Agree how you will gather information. In this capstone you work from the documents and interview notes in the case file. You do not test or scan any system.",
                },
                {
                  id: "sec5-m1-t3-ln5",
                  ts: "1:15",
                  text: "That limit is normal in real work too. An assessor acts only with written permission from the owner, and only within the scope that permission describes.",
                },
                {
                  id: "sec5-m1-t3-ln6",
                  ts: "1:30",
                  text: "Record your assumptions. Where the case file is silent, say what you assumed and why, so that the reader can correct you.",
                },
                {
                  id: "sec5-m1-t3-ln7",
                  ts: "1:50",
                  text: "A clear scope protects both sides: the client knows what the findings cover, and you know where your responsibility ends.",
                },
              ],
            },
            {
              id: "sec5-m1-t4",
              type: "Practice Assignment",
              title: "Practice Quiz: Reading the brief",
              duration: "approx. 8 min",
              completed: false,
            },
          ],
        },
        {
          id: "sec5-m1-l2",
          label: "Milestone 1",
          topics: [
            {
              id: "sec5-m1-t5",
              type: "Reading",
              title: "How to build the asset inventory",
              duration: "approx. 10 min read",
              completed: false,
            },
            {
              id: "sec5-m1-t6",
              type: "Activity",
              title: "Draft the asset inventory from the case file",
              duration: "approx. 30 min",
              completed: false,
            },
            {
              id: "sec5-m1-t7",
              type: "Graded Assignment",
              title: "Milestone 1 · Asset inventory and risk register",
              duration: "approx. 90 min",
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: "sec5-m2",
      label: "MODULE 02",
      title: "Designing the Controls",
      topicsCompleted: 0,
      topicsTotal: 7,
      isCompleted: false,
      lessons: [
        {
          id: "sec5-m2-l1",
          label: "Network and access",
          topics: [
            {
              id: "sec5-m2-t1",
              type: "Video",
              title: "Turning risks into a control plan",
              duration: "10 min",
              completed: false,
            },
            {
              id: "sec5-m2-t2",
              type: "Reading",
              title: "Choosing controls a small team can run",
              duration: "approx. 12 min read",
              completed: false,
            },
            {
              id: "sec5-m2-t3",
              type: "Activity",
              title: "Sketch the target network zones",
              duration: "approx. 30 min",
              completed: false,
            },
            {
              id: "sec5-m2-t4",
              type: "Activity",
              title: "Draft the access matrix",
              duration: "approx. 30 min",
              completed: false,
            },
          ],
        },
        {
          id: "sec5-m2-l2",
          label: "Milestone 2",
          topics: [
            {
              id: "sec5-m2-t5",
              type: "Reading",
              title: "Writing a design a non-specialist can approve",
              duration: "approx. 10 min read",
              completed: false,
            },
            {
              id: "sec5-m2-t6",
              type: "Graded Assignment",
              title: "Milestone 2 · Network and access design",
              duration: "approx. 90 min",
              completed: false,
            },
            {
              id: "sec5-m2-t7",
              type: "Peer Review",
              title: "Peer review: two control designs",
              duration: "approx. 30 min",
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: "sec5-m3",
      label: "MODULE 03",
      title: "Detect, Respond, Recover",
      topicsCompleted: 0,
      topicsTotal: 6,
      isCompleted: false,
      lessons: [
        {
          id: "sec5-m3-l1",
          label: "Monitoring and response",
          topics: [
            {
              id: "sec5-m3-t1",
              type: "Video",
              title: "A monitoring plan sized for a small organisation",
              duration: "10 min",
              completed: false,
            },
            {
              id: "sec5-m3-t2",
              type: "Reading",
              title: "What to log first when you cannot log everything",
              duration: "approx. 12 min read",
              completed: false,
            },
            {
              id: "sec5-m3-t3",
              type: "Activity",
              title: "Write the phishing playbook for the clinic",
              duration: "approx. 30 min",
              completed: false,
            },
            {
              id: "sec5-m3-t4",
              type: "Reading",
              title: "Backup and recovery plan: testing the restore",
              duration: "approx. 10 min read",
              completed: false,
            },
          ],
        },
        {
          id: "sec5-m3-l2",
          label: "Milestone 3",
          topics: [
            {
              id: "sec5-m3-t5",
              type: "Graded Assignment",
              title: "Milestone 3 · Monitoring and incident response plan",
              duration: "approx. 90 min",
              completed: false,
            },
            {
              id: "sec5-m3-t6",
              type: "Quiz",
              title: "Graded Quiz: Capstone checkpoint",
              duration: "approx. 15 min",
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: "sec5-m4",
      label: "MODULE 04",
      title: "Final Submission and Review",
      topicsCompleted: 0,
      topicsTotal: 5,
      isCompleted: false,
      lessons: [
        {
          id: "sec5-m4-l1",
          label: "Bring it together",
          topics: [
            {
              id: "sec5-m4-t1",
              type: "Reading",
              title: "Assembling the security plan and its roadmap",
              duration: "approx. 12 min read",
              completed: false,
              locked: true,
            },
            {
              id: "sec5-m4-t2",
              type: "Video",
              title: "Presenting security to a business owner",
              duration: "10 min",
              completed: false,
              locked: true,
            },
            {
              id: "sec5-m4-t3",
              type: "Project",
              title: "Final Project: Security plan for Tidewater Veterinary Group",
              duration: "approx. 120 min",
              completed: false,
              locked: true,
            },
          ],
        },
        {
          id: "sec5-m4-l2",
          label: "Review and close",
          topics: [
            {
              id: "sec5-m4-t4",
              type: "Peer Review",
              title: "Peer review: two final plans",
              duration: "approx. 40 min",
              completed: false,
              locked: true,
            },
            {
              id: "sec5-m4-t5",
              type: "Video",
              title: "Program wrap-up: where to go from here",
              duration: "6 min",
              completed: false,
              locked: true,
            },
          ],
        },
      ],
    },
  ],
};
