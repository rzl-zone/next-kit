/* eslint-disable no-unreachable */
import { Project, SyntaxKind, Node } from "ts-morph";
import fg from "fast-glob";
import { unlinkSync, existsSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";

// ! STILL BUG, PLS DON'T USE THIS SCRIPT !!!

const project = new Project({ skipAddingFilesFromTsConfig: true });

// --- helper: normalize import path ke absolute ---
function resolveImportPath(fromFile: string, moduleValue: string) {
  if (!moduleValue.startsWith(".")) return null; // skip node_modules
  const base = resolve(dirname(fromFile), moduleValue);
  const exts = ["", ".ts", ".js", ".cjs", ".mjs", ".esm", ".d.ts"];
  for (const ext of exts) {
    const full = base + ext;
    if (existsSync(full)) return full;
  }
  return null;
}

// --- helper: safe remove node
function tryRemove(node: Node | undefined): boolean {
  if (!node) return false;
  if (
    Node.isImportDeclaration(node) ||
    Node.isExpressionStatement(node) ||
    Node.isVariableStatement(node)
  ) {
    node.remove();
    return true;
  }
  return false;
}

async function run() {
  throw new Error("SCRIPT STILL BUG !!!");

  const files = await fg("dist/**/*.{ts,js,cjs,mjs,esm,d.ts}", { absolute: true });
  const emptyFiles: string[] = [];

  // Detect empty file (skip if file only /// <reference ...>)
  for (const filePath of files) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const statements = sourceFile.getStatements();

    const onlyReferences = statements.every((stmt) =>
      stmt.getText().trim().startsWith("/// <reference")
    );
    if (onlyReferences) continue;

    const realStatements = statements.filter((stmt) => {
      const text = stmt.getText().trim();
      // eslint-disable-next-line quotes
      return text !== "'use strict';" && text !== '"use strict";' && text.length > 0;
    });

    if (realStatements.length === 0) emptyFiles.push(filePath);
  }

  if (!emptyFiles.length) return;

  // Delete all import/require/dynamic import to empty file
  for (const filePath of files) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    let modified = false;

    // helper to check if module is directing to empty file
    const isEmptyModuleImported = (mod: string) => {
      const abs = resolveImportPath(filePath, mod);
      return abs ? emptyFiles.includes(abs) : false;
    };

    // --- ImportDeclaration (named/default/namespace/side-effect) ---
    for (const imp of sourceFile.getImportDeclarations()) {
      if (isEmptyModuleImported(imp.getModuleSpecifierValue())) {
        imp.remove();
        modified = true;
      }
    }

    // --- require(...) & dynamic import(...) ---
    const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    for (const call of calls) {
      const expr = call.getExpression();
      const arg = call.getArguments()[0]?.getText().replace(/['"]/g, "");

      if (!arg) continue;

      // require('...')
      if (expr.getText() === "require" && isEmptyModuleImported(arg)) {
        const parent = call.getParent();
        if (tryRemove(parent)) modified = true;
      }

      // dynamic import('...')
      if (expr.getKind() === SyntaxKind.ImportKeyword && isEmptyModuleImported(arg)) {
        const parent = call.getParent();
        if (tryRemove(parent)) modified = true;
      }
    }

    if (modified) {
      await sourceFile.save();
      console.log("📝 Cleaned imports/requires in:", relative(process.cwd(), filePath));
    }
  }

  // 3️⃣ remove empty files
  for (const f of emptyFiles) {
    unlinkSync(f);
    console.log("🗑 Deleted empty file:", relative(process.cwd(), f));
  }
}

run().catch(console.error);
