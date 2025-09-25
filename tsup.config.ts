import fs from "fs";
import path from "path";
import glob from "fast-glob";
import fsExtra from "fs-extra";
import type { PackageJson } from "type-fest";
import { defineConfig, type Options } from "tsup";
import { isBoolean, isNonEmptyString, isString } from "@rzl-zone/utils-js/predicates";
import { safeJsonParse } from "@rzl-zone/utils-js/conversions";

const pkgJson = path.resolve(__dirname, "package.json");
const pkg = safeJsonParse<PackageJson, typeof pkgJson>(fs.readFileSync(pkgJson, "utf-8"));
const KIT_VERSION = isNonEmptyString(pkg?.version) ? `v${pkg.version}.` : "";

export const bannerText = `/*!
 * ====================================================
 *  Rzl Next-Kit ${KIT_VERSION}
 *  Author: Rizalvin Dwiky
 *  Repo: https://github.com/rzl-zone/next-kit
 * ====================================================
 */`;

const externalDefault: ExtendedOptions["external"] = [
  "next",
  "validate-color",
  "react",
  "react-dom",
  "@edge-runtime/cookies"
];

const nonExternalDefault: ExtendedOptions["noExternal"] = [
  "@rzl-zone/utils-js",
  "@rzl-zone/ts-types-plus"
];

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
    const matched = glob.sync(p, { absolute: true });
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
      console.log(`✅ Added "use client" to ${filePath}`);
    }
  }
};

const injectBanner = async (pattern: string | string[]) => {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const files: string[] = [];

  for (const p of patterns) {
    const matched = glob.sync(p, { absolute: true });
    files.push(...matched);
  }

  for (const filePath of files) {
    if (!/\.(js|cjs|mjs)$/.test(filePath)) continue;
    if (!fs.existsSync(filePath)) continue;

    const content = await fs.promises.readFile(filePath, "utf8");
    const trimmed = content.trim();

    // Skip empty files or files that only contain "use strict"
    // eslint-disable-next-line quotes
    if (!trimmed || trimmed === '"use strict";' || trimmed === "'use strict';") continue;

    // Skip if banner already exists
    if (content.startsWith(bannerText)) continue;

    const finalContent = `${isNonEmptyString(bannerText) ? bannerText + "\n\n" : ""}${content}`;
    await fs.promises.writeFile(filePath, finalContent, "utf8");
    console.log(`✅ Added banner to ${filePath}`);
  }
};

const copyCss = async () => {
  await fsExtra.ensureDir("dist/top-loader");
  await fsExtra.copy("src/top-loader/css/default.css", "dist/top-loader/default.css");
  console.log("✅ Copied default.css");
};

const onSuccessDefault = async () => {
  await copyCss();
  await injectBanner("dist/**/*.{js,cjs,mjs}");
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
      // top-loader
      "src/top-loader/index.{ts,tsx}"
    ],
    preserveUseClient: true,
    clientFilesPattern: [
      // extra
      "dist/extra/context.*(js|cjs|mjs)",
      //themes
      "dist/themes/index.*(js|cjs|mjs)",
      // top-loader
      "dist/top-loader/index.*(js|cjs|mjs)"
    ]
  })
]);
