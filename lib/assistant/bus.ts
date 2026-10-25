/**
 * Opens the assistant from anywhere on the page, optionally with a question (Harbor's top-bar
 * search, Nelson 25 Oct 2026). AssistantChat listens; nothing else keeps state here.
 */
export const ASSISTANT_OPEN_EVENT = "sk-assistant-open";

export function openAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent(ASSISTANT_OPEN_EVENT, { detail: { question: question?.trim() || "" } }));
}
