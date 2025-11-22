"use client";

import React from "react";
import ContainerThemeAppDir from "../internals/container/ProviderAppDir";

import type { RzlThemeProviderProps } from "../types";

/** ------------------------------------------------------------
 * * ***Provider wrapper for configuring and supplying the theme system (App Dir).***
 * ------------------------------------------------------------
 * **Usage example in your `app/layout.tsx`:**
 *
 * ```tsx
 * import { RzlThemeProvider } from "@rzl-zone/next-kit/themes";
 *
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <RzlThemeProvider disableTransitionOnChange>
 *           {children}
 *         </RzlThemeProvider>
 *       </body>
 *     </html>
 *   );
 * };
 * ```
 * ---
 * - **ℹ️ Tip ***(Recommended)***:**
 *    - If you pass custom themes (e.g. `themes={["pink","blue"]}`) to provider,
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
 * @param props - Property options of `RzlThemeProvider`.
 * @throws Will throw an error if `children` is not provided.
 * @returns A `<RzlThemeProvider>` wrapping the passed children.
 */
export const RzlThemeProvider = <EnablingSystem extends boolean = true>(
  props: RzlThemeProviderProps<EnablingSystem>
): React.JSX.Element => {
  return (
    <ContainerThemeAppDir<EnablingSystem> {...props}>
      {props.children}
    </ContainerThemeAppDir>
  );
};

/** ------------------------------------------------------------
 * @deprecated This component has been renamed to {@link RzlThemeProvider | **`RzlThemeProvider`**}, **`ProvidersThemesApp`** will be removed in the next release, please update your imports to use ***`RzlThemeProvider`*** from `"@rzl-zone/next-kit/themes"` instead.
 */
export const ProvidersThemesApp = RzlThemeProvider;
