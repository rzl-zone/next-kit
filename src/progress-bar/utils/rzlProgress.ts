/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AnyFunction, Prettify } from "@rzl-zone/ts-types-plus";
import {
  isBoolean,
  isFunction,
  isInteger,
  isNumber,
  isPlainObject,
  isServer,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { DATA_RZL_PROGRESS, defaultPropsInitInitRzlNextProgressBar } from "../constants";
import { RzlNextProgressBarProps } from "../types/types";

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max));
}

export function toBarPercent(n: number, direction: "ltr" | "rtl"): number {
  return direction === "rtl" ? (1 - n) * 100 : (-1 + n) * 100;
}

export function css(
  element: HTMLElement | null | undefined,
  properties: string | Partial<CSSStyleDeclaration>,
  value?: string
): void {
  if (typeof properties === "string") {
    if (value !== undefined && element) {
      element.style[properties as any] = value;
    }
  } else {
    for (const prop in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, prop)) {
        const val = properties[prop];
        if (val !== void 0 && element) {
          (element.style as any)[prop] = val;
        }
      }
    }
  }
}

export function addClass(element: HTMLElement, name: string): void {
  element.classList.add(name);
}

export function removeClass(element: HTMLElement, name: string): void {
  element.classList.remove(name);
}

export function removeElement(element: HTMLElement | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

export const isValidEasingValue = (value: string): value is RzlProgressEasing => {
  if (!isString(value)) return false;
  const presets = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];
  return presets.includes(value);
};

export function isValidParentValue(value: unknown): value is HTMLElement | string {
  const validHtmlElement =
    typeof HTMLElement === "function" && value instanceof HTMLElement;
  if (isString(value) || validHtmlElement) return true;
  return false;
}

export type RzlProgressDirection = "ltr" | "rtl";
export type RzlProgressEasing =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

export type RzlProgressOptions = Prettify<
  Pick<RzlNextProgressBarProps, "classNameIfLoading"> & {
    /** * ***The initial position for the Progress Bar Loader in percentage, 0.08 is 8%.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type number, otherwise will return default value.
     * @default 0.08
     */
    minimum?: number;
    /** * ***The the maximum percentage used upon finishing, 1 is 100%.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type number, otherwise will return default value.
     * @default 1
     */
    maximum?: number;
    /** * ***Defines a template for the Progress Bar Loader.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default
     * ```jsx
     * `<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`
     * ```
     */
    template?: string;
    /** * ***Animation settings using easing (a CSS easing string).***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link RzlProgressEasing | *`RzlProgressEasing`*}, otherwise will return default value.
     * @default "linear"
     */
    easing?: RzlProgressEasing;
    /** * ***Animation speed in ms for the Progress Bar Loader.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type integer number, otherwise will return default value.
     * @default 200
     */
    speed?: number;
    /** * ***Auto incrementing behavior for the Progress Bar Loader.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type boolean, otherwise will return default value.
     * @default true
     */
    trickle?: boolean;
    /** * ***The increment delay speed in milliseconds.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type integer number, otherwise will return default value.
     * @default 200
     */
    trickleSpeed?: number;
    /** * ***To show spinner or not.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type boolean, otherwise will return default value.
     * @default true
     */
    showSpinner?: boolean;
    /** * ***Specify this to change the parent container.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link HTMLElement | *`HTMLElement`*} or string, otherwise will return default value.
     * @default "body"
     */
    parent?: HTMLElement | string;
    /**
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default ""
     */
    positionUsing?: string;
    /** * ***The selector attribute position.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default '[role="bar"]'
     */
    barSelector?: string;
    /** * ***The selector attribute spinner.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type string, otherwise will return default value.
     * @default '[role="spinner"]'
     */
    spinnerSelector?: string;
    /** * ***The direction bar.***
     *
     * - **⚠️ Warning:**
     *    - The value must be of type {@link RzlProgressDirection | *`RzlProgressDirection`*}, otherwise will return default value.
     * @default 'ltr'
     */
    direction?: RzlProgressDirection;
  }
>;

export class RzlProgress {
  /** * ***Default options settings.*** */
  static settings: Required<RzlProgressOptions> = {
    classNameIfLoading: defaultPropsInitInitRzlNextProgressBar["classNameIfLoading"],
    minimum: 0.08,
    maximum: 1,
    template: `<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`,
    easing: "linear",
    positionUsing: "",
    speed: 200,
    trickle: true,
    trickleSpeed: 200,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: "body",
    direction: "ltr"
  };

  static status: number | null = null;
  /** * ***Queue for animation functions.*** */
  // eslint-disable-next-line no-unused-vars
  private static pending: Array<(next: VoidFunction) => void> = [];
  private static isPaused: boolean = false;

