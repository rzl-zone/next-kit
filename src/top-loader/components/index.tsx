"use client";

import { EffectCallback, memo, useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  isBoolean,
  isInteger,
  isPlainObject,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { delay as delaying } from "@rzl-zone/utils-js/promises";
import { disableUserInteraction, enableUserInteraction } from "@rzl-zone/utils-js/events";

import {
  DATA_ATTRIBUTE,
  defaultPropsInitInitRzlNextTopLoader,
  SETTING_CONFIGS_TOP_LOADER
} from "../constants";
import { useCssTopLoader } from "../hooks/useCssTopLoader";
import { NProgress, isValidEasingValue } from "../utils/progress";

import type { RzlNextTopLoaderProps } from "../types/types";

const defaultProps = defaultPropsInitInitRzlNextTopLoader;
const ComponentInitRzlNextTopLoader = (props: RzlNextTopLoaderProps = defaultProps) => {
  if (!isPlainObject(props)) props = {};
  let {
    colorSpinner,
    classNameIfLoading = defaultProps.classNameIfLoading,
    spinnerSpeed = defaultProps.spinnerSpeed,
    spinnerSize = defaultProps.spinnerSize,
    spinnerEase = defaultProps.spinnerEase,
    color = defaultProps.color,
    height = defaultProps.height,
    zIndex = defaultProps.zIndex,
    showAtBottom = defaultProps.showAtBottom,
    startPosition = defaultProps.startPosition,
    delay = defaultProps.delay,
    stopDelay = defaultProps.stopDelay,
    showForHashAnchor = defaultProps.showForHashAnchor,
    options = defaultProps.options
  } = props;

  let { id, name, nonce, style } = props;

  if (!isUndefined(id) && !isString(id)) id = undefined;
  if (!isUndefined(name) && !isString(name)) name = undefined;
  if (!isUndefined(nonce) && !isString(nonce)) nonce = undefined;
  if (!isUndefined(style) && !isString(style)) style = undefined;

  if (!isUndefined(classNameIfLoading) && !isString(classNameIfLoading))
    classNameIfLoading = defaultProps.classNameIfLoading;

  if (
    !isUndefined(colorSpinner) &&
    (!isPlainObject(colorSpinner) ||
      (colorSpinner.type !== "base" && colorSpinner.type !== "hex") ||
      (colorSpinner.type === "base" &&
        !isUndefined(colorSpinner.ValueBase) &&
        !isString(colorSpinner.ValueBase)) ||
      (colorSpinner.type === "hex" &&
        !isUndefined(colorSpinner.ValueHex) &&
        !isString(colorSpinner.ValueHex)))
  ) {
    colorSpinner = undefined;
  }

  if (!isInteger(spinnerSpeed)) spinnerSpeed = defaultProps.spinnerSpeed;
  if (!isString(spinnerSize)) spinnerSize = defaultProps.spinnerSize;
  if (!isValidEasingValue(spinnerEase)) spinnerEase = defaultProps.spinnerEase;
  if (!isString(color)) color = defaultProps.color;
  if (!isString(height)) height = defaultProps.height;
  if (!isInteger(zIndex)) zIndex = defaultProps.zIndex;
  if (!isBoolean(showAtBottom)) showAtBottom = defaultProps.showAtBottom;
  if (!isInteger(startPosition)) startPosition = defaultProps.startPosition;
  if (!isInteger(delay)) delay = defaultProps.delay;
  if (!isInteger(stopDelay)) stopDelay = defaultProps.stopDelay;
  if (!isBoolean(showForHashAnchor)) showForHashAnchor = defaultProps.showForHashAnchor;
  if (!isPlainObject(options)) options = defaultProps.options;

  const {
    FORM,
    BUTTON_SUBMIT,
    IS_BTN_SUBMIT_NPROGRESS,
    CHILD_BUTTON_SUBMIT,
    IS_CHILD_BTN_SUBMIT_NPROGRESS,
    IS_VALID_BTN_SUBMIT_NPROGRESS,
    IS_PREVENT_NPROGRESS
  } = DATA_ATTRIBUTE;
  const { MAXIMUM_COUNT_LIMIT_INTERVAL } = SETTING_CONFIGS_TOP_LOADER;
  const { IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION, IS_METHOD_POST_FORM } = FORM;

  let timer: NodeJS.Timeout | number = 0;
  const searchCounting = useRef<number>(1);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useCssTopLoader({
    id,
    name,
    nonce,
    style,
    color,
    height,
    colorSpinner,
    spinnerEase,
    zIndex,
    spinnerSize,
    spinnerSpeed,
    showAtBottom
  });

  /** * Convert the url to Absolute URL based on the current window location.
   *
   * @param url {string}
   * @returns {string}
   */
  const toAbsoluteURL = (url: string): string => {
    return new URL(url, window.location.href).href;
  };

  /** * Check if it is hash anchor or same page anchor
   *
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isHashAnchor = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.href.split("#")[0] === next.href.split("#")[0];
  };

  /** * Check if it is Same Host name
   *
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isSameHostName = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.hostname.replace(/^www\./, "") === next.hostname.replace(/^www\./, "");
  };

  const startProgress = useCallback(
    async (withDelay = true) => {
      if (!isBoolean(withDelay)) withDelay = true;
      if (NProgress.isStarted() || NProgress.isRendered()) return;

      NProgress.configure(options);

      timer = setTimeout(
        async () => {
          if (startPosition > 0) NProgress.set(startPosition);

          NProgress.start();
          disableUserInteraction(classNameIfLoading);
        },
        withDelay ? delay : 1
      );
    },
    [options]
  );

  const stopProgress = useCallback(
    async (
      /** @default true */
      withDelay = true,
      /** @default false */
      force?: boolean
    ) => {
      if (!isBoolean(withDelay)) withDelay = true;
      if (!isBoolean(force)) force = false;

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(
        async () => {
          enableUserInteraction(classNameIfLoading);

          if (!(NProgress.isStarted() || NProgress.isRendered())) return;

          NProgress.done(force);
        },
        withDelay ? stopDelay : 1
      );

      NProgress.configure(options);
    },
    [options]
  );

  // const showingInitial = useCallback(async () => {
  //   if (showProgressOnInitial?.enabled) {
  //     await startProgress();
  //     await delaying(showProgressOnInitial.delay);
  //     await stopProgress();
  //     console.debug({ test: 123 });
  //   }
  // }, []);

  const setNestedAttribute = useCallback(
    (
      node: ChildNode | Element,
      type: "delete" | "add",
      attr: { qualifiedName: string; value: string }
    ) => {
      if (node.childNodes.length && node instanceof Element && node.children.length) {
        node.childNodes.forEach((child) => {
          if (child.nodeName === "#text") return;
          if (node instanceof Element) {
            if (type === "add") {
              node.setAttribute(CHILD_BUTTON_SUBMIT, "true");
            } else {
              node.removeAttribute(CHILD_BUTTON_SUBMIT);
            }
          }

          setNestedAttribute(child, type, attr);
        });
      } else {
        if (node instanceof Element) {
          if (type === "add") {
            node.setAttribute(CHILD_BUTTON_SUBMIT, "true");
          } else {
            node.removeAttribute(CHILD_BUTTON_SUBMIT);
          }
        }
      }
    },
    []
  );

  const setAttrChildSubmitBtn = useCallback(
    (docs: Document, type: "delete" | "add" = "add") => {
      docs?.querySelectorAll("button")?.forEach((doc) => {
        if (
          doc.type === "submit" &&
          IS_BTN_SUBMIT_NPROGRESS(doc) &&
          (IS_METHOD_POST_FORM(doc.form) ||
            IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(doc.form))
        )
          doc.childNodes.forEach((e) => {
            setNestedAttribute(e, type, {
              value: "true",
              qualifiedName: CHILD_BUTTON_SUBMIT
            });
          });
      });
    },
    []
  );

  useEffect(() => {
    stopProgress();
  }, [pathname, searchParams]);

  useEffect(() => {
    const actionsIdTimeInterval: NodeJS.Timeout | undefined = setInterval(() => {
      if (searchCounting.current < MAXIMUM_COUNT_LIMIT_INTERVAL) {
        if (document.querySelectorAll(`[${BUTTON_SUBMIT}]`).length) {
          document.querySelectorAll(`[${BUTTON_SUBMIT}]`)?.forEach((button) => {
            if (IS_VALID_BTN_SUBMIT_NPROGRESS(button)) {
              const isBtnSubmitFormValid =
                button.form &&
                (IS_METHOD_POST_FORM(button.form) ||
                  IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(button.form));

              if (isBtnSubmitFormValid) {
                setAttrChildSubmitBtn(document);

                searchCounting.current = MAXIMUM_COUNT_LIMIT_INTERVAL;

                return clearInterval(actionsIdTimeInterval);
              } else {
                return (searchCounting.current = searchCounting.current + 1);
              }
            }
          });
        } else {
          return (searchCounting.current = searchCounting.current + 1);
        }
      } else {
        searchCounting.current = MAXIMUM_COUNT_LIMIT_INTERVAL;
        return clearInterval(actionsIdTimeInterval);
      }
    }, 50);

    return () => {
      if (actionsIdTimeInterval) {
        clearInterval(actionsIdTimeInterval);
      }

      searchCounting.current = 1;
    };
  }, [pathname, searchParams]);

  /** * ref for start initial loader only */
  // useEffect(() => {
  //   showingInitial();
  // }, []);

  useEffect((): ReturnType<EffectCallback> => {
    /** * Check if the Current Url is same as New Url
     *
     * @param currentUrl {string}
     * @param newUrl {string}
     * @returns {boolean}
     */
    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string): boolean {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      // Compare hostname, pathname, and search parameters
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        // Check if the new URL is just an anchor of the current URL page
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return (
          currentHash !== newHash &&
          currentUrlObj.href.replace(currentHash, "") ===
            newUrlObj.href.replace(newHash, "")
        );
      }
      return false;
    }

    // deno-lint-ignore no-var
    const nProgressClass: NodeListOf<HTMLHtmlElement> = document.querySelectorAll("html");

    const removeNProgressClass = (): void =>
      nProgressClass.forEach((el: Element) => el.classList.remove("nprogress-busy"));

    /** * Find the closest anchor to trigger
     *
     * @param element {HTMLElement | null}
     * @returns element {Element}
     */
    function findClosestAnchor(element: HTMLElement | null): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== "a") {
        element = element.parentElement;
      }
      return element as HTMLAnchorElement;
    }

    /** * ClickHandler To Trigger NProgress
     *
     * @param event {MouseEvent}
     * @returns {void}
     */
    async function handleClick(event: MouseEvent): Promise<void> {
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);
        const newUrl = anchor?.href;

        let preventProgress =
          IS_PREVENT_NPROGRESS(target) || IS_PREVENT_NPROGRESS(anchor);

        let isButtonSubmitForm = IS_BTN_SUBMIT_NPROGRESS(target);
        let isButtonChildSubmitForm = IS_CHILD_BTN_SUBMIT_NPROGRESS(target);

        if (!preventProgress || !isButtonSubmitForm) {
          let element: HTMLButtonElement | HTMLElement | Element | null = target;

          if (isButtonSubmitForm && IS_VALID_BTN_SUBMIT_NPROGRESS(element)) {
            const isBtnSubmitForm =
              IS_METHOD_POST_FORM(element.form) ||
              IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(element.form);

            while (element) {
              if (isBtnSubmitForm) {
                preventProgress = false;
                isButtonSubmitForm = true;
                break;
              } else {
                preventProgress = true;
                isButtonSubmitForm = false;

                element = element.parentElement as unknown as HTMLButtonElement;
              }
            }
          } else {
            if (element.hasAttribute(DATA_ATTRIBUTE.CHILD_BUTTON_SUBMIT)) {
              while (element && element.tagName.toLowerCase() !== "a") {
                if (IS_BTN_SUBMIT_NPROGRESS(element.parentElement)) {
                  if (
                    element.parentElement instanceof HTMLButtonElement &&
                    (IS_METHOD_POST_FORM(element.parentElement.form) ||
                      IS_AUTO_GENERATE_ERROR_NEXTJS_SERVER_ACTION(
                        element.parentElement.form
                      ))
                  ) {
                    preventProgress = false;
                    isButtonSubmitForm = true;
                    isButtonChildSubmitForm = true;
                    break;
                  } else {
                    preventProgress = true;
                    isButtonSubmitForm = false;
                    // eslint-disable-next-line no-unused-vars
                    isButtonChildSubmitForm = false;
                    break;
                  }
                }
                element = element.parentElement;
              }
            } else {
              while (element && element.tagName.toLowerCase() !== "a") {
                if (IS_PREVENT_NPROGRESS(element.parentElement)) {
                  preventProgress = true;
                  break;
                }
                element = element.parentElement;
              }
            }
          }
        }

        if (preventProgress) return;

        // if ((isButtonSubmitForm || isButtonChildSubmitForm) && !newUrl) {
        //   await startProgress();
        //   await delaying(30000);
        //   return await stopProgress();
        // }

        if (newUrl && isString(newUrl)) {
          const currentUrl = window.location.href;
          const isExternalLink = anchor.target === "_blank";

          // Check for Special Schemes
          const isSpecialScheme = ["tel:", "mailto:", "sms:", "blob:", "download:"].some(
            (scheme) => newUrl.startsWith(scheme)
          );

          const notSameHost = !isSameHostName(window.location.href, anchor.href);
          if (notSameHost) {
            return;
          }

          const isAnchorOrHashAnchor =
            isAnchorOfCurrentUrl(currentUrl, newUrl) ||
            isHashAnchor(window.location.href, anchor.href);
          if (!showForHashAnchor && isAnchorOrHashAnchor) {
            return;
          }

          if (
            newUrl === currentUrl ||
            isExternalLink ||
            isSpecialScheme ||
            isAnchorOrHashAnchor ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            !toAbsoluteURL(anchor.href).startsWith("http")
          ) {
            await startProgress();
            await delaying(100);
            await stopProgress();
          } else {
            await startProgress();
          }
        }
      } catch (err) {
        // Log the error in development only!
        if (process.env["NODE_ENV"] === "development") {
          console.error("NextTopLoader error: ", err);
        }

        await startProgress();
        await stopProgress();
      } finally {
        // setAttrChildSubmitBtn(document, "delete");
      }
    }

    /** * Complete TopLoader Progress on adding new entry to history stack
     *
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const pushState = history.pushState;
      history.pushState = async (...args) => {
        await stopProgress();

        removeNProgressClass();

        setAttrChildSubmitBtn(document);
        return pushState.apply(history, args);
      };
    })((window as Window).history);

    /** * Complete TopLoader Progress on replacing current entry of history
     * stack
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const replaceState = history.replaceState;
      history.replaceState = async (...args) => {
        await stopProgress();

        removeNProgressClass();

        setAttrChildSubmitBtn(document);
        return replaceState.apply(history, args);
      };
    })((window as Window).history);

    async function handlePageHide() {
      await stopProgress();
      removeNProgressClass();
    }

    /** * Handle Browser Back and Forth Navigation  */
    async function handleBackAndForth() {
      await stopProgress();

      setAttrChildSubmitBtn(document);
    }

    // Add the global click event listener
    document.addEventListener("click", handleClick);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("popstate", handleBackAndForth);

    // Clean up the global click event listener when the component is unmounted
    return () => {
      if (timer) {
        clearTimeout(timer);
      }

      document.removeEventListener("click", handleClick);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("popstate", handleBackAndForth);
    };
  }, []);

  // No need to return anything since the style is applied directly
  return null;
};

/** ------------------------------------------------------------------
 * * ***Don't use import from here, because need Suspense.***
 * ------------------------------------------------------------------
 * **If you forcing to use from this components, you need wrapping with Suspense.**
 *
 *  @deprecated `Import { NextTopLoader } from "@rzl-zone/next-kit/top-loader"` instead, because include `WithSuspense` in there.
 */
const InitNextTopLoaderComponent = memo(ComponentInitRzlNextTopLoader);
export default InitNextTopLoaderComponent;
