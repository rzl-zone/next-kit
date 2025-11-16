import { createContext } from "react";

import type { UseTheme } from "../types";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import type { useTheme } from "../hooks/useTheme";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import type { ProvidersThemesApp } from "../providers/ProvidersThemesApp";

/** ------------------------------------------------------------
 * * ***React context for the app themes system.***
 * ------------------------------------------------------------
 * **Holds the current theme state and updater function, including
 * support for system-level theme preference.**
 *
 * ⚠️ ***Access this context only via `useTheme()` or within a
 * `<ProvidersThemesApp>` tree.***, directly calling `React.useContext(ThemeContext)` outside the provider
 * will return `undefined`.
 *
 * @remarks
 * This context is intentionally exported to support advanced use-cases
 * (e.g., custom hooks), prefer the `useTheme()` hook for typical usage.
 * @see ***{@link useTheme | `useTheme()`} and {@link ProvidersThemesApp | `ProvidersThemesApp`}.***
 */
export const ThemeContext: React.Context<UseTheme | undefined> = createContext<
  UseTheme | undefined
>(undefined);
