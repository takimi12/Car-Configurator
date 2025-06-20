import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } }, // To jest już poprawne
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Ogólne zasady, które chcesz stosować w całym projekcie
    rules: {
      // Zmienia błąd nieużywanych zmiennych na ostrzeżenie
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    // Konfiguracja dla plików API (.js)
    files: ["api/**/*.js"], // Dotyczy wszystkich plików .js w folderze api
    languageOptions: {
      parserOptions: {
        sourceType: "script", // Użyj trybu skryptu dla CommonJS
        ecmaVersion: 2020, // Zapewnij wsparcie dla ES2020
      },
      // Wszystkie globalne zmienne przeniesione do languageOptions.globals
      globals: {
        ...globals.node, // Dodaj globalne zmienne Node.js
        ...globals.es2020, // Dodaj globalne zmienne dla ES2020
      },
    },
    // Usunięto klucz 'env', ponieważ jest on nieobsługiwany w Flat Config na tym poziomie
    rules: {
      // Wyłącz zakaz importów CommonJS (require())
      "@typescript-eslint/no-require-imports": "off",
      // Wyłącz regułę ban-ts-comment, która narzeka na @ts-ignore/@ts-expect-error
      "@typescript-eslint/ban-ts-comment": "off",
      // Wyłącz sprawdzanie niezdefiniowanych globalnych zmiennych (np. module, process, require)
      // Ponieważ są one teraz zdefiniowane w languageOptions.globals
      "no-undef": "off",
      // Zmień błąd nieużywanych zmiennych na ostrzeżenie także dla tych plików
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
