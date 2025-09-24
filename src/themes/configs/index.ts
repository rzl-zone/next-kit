import type { ThemeProviderProps } from "../types";

export const CONFIG_THEME = {
  attribute: "data-theme",
  storageKey: "rzl-theme",
  themes: ["dark", "light", "system"],
  enableSystem: true,
  forcedTheme: undefined,
  defaultTheme: undefined,
  enableColorScheme: false,
  enableMetaColorScheme: false,
  disableTransitionOnChange: true
} as const satisfies Omit<ThemeProviderProps, "children">;
