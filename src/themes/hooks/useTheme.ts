"use client";

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

import type { UseTheme } from "../types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ProvidersThemesApp } from "../providers/ProvidersThemesApp";

/** ------------------------------------------------------------
 * * ***React hook for accessing the theme context.***
 * ------------------------------------------------------------
 * **Provides information about the currently active theme and utilities for
 * switching themes, including system-level theme support.**
 *
 * ⚠️ ***Must be used inside `<ProvidersThemesApp>` or it will throw.***
 * @throws If the hook is called outside of the `<ProvidersThemesApp>` provider, will throw {@link Error | `Error`} .
 * @returns {UseTheme} Object containing current theme data and setter.
 * @see {@link ProvidersThemesApp | `ProvidersThemesApp`}.
 */
export const useTheme = (): UseTheme => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useTheme must be wrapped by ProvidersThemesApp");
  }

  return themeContext;
};
