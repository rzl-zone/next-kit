import { createContext } from "react";

import type { ThemeCtx } from "../types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { useTheme, useThemePagesDir } from "../hooks";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RzlThemeProvider } from "../providers/RzlThemeProvider";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RzlThemePagesDirProvider } from "../providers/RzlThemePagesDirProvider";

/** ------------------------------------------------------------
 * * ***React context for the app themes system (App Dir).***
 * ------------------------------------------------------------
 * **Holds the current theme state and updater function, including
 * support for system-level theme preference.**
 *
 * ⚠️ ***Access this context only via `useTheme()` or within a
 * `<RzlThemeProvider>` tree.***, directly calling `React.useContext(ThemeContext)` outside the provider
 * will return `undefined`.
 *
 * @remarks
 * This context is intentionally exported to support advanced use-cases
 * (e.g., custom hooks), prefer the `useTheme()` hook for typical usage.
 * @see ***{@link useTheme | `useTheme()`} and {@link RzlThemeProvider | `RzlThemeProvider`}.***
 */
export const ThemeContext = createContext<ThemeCtx | undefined>(undefined);
ThemeContext.displayName = "RzlzoneThemeContext";

/** ------------------------------------------------------------
 * * ***React context for the app themes system (Pages Dir).***
 * ------------------------------------------------------------
 * **Holds the current theme state and updater function, including
 * support for system-level theme preference.**
 *
 * ⚠️ ***Access this context only via `useThemePagesDir()` or within a
 * `<RzlThemePagesDirProvider>` tree.***, directly calling `React.useContext(ThemePagesDirContext)` outside the provider
 * will return `undefined`.
 *
 * @remarks
 * This context is intentionally exported to support advanced use-cases
 * (e.g., custom hooks), prefer the `useThemePagesDir()` hook for typical usage.
 * @see ***{@link useThemePagesDir | `useThemePagesDir()`} and {@link RzlThemePagesDirProvider | `RzlThemePagesDirProvider`}.***
 */
export const ThemePagesDirContext = createContext<ThemeCtx | undefined>(undefined);
ThemePagesDirContext.displayName = "RzlzoneThemePagesDirContext";
