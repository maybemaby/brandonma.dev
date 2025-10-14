import { defineConfig, globalIgnores } from "eslint/config";
import eslintAstro from "eslint-plugin-astro";
import eslintSvelte from "eslint-plugin-svelte";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/", ".astro/", ".wrangler/"]),
  eslintJs.configs.recommended,
  tseslint.configs.recommended,
  ...eslintAstro.configs.recommended,
  ...eslintSvelte.configs.recommended,
  {
    files: ["**/*.svelte", "**/*.svelte.js", "**/*.svelte.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        parser: tseslint.parser,
        extraFileExtensions: [".svelte"],
        eslintSvelte,
      },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        project: true,
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
        eslintAstro,
      },
    },
  },
  {
    rules: {
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
    },
  },
]);
