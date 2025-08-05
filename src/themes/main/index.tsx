"use client";

import React from "react";
import {
  isEmptyString,
  isFunction,
  isNonEmptyString,
  isServer,
  isString
} from "@rzl-zone/utils-js";
import { usePathname, useServerInsertedHTML } from "next/navigation";

import { CONFIG_THEME } from "../config";
import { script } from "../internal/script";
import { cleaningScriptFuncToString } from "../internal/helper";

import type { ThemeMode } from "../types";
import type { Attribute, ThemeProviderProps, UseTheme } from "../internal/types";

const colorSchemes = ["light", "dark"];
const MEDIA = "(prefers-color-scheme: dark)";
const ThemeContext = React.createContext<UseTheme | undefined>(undefined);

// ! - Main Provider ------------------
/** ------------------------------------------------------------
 * * ***Provider wrapper for configuring and supplying the theme system.***
 * ------------------------------------------------------------
 *
 * Usage example in your `layout.tsx`:
 * ```tsx
 * import { ProvidersThemesApp } from "@/themes";
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
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
 * Any props you pass (e.g. `themes`, `defaultTheme`, etc) will override the default config.
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
 * Tip:
 * If you pass custom themes (e.g. `themes={["pink","blue"]}`),
 * remember to add a corresponding override for type-safety:
 * ```ts
 * import "@rzl-zone/next-kit/themes";
 *
 * declare module "@rzl-zone/next-kit/themes" {
 *   interface ThemeOverrideConfig {
 *     themes: ["pink", "blue"]; // or themes?: [...];
 *   }
 * }
 * ```
 *
 * @param props - Props that extend / override the default `CONFIG_THEME`.
 * @throws Will throw an error if `children` is not provided.
 * @returns A `<ThemeProvider>` wrapping the passed children.
 */
export const ProvidersThemesApp = (props: ThemeProviderProps) => {
  const { children, ..._restProps } = props;
  if (!children) {
    throw new Error("Props children is required as React.ReactNode type!!!");
  }

  const config = { ...CONFIG_THEME, ..._restProps };

  return <ThemeProvider {...config}>{children}</ThemeProvider>;
};

// ! - Hook ---------------------------
/** ------------------------------------------------------------
 * * ***React hook for accessing the theme context.***
 * ------------------------------------------------------------
 *
 * Provides information about the currently active theme and utilities for
 * switching themes, including system-level theme support.
 *
 * ⚠️ **Must be used inside `<ProvidersThemesApp>` or it will throw.**
 *
 * @throws {Error} If the hook is called outside of the `<ProvidersThemesApp>` provider.
 * @returns {UseTheme} Object containing current theme data and setter.
 */
export const useTheme = (): UseTheme => {
  const themeContext = React.useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useTheme must be wrapped by ProvidersThemesApp");
  }

  return themeContext;
};

// ! - BASE SCRIPT --------------------
const ThemeProvider = (props: ThemeProviderProps) => {
  const context = React.useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return props.children;
  return <Theme {...props} />;
};
ThemeProvider.displayName =
  process.env["NODE_ENV"] === "production" ? undefined : "ThemeProvider";

const defaultThemes = ["light", "dark"];

