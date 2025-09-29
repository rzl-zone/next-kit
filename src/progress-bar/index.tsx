"use client";

import type { RzlNextProgressBarProps } from "./types/types";

import { WithSuspense } from "@/hoc";

export { useRouter } from "./hooks";
import InitNextProgressBarComponent from "./components";

/** ------------------------------------------------------------------
 * * ***Component: `RzlNextTopLoader`.***
 * ------------------------------------------------------------------
 * **A top progress bar loader for Next.js apps**.
 *
 * This component wraps with `WithSuspense` to support
 * Suspense rendering.
 *
 * - **Features**:
 *    - Shows a progress bar at the top of the page.
 *    - Can be configured via `RzlNextProgressBarProps`.
 *    - Supports Suspense and lazy loading.
 *    - Fully compatible with client-side navigation in Next.js.
 *
 * @param {RzlNextProgressBarProps} props - The properties to configure the loader.
 * @param {string} [props.classNameIfLoading] - Optional class applied when loading.
 * @param {RzlProgressType} [props.optionsProgressBar] - Configuration object for the progress bar.
 * @param {boolean} [props.withDisableAnyAction=true] - Disable all user interaction while loading.
 * @param {boolean} [props.withRemoveAllFocusElement=true] - Remove focus from all active elements.
 * @param {object} [props.withStopDelay] - Optional delay configuration to automatically stop the progress.
 * @param {boolean} [props.withStopDelay.enable=false] - Enable auto-stop after a delay.
 * @param {number} [props.withStopDelay.delayStop=1000] - Delay duration in milliseconds.
 *
 * @returns {React.JSX.Element} Returns the `RzlNextTopLoader` React element.
 *
 * @example
 * * Basic usage:
 * ```tsx
 * import { RzlNextTopLoader } from "@rzl-zone/next-kit/progress-bar";
 *
 * export default function Layout({ children }: React.ReactNode) {
 *   return (
 *     <html>
 *       <body>
 *          <RzlNextTopLoader />
 *          {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export const RzlNextTopLoader = WithSuspense<RzlNextProgressBarProps>(
  InitNextProgressBarComponent
);

export {
  startRzlProgress,
  stopRzlProgress,
  isRenderedRzlProgress,
  isStartedRzlProgress,
  pauseRzlProgress,
  resumeRzlProgress
} from "./events/actions";
