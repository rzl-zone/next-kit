"use client";

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

import type { UseTheme } from "../types";

/** ------------------------------------------------------------
 * * ***React hook for accessing the theme context.***
 * ------------------------------------------------------------
 * **Provides information about the currently active theme and utilities for
 * switching themes, including system-level theme support.**
 *
 * ⚠️ ***Must be used inside `<ProvidersThemesApp>` or it will throw.***
 * @throws {Error} If the hook is called outside of the `<ProvidersThemesApp>` provider.
 * @returns {UseTheme} Object containing current theme data and setter.
 */
export const useTheme = (): UseTheme => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useTheme must be wrapped by ProvidersThemesApp");
  }

  return themeContext;
};
