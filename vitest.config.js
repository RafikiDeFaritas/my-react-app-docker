import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],   // ← ne prend que les tests du front
    exclude: ["server/**", "node_modules/**", "dist/**"] // ← exclut le backend
    // globals: true // (facultatif si tu utilises jest-dom/vitest)
  },
});
