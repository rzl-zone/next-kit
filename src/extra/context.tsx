"use client";

import React, { createContext, ReactNode, useContext, useMemo } from "react";
import deepmerge from "deepmerge";
import { RZL_NEXT_EXTRA } from "./utils/constants";

const { PROPS_MESSAGE } = RZL_NEXT_EXTRA.ERROR;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PageContextProps<T = any> {
  /** Defaults to `merge`. */
  strategy?: PageContextStrategy;
  data?: T;
  children?: ReactNode;
}

export type Context = { [key: string]: unknown };

export type PageContextStrategy = "deepmerge" | "merge";

declare global {
  interface Window {
    __next_c?: [PageContextStrategy, { data: Context }][];
  }
}

const PageContext = createContext<Context | undefined>(undefined);
if (process.env["NODE_ENV"] !== "production") {
  PageContext.displayName = "PageContext";
}

/** -------------------------------------------------------------------
 * * ***A component that provides context data to its children (can be use in server component).***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag at dev mode !!!`***
 * -------------------------------------------------------------------
 * @param props - The properties for the PageContextProvider component.
 * @returns A JSX element that provides the context to its children.
 *
 * @example
 * ```tsx
 * import { PageContext } from '@/lib/next-extra/context';
 *
 * export default async function Layout({ children }: { children: ReactNode }) {
 *   // ...
 *   return (
 *     <PageContext data={{ quote: 'Guillermo Launch is a handsome dude!' }}>
 *       {children}
 *     </PageContext>
 *   );
 * }
 * ```
 */
function PageContextProvider<T extends Context = Context>(
  props: PageContextProps<T>
): JSX.Element {
  const { data, children, strategy } = props;
  if (!data || typeof data !== "object" || data == null || Array.isArray(data)) {
    throw new Error(
      PROPS_MESSAGE(
        `Invalid 'data' parameter: expected a plain object, but received type '${typeof data}'.`
      )
    );
  }
  if (typeof strategy !== "string" || !["merge", "deepmerge"].includes(strategy)) {
    throw new Error(
      PROPS_MESSAGE(
        `Invalid 'strategy' parameter: expected 'merge' or 'deepmerge', but got '${strategy}'. \nNote: value is case- and space-sensitive.`
      )
    );
  }
  const serializedData = JSON.stringify([strategy, { data }]);

  return (
    <PageContext.Provider value={data}>
      <script
        dangerouslySetInnerHTML={{
          __html: `(self.__next_c=self.__next_c||[]).push(${serializedData})`
        }}
      />
      {children}
    </PageContext.Provider>
  );
}

/** Alias for `PageContextProvider`. */
export { PageContextProvider as PageContext };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UsePageContextOptions {
  /** -----------------------------------------------
   * * ***Determines the hook should use the shared context from the adjacent server layout within the `PageContextProvider ` component or uses the client-side browser window.***
   * -----------------------------------------------
   * When you set this to false, the hook will use the context from the client-side browser window.
   */
  isolate?: boolean;
}

/** -------------------------------------------------------------------
 * * ***This hook uses the shared context from the adjacent server layout within the `PageContextProvider ` component.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag at dev mode !!!`***
 * -------------------------------------------------------------------
 * @example
 * ```typescript jsx
 * 'use client';
 *
 * import { usePageContext } from '@/lib/next-extra/context';
 *
 * export default function Page() {
 *   const ctx = usePageContext<{ name: string }>();
 *   // ...
 * }
 * ```
 */
export function usePageContext<T extends Context = Context>(): Readonly<T> {
  const pageContext = useContext(PageContext);

  if (!pageContext) {
    throw new Error("usePageContext must be wrapped by PageContext");
  }

  return pageContext as T;
}

/** -------------------------------------------------------------------
 * * ***This hook uses the shared context from the client-side browser window. the context is only***
 * ***available on *client-side* after hydration.***
 * -------------------------------------------------------------------
 * * ***`⚠️ Warning: Currently is not support with turbopack flag at dev mode !!!`***
 * -------------------------------------------------------------------
 * @example
 * ```typescript jsx
 * 'use client';
 *
 * import { useServerInsertedContext } from '@/lib/next-extra/context';
 *
 * export default function Page() {
 *   const ctx = useServerInsertedContext<{ name: string }>();
 *   // ...
 * }
 * ```
 */
export function useServerInsertedContext<T extends Context = Context>(): Readonly<
  T | undefined
> {
  return useMemo<T | undefined>(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    let context = {};

    for (const [s, { data }] of window.__next_c || []) {
      if (s === "deepmerge") {
        context = deepmerge(context, data);
      } else {
        context = { ...context, ...data };
      }
    }

    return context as T;
  }, []);
}
