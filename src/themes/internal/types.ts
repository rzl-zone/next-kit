import type {
  DetailedHTMLProps,
  Dispatch,
  ReactNode,
  ScriptHTMLAttributes,
  SetStateAction
} from "react";
import { ThemeMode } from "../types";

interface ValueObject {
  [themeName: string]: string;
}

type DataAttribute = `data-${string}`;

interface ScriptPropsThemesProps
  extends DetailedHTMLProps<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> {
  [dataAttribute: DataAttribute]: string | undefined;
}

/** ------------------------------------------------------------
 * * ***Value returned by {@link useTheme}.***
 * ------------------------------------------------------------
 *
 * Contains the current theme information and helper utilities for manually
 * updating the active theme, including support for system-based themes.
 */
export type UseTheme = {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Update the theme */
  setTheme: Dispatch<SetStateAction<(string & {}) | ThemeMode>>;
  /** Active theme name */
  theme?: string | undefined;
  /** If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme` */
  resolvedTheme?: string | undefined;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: "dark" | "light" | undefined;
};

export type Attribute = DataAttribute | "class";

/** ------------------------------------------------------------
 * * ***Props accepted by `<ProvidersThemesApp />`, used to configure how theming behaves on the page.***
 * ------------------------------------------------------------
 * You usually place this provider at the root of your application (e.g. in `app/layout.tsx`).
 */
export type ThemeProviderProps = {
  children: ReactNode;
  /** List of all available theme names */
  themes?: string[] | undefined;
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Whether to switch between dark and light themes based on prefers-color-scheme, DefaultValue: `true`. */
  enableSystem?: boolean | undefined;
  /** Disable all CSS transitions when switching themes, DefaultValue: `false`. */
  disableTransitionOnChange?: boolean | undefined;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons, that style will inject into html or body element, DefaultValue: `html` (if you using this value on html, you must using "suppressHydrationWarning" on html and if you choose "body" you must use "suppressHydrationWarning" at body element). */
  enableColorScheme?: "html" | "body" | false | undefined;
  /** Whether to indicate to browsers which color scheme in meta head, is used (dark or light) for built-in UI like inputs and buttons, DefaultValue: `true`. */
  enableMetaColorScheme?: boolean | undefined;
  /** Key used to store theme setting in localStorage, DefaultValue: `"theme"`. */
  storageKey?: string | undefined;
  /** Default theme name (for v0.0.12 and lower the default was light). DefaultValue: if `enableSystem` is `true` then `system` otherwise `light`. */
  defaultTheme?: string | undefined;
  /** HTML attribute modified based on the active theme. Accepts `class`, `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array which could include both, DefaultValue: `"data-theme"`. */
  attribute?: Attribute | Attribute[] | undefined;
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject | undefined;
  /** Nonce string to pass to the inline script and style elements for CSP headers */
  nonce?: string;
  /** Props to pass the inline script */
  scriptProps?: ScriptPropsThemesProps;
};