const Theme = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = "html",
  enableMetaColorScheme = true,
  storageKey = "theme",
  themes = defaultThemes,
  defaultTheme: _defaultTheme,
  attribute = "data-theme",
  value,
  children,
  nonce,
  scriptProps
}: ThemeProviderProps) => {
  // Set Default Props Values;
  const defaultTheme = enableSystem
    ? _defaultTheme && themes.includes(_defaultTheme)
      ? _defaultTheme
      : "system"
    : _defaultTheme && _defaultTheme !== "system" && themes.includes(_defaultTheme)
      ? _defaultTheme
      : "light";

  const [theme, setThemeState] = React.useState(() =>
    getTheme(storageKey, themes, defaultTheme)
  );

  themes = themes.filter((theme) => theme !== "system");

  const [resolvedTheme, setResolvedTheme] = React.useState(() =>
    theme === "system" ? getSystemTheme() : theme
  );
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = React.useCallback(
    (theme?: string) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === "system" && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation(nonce) : null;
      const d = document.documentElement;
      const bodyEl = document.body;

      const handleAttribute = (attr: Attribute) => {
        if (attr === "class") {
          d.classList.remove(...attrs);
          if (name) d.classList.add(name);
        } else if (attr.startsWith("data-")) {
          if (name) {
            d.setAttribute(attr, name);
          } else {
            d.removeAttribute(attr);
          }
        }
      };

      if (Array.isArray(attribute)) attribute.forEach(handleAttribute);
      else handleAttribute(attribute);

      if (enableColorScheme !== false) {
        const fallback = colorSchemes.includes(defaultTheme) ? defaultTheme : null;
        const colorScheme = colorSchemes.includes(resolved) ? resolved : fallback;
        if (colorScheme) {
          if (enableColorScheme === "body") {
            bodyEl.style.colorScheme = colorScheme;
          } else {
            d.style.colorScheme = colorScheme;
          }
        }
      }

      updateMetaThemeColor({ theme, enableMetaColorScheme });
      enable?.();
    },
    [nonce]
  );

  const setTheme = React.useCallback(
    (value: React.SetStateAction<(string & {}) | ThemeMode> | string) => {
      if (isFunction(value)) {
        setThemeState((prevTheme?: string) => {
          const newTheme = isNonEmptyString(prevTheme) ? value(prevTheme) : undefined;

          saveToLS(storageKey, newTheme);

          return newTheme;
        });
      } else if (isString(value)) {
        setThemeState(value);
        saveToLS(storageKey, value);
      }
    },
    []
  );

  const handleMediaQuery = React.useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [theme, forcedTheme]
  );

  // Always listen to System preference
  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      if (!e.newValue) {
        setTheme(defaultTheme);
      } else {
        setThemeState(e.newValue); // Direct state update to avoid loops
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setTheme]);

  // Whenever theme or forcedTheme changes, apply it
  React.useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme]);

  const providerValue = React.useMemo(
    () => ({
      theme,
      setTheme,
      forcedTheme,
      resolvedTheme: theme === "system" ? resolvedTheme : theme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: (enableSystem ? resolvedTheme : undefined) as UseTheme["systemTheme"]
    }),
    [theme, setTheme, forcedTheme, resolvedTheme, enableSystem, themes]
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}

      <ThemeScript
        {...{
          forcedTheme,
          storageKey,
          attribute,
          enableSystem,
          enableColorScheme,
          enableMetaColorScheme,
          defaultTheme,
          value,
          themes,
          nonce,
          scriptProps
        }}
      />

      <LocalStorageRefresherTheme
        storageKey={storageKey}
        defaultTheme={defaultTheme}
        enableSystem={enableSystem}
        theme={providerValue.theme}
        themes={providerValue.themes}
        setTheme={providerValue.setTheme}
      />
    </ThemeContext.Provider>
  );
};

const ThemeScript = React.memo(
  ({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    themes,
    nonce,
    scriptProps,
    enableMetaColorScheme
  }: Omit<ThemeProviderProps, "children">) => {
    const isServerInserted = React.useRef(false);

    const scriptArgs = JSON.stringify([
      attribute,
      storageKey,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      enableColorScheme,
      enableMetaColorScheme
    ]).slice(1, -1);

    useServerInsertedHTML(() => {
      if (!isServerInserted?.current) {
        isServerInserted.current = true;

        return (
          <script
            {...scriptProps}
            suppressHydrationWarning
            {...(nonce ? { nonce: typeof window === "undefined" ? nonce : "" } : {})}
            dangerouslySetInnerHTML={{
              __html: `(${cleaningScriptFuncToString(script)})(${scriptArgs})`
            }}
          />
        );
      }

      return null;
    });

    return null;
  }
);

