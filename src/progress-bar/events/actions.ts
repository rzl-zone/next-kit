import {
  enableUserInteraction,
  disableUserInteraction,
  removeElementFocus
} from "@rzl-zone/utils-js/events";
import { isBoolean, isNumber, isPlainObject } from "@rzl-zone/utils-js/predicates";

import { RzlProgress } from "../utils/rzlProgress";
import { defaultOptionsProgressBar } from "../constants";

import type { RzlProgressType } from "../types/types";

type StartRzlProgressProps = {
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
  optionsProgressBar?: RzlProgressType;
  withStopDelay?: {
    /** @default false */
    enable?: boolean;
    /** @default 1000 */
    delayStop?: number;
  };
};

type StopRzlProgressProps = {
  /** @default false */
  force?: boolean;
};

const defaultWithStopDelay = {
  enable: false,
  delayStop: 1000
} as const satisfies Required<StartRzlProgressProps["withStopDelay"]>;

/** * Starting progress bar loader on top page. */
export const startRzlProgress = (props: StartRzlProgressProps = {}) => {
  if (!isPlainObject(props)) props = {};

  const {
    withDisableAnyAction = true,
    optionsProgressBar = defaultOptionsProgressBar,
    withRemoveAllFocusElement = true
  } = props;

  let { withStopDelay = defaultWithStopDelay } = props;

  if (!isPlainObject(props)) withStopDelay = defaultWithStopDelay;
  let { delayStop, enable } = withStopDelay;

  if (!isBoolean(enable)) enable = defaultWithStopDelay.enable;
  if (!isNumber(delayStop)) delayStop = defaultWithStopDelay.delayStop;

  let timeOut: NodeJS.Timeout | null = null;

  if (!RzlProgress.isRendered() || !RzlProgress.isStarted()) {
    RzlProgress.configure(optionsProgressBar);

    if (withRemoveAllFocusElement) {
      removeElementFocus();
    }

    if (withDisableAnyAction) {
      disableUserInteraction();
    }

    RzlProgress.start();

    if (enable) {
      if (timeOut) clearTimeout(timeOut);

      timeOut = setTimeout(() => {
        stopRzlProgress();
      }, delayStop);
    }
  }

  // ✅ return stop function
  return (forceStop?: boolean) => {
    if (timeOut) clearTimeout(timeOut);

    if (forceStop) stopRzlProgress();
  };
};

/** * Stopping progress bar loader on top page. */
export const stopRzlProgress = ({ force }: StopRzlProgressProps = {}) => {
  if (RzlProgress.isRendered() || RzlProgress.isStarted()) {
    RzlProgress.done(force);
  }

  enableUserInteraction();
};
