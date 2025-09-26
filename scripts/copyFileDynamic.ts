import path from "path";
import fsExtra from "fs-extra";
import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";

import { BUILD_LOGGER } from "./utils/logger";

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

    BUILD_LOGGER.ON_STARTING({
      actionName: "Copy File",
      textDirectAction: "action",
      textDirectFolder: "to"
    });

    await fsExtra.ensureDir(absTargetDir);
    await fsExtra.copy(absSource, absTargetFile);

    const relSrc = path.relative(process.cwd(), absSource).replace(/\\/g, "/");
    const relDest = path.relative(process.cwd(), absTargetFile).replace(/\\/g, "/");

    BUILD_LOGGER.ON_PROCESS_COPY({
      actionName: "File Copied",
      count: 1,
      copyFrom: relSrc,
      copyTo: relDest
    });

    BUILD_LOGGER.ON_FINISH({
      actionName: "Copying File",
      textDirectFolder: "to",
      count: 1
    });
  } catch (error) {
    BUILD_LOGGER.ON_ERROR({
      actionName: "Copying DTS",
      error
    });
  }
}

// Example usage:
await copyFileDynamic({
  source: "src/progress-bar/css/default.css",
  target: "progress-bar"
  // fileName: "default.css", // optional custom name
});
