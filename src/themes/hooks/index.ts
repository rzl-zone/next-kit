"use client";

import { useContext } from "react";
import { ThemeContext, ThemePagesDirContext } from "../contexts/ThemeContext";

import type { ThemeCtx } from "../types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RzlThemeProvider } from "../providers/RzlThemeProvider";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  RzlThemePagesDirProvider
} from "../providers/RzlThemePagesDirProvider";

/** ------------------------------------------------------------
 * * ***React hook for accessing the theme context (App Dir).***
 * ------------------------------------------------------------
 * **Provides information about the currently active theme and utilities for
 * switching themes, including system-level theme support.**
 *
 * ⚠️ ***Must be used inside `<RzlThemeProvider>` for (`App Dir`), or it will throw.***
 * @throws If the hook is called outside of the **`<RzlThemeProvider>`** component, will throw {@link Error | **`Error`**} .
 * @returns {ThemeCtx} Object containing current theme data and setter.
 */
export const useTheme = (): ThemeCtx => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useTheme must be wrapped by RzlThemeProvider");
  }

  return themeContext;
};

/** ------------------------------------------------------------
 * * ***React hook for accessing the theme context (Pages Dir).***
 * ------------------------------------------------------------
 * **Provides information about the currently active theme and utilities for
 * switching themes, including system-level theme support.**
 *
 * ⚠️ ***Must be used inside `<RzlThemePagesDirProvider>` for (`Pages Dir`), otherwise will throw.***
 * @throws If the hook is called outside of the **`<RzlThemePagesDirProvider>`** component, will throw {@link Error | **`Error`**} .
 * @returns {ThemeCtx} Object containing current theme data and setter.
 */
export const useThemePagesDir = (): ThemeCtx => {
  const themeContext = useContext(ThemePagesDirContext);

  if (!themeContext) {
    throw new Error("useTheme must be wrapped by RzlThemeProvider");
  }

  return themeContext;
};
