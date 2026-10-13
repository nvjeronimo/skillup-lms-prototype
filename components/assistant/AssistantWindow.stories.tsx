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
