"use client";

import { NProgress } from "../utils/progress";
import { useRouter as useNextRouter } from "next/navigation";

import { delay } from "@rzl-zone/utils-js/promises";
import { enableUserInteraction, disableUserInteraction } from "@rzl-zone/utils-js/events";

import { defaultOptionsTopsLoader } from "../constants";
import { useTopLoaderRouterWithEnhanced } from "./useTopLoaderRouterWithEnhanced";

import type {
  OptionsUseRouter,
  UseAppRouterInstance,
  NavigateOptionsUseRouter,
  NavigateFwdOptionsUseRouter
} from "../types/types";
import { isInteger, isPlainObject } from "@rzl-zone/utils-js/predicates";
import { assertIsBoolean, assertIsString } from "@rzl-zone/utils-js/assertions";
import { useCallback } from "react";

/** ------------------------------------------------------------------
 * * ***Custom useRouter hook to work with NextTopLoader, Compatible with app router only***.
 * ------------------------------------------------------------------
 * @param {boolean} withEnhanced - **Enhanced memory of useRouter() hook, defaultValue: `true`.**
 */
export const useRouter = (withEnhanced: boolean = true): UseAppRouterInstance => {
  assertIsBoolean(withEnhanced, {
    message: ({ currentType, validType }) => {
      return `Props \`withEnhanced\` expected ${validType} but received (${currentType}).`;
    }
  });

  const router = useNextRouter();

  const startProgress = useCallback(
    ({
      disableProgressBar = false,
      disablePreventAnyAction = false,
      options = defaultOptionsTopsLoader
    }: NavigateOptionsUseRouter = {}) => {
      if (!isPlainObject(options)) options = defaultOptionsTopsLoader;

      const { startPosition, ...restNpOptions } = options;

      assertIsBoolean(disableProgressBar, {
        message: ({ currentType, validType }) => {
          return `Props \`disableProgressBar\` expected ${validType} but received (${currentType}).`;
        }
      });
      assertIsBoolean(disablePreventAnyAction, {
        message: ({ currentType, validType }) => {
          return `Props \`disablePreventAnyAction\` expected ${validType} but received (${currentType}).`;
        }
      });

      if (!disableProgressBar && !NProgress.isStarted() && !NProgress.isRendered()) {
        NProgress.configure(restNpOptions);

        if (startPosition && startPosition > 0) {
          NProgress.set(startPosition);
        }

        if (!disablePreventAnyAction) {
          disableUserInteraction();
        }

        NProgress.start();
      }
    },
    [router]
  );

  const stopProgress = useCallback(() => {
    enableUserInteraction();

    if (!NProgress.isStarted() || !NProgress.isRendered()) return;

    NProgress.done();
  }, []);

  const replace = useCallback(
    (href: string, options?: NavigateOptionsUseRouter) => {
      assertIsString(href, {
        message: ({ currentType, validType }) => {
          return `Props \`href\` expected ${validType} but received (${currentType}).`;
        }
      });

      if (!isPlainObject(options)) {
        options = { scroll: true, options: defaultOptionsTopsLoader };
      }

      startProgress(options);

      router.replace(href, { ...options });
    },
    [router]
  );

  const push = useCallback(
    (href: string, options?: NavigateOptionsUseRouter) => {
      assertIsString(href, {
        message: ({ currentType, validType }) => {
          return `Props \`href\` expected ${validType} but received (${currentType}).`;
        }
      });

      if (!isPlainObject(options)) {
        options = { scroll: true, options: defaultOptionsTopsLoader };
      }

      startProgress(options);

      router.push(href, { ...options });
    },
    [router]
  );

  const back = useCallback(
    (options?: OptionsUseRouter) => {
      if (!isPlainObject(options)) {
        options = { options: defaultOptionsTopsLoader };
      }

      startProgress(options);

      router.back();
    },
    [router]
  );

  const refresh = useCallback(
    (options?: OptionsUseRouter) => {
      if (!isPlainObject(options)) {
        options = { options: defaultOptionsTopsLoader };
      }

      startProgress(options);

      router.refresh();
    },
    [router]
  );

  const forward = useCallback(
    async (options?: NavigateFwdOptionsUseRouter) => {
      if (!isPlainObject(options)) {
        options = { options: defaultOptionsTopsLoader };
      }

      let { delayStops = 100 } = options;

      if (!isInteger(delayStops)) delayStops = 100;

      startProgress(options);

      router.forward();

      await delay(delayStops);
      stopProgress();
    },
    [router]
  );

  if (withEnhanced) {
    return useTopLoaderRouterWithEnhanced({
      ...router,
      push,
      replace,
      back,
      refresh,
      forward
    });
  }

  return { ...router, push, replace, back, refresh, forward };
};
