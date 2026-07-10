"use client";

import { useEffect } from "react";

// Dev-only visual feedback picker (ALT+click → markdown backlog with file:line).
// Package: feedback-collector. Loaded as a side-effect import so the picker/panel
// inject themselves into the DOM. Gated to development in the root layout.
export default function FeedbackCollector() {
  useEffect(() => {
    void import("feedback-collector");
  }, []);
  return null;
}
