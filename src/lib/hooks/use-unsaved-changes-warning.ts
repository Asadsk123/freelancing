"use client";

import { useEffect } from "react";

/**
 * Warns the user (via the browser's native prompt) before they leave the page
 * with unsaved changes. Pass `true` only while there is genuinely unsaved work
 * so navigation stays friction-free otherwise.
 */
export function useUnsavedChangesWarning(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Required by some browsers to trigger the confirmation dialog.
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);
}
