import next from "@next/eslint-plugin-next";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules/", "dist/", ".next/"],
  },
  {
    plugins: {
      "@next/next": next,
      "@typescript-eslint": ts,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];
