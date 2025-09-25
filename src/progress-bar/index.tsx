"use client";

import type { RzlNextProgressBarProps } from "./types/types";

import { WithSuspense } from "@/hoc";

export { useRouter } from "./hooks";
import InitNextProgressBarComponent from "./components";

/** ------------------------------------------------------------------
 * * ***Component: `RzlNextTopLoader`.***
 * ------------------------------------------------------------------
 *
 * @param {RzlNextProgressBarProps} props The properties to configure NextTopLoader.
 *
 * @description If you using React 19 and Turning On `reactCompiler`, it will be Automatic using Memoize Component, otherwise do `React.memo` by you'r self.
 * @returns {React.JSX.Element}
 *
 */
export const RzlNextTopLoader = WithSuspense<RzlNextProgressBarProps>(
  InitNextProgressBarComponent
);

export { startRzlProgress, stopRzlProgress } from "./events/actions";
