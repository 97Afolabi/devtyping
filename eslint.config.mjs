import tsParser from "@typescript-eslint/parser";

const config = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default config;