  /** * ***Configure the `RzlProgress` behavior.*** */
  static configure(options: Partial<RzlProgressOptions>): typeof RzlProgress {
    if (!isPlainObject(options)) options = this.settings;

    let {
      barSelector,
      direction,
      easing,
      maximum,
      minimum,
      speed,
      trickleSpeed,
      trickle,
      showSpinner,
      template,
      parent,
      positionUsing,
      spinnerSelector
    } = options;

    if (!isUndefined(parent) && !isValidParentValue(parent))
      parent = this.settings.parent;

    if (!isUndefined(positionUsing) && !isString(positionUsing))
      positionUsing = this.settings.positionUsing;
    if (!isUndefined(spinnerSelector) && !isString(spinnerSelector))
      spinnerSelector = this.settings.spinnerSelector;
    if (!isUndefined(template) && !isString(template)) template = this.settings.template;

    if (!isUndefined(showSpinner) && !isBoolean(showSpinner))
      showSpinner = this.settings.showSpinner;
    if (!isUndefined(trickle) && !isBoolean(trickle)) trickle = this.settings.trickle;

    if (!isUndefined(speed) && !isInteger(speed)) speed = this.settings.speed;
    if (!isUndefined(minimum) && !isNumber(minimum)) minimum = this.settings.minimum;
    if (!isUndefined(maximum) && !isNumber(maximum)) maximum = this.settings.maximum;

    if (!isUndefined(trickleSpeed) && !isInteger(trickleSpeed))
      trickleSpeed = this.settings.trickleSpeed;
    if (!isUndefined(barSelector) && !isString(barSelector))
      barSelector = this.settings.barSelector;

    if (
      !isUndefined(direction) &&
      !(isString(direction) && ["ltr", "rtl"].includes(direction))
    ) {
      direction = this.settings.direction;
    }

    if (!isUndefined(easing) && !isValidEasingValue(easing)) {
      easing = this.settings.easing;
    }

    Object.assign(this.settings, {
      barSelector,
      direction,
      easing,
      maximum,
      minimum,
      speed,
      trickleSpeed,
      trickle,
      showSpinner,
      template,
      parent,
      positionUsing,
      spinnerSelector
    });

    return this;
  }

  /** * ***Check if `RzlProgress` has started.*** */
  static isStarted(): boolean {
    return typeof this.status === "number";
  }

  /** * ***Set the progress status.*** */
  static set(n: number): typeof RzlProgress {
    if (!isNumber(n)) n = 0;

    if (this.isPaused) return this;

    const started = this.isStarted();

    n = clamp(n, this.settings.minimum, this.settings.maximum);
    this.status = n === this.settings.maximum ? null : n;

    const progress = this.render(!started);
    if (progress) {
      const bar = progress.querySelector<HTMLElement>(this.settings.barSelector);
      const speed = this.settings.speed;
      const ease = this.settings.easing;

      progress.offsetWidth;

      this.queue((next) => {
        if (this.settings.positionUsing === "") {
          this.settings.positionUsing = this.getPositioningCSS();
        }
        css(bar, this.barPositionCSS(n, speed, ease));
        if (n === this.settings.maximum) {
          css(progress, { transition: "none", opacity: "1" });
          progress.offsetWidth;
          setTimeout(() => {
            css(progress, {
              transition: `all ${speed}ms linear`,
              opacity: "0.5"
            });
            setTimeout(() => {
              this.remove();
              next();
            }, speed);
          }, speed);
        } else {
          setTimeout(next, speed);
        }
      });
    }

    return this;
  }

  /** * ***Start the `RzlProgress`.*** */
  static start(): typeof RzlProgress {
    if (!this.status) this.set(0);
    const work = () => {
      if (this.isPaused) return;
      setTimeout(() => {
        if (!this.status) return;
        this.trickle();
        work();
      }, this.settings.trickleSpeed);
    };
    if (this.settings.trickle) work();
    return this;
  }

  /**
   * @param force Default `false`
   * @returns Instance `RzlProgress` Class.
   */
  static done(force?: boolean) {
    if (!isBoolean(force)) force = false;
    if (!force && !this.status) return this;
    return this.inc(0.3 + 0.5 * Math.random()).set(1);
  }

  /** * ***Increment the `RzlProgress`.*** */
  static inc(amount?: number): typeof RzlProgress {
    if (this.isPaused) return this;
    let n = this.status;
    if (!n) {
      return this.start();
    } else if (n > 1) {
      return this;
    } else {
      if (typeof amount !== "number") {
        if (n >= 0 && n < 0.2) {
          amount = 0.1;
        } else if (n >= 0.2 && n < 0.5) {
          amount = 0.04;
        } else if (n >= 0.5 && n < 0.8) {
          amount = 0.02;
        } else if (n >= 0.8 && n < 0.99) {
          amount = 5e-3;
        } else {
          amount = 0;
        }
      }
      n = clamp(n + amount, 0, 0.994);
      return this.set(n);
    }
  }

  /** * ***Advance the `RzlProgress`.*** */
  static trickle() {
    if (this.isPaused) return this;
    return this.inc();
  }

  /** * ***Handle jQuery promises (for compatibility).*** */
  static promise($promise?: { state?: AnyFunction; always?: AnyFunction }) {
    if (!$promise || (isFunction($promise.state) && $promise.state() === "resolved")) {
      return this;
    }

    let initial = 0,
      current = 0;

    if (current === 0) {
      this.start();
    }

    initial++;
    current++;

    if (isFunction($promise.always)) {
      $promise.always(() => {
        current--;
        if (current === 0) {
          initial = 0;
          this.done();
        } else {
          this.set((initial - current) / initial);
        }
      });
    }

    return this;
  }

