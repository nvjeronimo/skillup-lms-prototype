"use client";

import * as React from "react";

/**
 * The topic's end-of-content action (Mark as Complete). The player shell owns it; the view
 * that owns the feedback row renders it there, on the right (Figma `Feedback-Mark`, 13 Oct
 * 2026). Only the video needs the hand-over: its feedback row lives under the transcript,
 * inside the tab, while every other type gets the row from the shell itself.
 */
export const TopicEndActionContext = React.createContext<React.ReactNode>(null);
