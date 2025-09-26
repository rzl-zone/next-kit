import fg from "fast-glob";
import { relative } from "path";
import { promises as fs } from "fs";

import { BUILD_LOGGER } from "./utils/logger";

let importingFixed = 0;
/**
 * Ultra-safe fixer for React 18+ .d.ts files.
 * Converts all React/JSX runtime aliases to unified React types.
 */
async function run(): Promise<void> {
  try {
    BUILD_LOGGER.ON_STARTING({
      actionName: "Fixing DTS React Import"
    });

    const files = await fg("dist/**/*.d.{ts,cts,esm,mts}");

    // Regexes
    const reReactImport = /^import\s+.*from\s+['"]react(?:\/[^'"]*)?['"]/i;
    const reReactAlias =
      /(?<!from\s*['"])\b(?:react__default|React__default|react_jsx_runtime|React_jsx_runtime|react_jsx_dev_runtime|React_jsx_dev_runtime|react|React)\b/g;

    // JSX.Element
    const reJSXElement =
      /(?<!from\s*['"])\b(?:react|React|react__default|React__default|react_jsx_runtime|React_jsx_runtime|react_jsx_dev_runtime|React_jsx_dev_runtime)\s*\.\s*JSX\.Element\b/g;

    // ReactNode
    const reReactNode =
      /(?<!from\s*['"])\b(?:react|React|react__default|React__default|react_jsx_runtime|React_jsx_runtime|react_jsx_dev_runtime|React_jsx_dev_runtime)\s*\.\s*ReactNode\b/g;

    // JSX.IntrinsicElements
    const reIntrinsicElements =
      /(?<!from\s*['"])\b(?:react|React|react__default|React__default|react_jsx_runtime|React_jsx_runtime|react_jsx_dev_runtime|React_jsx_dev_runtime)\s*\.\s*JSX\.IntrinsicElements\b/g;

    for (const file of files) {
      const original = await fs.readFile(file, "utf8");

      const namedSet = new Set<string>();
      let hasDefaultOrNamespace = false;
      const otherLines: string[] = [];

      for (const line of original.split("\n")) {
        if (reReactImport.test(line)) {
          // Extract named imports
          const namedMatch = line.match(/\{\s*([^}]*)\s*\}/);
          if (namedMatch?.[1]) {
            namedMatch[1]
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
              .forEach((x) => namedSet.add(x.replace(/^type\s+/, "")));
          }

          // Detect default or namespace import
          if (
            /import\s+(type\s+)?[\w$]+(\s*,|\s+from)/.test(line) ||
            /\*\s+as\s+[\w$]+/.test(line)
          ) {
            hasDefaultOrNamespace = true;
          }
          continue;
        }
        otherLines.push(line);
      }

      let result = otherLines
        .join("\n")
        .trimStart()
        .replace(reJSXElement, "React.JSX.Element")
        .replace(reReactNode, "React.ReactNode")
        .replace(reIntrinsicElements, "React.JSX.IntrinsicElements")
        .replace(reReactAlias, "React");

      const named = [...namedSet]
        .sort()
        .map((x) => `type ${x}`)
        .join(", ");

      if (named || hasDefaultOrNamespace || namedSet.size > 0) {
        result = result.trimStart().startsWith("import") ? result : "\n" + result;
      }

      if (named || hasDefaultOrNamespace) {
        if (named) {
          if (/\bReact\./.test(result)) {
            // If React.* usage → use default + named types
            result = `import React, { ${named} } from 'react';\n${result}`;
          } else {
            // if no React.* usage → only imports type
            result = `import { ${named} } from 'react';\n${result}`;
          }
        } else {
          result = `import type * as React from 'react';\n${result}`;
        }
      } else if (namedSet.size > 0) {
        result = `import type * as React from 'react';\n${result}`;
      }

      if (result !== original) {
        await fs.writeFile(file, result, "utf8");
        importingFixed++;

        BUILD_LOGGER.ON_PROCESS({
          actionName: "Fixed DTS React Import",
          count: importingFixed,
          nameDirect: relative(process.cwd(), file)
        });
      }
    }

    BUILD_LOGGER.ON_FINISH({
      actionName: "Fixing DTS React Import",
      count: importingFixed
    });
  } catch (error) {
    BUILD_LOGGER.ON_ERROR({
      actionName: "Fixing DTS React Import",
      error
    });
  }
}

await run();
