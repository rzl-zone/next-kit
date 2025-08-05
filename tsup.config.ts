import { isBoolean, isString } from "@rzl-zone/utils-js";
import { defineConfig, Options } from "tsup";

const configOptions = (options: Options): Options => {
  if (!isString(options.dts) && !isBoolean(options.dts) && options.dts?.only === true) {
    return {
      ...options,
      clean: !options.watch,
      dts: { only: true }
    };
  }

  return {
    dts: true,
    minify: true,
    format: ["cjs", "esm"],
    outDir: "dist",
    target: "esnext",
    clean: !options.watch,
    ...options
  };
};

export default defineConfig((options) => [
  configOptions({
    ...options,
    outDir: "dist/extra",
    entry: [
      "src/extra/*.ts",
      "src/extra/*.tsx",
      "!src/extra/tests/*",
      "!src/extra/tests/*"
    ]
  }),

  configOptions({
    ...options,
    outDir: "dist/themes",
    entry: ["src/themes/index.{ts,tsx}"]
  }),

  configOptions({
    ...options,
    treeshake: true,
    outDir: "dist/hoc",
    entry: ["src/hoc/*.{ts,tsx}"]
  })
]);