  /** * ***Render the `RzlProgress` component.*** */
  static render(fromStart = false): HTMLElement | undefined {
    if (isServer()) return;

    if (this.isRendered()) {
      const nProgEl = document.getElementById(DATA_RZL_PROGRESS.MAIN_ID);
      if (nProgEl) return nProgEl;
    }

    addClass(document.documentElement, DATA_RZL_PROGRESS.ON_BUSY);

    const progress = document.createElement("div");
    progress.id = DATA_RZL_PROGRESS.MAIN_ID;
    progress.innerHTML = this.settings.template;

    const bar = progress.querySelector<HTMLElement>(this.settings.barSelector)!;
    const percent = fromStart
      ? toBarPercent(0, this.settings.direction)
      : toBarPercent(this.status || 0, this.settings.direction);
    const parent =
      typeof this.settings.parent === "string"
        ? document.querySelector<HTMLElement>(this.settings.parent)!
        : this.settings.parent;

    css(bar, {
      transition: "all 0 linear",
      transform: `translate3d(${percent}%,0,0)`
    });

    if (!this.settings.showSpinner) {
      const spinner = progress.querySelector<HTMLElement>(this.settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent !== document.body) addClass(parent, DATA_RZL_PROGRESS.CUSTOM_PARENT);

    parent.appendChild(progress);

    return progress;
  }

  /** * ***Remove `RzlProgress` from the DOM.*** */
  static remove(): void {
    if (isServer()) return;

    removeClass(document.documentElement, DATA_RZL_PROGRESS.ON_BUSY);
    const parent =
      typeof this.settings.parent === "string"
        ? document.querySelector<HTMLElement>(this.settings.parent)
        : this.settings.parent;

    if (parent) removeClass(parent, DATA_RZL_PROGRESS.CUSTOM_PARENT);
    const progress = document.getElementById(DATA_RZL_PROGRESS.MAIN_ID);
    progress && removeElement(progress);
  }

  /** * ***Pause the `RzlProgress`.*** */
  static pause() {
    this.isPaused = true;
    return this;
  }

  /** * ***Resume the `RzlProgress`.*** */
  static resume() {
    this.isPaused = false;
    return this;
  }

  /** * ***Check if `RzlProgress` is rendered in the DOM.*** */
  static isRendered(): boolean {
    if (isServer()) return false;
    return !!document.getElementById(DATA_RZL_PROGRESS.MAIN_ID);
  }

  /** * ***Queue function for animations.*** */
  // eslint-disable-next-line no-unused-vars
  static queue(callback: (next: VoidFunction) => void): void {
    if (isFunction(callback)) {
      this.pending.push(callback);
      if (this.pending.length === 1) this.next();
    }
  }

  /** * ***Determine the `RzlProgress` direction passed.*** */
  static getDirection() {
    return this.settings.direction;
  }

  /** * ***Determine the CSS positioning `RzlProgress` method to use.*** */
  static getPositioningCSS(): "translate3d" | "translate" | "margin" {
    const bodyStyle = document.body.style;
    const vendorPrefix =
      "WebkitTransform" in bodyStyle
        ? "Webkit"
        : "MozTransform" in bodyStyle
          ? "Moz"
          : "msTransform" in bodyStyle
            ? "ms"
            : "OTransform" in bodyStyle
              ? "O"
              : "";
    if (`${vendorPrefix}Perspective` in bodyStyle) {
      return "translate3d";
    } else if (`${vendorPrefix}Transform` in bodyStyle) {
      return "translate";
    } else {
      return "margin";
    }
  }

  /** @internal */
  static getClassNameIfLoading() {
    const { MAIN_IDENTITY, KEY_DATA } = DATA_RZL_PROGRESS.STYLE_ELEMENT;
    if (isServer()) return null;
    const styleElement = document.querySelector<HTMLStyleElement>(
      `style[${MAIN_IDENTITY.KEY}="${MAIN_IDENTITY.VALUE}"]`
    );

    return styleElement?.getAttribute(KEY_DATA.CLASS_NAME_LOADING) || null;
  }

  /** @internal */
  private static next(): void {
    const fn = this.pending.shift();
    if (fn) fn(this.next.bind(this));
  }

  /** @internal */
  private static barPositionCSS(
    n: number,
    speed: number,
    ease: string
  ): Partial<CSSStyleDeclaration> {
    let barCSS: Partial<CSSStyleDeclaration> = {};

    if (this.settings.positionUsing === "translate3d") {
      barCSS = {
        transform: `translate3d(${toBarPercent(n, this.settings.direction)}%,0,0)`
      };
    } else if (this.settings.positionUsing === "translate") {
      barCSS = {
        transform: `translate(${toBarPercent(n, this.settings.direction)}%,0)`
      };
    } else {
      // @ts-expect-error its render in client
      barCSS = { "margin-left": `${toBarPercent(n, this.settings.direction)}%` };
    }

    barCSS.transition = `all ${speed}ms ${ease}`;

    return barCSS;
  }
}
