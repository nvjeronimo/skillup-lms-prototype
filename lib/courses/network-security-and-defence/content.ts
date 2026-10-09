import type { CourseContent } from "@/lib/courses/kit";

/**
 * Topic bodies of "Network Security and Defence": one reading, the first practice quiz and
 * the written assignment. The transcripts of the two videos that have one ("Course
 * introduction" and "DNS: how names become addresses") are in the outline. Larchfield
 * Architects is a practice made up for the course; the addresses in the questions are from
 * private ranges.
 */
export const content: CourseContent = {
  byline: {
    author: "Dr. Amara Okafor",
    role: "Lead instructor · Cybersecurity Fundamentals",
    updated: "September 2026",
  },
  quiz: [
    {
      question: "What is the main purpose of network segmentation?",
      platformPrompt: "Choose the correct option",
      explanation:
        "Segmentation divides a network into zones and controls the traffic between them, so that a compromised device can reach only what its zone is allowed to reach.",
      options: [
        { id: "a", label: "To make the network faster", feedback: "It can reduce broadcast traffic, but speed is not its purpose." },
        {
          id: "b",
          label: "To limit how far a compromise or a fault can spread",
          correct: true,
          feedback: "Correct. Each zone boundary is a place where traffic can be allowed, denied and logged.",
        },
        { id: "c", label: "To give every device a public address", feedback: "Segmentation is about internal boundaries, not public addressing." },
        { id: "d", label: "To remove the need for a firewall", feedback: "Zones need something to enforce the rules between them, which is usually a firewall." },
      ],
    },
    {
      question: "A firewall rule base ends with a rule that blocks everything not allowed above it. What is this approach called?",
      platformPrompt: "Choose the correct option",
      explanation:
        "With default deny, traffic passes only when a rule says so. A forgotten service is then blocked, which is the safe way to fail.",
      options: [
        { id: "a", label: "Default allow", feedback: "Default allow passes everything that no rule blocks." },
        { id: "b", label: "Default deny", correct: true, feedback: "Correct. Only traffic with an explicit rule gets through." },
        { id: "c", label: "Stateful inspection", feedback: "That is how a firewall tracks connections, not what it does with unmatched traffic." },
        { id: "d", label: "Port forwarding", feedback: "Port forwarding publishes an internal service. It is a rule, not a default." },
      ],
    },
    {
      question: "What does TLS provide for a connection between a browser and a web server?",
      explanation:
        "TLS encrypts the traffic, detects changes to it and lets the browser check the server's identity through its certificate. It says nothing about whether the site itself is trustworthy.",
      options: [
        { id: "a", label: "Encryption only", feedback: "It also protects integrity and authenticates the server." },
        {
          id: "b",
          label: "Encryption, integrity and authentication of the server",
          correct: true,
          feedback: "Correct. The certificate is what ties the connection to the named server.",
        },
        { id: "c", label: "A guarantee that the site is safe to use", feedback: "A harmful site can have a valid certificate too." },
        { id: "d", label: "Protection against all denial-of-service attacks", feedback: "TLS protects the content of a connection, not its availability." },
      ],
    },
  ],
  articles: {
    "sec2-m1-t4": {
      lede: "A port number tells a computer which program a connection is for. Knowing the handful of ports and protocols an office really uses is the quickest way to see traffic that does not belong.",
      sections: [
        {
          heading: "Addresses find the machine, ports find the service",
          paragraphs: [
            "An IP address gets a packet to the right device. The port number, from 0 to 65535, gets it to the right program on that device. A web server listens on port 443 for HTTPS; a mail server listens on port 25 to receive mail from other servers.",
            "TCP sets up a connection and confirms delivery, which suits web pages, mail and file transfers. UDP sends without a handshake, which suits short questions and answers such as DNS, and streams where a late packet is of no use.",
          ],
        },
        {
          heading: "What a small office normally sends",
          paragraphs: [
            "Most traffic from a staff laptop is HTTPS on port 443 and DNS on port 53. Add the mail client, a video meeting service, a time service and software updates, and you have described nearly all of it.",
            "Servers and devices have even narrower habits. A printer talks to print clients and perhaps to its maker's update service. A card terminal talks to the payment processor. Write these expectations down for each type of device: that list is your baseline.",
          ],
        },
        {
          heading: "Using the baseline",
          paragraphs: [
            "A baseline turns a vague question, “is anything wrong?”, into specific ones. Why is a printer making connections to the internet at night? Why is one laptop accepting connections from another laptop? Why is a remote administration port reachable from outside the office?",
            "The same list drives the firewall rules. If a type of device needs three destinations, allow those three and deny the rest. You will write rules this way in Module 3.",
          ],
        },
      ],
      pullQuote: {
        text: "You cannot spot the odd connection until you have written down the normal ones.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "Ports identify services, and a few ports carry most office traffic.",
        "TCP confirms delivery; UDP does not, and suits short exchanges such as DNS.",
        "Write a baseline for each type of device: what it talks to, and on which ports.",
        "Departures from the baseline are the questions worth asking first.",
      ],
    },
  },
  quizzes: {
    "sec2-m1-t5": [
      {
        question: "Which pairing of service, transport and port is correct?",
        platformPrompt: "Choose the correct option",
        hints: [
          "Web traffic that is encrypted has its own well-known port.",
          "Port 53 belongs to name lookups, and port 25 to mail between servers.",
        ],
        explanation:
          "HTTPS runs over TCP on port 443. DNS uses port 53, mostly over UDP, and mail servers receive from each other on TCP port 25.",
        reviewTopicId: "sec2-m1-t4",
        reviewTopicTitle: "Ports, protocols and what normal traffic looks like",
        options: [
          { id: "a", label: "HTTPS over TCP on port 443", correct: true, feedback: "Correct. This is most of what a staff laptop sends." },
          { id: "b", label: "DNS over TCP on port 25", feedback: "Port 25 is mail between servers. DNS uses port 53." },
          { id: "c", label: "Mail between servers on port 53", feedback: "Port 53 is DNS." },
          { id: "d", label: "HTTPS over UDP on port 80", feedback: "Port 80 is unencrypted HTTP, over TCP." },
        ],
      },
      {
        question: "A device has the address 192.168.10.37 with the subnet mask 255.255.255.0. Which address is on the same subnet?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The mask 255.255.255.0 says that the first three numbers name the network. Any address that starts with 192.168.10 is on the same subnet and can be reached without a router.",
        reviewTopicId: "sec2-m1-t3",
        reviewTopicTitle: "IP addresses, subnets and routing",
        options: [
          { id: "a", label: "192.168.10.200", correct: true, feedback: "Correct. The first three numbers match, so it is the same network." },
          { id: "b", label: "192.168.11.37", feedback: "The third number differs, so this is another subnet." },
          { id: "c", label: "192.169.10.37", feedback: "The second number differs, so this is another network." },
          { id: "d", label: "10.168.10.37", feedback: "The first number differs, so this is another network." },
        ],
      },
      {
        question: "Why are DNS logs useful to a defender?",
        explanation:
          "Because nearly every connection begins with a name lookup, the DNS log is a short record of where each device tried to go, including the destinations that a firewall later blocked.",
        reviewTopicId: "sec2-m1-t6",
        reviewTopicTitle: "DNS: how names become addresses",
        options: [
          { id: "a", label: "They hold the content of every web page visited", feedback: "DNS carries names and addresses, not page content." },
          {
            id: "b",
            label: "Most connections start with a lookup, so the logs show where devices tried to go",
            correct: true,
            feedback: "Correct. They are compact, and they cover almost every device.",
          },
          { id: "c", label: "They record every password typed", feedback: "DNS never sees passwords." },
          { id: "d", label: "They replace the need for firewall logs", feedback: "The two complement each other: one shows intent, the other what was allowed." },
        ],
      },
    ],
  },
  assignments: {
    "sec2-m2-t9": {
      brief:
        "Design a segmentation plan for Larchfield Architects, the fictional two-site practice described in the case file in Handouts. Group its devices into trust zones, say which zones may talk to which, and give the reason for each allowed flow. Submit a zone diagram and a flow table as one PDF.",
      requirements: [
        "A zone diagram that covers both sites, including guest Wi-Fi and printers",
        "A flow table: source zone, destination zone, service and reason",
        "Everything not listed is denied; say how remote staff connect",
        "2 to 3 pages. Counts toward your final grade",
      ],
    },
  },
  ora: {},
};
