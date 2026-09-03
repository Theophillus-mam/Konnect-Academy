import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Two entry points, two bundles. The learner site is index.html and the
// console is admin.html, so the console is a separate page rather than a
// route inside the learner app: nothing about it ships in the learner bundle.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        admin: resolve(__dirname, "admin.html"),
      },
    },
  },
});
