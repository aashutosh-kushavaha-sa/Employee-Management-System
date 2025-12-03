// @ts-check

/**
 * Angular + TypeScript + Prettier ESLint Configuration (Flat Config)
 * Works for Angular 16/17+ using eslint.config.js format.
 */

const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  // -------------------- TS + Angular Rules --------------------
  {
    files: ["**/*.ts"],
    ignores: ["**/dist/**", "**/node_modules/**"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettierConfig // Important: Disable rules conflicting with Prettier
    ],
    plugins: {
      prettier // Enables Prettier plugin
    },
    processor: angular.processInlineTemplates,
    rules: {
      // 🔥 Prettier integration (shows formatting errors as warnings)
      "prettier/prettier": "warn",

      // Angular style guidelines
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase"
        }
      ],

      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case"
        }
      ]
    }
  },

  // -------------------- HTML TEMPLATE LINTING --------------------
  {
    files: ["**/*.html"],
    ignores: ["**/dist/**", "**/node_modules/**"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
      prettierConfig
    ],
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn"
    }
  }
]);
