import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Алиасы @/* и @data/* берутся из tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
