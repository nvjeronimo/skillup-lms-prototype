"use client";

import * as React from "react";
import type { PageContext } from "@/lib/assistant/types";
import { createState, load, reduce, save, type FirstStepsEvent, type FirstStepsState } from "./progress";

export const RESTART_EVENT = "sk-first-steps-restart";

const store = () => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

/** For the demo menu: a fresh state from today's completions, and tell any mounted hook. */
export function restartFirstSteps(completedTopics: string[]): void {
  save(store(), createState(completedTopics));
  window.dispatchEvent(new Event(RESTART_EVENT));
}

/**
 * The first steps of this browser. They tick from three things the learner does: the page
 * they are on, a topic they complete, a question they ask. `state` is null until it has been
 * read after mount, so the server render and the first client render agree.
 */
export function useFirstSteps(page: PageContext, completedTopics: Set<string>) {
  const [state, setState] = React.useState<FirstStepsState | null>(null);
  const [justFinished, setJustFinished] = React.useState(false);
  const completed = React.useMemo(() => Array.from(completedTopics), [completedTopics]);
  const completedRef = React.useRef(completed);
  completedRef.current = completed;

  const dispatch = React.useCallback((event: FirstStepsEvent) => {
    setState((current) => {
      if (!current) return current;
      const next = reduce(current, event);
      if (next === current) return current;
      save(store(), next);
      if (current.status === "active" && next.status === "done") setJustFinished(true);
      return next;
    });
  }, []);

  React.useEffect(() => {
    const read = () => {
      setJustFinished(false);
      setState(load(store(), completedRef.current));
    };
    read();
    window.addEventListener(RESTART_EVENT, read);
    return () => window.removeEventListener(RESTART_EVENT, read);
  }, []);

  // The page is known from the address: a visit ticks its step wherever the learner came from.
  const pageKey = JSON.stringify(page);
  const loaded = state !== null;
  React.useEffect(() => {
    if (loaded) dispatch({ type: "visited", page: JSON.parse(pageKey) as PageContext });
  }, [dispatch, loaded, pageKey]);
  React.useEffect(() => {
    if (loaded) dispatch({ type: "completed", completedTopics: completed });
  }, [dispatch, loaded, completed]);

  const asked = React.useCallback(() => dispatch({ type: "asked" }), [dispatch]);
  const greeted = React.useCallback(() => dispatch({ type: "greeted" }), [dispatch]);
  const dismiss = React.useCallback(() => dispatch({ type: "dismissed" }), [dispatch]);

  return {
    state,
    left: state?.status === "active" ? 5 - state.done.length : 0,
    justFinished,
    asked,
    greeted,
    dismiss,
  };
}
