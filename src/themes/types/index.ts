import type {
  DetailedHTMLProps,
  Dispatch,
  ReactNode,
  ScriptHTMLAttributes,
  SetStateAction
} from "react";

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import type { useTheme } from "..";
import { defaultThemes } from "../configs";
import { AnyString as AnyThemeAsString } from "@rzl-zone/ts-types-plus";

/** * The default themes fetched from the main config. */
type _DefaultThemes = typeof defaultThemes;

interface ValueObject {
  [themeName: string]: string;
}
type DataAttribute = `data-${string}`;
export type Attribute = DataAttribute | "class";

export interface ScriptPropsThemesProps
  extends DetailedHTMLProps<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> {
  [dataAttribute: DataAttribute]: string | undefined;
}

/** ------------------------------------------------------------
 * * ***An empty interface meant to be augmented to override theme configuration.***
 * ------------------------------------------------------------
 *
 * Users can extend this interface with a `themes` property as a readonly array literal
 * to customize the valid themes list.
 *
 * Usage example to override the themes:
 *
 * ```ts
 * import "@rzl-zone/next-kit/themes";
 *
 * declare module "@rzl-zone/next-kit/themes" {
 *   interface ThemeOverrideConfig {
 *     // Required override: themes must be exactly these strings
 *     themes: ["pink", "blue", "green"];
 *   }
 * }
 * ```
 *
 * Or optionally override:
 *
 * ```ts
 * import "@rzl-zone/next-kit/themes";
 *
 * declare module "@rzl-zone/next-kit/themes" {
 *   interface ThemeOverrideConfig {
 *     // Optional override: themes can be these strings or undefined
 *     themes?: ["pink", "blue", "green"];
 *   }
 * }
 * ```
 *
 * If no override is provided, default themes from defaultTheme will be used.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ThemeOverrideConfig {}
// eslint-enable-next-line @typescript-eslint/no-empty-object-type

/** ------------------------------------------------------------
 * * ***Represents the list of theme modes used in the app.***
 * ------------------------------------------------------------
 *
 * Logic:
 * - If `ThemeOverrideConfig` contains a required `themes` property,
 *   and it is a readonly array literal, use that.
 * - If `ThemeOverrideConfig` contains an optional `themes` property,
 *   and it is a readonly array literal, use that plus `undefined`.
 * - Otherwise, fallback to the default `["dark", "light", "system"]`.
 *
 * Example results:
 * - Required override `themes: ["pink", "blue"]` → `readonly ["pink", "blue"]`
 * - Optional override `themes?: ["pink", "blue"]` → `readonly ("pink" | "blue" | undefined)[]`
 * - No override → `["dark", "light", "system"]`
 */
type ThemesMode = ThemeOverrideConfig extends { themes: infer T }
  ? T extends readonly (infer U)[]
    ? readonly U[]
    : _DefaultThemes
  : ThemeOverrideConfig extends { themes?: infer T }
    ? T extends readonly (infer U)[]
      ? readonly (U | undefined)[]
      : _DefaultThemes
    : _DefaultThemes;

/** ------------------------------------------------------------
 * * ***Represents the valid individual theme mode, extracted from the {@link ThemesMode | `ThemesMode`} array.***
 * ------------------------------------------------------------
 * **This can be a string literal type like `"dark" | "light" | "pink" | "blue"`, or `undefined` if `themes` is optional.**
 */
export type ThemeMode = ThemesMode extends readonly (infer T)[] ? T : undefined;

/** ------------------------------------------------------------
 * * ***Props accepted by `<ProvidersThemesApp />`, used to configure how theming behaves on the page.***
 * ------------------------------------------------------------
 * **You usually place this provider at the root of your application (e.g. in `app/layout.tsx`).**
 */
