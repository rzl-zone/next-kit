import fs from "fs";
import chalk from "chalk";
import glob from "fast-glob";
import { defineConfig, type Options } from "tsup";
import { isBoolean, isString } from "@rzl-zone/utils-js/predicates";

const externalDefault: ExtendedOptions["external"] = [
  "next",
  "validate-color",
  "react",
  "react-dom",
  "@rzl-zone/utils-js",
  "@edge-runtime/cookies"
];

const nonExternalDefault: ExtendedOptions["noExternal"] = ["@rzl-zone/ts-types-plus"];

interface ExtendedOptions extends Options {
  /** @default true */
  preserveUseClient?: boolean; // toggle
  /** @default undefined */
  clientFilesPattern?: string | string[]; // folder/build pattern
}

const injectUseClient = async (pattern: string | string[]) => {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];

  const files: string[] = [];
  for (const p of patterns) {
    const matched = glob.sync(p, { absolute: false });
    files.push(...matched);
  }

  for (const filePath of files) {
    if (
      !filePath.endsWith(".js") &&
      !filePath.endsWith(".cjs") &&
      !filePath.endsWith(".mjs")
    )
      continue;
    if (!fs.existsSync(filePath)) continue;

    const content = await fs.promises.readFile(filePath, "utf8");
    const trimmed = content.trim();

    // Skip empty files or files that only contain "use strict"
    // eslint-disable-next-line quotes
    if (!trimmed || trimmed === '"use strict";' || trimmed === "'use strict';") continue;

    // eslint-disable-next-line quotes
    if (!content.startsWith('"use client";')) {
      await fs.promises.writeFile(filePath, `"use client";\n${content}`, "utf8");
      console.log(
        chalk.bold(
          // eslint-disable-next-line quotes
          `✅ ${chalk.bold.greenBright("Added")} ${chalk.underline.whiteBright('("use client";)')} ${chalk.yellowBright("mark")} ${chalk.bold.blackBright(
            "to"
          )} ${chalk.bold.underline.blueBright(filePath)}`
        )
      );
    }
  }
};

const onSuccessDefault = async () => {
  const removeJs = await glob([
    "dist/types/**/*.{js,js.map,cjs}",
    "dist/types/*.{js,js.map,cjs}"
  ]);
  for (const file of removeJs.sort()) {
    fs.rmSync(file, { force: true });
  }
};

const configOptions = (options: ExtendedOptions): Options => {
  const { preserveUseClient, clientFilesPattern, outDir, ...rest } = options;

  const onSuccess =
    preserveUseClient && clientFilesPattern
      ? async () => {
          await injectUseClient(clientFilesPattern);
          await onSuccessDefault();
        }
      : async () => {
          await onSuccessDefault();
        };

  if (!isString(options.dts) && !isBoolean(options.dts) && options.dts?.only === true) {
    return { ...options, clean: !options.watch, dts: { only: true }, onSuccess };
  }

  return {
    dts: true,
    treeshake: true,
    minify: false,
    bundle: true,
    splitting: true,
    format: ["cjs", "esm"],
    clean: !options.watch,
    skipNodeModulesBundle: true,
    external: externalDefault,
    noExternal: nonExternalDefault,
    esbuildOptions(opts) {
      opts.treeShaking = true;
      opts.minify = false;
      opts.keepNames = false;
      opts.legalComments = "none";
      opts.ignoreAnnotations = true;

      return opts;
    },
    outDir,
    onSuccess,
    ...rest
  };
};

export default defineConfig((options) => [
  configOptions({
    ...options,
    outDir: "dist",
    entry: [
      // extra
      "src/extra/*.ts",
      "src/extra/*.tsx",
      "!src/extra/tests/*",
      // hoc
      "src/hoc/*.{ts,tsx}",
      // themes
      "src/themes/index.{ts,tsx}",
      // progress-bar
      "src/progress-bar/index.{ts,tsx}",
      // utils
      "src/utils/index.ts",
      // types
      "src/types/index.ts"
    ],
    preserveUseClient: true,
    clientFilesPattern: [
      // extra
      "dist/extra/context.*(js|cjs|mjs)",
      //themes
      "dist/themes/index.*(js|cjs|mjs)",
      // progress-bar
      "dist/progress-bar/index.*(js|cjs|mjs)"
    ]
  })
]);
