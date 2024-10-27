import js from "@eslint/js";
import tslintPlugin from "@typescript-eslint/eslint-plugin";
import tslintParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import tslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tslint.configs.recommended,
  prettier,
  {
    files: ["source/**/*"],
    ignores: ["out/**", "**/esbuild.js"],
    languageOptions: {
      parser: tslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tslintPlugin,
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "always",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      curly: "warn",
      eqeqeq: "warn",
      "no-throw-literal": "warn",
    },
  },
];
