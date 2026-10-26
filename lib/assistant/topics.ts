import { Award, BookOpen, CalendarDays, Compass, FileText, type LucideIcon } from "lucide-react";

/**
 * The topics the panel-layout assistant offers before a question (Harbor, Fluent; Nelson, 26 Oct
 * 2026, after the DreamHost panel's "Explore a topic or chat below"). Each question is one the
 * scripted answers (lib/assistant/scripted) or the knowledge (lib/assistant/knowledge) already
 * cover, so a tap always gets a real answer.
 */
export interface AssistantTopic {
  id: string;
  label: string;
  icon: LucideIcon;
  questions: string[];
}

export const ASSISTANT_TOPICS: AssistantTopic[] = [
  {
    id: "courses",
    label: "Your courses",
    icon: BookOpen,
    questions: [
      "Where did I stop?",
      "Which courses am I enrolled in?",
      "How is my progress counted?",
      "How does a topic get completed?",
      "Where are my saved topics?",
    ],
  },
  {
    id: "deadlines",
    label: "Deadlines",
    icon: CalendarDays,
    questions: [
      "What is due this week?",
      "Where do I see what is due?",
      "How many attempts do I get on a quiz?",
      "How do live sessions work?",
    ],
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: Award,
    questions: ["How do I get my certificate?", "How do I get the program certificate?", "How far am I in my program?"],
  },
  {
    id: "platform",
    label: "Using SkillUp",
    icon: Compass,
    questions: ["How do I move around?", "What do the status badges mean?", "How do notes work?", "What can you do?"],
  },
];

/** In the player the assistant is about the course (Nelson, 26 Oct 2026): its topics. */
export const COURSE_ASSISTANT_TOPICS: AssistantTopic[] = [
  {
    id: "topic",
    label: "This topic",
    icon: FileText,
    questions: ["Summarize this topic", "How do I complete this topic?", "How do notes work?", "Why is my lab not complete?"],
  },
  {
    id: "course",
    label: "This course",
    icon: BookOpen,
    questions: ["Where did I stop?", "What should I do next?", "How is my progress counted?", "Where are my saved topics?"],
  },
  {
    id: "deadlines",
    label: "Deadlines and grades",
    icon: CalendarDays,
    questions: ["What is due this week?", "How many attempts do I get on a quiz?", "How does an open response work?"],
  },
  {
    id: "certificate",
    label: "Certificate",
    icon: Award,
    questions: ["How do I get my certificate?", "How far am I in my program?"],
  },
];
