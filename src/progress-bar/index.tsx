"use client";

import React from "react";

import { RzlNextAppProgressBar } from "./app";
import type { RzlNextProgressBarProps } from "./types/types";

/** ------------------------------------------------------------
 * @deprecated This component has been renamed to **`RzlNextAppProgressBar`**.
 *
 * `RzlNextTopLoader` will be removed in the next release, please update your imports to:
 * ```ts
 * import { RzlNextAppProgressBar } from "@rzl-zone/next-kit/progress-bar/app";
 * ```
 *
 */
export const RzlNextTopLoader = (props: RzlNextProgressBarProps): React.JSX.Element => {
  console.warn(
    "[DEPRECATED] `RzlNextTopLoader` has been renamed to `RzlNextAppProgressBar` and will be removed in the next release, please update your imports to use `RzlNextAppProgressBar` from '@rzl-zone/next-kit/progress-bar/app'."
  );

  return <RzlNextAppProgressBar {...props} />;
};

export {
  startRzlProgress,
  stopRzlProgress,
  isRenderedRzlProgress,
  isStartedRzlProgress,
  pauseRzlProgress,
  resumeRzlProgress
} from "./events/actions";
