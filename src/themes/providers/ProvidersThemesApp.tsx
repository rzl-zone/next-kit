import React from "react";

import { CONFIG_THEME } from "../configs";
import InternalThemeProvider from "./InternalThemeProvider";

import type { ThemeProviderProps } from "../types";
import { assertIsPlainObject } from "@rzl-zone/utils-js/assertions";
import { isReactNode } from "@/_private/reactNode";

/** ------------------------------------------------------------
 * * ***Provider wrapper for configuring and supplying the theme system.***
 * ------------------------------------------------------------
 * **Usage example in your `layout.tsx`:**
 *
 * ```tsx
 * import { ProvidersThemesApp } from "@/themes";
 *
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <ProvidersThemesApp themes={["pink", "blue"]}>
 *           {children}
 *         </ProvidersThemesApp>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * *Any props you pass (e.g. `themes`, `defaultTheme`, etc) will override the default config.*
 *
 * Default `CONFIG_THEME`:
 * ```ts
 * const CONFIG_THEME = {
 *   attribute: "data-theme",
 *   storageKey: "rzl-theme",
 *   themes: ["dark", "light", "system"] as const,
 *   enableSystem: true,
 *   forcedTheme: undefined,
 *   defaultTheme: undefined,
 *   enableColorScheme: false,
 *   enableMetaColorScheme: false,
 *   disableTransitionOnChange: true
 * }
 * ```
 *
 * - **ℹ️ Tip:**
 *    - If you pass custom themes (e.g. `themes={["pink","blue"]}`),
 *      remember to add a corresponding override for type-safety:
 * ```ts
 * import "@rzl-zone/next-kit/themes";
 *
 * declare module "@rzl-zone/next-kit/themes" {
 *   interface ThemeOverrideConfig {
 *     themes: ["pink", "blue"]; // or themes?: [...];
 *   }
 * }
 * ```
 * @param props - Props that extend / override the default `CONFIG_THEME`.
 * @throws Will throw an error if `children` is not provided.
 * @returns A `<ThemeProvider>` wrapping the passed children.
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

  const config = { ...CONFIG_THEME, ..._restProps };

  return <InternalThemeProvider {...config}>{children}</InternalThemeProvider>;
};
