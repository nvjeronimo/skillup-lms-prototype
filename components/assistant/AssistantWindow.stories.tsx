import type { Meta, StoryObj } from "@storybook/react";
import { AssistantWindow } from "./AssistantWindow";

const SUGGESTIONS = [
  "What is due this week?",
  "Where did I stop?",
  "What should I do next?",
  "How do I get my certificate?",
];

const meta: Meta<typeof AssistantWindow> = {
  title: "Assistant/Window",
  component: AssistantWindow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    id: "assistant-window",
    messages: [],
    streaming: null,
    status: "idle",
    suggestions: SUGGESTIONS,
    firstName: "John",
    modal: false,
    className: "h-[600px] w-[380px]",
    onAsk: () => {},
    onClear: () => {},
    onClose: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof AssistantWindow>;

const QUESTION = { id: "q1", role: "user" as const, text: "What is due this week?" };

export const Empty: Story = {};

export const Answering: Story = {
  args: { messages: [QUESTION], status: "answering", streaming: "You have 2 deadlines coming up:" },
};

export const AnswerWithButtons: Story = {
  args: {
    messages: [
      QUESTION,
      {
        id: "a1",
        role: "assistant",
        source: "model",
        text: "Two things are due: the persona research draft tonight, and Assignment 02 on Saturday.",
        actions: [
          { id: "due:1", label: "Open Persona research draft", href: "/platform/dashboard" },
          { id: "due:2", label: "Open Assignment 02", href: "/platform/dashboard" },
        ],
      },
    ],
  },
};

export const ScriptedNote: Story = {
  args: {
    messages: [
      { id: "q1", role: "user", text: "How do I get my certificate?" },
      {
        id: "a1",
        role: "assistant",
        source: "script",
        text: "A course certificate is issued when you complete the course with a passing grade.",
      },
    ],
  },
};

export const Mobile: Story = {
  args: { modal: true, className: "h-[640px] w-[375px]" },
};

const ROWS = [
  { id: "program", label: "Open your program", why: "See the courses ahead and the certificate at the end.", cta: "Open your program", done: true, href: "/platform/program/x" },
  { id: "course", label: "Open a course", why: "Its page has your progress, dates and grades.", cta: "Open a course", done: true, href: "/platform/course/x" },
  { id: "topic", label: "Start a topic", why: "Learning happens in the player.", cta: "Start learning", done: false, href: "/course/x/topic/y" },
  { id: "complete", label: "Complete a topic", why: "Completed topics move your progress.", cta: "Resume", done: false, href: "/course/x/topic/y" },
  { id: "ask", label: "Ask the assistant", why: "Deadlines, certificates, where you stopped.", cta: "Ask a question", done: false, ask: true },
];
const NEXT = {
  text: "\"Persona research draft\" is due tonight. Start there.",
  action: { id: "due:1", label: "Open Persona research draft", href: "/platform/dashboard" },
};

export const FirstSteps: Story = {
  args: { firstSteps: { rows: ROWS, finished: false, onSkip: () => {} }, next: NEXT },
};

export const FirstStepsFinished: Story = {
  args: {
    firstSteps: { rows: ROWS.map((row) => ({ ...row, done: true })), finished: true, onSkip: () => {} },
    next: NEXT,
  },
};

export const EmptyWithNext: Story = { args: { next: NEXT } };
