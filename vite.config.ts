import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * The prototype on the development team's stack (13 Nov 2026): Vite + React 19 + React Router,
 * like their learning-demo MFE. Module Federation is left out: it is deployment plumbing and
 * changes no page code.
 *
 * `NEXT_PUBLIC_` stays an allowed env prefix for now so the Vercel variable that holds the
 * sample video (NEXT_PUBLIC_SAMPLE_VIDEO_SRC) keeps working without a dashboard change.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  server: { port: 3000 },
  preview: { port: 3000 },
});
