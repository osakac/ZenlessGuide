import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";

/**
 * Границы Feature-Sliced Design.
 *
 * Слои перечислены сверху вниз: каждый может импортировать только те,
 * что ниже. Кросс-импорты внутри слоя запрещены (исключение — shared).
 * Импорт в чужой слайс разрешён только через его публичный API (index.ts).
 */
const fsdBoundaries = {
  files: ["app/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
  plugins: { boundaries },
  settings: {
    "boundaries/elements": [
      // Файлы маршрутов Next.js — тонкая обвязка над слоем views.
      { type: "routes", pattern: "app/**/*", partialMatch: false },
      { type: "app", pattern: "src/app" },
      { type: "views", pattern: "src/views/*", capture: ["slice"] },
      { type: "widgets", pattern: "src/widgets/*", capture: ["slice"] },
      { type: "features", pattern: "src/features/*", capture: ["slice"] },
      { type: "entities", pattern: "src/entities/*", capture: ["slice"] },
      { type: "shared", pattern: "src/shared/*", capture: ["slice"] },
    ],
    "boundaries/files": [{ category: "styles", pattern: "**/*.css" }],
    "import/resolver": {
      typescript: { alwaysTryTypes: true },
    },
  },
  rules: {
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        policies: [
          {
            from: { element: { type: "routes" } },
            allow: {
              to: {
                element: {
                  types: {
                    anyOf: [
                      "app",
                      "views",
                      "widgets",
                      "features",
                      "entities",
                      "shared",
                    ],
                  },
                },
              },
            },
          },
          {
            from: { element: { type: "app" } },
            allow: {
              to: {
                element: {
                  types: {
                    anyOf: [
                      "views",
                      "widgets",
                      "features",
                      "entities",
                      "shared",
                    ],
                  },
                },
              },
            },
          },
          {
            from: { element: { type: "views" } },
            allow: {
              to: {
                element: {
                  types: {
                    anyOf: ["widgets", "features", "entities", "shared"],
                  },
                },
              },
            },
          },
          {
            from: { element: { type: "widgets" } },
            allow: {
              to: {
                element: {
                  types: { anyOf: ["features", "entities", "shared"] },
                },
              },
            },
          },
          {
            from: { element: { type: "features" } },
            allow: {
              to: { element: { types: { anyOf: ["entities", "shared"] } } },
            },
          },
          {
            from: { element: { type: "entities" } },
            allow: { to: { element: { type: "shared" } } },
          },
          // Внутри shared слайсы могут ссылаться друг на друга.
          {
            from: { element: { type: "shared" } },
            allow: { to: { element: { type: "shared" } } },
          },
          // Глобальные стили подключаются файлом, публичного API у них нет.
          {
            allow: { to: { file: { categories: "styles" } } },
          },
          // Импорт мимо публичного API слайса запрещён.
          // Исключение — shared: там лежат россыпью компоненты shadcn/ui.
          {
            disallow: {
              to: {
                element: {
                  types: {
                    anyOf: ["app", "views", "widgets", "features", "entities"],
                  },
                  fileInternalPath: "!index.ts",
                },
              },
            },
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  fsdBoundaries,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
