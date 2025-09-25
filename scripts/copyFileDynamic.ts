import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";
import chalk from "chalk";
import fsExtra from "fs-extra";
import path from "path";

/**
 * Copy any file (commonly CSS) into a `dist` sub-directory with dynamic paths.
 *
 * @param source   Path to the source file (absolute or relative to project root).
 * @param target   Sub-folder inside `dist` where the file will be copied.
 * @param fileName Optional custom name for the copied file.
 *                 If omitted, the original source file name is used.
 *
 * @example
 * // Copy src/progress-bar/css/default.css to dist/progress-bar/default.css
 * await copyFileDynamic({
 *   source: "src/progress-bar/css/default.css",
 *   target: "progress-bar"
 * });
 *
 * @example
 * // Copy and rename the output file
 * await copyFileDynamic({
 *   source: "src/assets/style.css",
 *   target: "theme",
 *   fileName: "theme-default.css"
 * });
 */
async function copyFileDynamic({
  source,
  target,
  fileName
}: {
  source: string;
  target: string;
  fileName?: string;
}) {
  try {
    const absSource = path.resolve(process.cwd(), source);
    const absTargetDir = path.resolve(
      process.cwd(),
      isNonEmptyString(target) && target.startsWith("dist") ? "" : "dist",
      target
    );
    const absTargetFile = path.join(absTargetDir, fileName ?? path.basename(source));

    console.log(
      chalk.bold(
        `🕧 ${chalk.cyanBright("Starting")} ${chalk.underline.blueBright(
          "Copy File"
        )} to ${chalk.italic.underline.whiteBright("'dist'")} folder.`
      )
    );

    await fsExtra.ensureDir(absTargetDir);
    await fsExtra.copy(absSource, absTargetFile);

    const relSrc = path.relative(process.cwd(), absSource).replace(/\\/g, "/");
    const relDest = path.relative(process.cwd(), absTargetFile).replace(/\\/g, "/");

    console.log(
      `${chalk.bold("   >")} ${chalk.italic(
        `${chalk.white("1.")} ${chalk.white("Copying File")} ${chalk.yellow(
          "from"
        )} '${chalk.bold.underline.cyanBright(relSrc)}' ${chalk.bold.gray(
          "➔"
        )} '${chalk.bold.underline.cyanBright(relDest)}'.`
      )}`
    );

    console.log(
      chalk.bold(
        `✅ ${chalk.greenBright("Success")} ${chalk.underline.blueBright(
          "Copy File"
        )} to ${chalk.italic.underline.whiteBright("'dist'")} folder.`
      )
    );
  } catch (e) {
    console.error(
      chalk.bold(
        `❌ ${chalk.redBright("Error")} while ${chalk.underline.blueBright(
          "Copy File"
        )} tp ${chalk.cyan("dist")} folder:\n\n > ${chalk.inverse.red(e)}`
      )
    );
  }
}

// Example usage:
await copyFileDynamic({
  source: "src/progress-bar/css/default.css",
  target: "progress-bar"
  // fileName: "default.css", // optional custom name
});
