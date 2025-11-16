import React from "react";
import { assertIsPlainObject } from "@rzl-zone/utils-js/assertions";

import { isReactNode } from "@/utils/reactNode";
import InternalThemeProvider from "./InternalThemeProvider";

import type { ThemeProviderProps } from "../types";

/** ------------------------------------------------------------
 * * ***Provider wrapper for configuring and supplying the theme system.***
 * ------------------------------------------------------------
 * **Usage example in your `layout.tsx`:**
 *
 * ```tsx
 * import { ProvidersThemesApp } from "@rzl-zone/next-kit/themes";
 *
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <ProvidersThemesApp themes={["pink", "blue"]}>
 *           {children}
 *         </ProvidersThemesApp>
 *       </body>
 *     </html>
 *   );
 * };
 * ```
 * ---
 * - **ℹ️ Tip ***(Recommended)***:**
 *    - If you pass custom themes (e.g. `themes={["pink","blue"]}`),
 *      remember to add a corresponding override for type-safety:
 *      ```ts
 *
 *      import "@rzl-zone/next-kit/themes";
 *
 *      declare module "@rzl-zone/next-kit/themes" {
 *        interface ThemeOverrideConfig {
 *          themes: ["pink", "blue"]; // or themes?: [...];
 *        }
 *      }
 *      ```
 * @param props - Property options of `ProvidersThemesApp`.
 * @throws Will throw an error if `children` is not provided.
 * @returns A `<ProvidersThemesApp>` wrapping the passed children.
 */
export const ProvidersThemesApp = (props: ThemeProviderProps) => {
  assertIsPlainObject(props, {
    message({ currentType, validType }) {
      return `Props 'ProvidersThemesApp' must be of type \`${currentType}\` as types 'ThemeProviderProps', but received: \`${validType}\`.`;
    }
  });

  const { children, ..._restProps } = props;
  if (!isReactNode(children))
    throw new Error("Props children is required as ReactNode type!!!");

  const config = { ..._restProps };

  return <InternalThemeProvider {...config}>{children}</InternalThemeProvider>;
};
