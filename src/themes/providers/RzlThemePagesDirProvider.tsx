"use client";

import React from "react";

import type { RzlThemeProviderProps } from "../types";
import ContainerThemePagesDir from "../internals/container/ProviderPagesDir";

/** ------------------------------------------------------------
 * * ***Provider wrapper for configuring and supplying the theme system (Pages Dir).***
 * ------------------------------------------------------------
 * **Usage example in your `pages/_app.tsx`:**
 *
 * ```tsx
 * import { RzlThemePagesDirProvider } from "@rzl-zone/next-kit/themes/pages-dir";
 *
 * export default function MyApp({ Component, pageProps }) {
 *   return (
 *     <>
 *       <RzlThemePagesDirProvider disableTransitionOnChange>
 *         <Component {...pageProps} />
 *       </RzlThemePagesDirProvider>
 *     </>
 *   );
 * };
 * ```
 * ---
 * - **ℹ️ Tip ***(Recommended)***:**
 *    - If you pass custom themes (e.g. `themes={["pink","blue"]}`) to provider,
 *      remember to add a corresponding override for type-safety:
 *      ```ts
 *
 *      import "@rzl-zone/next-kit/themes/pages-dir";
 *
 *      declare module "@rzl-zone/next-kit/themes/pages-dir" {
 *        interface ThemeOverrideConfig {
 *          themes: ["pink", "blue"]; // or themes?: [...];
 *        }
 *      }
 *      ```
 * @param props - Property options of `RzlThemePagesDirProvider`.
 * @throws Will throw an error if `children` is not provided.
 * @returns A `<RzlThemePagesDirProvider>` wrapping the passed children.
 */
export const RzlThemePagesDirProvider = <EnablingSystem extends boolean = true>(
  props: RzlThemeProviderProps<EnablingSystem>
): React.JSX.Element => {
  return (
    <ContainerThemePagesDir<EnablingSystem> {...props}>
      {props.children}
    </ContainerThemePagesDir>
  );
};
