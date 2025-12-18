// @ts-check
const { defineConfig } = require('eslint/config');
const eslint = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 2021,
      parserOptions: { ecmaVersion: 2021 },
      globals: {
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        process: 'readonly'
      }
    },
    extends: [eslint.configs.recommended, prettierConfig],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  }
]);
