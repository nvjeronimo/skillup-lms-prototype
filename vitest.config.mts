import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The pure modules only (lib/assistant): no DOM, no React.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
});
