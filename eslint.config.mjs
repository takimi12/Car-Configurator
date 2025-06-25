import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Nowa sekcja settings dla eslint-plugin-react
    settings: {
      react: {
        version: "detect", // Automatycznie wykryje wersję Reacta z package.json
      },
    },
    // Ogólne zasady, które chcesz stosować w całym projekcie
    rules: {
      // Zmienia błąd nieużywanych zmiennych na ostrzeżenie
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    // Konfiguracja dla plików API (.js)
    files: ["api/**/*.js"],
    languageOptions: {
      parserOptions: {
        sourceType: "script",
        ecmaVersion: 2020,
      },
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
