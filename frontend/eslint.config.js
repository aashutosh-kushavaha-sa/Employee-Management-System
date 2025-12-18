// @ts-check

/**
 * Angular + TypeScript + Prettier ESLint Configuration (Flat Config)
 */

const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  {
    ignores: ["**/.angular/**", ".angular/**", "**/dist/**", "**/node_modules/**"],
  },

  // -------------------- TS + Angular Rules --------------------
  {
    files: ["**/*.ts"],
    ignores: ["**/dist/**", "**/node_modules/**", "**/.angular/**", ".angular/**"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettierConfig
    ],
    plugins: { prettier },
    processor: angular.processInlineTemplates,
    rules: {
      "prettier/prettier": "warn",

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
    ignores: ["**/dist/**", "**/node_modules/**", "**/.angular/**", ".angular/**"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
      prettierConfig
    ],
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "@angular-eslint/template/prefer-control-flow": "off"
    }
  }
]);
