"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loads the assistant on the client only (ssr: false), so it adds zero
 * JavaScript to the initial server render / first paint. Mounted once from the
 * root layout.
 */
const Assistant = dynamic(
  () => import("./assistant").then((m) => m.Assistant),
  { ssr: false },
);

export function AssistantMount() {
  return <Assistant />;
}
