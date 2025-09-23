import { NProgress } from "../utils/progress";

import {
  enableUserInteraction,
  disableUserInteraction,
  removeElementFocus
} from "@rzl-zone/utils-js/events";

import { defaultOptionsTopsLoader } from "../constants";

import type { NProgressType } from "../types/types";

type StartNProgressProps = {
  /** * Disabled and prevent any actions.
   *
   * @default true
   */
  withDisableAnyAction?: boolean;
  /** * Remove focus (blur) from all element actions.
   *
   * @default true
   */
  withRemoveAllFocusElement?: boolean;
  optionsProgressBar?: NProgressType;
  withStopDelay?: {
    /** @default false */
    activate?: boolean;
    /** @default 1000 */
    delayStop?: number;
  };
};

/** * Starting loader on top page. */
export const startNProgress = ({
  withDisableAnyAction = true,
  optionsProgressBar = defaultOptionsTopsLoader,
  withStopDelay,
  withRemoveAllFocusElement = true
}: StartNProgressProps = {}) => {
  const { activate = false, delayStop = 1000 } = withStopDelay || {};
  let timeOut: NodeJS.Timeout | null = null;

  if (!NProgress.isRendered() || !NProgress.isStarted()) {
    NProgress.configure(optionsProgressBar);

    if (withRemoveAllFocusElement) {
      removeElementFocus();
    }

    if (withDisableAnyAction) {
      disableUserInteraction();
    }

    NProgress.start();

    if (activate) {
      if (timeOut) clearTimeout(timeOut);

      timeOut = setTimeout(() => {
        stopNProgress();
      }, delayStop);
    }
  }

  // ✅ return stop function
  return (forceStop?: boolean) => {
    if (timeOut) clearTimeout(timeOut);

    if (forceStop) stopNProgress();
  };
};

type StopNProgressProps = {
  /** @default false */
  force?: boolean;
};

/** * Stopping loader on top page. */
export const stopNProgress = ({ force }: StopNProgressProps = {}) => {
  if (NProgress.isRendered() || NProgress.isStarted()) {
    NProgress.done(force);
  }

  enableUserInteraction();
};
