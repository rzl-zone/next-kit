import type { ColorCssNamed, PickStrict, Prettify } from "@rzl-zone/ts-types-plus";
import type { NProgressEasing, NProgressOptions } from "../utils/progress";

export type SpinnerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type ColorBase = {
  type: "base";
  /** * ***Support only Valid Color CSS.*** */
  ValueBase?: ColorCssNamed;
};
export type ColorHex = {
  type: "hex";
  /** * ***Support only HEX, RGB, RGBA, HSL, HSLA, HWB, LAB, LCH.*** */
  ValueHex?: string;
};

export type NProgressType = Prettify<
  {
    /** * ***Animation settings using easing (a CSS easing string).***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link NProgressEasing}, otherwise will return default value.
     * @default "ease"
     */
    easing?: NProgressEasing;
  } & NProgressOptions
>;

export type RzlNextTopLoaderProps = {
  /** * ***CSS class name that will be applied to the loader container
   * **only while the loader is active (loading)**.***
   *
   * **Useful if you need to style or animate the element differently
   * during page transitions.**
   *
   * By default, a simple ready-to-use style is provided in:
   * ```ts
   * import "@rzl-zone/next-kit/top-loader/default.css";
   * ```
   * This import can be placed in your global stylesheet entry,
   * for example:
   * 1. At layout.tsx:
   * ```ts
   * import "@rzl-zone/next-kit/top-loader/default.css";
   * ```
   * 2. At global stylesheet entry (eg: globals.css):
   * **`@import "@rzl-zone/next-kit/top-loader/default.css";`**
   *
   * Which defines a class named **`on_processing`**.
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   *
   * @default "on_processing"
   */
  classNameIfLoading?: string;
  /** * ***Color for the TopLoader.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default "linear-gradient(45deg, #b656cb, #29f)"
   */
  color?: string;
  /** * ***Show Progress Bar At Bottom Page.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type boolean, otherwise will return default value.
   * @default false
   */
  showAtBottom?: boolean;
  /** * ***The position of the progress bar at the start of the page load.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 0
   */
  startPosition?: number;
  /** * ***When the page loads faster than the progress bar, it does not display.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 0
   */
  delay?: number;
  /** * ***Delay to stop the progress bar.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 0
   */
  stopDelay?: number;
  /** * ***To show the TopLoader for hash anchors.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type boolean, otherwise will return default value.
   * @default true
   */
  showForHashAnchor?: boolean;
  /** * ***The id attribute to use for the `style` tag.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default undefined
   */
  id?: string;
  /** * ***The z-index of the loader.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 9999
   */
  zIndex?: number;
  /** * ***The name attribute to use for the `style` tag.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default undefined
   */
  name?: string;
  /** * ***Custom nonce for Content-Security-Policy directives.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default undefined
   */
  nonce?: string;
  /** * ***Custom CSS.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default undefined
   */
  style?: string;
  /** * ***Height of the progress bar.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default "3px"
   */
  height?: string;
  /** * ***The color of the Spinner. Support only HEX, RGB, RGBA, HSL, HSLA, HWB, LAB, LCH or Valid Color CSS, depends of your type props.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type {@link ColorBase} or {@link ColorHex}, otherwise will return default value.
   * @default hex: "#29f"
   */
  colorSpinner?: Extract<ColorBase | ColorHex, { type: "hex" | "base" }>;
  /** * ***The size of the spinner.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type string, otherwise will return default value.
   * @default "3px"
   */
  spinnerSize?: string;
  /** * ***The speed of the spinner.***
   *
   * - **⚠️ Warning:**
   *    - The value must be valid integer number, otherwise will return default value.
   * @default 400
   */
  spinnerSpeed?: number;
  /** * ***The ease function of the spinner.***
   *
   * - **⚠️ Warning:**
   *    - The value must be of type {@link NProgressEasing}, otherwise will return default value.
   * @default "linear"
   */
  spinnerEase?: NProgressEasing;
  /** * ***Showing Progress Bar On First Initial/Refresh Page.***
   *
   * @deprecated Unused anymore.
   */
  showProgressOnInitial?: {
    /** @default true */
    enabled?: boolean;
    /** * ***Delaying Before Trigger Stop Progress Bar.***
     *
     *  @default 100
     */
    delay?: number;
  };
  /** * ***Options of `NProgress`.*** */
  options?: NProgressType;
};

type OptionsNProgress = Prettify<
  NProgressType & Partial<PickStrict<RzlNextTopLoaderProps, "startPosition">>
>;

export type OptionsUseRouter = {
  /** @default false */
  disableProgressBar?: boolean;
  /** @default false */
  disablePreventAnyAction?: boolean;
  /** * ***Options of `NProgress`*** */
  options?: OptionsNProgress;
};

export interface NavigateOptionsUseRouter extends OptionsUseRouter {
  /** * ***Scrolling to top of page.***
   *
   * @default true
   */
  scroll?: boolean;
}
export interface NavigateFwdOptionsUseRouter extends OptionsUseRouter {
  /** @default 100 */
  delayStops?: number;
}

export interface UseAppRouterInstance {
  /** * ***Navigate to the previous history entry.*** */
  // eslint-disable-next-line no-unused-vars
  back(options?: OptionsUseRouter): void;
  /** * ***Navigate to the next history entry.*** */
  // eslint-disable-next-line no-unused-vars
  forward(options?: NavigateFwdOptionsUseRouter): void;
  /** * ***Refresh the current page.*** */
  // eslint-disable-next-line no-unused-vars
  refresh(options?: OptionsUseRouter): void;
  /** * ***Navigate to the provided href.***
   *
   * **Pushes a new history entry.**
   */
  // eslint-disable-next-line no-unused-vars
  push(href: string, options?: NavigateOptionsUseRouter): void;
  /** * ***Navigate to the provided href.***
   *
   * **Replaces the current history entry.**
   */
  // eslint-disable-next-line no-unused-vars
  replace(href: string, options?: NavigateOptionsUseRouter): void;
}