export type ThemeProviderProps = {
  /** ***Children React Node.***
   *
   * - **Default value:** `undefined`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is `undefined` or `not valid React Children`.**
   */
  children: ReactNode;
  /** ***List of all available theme names.***
   *
   * - **Default value:**
   *     - If **`enableSystem`** is **true**, then **`["dark", "light", "system"]`**.
   *     - If **`enableSystem`** is **false**, then **`["dark", "light"]`**.
   *
   * - **⚠️ Note:**
   *     - If **`enableSystem`** is **false** and your `themes` array includes `"system"`,
   *       it will be removed automatically.
   *
   * - **ℹ️ Tip ***(Recommended)***:**
   *    - If you pass custom themes (e.g. `themes={["pink","blue"]}`),
   *      remember to add a corresponding override for type-safety:
   *      ```ts
   *
   *      import "@rzl-zone/next-kit/themes";
   *
   *      declare module "@rzl-zone/next-kit/themes" {
   *        interface ThemeOverrideConfig {
   *          themes: ["pink", "blue"]; // or themes?: [...];
   *        }
   *      }
   *      ```
   */
  themes?: string[] | undefined;
  /** ***Forced theme name for the current page.***
   *
   * - **Default value:** `undefined`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string`.**
   */
  forcedTheme?: string | undefined;
  /** ***Whether to switch between dark and light themes based on prefers-color-scheme.***
   *
   * - **Default value:** `true`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a boolean`.**
   */
  enableSystem?: boolean | undefined;
  /** ***Disable all CSS transitions when switching themes.***
   *
   * - **Default value:** `true`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a boolean`.**
   */
  disableTransitionOnChange?: boolean | undefined;
  /** ***Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons, that style will inject into html or body element.***
   *
   * - **Default value:** `"html"`.
   * - ***⚠️ Warning:***
   *    - If you using this value on html, you must using `suppressHydrationWarning` on `html` and if you
   *      choose `"body"` you must use `suppressHydrationWarning` at `body element`.
   *    - **Will throw TypeError if value is not `undefined`, `false` or not a string with
   *      valid value: `"html"` or `"body"`.**
   */
  enableColorScheme?: "html" | "body" | false | undefined;
  /** ***Whether to indicate to browsers which color scheme in meta head, is used (dark or light) for built-in UI like inputs and buttons.***
   *
   * - **Default value:** `true`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a boolean`.**
   */
  enableMetaColorScheme?: boolean | undefined;
  /** ***Key used to store theme setting in localStorage.***
   *
   * - **Default value:** `"rzl-theme"`
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string` and value `is empty-string`**
   */
  storageKey?: string | undefined;
  /** ***Default theme.***
   *
   * - **Default value:**
   *    - If `enableSystem` is `true` then `system` otherwise `light`.
   * - **ℹ️ Note:**
   *    - If you set this value, value must be one of `themes` property value, otherwise will keep to default value.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string`.**
   */
  defaultTheme?: string | undefined;
  /** ***HTML attribute modified based on the active theme.***
   *
   * - **Default value:** `"data-theme"`
   * - **Accepts:**
   *    - `"class"`.
   *    - `"data-*"` (any data attribute, e.g., `"data-mode"`, `"data-color"`, etc.).
   *    - An array including any combination of the above.
   *
   * - ⚠️ **Warning:**
   *      - ***This will throw a `TypeError` if:***
   *         - The value is not `undefined` **and**
   *         - The value is not a string **or**
   *         - The value is an empty string `""` **or**
   *         - The value is an array that contains elements not matching `"class"` or `"data-*"`.
   */
  attribute?: Attribute | Attribute[] | undefined;
  /** ***Mapping of theme name to HTML attribute value.***
   *
   * - **Type:** {@link ValueObject | **`ValueObject`**} | `undefined`
   * - **Structure:** An object where each key is a theme name (`string`) and the value is a string representing the attribute value.
   *
   * - ⚠️ **Warning:**
   *      - This will throw a `TypeError` if the value is not `undefined` **and**:
   *         - It is not a plain object, or
   *         - Any of the object values is not a string or a empty-string
   *
   * @example
   * // Valid
   * value = {
   *   light: "data-light",
   *   dark: "data-dark"
   * }
   *
   * // Invalid
   * value = "string"          // TypeError
   * value = { light: 123 }    // TypeError
   */
  value?: ValueObject | undefined;
  /** ***Nonce string to pass to the inline script and style elements for CSP headers.***
   *
   * - **Default value:** `undefined`.
   * - ***⚠️ Warning:***
   *    - **Will throw TypeError if value is not `undefined` or `not a string`.**
   */
  nonce?: string;
  /** ***Props to pass the inline script.***
   *
   * @default undefined
   */
  scriptProps?: ScriptPropsThemesProps;
};

/** ------------------------------------------------------------
 * * ***Value returned by {@link useTheme | `useTheme`}.***
 * ------------------------------------------------------------
 * **Contains the current theme information and helper utilities for manually
 * updating the active theme, including support for system-based themes.**
 */
export type UseTheme = {
  /** ***List of all available theme names.*** */
  themes: Array<AnyThemeAsString | ThemeMode>;
  /** ***Forced theme name for the current page.*** */
  forcedTheme?: AnyThemeAsString | ThemeMode | undefined;
  /** ***Update the theme.*** */
  setTheme: Dispatch<SetStateAction<AnyThemeAsString | ThemeMode>>;
  /** ***Active theme name.*** */
  theme?: AnyThemeAsString | ThemeMode | undefined;
  /** ***If `enableSystem` is `true` and the active theme is `"system"`, this returns whether the system preference resolved to` "dark" or "light"`. Otherwise, identical to `theme`.*** */
  resolvedTheme?: AnyThemeAsString | Exclude<ThemeMode, "system"> | undefined;
  /** ***If enableSystem is true, returns the System theme preference (`"dark"` or `"light"`), regardless what the active theme is.*** */
  systemTheme?: AnyThemeAsString | Exclude<ThemeMode, "system"> | undefined;
};
