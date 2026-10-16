"use client";

import * as React from "react";
import { loadMessages, resolveAnswer, saveMessages } from "./conversation";
import { visibleText } from "./model-reply";
import { suggestionsFor } from "./scripted";
import type { ChatMessage, LearnerSnapshot } from "./types";

const MAX_QUESTION = 500;
const MAX_HISTORY = 10;
const ENDPOINT = "/api/assistant";
// Longer than the route's own limit: past this the model is taken as unreachable and the script answers.
const ANSWER_MS = 25_000;

const sessionStore = () => {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
};

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * The assistant's conversation. It answers from the script until the server says a model is
 * configured, and goes back to the script for any question the model fails on.
 */
export function useAssistant(snapshot: LearnerSnapshot) {
  const [mode, setMode] = React.useState<"script" | "model">("script");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<"idle" | "answering">("idle");
  const request = React.useRef<AbortController | null>(null);
  const busy = React.useRef(false);

  // Read after mount, so the server render and the first client render agree.
  React.useEffect(() => {
    setMessages(loadMessages(sessionStore()));
    const probe = new AbortController();
    fetch(ENDPOINT, { signal: probe.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (body?.mode === "model") setMode("model");
      })
      .catch(() => {
        /* no route, no network: the script answers */
      });
    return () => {
      probe.abort();
      request.current?.abort();
    };
  }, []);

  const commit = React.useCallback((next: ChatMessage[]) => {
    setMessages(next);
    saveMessages(sessionStore(), next);
  }, []);

  const ask = React.useCallback(
    (raw: string) => {
      const question = raw.trim().slice(0, MAX_QUESTION);
      if (!question || busy.current) return;
      busy.current = true;
      const asked: ChatMessage[] = [...messages, { id: newId(), role: "user", text: question }];
      commit(asked);
      setStatus("answering");

      const controller = new AbortController();
      request.current = controller;
      const askModel = async (onDelta: (shown: string) => void) => {
        const late = window.setTimeout(() => stalled.abort(), ANSWER_MS);
        try {
          return await readReply(onDelta);
        } finally {
          window.clearTimeout(late);
        }
      };
      // Aborted by the learner (clear, unmount) or by the clock (a stalled answer).
      const stalled = new AbortController();
      controller.signal.addEventListener("abort", () => stalled.abort());
      const readReply = async (onDelta: (shown: string) => void) => {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: asked.slice(-MAX_HISTORY).map((m) => ({ role: m.role, text: m.text })),
            snapshot,
          }),
          signal: stalled.signal,
        });
        if (!response.ok || !response.body) throw new Error(`assistant: ${response.status}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let reply = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          onDelta(visibleText(reply));
        }
        return reply;
      };

      resolveAnswer({ question, snapshot, mode, askModel, onDelta: setStreaming })
        .then((answer) => {
          if (controller.signal.aborted) return;
          commit([
            ...asked,
            { id: newId(), role: "assistant", text: answer.text, actions: answer.actions, source: answer.source },
          ]);
        })
        .finally(() => {
          busy.current = false;
          if (controller.signal.aborted) return;
          setStreaming(null);
          setStatus("idle");
        });
    },
    [commit, messages, mode, snapshot],
  );

  const clear = React.useCallback(() => {
    request.current?.abort();
    busy.current = false;
    setStreaming(null);
    setStatus("idle");
    commit([]);
  }, [commit]);

  const suggestions = React.useMemo(() => suggestionsFor(snapshot), [snapshot]);

  return { mode, messages, streaming, status, suggestions, ask, clear };
}
