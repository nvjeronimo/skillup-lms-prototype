"use client";

import { useState } from "react";

/** An action this lab does not build: a real button that says so, in words, when pressed. */
export function NotWired({ label, context }: { label: string; context: string }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <button type="button" className="ex-btn-quiet" onClick={() => setPressed(true)}>
        {label}
        <span className="sr-only">: {context}</span>
      </button>
      <p role="status" className="ex-small ex-c-ink2">
        {pressed ? "Lab demo — not wired" : ""}
      </p>
    </div>
  );
}
