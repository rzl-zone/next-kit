import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";
import esbuild from "rollup-plugin-esbuild";
import nodeExternals from "rollup-plugin-node-externals";

/**
 * Flatten nested objects into { key: path }
 */
function flattenEntries(entries) {
  const flat = {};
  function recurse(obj, parentPath = "") {
    for (const [key, val] of Object.entries(obj)) {
      const fullPath = parentPath ? `${parentPath}/${key}` : key;
      if (typeof val === "string") flat[fullPath] = val;
      else if (typeof val === "object") recurse(val, fullPath);
    }
  }
  recurse(entries);
  return flat;
}

/**
 * Generates Rollup config
 */
function makeDedupeRollupConfig(inputsPerFolder, clientFiles = []) {
  const configs = [];

  // 2️⃣ ESM build with shared chunks
  const flattenedInputs = flattenEntries(inputsPerFolder);
  configs.push({
    input: flattenedInputs,
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: false,
      entryFileNames: "[name].js",
      chunkFileNames: ({ facadeModuleId }) => {
        if (!facadeModuleId) return "chunks/[name]-[hash].js";
        if (facadeModuleId.includes("node_modules")) return "vendor/[name]-[hash].js";

        // masuk folder sesuai top-folder src
        const rel = path
          .relative(path.resolve("src"), facadeModuleId)
          .replace(/\\/g, "/");
        const topFolder = rel.split("/")[0];
        return `${topFolder}/chunks/[name]-[hash].js`;
      },
      manualChunks(id) {
        if (id.includes("node_modules")) return "vendor";
      },
      banner: (chunk) => {
        const baseName = chunk.name;
        return clientFiles.some(
          (f) => f === baseName || f === `${baseName}.ts` || f === `${baseName}.tsx`
        )
          ? // eslint-disable-next-line quotes
            '"use client";'
          : "";
      }
    },
    external: ["next", "react", "@edge-runtime/cookies"],
    treeshake: true,
    jsx: "preserve",
    onwarn(warning, warn) {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE" && /use client/.test(warning.message))
        return;
      if (warning.message.includes("Can't resolve original location of error")) return;
      warn(warning);
    },
    plugins: [
      // nodeExternals({
      //   allowlist: ["@rzl-zone/utils-js"]
      // }),
      tsconfigPaths(),
      resolve({
        extensions: [".mjs", ".js", ".ts", ".tsx", ".json"],
        preferBuiltins: false
      }),
      commonjs(),
      esbuild({
        target: "esnext",
        tsconfig: "tsconfig.json",
        loader: "tsx",
        minify: false
      })
    ]
  });

  // 1️⃣ Build TypeScript declaration files (.d.ts) per folder
  for (const [folder, files] of Object.entries(inputsPerFolder)) {
    const flatFiles = flattenEntries(files); // ⚡ only flatten inside folder

    configs.push({
      input: flatFiles,
      output: { dir: `dist/${folder}`, format: "es", sourcemap: false },
      plugins: [tsconfigPaths(), dts()]
    });

    // Build main index.d.ts per folder (first entry)
    const firstEntryName = Object.keys(flatFiles)[0];
    configs.push({
      input: flatFiles[firstEntryName],
      output: { file: `dist/${folder}/${firstEntryName}.d.ts`, format: "es" },
      plugins: [tsconfigPaths(), dts()]
    });
  }
  return configs;
}

// Example inputs
const inputs = {
  extra: {
    index: path.resolve("src/extra/index.ts"),
    action: path.resolve("src/extra/action.ts"),
    context: path.resolve("src/extra/context.tsx"),
    pathname: path.resolve("src/extra/pathname.ts")
  },
  hoc: {
    index: path.resolve("src/hoc/index.ts")
  },
  themes: {
    index: path.resolve("src/themes/index.tsx")
  },
  "top-loader": {
    index: path.resolve("src/top-loader/index.tsx"),
    hooks: { index: path.resolve("src/top-loader/hooks/index.ts") }
  }
};

// Files that require "use client"
const clientFiles = [
  "extra/context.tsx",
  "themes/index.tsx",
  "top-loader/hooks/index.ts"
];

export default makeDedupeRollupConfig(inputs, clientFiles);
