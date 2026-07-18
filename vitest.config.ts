import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // `server-only` throws outside a React Server Components bundler;
      // tests import pure functions from modules that carry the marker.
      "server-only": path.resolve(__dirname, "tests/helpers/server-only-stub.ts"),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    // Deterministic: no retries — a test that needs retries is a bug.
    retry: 0,
    clearMocks: true,
  },
});