// ! - PARTIAL -------------------------
const LocalStorageRefresherTheme = ({
  theme,
  themes,
  setTheme,
  defaultTheme,
  enableSystem = true,
  storageKey = "rzl-theme"
}: {
  /** Key used to store theme setting in localStorage, DefaultValue: `"rzl-theme"`. */
  storageKey: string | undefined;
  /**
   * @default "light"
   */
  defaultTheme: (string & {}) | ThemeMode;
  /** Whether to switch between dark and light themes based on prefers-color-scheme, DefaultValue: `true`. */
  enableSystem: boolean | undefined;
  /** List of all available theme names
   *
   * @default  ["light", "dark"]
   */
  themes: string[];
  /** Update the theme */
  setTheme: React.Dispatch<React.SetStateAction<(string & {}) | ThemeMode>>;
  /** Active theme name */
  theme: string | undefined;
}) => {
  const pathname = usePathname();

  const StorageRefresher = React.useCallback(() => {
    const getCurrentStorageTheme = (): (string & {}) | ThemeMode | null | "" => {
      return localStorage.getItem(storageKey);
    };

    const LocalStorageTheme = getCurrentStorageTheme();

    if (!theme) {
      if (LocalStorageTheme === "") {
        return localStorage.removeItem(storageKey);
      }
      return;
    }

    const validValTheme = themes.includes(theme) ? theme : defaultTheme;

    if (!enableSystem && LocalStorageTheme === "system") {
      localStorage.setItem(storageKey, theme === "system" ? defaultTheme : validValTheme);
      return setTheme(theme === "system" ? defaultTheme : validValTheme);
    }

    if (
      !LocalStorageTheme ||
      LocalStorageTheme !== theme ||
      !themes?.includes(LocalStorageTheme)
    ) {
      localStorage.setItem(storageKey, validValTheme);
      return setTheme(validValTheme);
    }
  }, [theme, storageKey, enableSystem]);

  React.useEffect(() => {
    StorageRefresher();
  }, [pathname]);

  return null;
};
LocalStorageRefresherTheme.displayName =
  process.env["NODE_ENV"] === "production" ? undefined : "LocalStorageRefresherTheme";

// ! - Helpers -------------------------
const saveToLS = (storageKey: string, value?: string) => {
  // Save to storage
  try {
    if (isNonEmptyString(value)) localStorage.setItem(storageKey, value);
  } catch (e) {
    // Unsupported
  }
};

const getTheme = (
  key: string,
  validTheme: string[],
  fallback?: string
): string | undefined => {
  if (isServer()) return undefined;
  let theme: string | undefined;
  try {
    const getTheme = localStorage.getItem(key);
    theme = getTheme && validTheme.includes(getTheme) ? getTheme : fallback;
  } catch (e) {
    // Unsupported
  }
  return theme || fallback;
};

const disableAnimation = (nonce?: string) => {
  const css = document.createElement("style");
  if (isNonEmptyString(nonce)) css.setAttribute("nonce", nonce);
  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    )
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (!e) e = window?.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

const updateMetaThemeColor = ({
  theme,
  enableMetaColorScheme
}: {
  theme: string | undefined;
  /** Whether to indicate to browsers which color scheme in meta head, is used (dark or light) for built-in UI like inputs and buttons */
  enableMetaColorScheme: boolean | undefined;
}) => {
  if (document !== undefined && enableMetaColorScheme) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());

    if (theme === "dark") {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "oklch(.13 .028 261.692)";
      document.head.appendChild(meta);
    } else if (theme === "light") {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "white";
      document.head.appendChild(meta);
    } else {
      const meta1 = document.createElement("meta");
      meta1.name = "theme-color";
      meta1.content = "oklch(.13 .028 261.692)";
      meta1.media = "(prefers-color-scheme: dark)";
      document.head.appendChild(meta1);

      const meta2 = document.createElement("meta");
      meta2.name = "theme-color";
      meta2.content = "white";
      meta2.media = "(prefers-color-scheme: light)";
      document.head.appendChild(meta2);
    }
  }
};
