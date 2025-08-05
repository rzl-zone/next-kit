import { CONFIG_THEME } from "../config";

/** * The default themes fetched from the main config. */
type _DefaultThemes = typeof CONFIG_THEME.themes;

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
 * If no override is provided, default themes from CONFIG_THEME will be used.
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
export type ThemesMode = ThemeOverrideConfig extends { themes: infer T }
  ? T extends readonly (infer U)[]
    ? readonly U[]
    : _DefaultThemes
  : ThemeOverrideConfig extends { themes?: infer T }
    ? T extends readonly (infer U)[]
      ? readonly (U | undefined)[]
      : _DefaultThemes
    : _DefaultThemes;

/** ------------------------------------------------------------
 * * ***Represents the valid individual theme mode, extracted from the `ThemesMode` array.***
 * ------------------------------------------------------------
 *
 * This can be a string literal type like `"pink" | "blue"`, or `undefined` if `themes` is optional.
 */
export type ThemeMode = ThemesMode extends readonly (infer T)[] ? T : undefined;
