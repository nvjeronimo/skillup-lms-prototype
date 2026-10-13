"use client";

import * as React from "react";
import type { PageContext } from "@/lib/assistant/types";
import { useLmsStore } from "@/lib/store";
import {
  STORAGE_KEY,
  createState,
  load,
  loadStored,
  reduce,
  save,
  type FirstStepsEvent,
  type FirstStepsState,
} from "./progress";

export const RESTART_EVENT = "sk-first-steps-restart";

const store = () => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

/** For the demo menus: a fresh state from today's completions, and tell any mounted hook. */
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
  const stateRef = React.useRef<FirstStepsState | null>(null);
  const pageRef = React.useRef(page);
  pageRef.current = page;
  const completed = React.useMemo(() => Array.from(completedTopics), [completedTopics]);

  const commit = React.useCallback((next: FirstStepsState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const dispatch = React.useCallback(
    (event: FirstStepsEvent) => {
      const current = stateRef.current;
      if (!current) return;
      // Another tab may have moved on (a step, a skip): reduce from what is stored, so this
      // tab never writes an older state over it.
      const base = loadStored(store()) ?? current;
      const next = reduce(base, event);
      if (next !== base) save(store(), next);
      if (base.status === "active" && next.status === "done") setJustFinished(true);
      // The stored copy is a new object every time: commit only what really differs.
      if (JSON.stringify(next) !== JSON.stringify(current)) commit(next);
    },
    [commit],
  );

  React.useEffect(() => {
    const read = () => {
      setJustFinished(false);
      // The baseline is read from the store itself, not from this render: the first client
      // render still shows the seeded state (the persisted one arrives right after), and a
      // baseline taken from it would tick "Complete a topic" for work done on an earlier visit.
      commit(load(store(), Array.from(useLmsStore.getState().completedTopics)));
    };
    const restart = () => {
      read();
      // The page the learner is on counts again from the start.
      dispatch({ type: "visited", page: pageRef.current });
    };
    const fromOtherTab = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) read();
    };
    read();
    window.addEventListener(RESTART_EVENT, restart);
    window.addEventListener("storage", fromOtherTab);
    return () => {
      window.removeEventListener(RESTART_EVENT, restart);
      window.removeEventListener("storage", fromOtherTab);
    };
  }, [commit, dispatch]);

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
  /** The learner has seen "You're set.": the next time the window opens it is the chat alone. */
  const acknowledge = React.useCallback(() => setJustFinished(false), []);

  return {
    state,
    left: state?.status === "active" ? 5 - state.done.length : 0,
    justFinished,
    asked,
    greeted,
    dismiss,
    acknowledge,
  };
}
