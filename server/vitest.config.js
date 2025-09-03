import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    exclude: ["node_modules/**", "dist/**"],
    // augmente le timeout si ta DB est lente au démarrage
    testTimeout: 30000,
  },
});
