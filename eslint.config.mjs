import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintReact from "@eslint-react/eslint-plugin";

export default defineConfig([
  {
    files: [
      "src/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}",
      "*.*.*js",
      "*.*.*ts",
      "internal-global.d.ts"
    ],
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs["recommended-typescript"]
    ],
    plugins: {},
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      semi: "warn",
      quotes: "warn",
      "comma-dangle": [
        "warn",
        {
          arrays: "never",
          objects: "never",
          imports: "never",
          exports: "never",
          functions: "never"
        }
      ],
      "prefer-const": "warn",
      "no-unreachable": "warn",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          "ts-check": "allow-with-description",
          minimumDescriptionLength: 3
        }
      ],
      "@eslint-react/no-missing-key": "error",
      "@eslint-react/no-implicit-key": "error",
      "@eslint-react/no-duplicate-key": "error",
      "@eslint-react/no-unnecessary-key": "error",
      "@eslint-react/jsx-key-before-spread": "error",
      "@eslint-react/no-missing-context-display-name": "warn",
      "@eslint-react/no-missing-component-display-name": "warn",
      "@eslint-react/dom/no-dangerously-set-innerhtml": "off"
    },
    ignores: [
      "dist/**/*",
      "**/dist",
      "**/dev",
      "node_modules/**/*",
      "docs/**/*",
      "deprecated/**/*"
    ]
  }
]);
