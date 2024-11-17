import js from "@eslint/js";
import tslintPlugin from "@typescript-eslint/eslint-plugin";
import tslintParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import tslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tslint.configs.recommendedTypeChecked,
  prettier,
  {
    files: ["source/**/*"],
    ignores: ["out/**", "**/esbuild.js"],
    languageOptions: {
      parser: tslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tslintPlugin,
    },
    rules: {
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": ["error", { default: "array", readonly: "array" }],
      "@typescript-eslint/ban-tslint-comment": "error",
      "@typescript-eslint/class-literal-property-style": ["error", "fields"],
      "@typescript-eslint/consistent-generic-constructors": ["error", "constructor"],
      "@typescript-eslint/consistent-indexed-object-style": ["error", "record"],
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "as", objectLiteralTypeAssertions: "allow" },
      ],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
          allowDirectConstAssertionInArrowFunctions: true,
          allowedNames: [],
          allowExpressions: false,
          allowFunctionsWithoutTypeParameters: false,
          allowHigherOrderFunctions: true,
          allowIIFEs: false,
          allowTypedFunctionExpressions: true,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "always",
        },
      ],
      "@typescript-eslint/no-inferrable-types": [
        "error",
        {
          ignoreParameters: false,
          ignoreProperties: false,
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksConditionals: true,
          checksSpreads: true,
          checksVoidReturn: false,
        },
      ],
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
      "@typescript-eslint/prefer-readonly": "error",
      // ESLint
      curly: "error",
      eqeqeq: "error",
      "no-throw-literal": "error",
      "no-unused-vars": "off",
    },
  },
];
