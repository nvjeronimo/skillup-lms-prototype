import type { CourseContent } from "@/lib/courses/kit";
import { activities } from "./activities";

/**
 * Topic bodies of "Network Security and Defence". All of Module 1 is written (the
 * transcripts of its three videos are in the outline, with the one of "How a firewall
 * decides"), then the two labs, the podcast, two more readings, the practice quiz on
 * firewalls and the written assignment. Larchfield Architects, and Tidewater Clinics where
 * the podcast guest works, are made up for the course; the addresses are from private
 * ranges. Everything here is review and defence: reading sample files, never running a tool
 * against a network.
 */
export const content: CourseContent = {
  byline: {
    author: "Dr. Amara Okafor",
    role: "Lead instructor · Network Security and Defence",
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
    "sec2-m1-t7": {
      lede: "Before a laptop can reach anything, two quiet protocols do their work on the local network: DHCP gives it an address, and ARP finds the hardware behind the addresses next to it. Both leave records that tell a defender which device is which.",
      sections: [
        {
          heading: "DHCP: how a device gets its address",
          paragraphs: [
            "A device that joins a network broadcasts a request, and the DHCP server answers with a lease: an IP address, the subnet mask, the default gateway and the DNS resolver to use, valid for a set time. In a small office the server is usually the router or the firewall.",
            "The lease table is one of the most useful records an office has. Each line ties an IP address to a hardware (MAC) address, a device name and a time. When a log elsewhere says that 192.168.20.57 did something at 14:10, the lease table says which device held that address at 14:10.",
          ],
        },
        {
          heading: "ARP: from address to hardware",
          paragraphs: [
            "On the local network, frames are delivered to hardware addresses, not IP addresses. To send to 192.168.20.1, a device asks the whole subnet who has that address, and the owner replies with its MAC address. The answer is kept in the ARP table for a few minutes.",
            "ARP has no way to check that a reply is true: devices believe the answers they receive. That is why switches for business use offer protections that compare ARP replies with the DHCP lease table and drop the ones that do not agree, and why those protections are worth turning on.",
          ],
        },
        {
          heading: "What a defender takes from this",
          paragraphs: [
            "Keep the DHCP logs, and keep them for long enough: weeks, not hours. Give servers, printers and network devices reserved addresses, so that they are always found at the same place and stand out if they move.",
            "Then read the tables from time to time. A device name nobody recognises, a second DHCP server answering on the network, or one MAC address claiming the address of the gateway are all worth a question on the same day.",
          ],
        },
      ],
      pullQuote: {
        text: "An IP address in a log is only useful if you can say which device held it at that minute.",
        attribution: "Course notes, Module 1",
      },
      takeaways: [
        "DHCP leases tie an address to a device and a time: keep the logs for weeks.",
        "ARP maps IP addresses to hardware addresses and trusts every reply.",
        "Turn on the switch protections that check ARP against the lease table.",
        "Reserve addresses for servers, printers and network devices.",
      ],
    },
    "sec2-m2-t2": {
      lede: "In a flat network every device can reach every other device. It is the easiest network to set up and the hardest to defend, because one infected laptop sits one step away from everything the office owns.",
      sections: [
        {
          heading: "What flat means",
          paragraphs: [
            "A flat network is one subnet with no filtering inside it: staff laptops, the file server, printers, the door controller, the guest's phone and the accounting PC all share the same range. Nothing sits between them to allow, deny or record a connection.",
            "Most small offices start this way. The router arrives with one network configured, and each new device simply joins it. Nobody decides that the printer should be able to reach the accounting PC. It can because nothing says otherwise.",
          ],
        },
        {
          heading: "Why it fails",
          paragraphs: [
            "Incidents rarely begin on the most important machine. They begin on the weakest one: a laptop whose user opened an attachment, or a camera that never received an update. In a flat network that device can then try every other device directly, and the traffic never crosses a point where it could be blocked or logged.",
            "The same is true of faults. A misconfigured device that floods the network with traffic slows everyone down, because everyone shares the same segment. Flatness turns a local problem into an office-wide one.",
          ],
        },
        {
          heading: "The first boundaries to draw",
          paragraphs: [
            "You do not need a complex design to improve on this. Three boundaries remove most of the exposure: guests on their own network with internet access only; printers, cameras and other unattended devices in a zone that staff can reach but that cannot start connections to staff; and servers behind rules that allow only the services they offer.",
            "Each boundary is a place where traffic is allowed for a stated reason, denied otherwise, and written to a log. The next topics give these zones names and show how VLANs and subnets build them.",
          ],
        },
      ],
      pullQuote: {
        text: "In a flat network, the security of the accounting PC equals the security of the least-maintained device in the building.",
        attribution: "Course notes, Module 2",
      },
      takeaways: [
        "Flat means one subnet with no filtering between devices.",
        "Incidents start on the weakest device and spread across whatever it can reach.",
        "Separate guests, unattended devices and servers first.",
        "Every boundary is a point to allow, deny and log.",
      ],
    },
    "sec2-m3-t2": {
      lede: "A rule base is a written policy that a firewall can execute. Two choices decide whether it protects the office: what happens to traffic no rule mentions, and the order in which the rules are read.",
      sections: [
        {
          heading: "Start from the flows, not from the firewall",
          paragraphs: [
            "List what the office needs before opening the firewall's screen: staff to the internet on HTTPS and DNS, staff to the file server on its file-sharing service, staff to printers, the backup server to its storage provider. Each line has a source zone, a destination zone, a service and a reason.",
            "That list is the flow table you wrote in Assignment 01. A rule base is the same table in the firewall's own format, and every rule should trace back to one line of it. A rule nobody can explain is a rule to review.",
          ],
        },
        {
          heading: "Default deny",
          paragraphs: [
            "End the rule base with a rule that denies everything else and logs it. Traffic then passes only when a rule says so, and a service you forgot is blocked, which someone will report within the hour. With default allow, a service you forgot stays open, and nobody reports that.",
            "The log of the last rule is worth reading in the first weeks. It shows the flows you missed, which become new rules with a reason, and the connections that should not be happening at all.",
          ],
        },
        {
          heading: "Order: first match wins",
          paragraphs: [
            "The firewall reads from the top and stops at the first rule that matches. Put specific rules above general ones. If rule 3 allows the whole staff zone to reach the server zone on any service, a rule 9 that denies staff access to the database port never runs: it is shadowed.",
            "Review the rule base on a schedule. Look for rules with any as the source, destination or service, rules that have matched nothing for months, rules with no owner or reason in their comment, and temporary rules that outlived the work they were for. You practise exactly this in the lab that follows.",
          ],
        },
      ],
      pullQuote: {
        text: "With default deny, your mistakes are reported to you. With default allow, they stay open and silent.",
        attribution: "Course notes, Module 3",
      },
      takeaways: [
        "Write the flow table first; each rule traces back to one line of it.",
        "End with a rule that denies and logs everything else.",
        "Specific rules go above general ones: the first match wins.",
        "Review for any-rules, unused rules, rules with no reason and expired temporary rules.",
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
    "sec2-m1-t9": [
      {
        question: "A laptop sends a web request. Which layer of the TCP/IP model adds the source and destination port numbers?",
        platformPrompt: "Choose the correct option",
        explanation:
          "Ports belong to the transport layer, where TCP and UDP run. The internet layer below adds IP addresses, and the link layer adds hardware addresses for the local hop.",
        reviewTopicId: "sec2-m1-t2",
        reviewTopicTitle: "The TCP/IP model in four layers",
        options: [
          { id: "a", label: "Application", feedback: "The application layer produces the request itself, such as HTTP." },
          { id: "b", label: "Transport", correct: true, feedback: "Correct. TCP and UDP carry the port numbers." },
          { id: "c", label: "Internet", feedback: "The internet layer adds IP addresses, not ports." },
          { id: "d", label: "Link", feedback: "The link layer adds hardware addresses for the local network." },
        ],
      },
      {
        question: "A laptop at 192.168.20.57 with the mask 255.255.255.0 sends a packet to 192.168.30.10. Where does the laptop send it first?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The destination is on another subnet (192.168.30, not 192.168.20), so the laptop hands the packet to its default gateway. The router then forwards it towards the other subnet.",
        reviewTopicId: "sec2-m1-t3",
        reviewTopicTitle: "IP addresses, subnets and routing",
        options: [
          { id: "a", label: "Directly to 192.168.30.10", feedback: "Direct delivery works only inside the same subnet." },
          { id: "b", label: "To its default gateway", correct: true, feedback: "Correct. Anything outside the subnet goes to the router first." },
          { id: "c", label: "To the DNS resolver", feedback: "The resolver translates names. It does not forward packets." },
          { id: "d", label: "To every device on its subnet", feedback: "Packets for another subnet are not broadcast." },
        ],
      },
      {
        question: "A log shows that 192.168.20.57 contacted an unusual destination at 14:10 yesterday. Which record tells you which device that was?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The DHCP lease table ties each IP address to a hardware address, a device name and the time of the lease. Addresses are handed out again, so the time matters as much as the address.",
        reviewTopicId: "sec2-m1-t7",
        reviewTopicTitle: "DHCP, ARP and the local network",
        options: [
          { id: "a", label: "The DHCP lease table", correct: true, feedback: "Correct. It names the device that held the address at that time." },
          { id: "b", label: "The public DNS record of the office", feedback: "Public DNS does not list internal devices." },
          { id: "c", label: "The firewall's default deny rule", feedback: "A rule decides on traffic. It does not identify devices." },
          { id: "d", label: "The subnet mask", feedback: "The mask describes the network, not the device." },
        ],
      },
      {
        question: "Which observation in a day of DNS logs most deserves a closer look?",
        explanation:
          "A single device asking for hundreds of names that do not exist, and that look randomly generated, is not how people or ordinary software behave. It is a reason to find the device and examine it.",
        reviewTopicId: "sec2-m1-t6",
        reviewTopicTitle: "DNS: how names become addresses",
        options: [
          { id: "a", label: "Many laptops looking up the mail service at 09:00", feedback: "That is the start of a working day." },
          {
            id: "b",
            label: "One device looking up hundreds of random-looking names that do not exist",
            correct: true,
            feedback: "Correct. It does not match any normal pattern, so find the device.",
          },
          { id: "c", label: "A printer looking up its maker's update service once a week", feedback: "That fits the baseline of a printer." },
          { id: "d", label: "Cached answers being reused within their time to live", feedback: "That is how caching is meant to work." },
        ],
      },
      {
        question: "You are writing a baseline for the office printers. Which entry belongs in it?",
        explanation:
          "A baseline lists what a type of device normally talks to, and on which ports. For a printer that is print jobs from the staff zone and, at most, its maker's update service. Anything else is a departure worth a question.",
        reviewTopicId: "sec2-m1-t4",
        reviewTopicTitle: "Ports, protocols and what normal traffic looks like",
        options: [
          { id: "a", label: "Accepts print jobs from staff laptops; contacts the maker's update service", correct: true, feedback: "Correct. Short, specific and checkable." },
          { id: "b", label: "May connect to any internet address at any time", feedback: "A baseline that allows everything can never show a departure." },
          { id: "c", label: "Starts connections to staff laptops on remote administration ports", feedback: "A printer has no reason to do that. It would be a finding, not a baseline." },
          { id: "d", label: "Uses the same ports as the file server", feedback: "Each type of device has its own, narrower habits." },
        ],
      },
    ],
    "sec2-m3-t5": [
      {
        question: "Rule 3 allows the staff zone to reach the server zone on any service. Rule 9 denies the staff zone access to the database port in the server zone. What happens to a staff laptop's connection to the database?",
        platformPrompt: "Choose the correct option",
        hints: ["The firewall stops reading at the first rule that matches.", "Which of the two rules comes first?"],
        explanation:
          "The first match wins. Rule 3 matches the connection and allows it, so rule 9 is never reached. Rule 9 is shadowed: move it above rule 3, or narrow rule 3 to the services staff need.",
        reviewTopicId: "sec2-m3-t2",
        reviewTopicTitle: "Writing a rule base: default deny and rule order",
        options: [
          { id: "a", label: "It is allowed by rule 3", correct: true, feedback: "Correct. Rule 9 is shadowed and never runs." },
          { id: "b", label: "It is denied by rule 9", feedback: "Rule 9 would deny it, but the firewall never gets that far." },
          { id: "c", label: "Both rules apply and the stricter one wins", feedback: "Firewalls do not weigh rules against each other. The first match decides." },
          { id: "d", label: "It is dropped by the default deny rule", feedback: "The default rule only sees traffic that no earlier rule matched." },
        ],
      },
      {
        question: "Why should the final deny rule also write to the log?",
        platformPrompt: "Choose the correct option",
        explanation:
          "The log of the final rule shows what was tried and not allowed: flows you forgot, which need a rule and a reason, and connections that should not be happening, which need a question.",
        reviewTopicId: "sec2-m3-t1",
        reviewTopicTitle: "How a firewall decides",
        options: [
          { id: "a", label: "Logging makes the rule faster", feedback: "Logging adds a little work. Its value is the record." },
          { id: "b", label: "It shows what was attempted and blocked", correct: true, feedback: "Correct. Missed flows and unwanted connections both show up there." },
          { id: "c", label: "A rule that does not log is ignored", feedback: "Rules apply whether or not they log." },
          { id: "d", label: "It lets replies to allowed connections return", feedback: "That is the work of stateful inspection." },
        ],
      },
      {
        question: "A rule reads: source any, destination any, service any, allow, comment “temp for migration”. What is the right response in a review?",
        explanation:
          "An any-any allow rule turns the firewall into a cable for as long as it exists. Find the owner, confirm that the work is over and remove the rule. If something still depends on it, replace it with a rule that names the source, the destination and the service.",
        reviewTopicId: "sec2-m3-t2",
        reviewTopicTitle: "Writing a rule base: default deny and rule order",
        options: [
          { id: "a", label: "Leave it: temporary rules expire automatically", feedback: "Most firewalls keep a rule until someone removes it." },
          { id: "b", label: "Move it to the bottom of the rule base", feedback: "It would still allow everything the rules above it did not match." },
          {
            id: "c",
            label: "Find its owner, then remove it or replace it with a specific rule",
            correct: true,
            feedback: "Correct. A rule this broad needs a name, a reason and an end date, or it goes.",
          },
          { id: "d", label: "Duplicate it, so there is a backup", feedback: "That doubles the problem." },
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
  labs: {
    "sec2-m1-t8": {
      kind: "download",
      intro:
        "In this lab you read a summary of 40 packets captured on a sample office network and say, for each one, which layer each field belongs to and what the exchange is: a name lookup, a lease, a web request. You work in a spreadsheet. No capture tool is installed and nothing is run against a real network.",
      prerequisites: [
        "A spreadsheet program, or any editor that opens CSV files",
        "The common ports reference sheet from Handouts",
      ],
      steps: [
        "Download the capture summary and the answer sheet.",
        "For the first ten rows, write the layer of each field: hardware address (link), IP address (internet), port (transport), request line (application).",
        "Find the DHCP exchange at the start of the file and note which address the laptop received, and from which server.",
        "Find three DNS lookups and the connections that follow them. Match each connection to the name that was looked up.",
        "Mark the two rows that do not fit a staff laptop's baseline from the reading on ports, and write one sentence on each.",
        "Compare your sheet with the worked example in the PDF.",
      ],
      files: [
        { name: "capture_summary_40_packets.csv", kind: "data", size: "9 KB" },
        { name: "layers_answer_sheet.xlsx", kind: "data", size: "22 KB" },
        { name: "Lab_01_worked_example.pdf", kind: "pdf", size: "520 KB" },
      ],
      estimatedMinutes: 15,
    },
    "sec2-m3-t4": {
      kind: "download",
      intro:
        "In this lab you review the firewall rule base of Larchfield Architects, exported as a table of 24 rules, and list what a reviewer should raise: rules that are too broad, rules that can never match, rules nobody can explain. The work is done on the file, not on a firewall.",
      prerequisites: [
        "A spreadsheet program, or any editor that opens CSV files",
        "The firewall rule review checklist and the Larchfield Architects case file from Handouts",
      ],
      steps: [
        "Download the rule base and the findings template.",
        "Read the 24 rules from top to bottom, as the firewall does, and note the zone names used.",
        "List every rule with any as its source, destination or service, and say what it should be narrowed to.",
        "Find the two rules that can never match because an earlier rule already covers their traffic.",
        "Check the last rule: does it deny everything else, and does it log?",
        "Mark the rules with no owner or reason in the comment column, and the temporary rules past their end date.",
        "Write your five most important findings in the template, each with the rule number and a proposed change.",
      ],
      files: [
        { name: "larchfield_rule_base.csv", kind: "data", size: "6 KB" },
        { name: "rule_review_findings_template.xlsx", kind: "data", size: "19 KB" },
        { name: "Lab_02_worked_example.pdf", kind: "pdf", size: "610 KB" },
      ],
      estimatedMinutes: 20,
    },
  },
  podcasts: {
    "sec2-m2-t6": {
      host: "Dr. Amara Okafor",
      guest: "Hannah Lindqvist, IT manager at the fictional Tidewater Clinics",
      episodeLabel: "Episode 1",
      summary:
        "Zero trust without the sales language: stop treating the office network as proof that a request is safe, and check the person, the device and the request each time. A conversation about what that changed in a group of twelve clinics, and what a small team can do first.",
      chapters: [
        { ts: "0:00", label: "What “inside the network” used to mean" },
        { ts: "2:10", label: "Verify the person, the device and the request" },
        { ts: "4:45", label: "Least privilege, one application at a time" },
        { ts: "7:20", label: "Three first steps for a small team" },
        { ts: "9:40", label: "What zero trust does not replace" },
      ],
    },
  },
  lessonPages: {
    "sec2-m1-t2": {
      intro:
        "Every message on a network is wrapped four times before it leaves a device, once per layer. This page walks through the four layers of the TCP/IP model and what a defender can see and control at each.",
      blocks: [
        {
          kind: "text",
          heading: "Four layers, four jobs",
          paragraphs: [
            "The application layer is the conversation itself: a browser asking for a page with HTTP, a mail client sending a message. The transport layer, TCP or UDP, delivers that conversation to the right program by port number and, with TCP, confirms that it arrived.",
            "The internet layer moves packets between networks by IP address, one router at a time. The link layer carries them across a single local network, by cable or Wi-Fi, from one hardware address to the next.",
          ],
        },
        { kind: "video", title: "One web request, wrapped layer by layer", durationLabel: "3m 40s" },
        {
          kind: "text",
          heading: "Wrapping and unwrapping",
          paragraphs: [
            "Each layer adds its own header in front of what it was given: ports, then IP addresses, then hardware addresses. The receiving device removes them in the opposite order. A router only opens the outer two layers, which is why it can forward a packet without reading the page inside it.",
          ],
        },
        {
          kind: "callout",
          tone: "info",
          title: "Why defenders think in layers",
          body: "Each control works at a layer. A switch separates devices at the link layer, a firewall rule filters on addresses and ports, a web filter reads the application layer. When a control misses something, the first question is which layer it could not see.",
        },
        {
          kind: "text",
          heading: "What you can see at each layer",
          paragraphs: [
            "At the link layer: which hardware address is on which switch port. At the internet layer: which addresses talk to which. At the transport layer: which services are in use. At the application layer: which names, pages and files, when the traffic is not encrypted or the log comes from the application itself.",
          ],
        },
        { kind: "file", name: "TCP_IP_layers_one_page.pdf", fileKind: "pdf", size: "150 KB" },
        {
          kind: "knowledge-check",
          question: "A firewall rule allows the staff zone to reach 192.168.30.10 on TCP port 443. Which layers does the rule read?",
          options: [
            { id: "a", label: "Link and internet", feedback: "The rule does not mention hardware addresses." },
            {
              id: "b",
              label: "Internet and transport",
              correct: true,
              feedback: "Correct. The address is internet layer, the protocol and port are transport layer.",
            },
            { id: "c", label: "Application only", feedback: "The rule names no page, file or user, so it does not read the application layer." },
          ],
        },
      ],
    },
  },
  activities,
};
