import fs from "fs";
import fg from "fast-glob";

/**
 * File extensions to check
 */
const FILE_PATTERNS = "**/*.{ts,tsx,js,json,md}";

/**
 * Directories to ignore
 */
const IGNORE_PATTERNS = ["node_modules/**", "dist/**", ".next/**"];

async function removeTrailingNewlines() {
  const files = await fg(FILE_PATTERNS, {
    ignore: IGNORE_PATTERNS,
    onlyFiles: true,
    absolute: false
  });

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    if (content.endsWith("\n")) {
      const newContent = content.replace(/\n$/, "");
      fs.writeFileSync(file, newContent, "utf8");
      console.log(`✔ Removed trailing newline: ${file}`);
    }
  }

  console.log("✅ Done.");
}

removeTrailingNewlines().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
