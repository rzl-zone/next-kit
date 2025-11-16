"use client";

import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

import { ThemeMode, UseTheme } from "../types";
import { usePathname } from "next/navigation";

type LocalStorageRefresherThemeProps = {
  /** Key used to store theme setting in localStorage, DefaultValue: `"rzl-theme"`. */
  storageKey: string | undefined;
  /**
   * @default "light"
   */
  defaultTheme: NonNullable<UseTheme["theme"]>;
  /** Whether to switch between dark and light themes based on prefers-color-scheme, DefaultValue: `true`. */
  enableSystem: boolean | undefined;
  /** List of all available theme names
   *
   * @default  ["light", "dark"]
   */
  themes: string[];
  /** Update the theme */
  setTheme: Dispatch<SetStateAction<NonNullable<UseTheme["theme"]>>>;
  /** Active current theme */
  theme: string | undefined;
};

const LocalStorageRefresherTheme = ({
  theme,
  themes,
  setTheme,
  defaultTheme,
  enableSystem = true,
  storageKey = "rzl-theme"
}: LocalStorageRefresherThemeProps) => {
  const pathname = usePathname();

  const StorageRefresher = useCallback(() => {
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

  useEffect(() => {
    StorageRefresher();
  }, [pathname]);

  return null;
};

export default LocalStorageRefresherTheme;
