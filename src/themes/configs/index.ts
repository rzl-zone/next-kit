import type { ThemeProviderProps } from "../types";

/** @deprecated It used for internal-only use `defaultThemes` directly. */
const CONFIG_THEME = {
  themes: ["dark", "light", "system"]
} as const satisfies Pick<ThemeProviderProps, "themes">;

export const defaultThemes = CONFIG_THEME.themes;
export const defaultColorSchemes = ["light", "dark"];
export const MEDIA_SCHEME_THEME = "(prefers-color-scheme: dark)";

export const defaultMetaColorSchemeValue = {
  light: "#ffffff",
  dark: "oklch(.13 .028 261.692)"
};
