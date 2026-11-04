/**
 * A SCORM 1.2 run-time API for the packages in `public/scorm/`, standing in for the Open edX SCORM
 * XBlock (openedx-scorm-xblock). A package looks for `window.API` on its parent frames, then on
 * `window.opener` when it runs in its own window, so the player puts this object on its own window
 * while an Activity with a real package is open (`installScormApi`).
 *
 * What the package writes (`cmi.*`) is kept per topic in localStorage, as the XBlock keeps it per
 * learner, so the package resumes from its suspend data. Completion is the package's own report:
 * `cmi.core.lesson_status` completed, passed or failed. A score is `cmi.core.score.raw`.
 *
 * Only 1.2: the four test packages are SCORM 1.2 (SCORM test course, 4 Nov 2026).
 */

export type ScormLessonStatus =
  | "not attempted"
  | "browsed"
  | "incomplete"
  | "completed"
  | "passed"
  | "failed";

/** The statuses the XBlock counts as complete. `failed` is complete, not passed. */
export const SCORM_DONE: ScormLessonStatus[] = ["completed", "passed", "failed"];

export interface ScormCall {
  /** "LMSSetValue", "LMSInitialize"… */
  fn: string;
  args: string[];
  result: string;
}

export interface ScormData {
  /** Every cmi element the package has set. */
  cmi: Record<string, string>;
  /** Launched before: the next launch is a resume (`cmi.core.entry` = "resume"). */
  launched: boolean;
}

interface ScormApi12 {
  LMSInitialize(arg: string): string;
  LMSFinish(arg: string): string;
  LMSGetValue(element: string): string;
  LMSSetValue(element: string, value: string): string;
  LMSCommit(arg: string): string;
  LMSGetLastError(): string;
  LMSGetErrorString(code: string): string;
  LMSGetDiagnostic(code: string): string;
}

declare global {
  interface Window {
    API?: ScormApi12;
  }
}

const KEY = (topicId: string) => `sk-scorm:${topicId}`;

export function readScormData(topicId: string): ScormData {
  try {
    const raw = window.localStorage.getItem(KEY(topicId));
    if (raw) return JSON.parse(raw) as ScormData;
  } catch {
    /* storage blocked: start fresh */
  }
  return { cmi: {}, launched: false };
}

function writeScormData(topicId: string, data: ScormData) {
  try {
    window.localStorage.setItem(KEY(topicId), JSON.stringify(data));
  } catch {
    /* storage blocked: this visit only */
  }
}

/** Forget what a package stored for this topic (the test panel's Reset). */
export function clearScormData(topicId: string) {
  try {
    window.localStorage.removeItem(KEY(topicId));
  } catch {
    /* nothing to clear */
  }
}

export interface ScormHandlers {
  /** Every call the package makes, for the test panel. */
  onCall?: (call: ScormCall, data: ScormData) => void;
  /** `cmi.core.lesson_status` changed. */
  onStatus?: (status: ScormLessonStatus) => void;
  /** `cmi.core.score.raw` changed. */
  onScore?: (score: number) => void;
}

/**
 * Puts the SCORM 1.2 API on `window` for one topic and returns the function that removes it.
 * Install it before the package's iframe loads: a package looks for the API once, on start.
 */
export function installScormApi(topicId: string, learnerName: string, handlers: ScormHandlers = {}) {
  const data = readScormData(topicId);
  const entry = data.launched ? "resume" : "ab-initio";
  let initialized = false;
  let lastError = "0";

  const defaults: Record<string, string> = {
    "cmi._version": "3.4",
    "cmi.core._children":
      "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
    "cmi.core.student_id": "sk-learner-001",
    "cmi.core.student_name": learnerName,
    "cmi.core.lesson_location": "",
    "cmi.core.credit": "credit",
    "cmi.core.lesson_status": "not attempted",
    "cmi.core.entry": entry,
    "cmi.core.score._children": "raw,min,max",
    "cmi.core.score.raw": "",
    "cmi.core.total_time": "0000:00:00",
    "cmi.core.lesson_mode": "normal",
    "cmi.suspend_data": "",
    "cmi.launch_data": "",
  };

  const log = (fn: string, args: string[], result: string) => {
    handlers.onCall?.({ fn, args, result }, data);
    return result;
  };

  const api: ScormApi12 = {
    LMSInitialize(arg) {
      initialized = true;
      data.launched = true;
      writeScormData(topicId, data);
      lastError = "0";
      return log("LMSInitialize", [arg], "true");
    },
    LMSFinish(arg) {
      initialized = false;
      writeScormData(topicId, data);
      return log("LMSFinish", [arg], "true");
    },
    LMSGetValue(element) {
      if (!initialized) {
        lastError = "301";
        return log("LMSGetValue", [element], "");
      }
      lastError = "0";
      const value = element === "cmi.core.entry" ? entry : (data.cmi[element] ?? defaults[element] ?? "");
      return log("LMSGetValue", [element], value);
    },
    LMSSetValue(element, value) {
      if (!initialized) {
        lastError = "301";
        return log("LMSSetValue", [element, value], "false");
      }
      lastError = "0";
      const v = String(value);
      data.cmi[element] = v;
      if (element === "cmi.core.lesson_status") handlers.onStatus?.(v as ScormLessonStatus);
      if (element === "cmi.core.score.raw" && v !== "" && !Number.isNaN(Number(v))) handlers.onScore?.(Number(v));
      return log("LMSSetValue", [element, v], "true");
    },
    LMSCommit(arg) {
      writeScormData(topicId, data);
      return log("LMSCommit", [arg], "true");
    },
    LMSGetLastError() {
      return lastError;
    },
    LMSGetErrorString(code) {
      return code === "301" ? "Not initialized" : code === "0" ? "No error" : "General error";
    },
    LMSGetDiagnostic(code) {
      return code;
    },
  };

  window.API = api;
  return () => {
    writeScormData(topicId, data);
    if (window.API === api) delete window.API;
  };
}
