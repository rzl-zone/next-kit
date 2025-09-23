import type { RzlNextTopLoaderProps } from "./types/types";

import { WithSuspense } from "@/hoc";
import InitNextTopLoaderComponent from "./components";

/** ------------------------------------------------------------------
 * * ***Component: `RzlNextTopLoader`.***
 * ------------------------------------------------------------------
 *
 * @param {RzlNextTopLoaderProps} props The properties to configure NextTopLoader.
 *
 * @description If you using React 19 and Turning On `reactCompiler`, it will be Automatic using Memoize Component, otherwise do `React.memo` by you'r self.
 * @returns {React.JSX.Element}
 *
 */
export const RzlNextTopLoader = WithSuspense<RzlNextTopLoaderProps>(
  InitNextTopLoaderComponent
);
