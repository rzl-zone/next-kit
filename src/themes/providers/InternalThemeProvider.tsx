"use client";

import React, {
  memo,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useServerInsertedHTML } from "next/navigation";
import {
  getPreciseType,
  isArray,
  isBoolean,
  isFunction,
  isNonEmptyString,
  isPlainObject,
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { assertIsBoolean } from "@rzl-zone/utils-js/assertions";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import type { ThemeMode, ThemeProviderProps, UseTheme } from "../types";
import { isProdEnv } from "@/_private/nodeEnv";

import {
  disableAnimation,
  getSystemTheme,
  getTheme,
  handlingApplyTheme,
  saveToLS,
  updateMetaThemeColor,
  validatePropsAttribute
} from "../utils/internal";
import { scriptThemesApp } from "../internals/script-themes-app";
import { cleaningScriptFuncToString } from "../internals/helper";
import LocalStorageRefresherTheme from "../internals/ls-refresher";

import { ThemeContext } from "../contexts/ThemeContext";
import { defaultThemes, MEDIA_SCHEME_THEME } from "../configs/default";

const InternalThemeProvider = (props: ThemeProviderProps) => {
  const context = useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return props.children;
  return <ThemeInternal {...props} />;
};
if (!isProdEnv) InternalThemeProvider.displayName = "InternalThemeProvider";

const ThemeInternal = (props: ThemeProviderProps) => {
  const {
    forcedTheme,
    disableTransitionOnChange = false,
    enableSystem = true,
    enableColorScheme = "html",
    enableMetaColorScheme = true,
    storageKey = "theme",
    defaultTheme: _defaultTheme,
    attribute = "data-theme",
    value,
    children,
    nonce,
    scriptProps
  } = props;
  let { themes = defaultThemes } = props;

  if (!isUndefined(nonce) && !isString(nonce)) {
    throw new TypeError(
      `Props \`nonce\` for 'ProvidersThemesApp' must be of type \`string\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(nonce)}\`.`
    );
  }

  if (!isUndefined(value)) {
    if (!isPlainObject(value)) {
      throw new TypeError(
        `Props \`value\` for 'ProvidersThemesApp' must be a \`plain-object\` or undefined, but received: \`${getPreciseType(value)}\`.`
      );
    }

    for (const [themeName, themeValue] of Object.entries(value)) {
      if (!isString(themeValue) || themeValue === "") {
        throw new TypeError(
          `Props \`value\` at 'ProvidersThemesApp', the value for theme key "${themeName}" must be a string an non-empty string, but received: \`${getPreciseType(themeValue)}\`, with value: \`${safeStableStringify(themeValue)}\`.`
        );
      }
    }
  }

  if (!isUndefined(attribute)) {
    isArray(attribute)
      ? attribute.forEach(validatePropsAttribute)
      : validatePropsAttribute(attribute);
  }

  if (!isUndefined(_defaultTheme) && !isString(_defaultTheme)) {
    throw new TypeError(
      `Props \`_defaultTheme\` for 'ProvidersThemesApp' must be of type \`string\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(_defaultTheme)}\`.`
    );
  }
  if (!isUndefined(storageKey) && !isNonEmptyString(storageKey)) {
    throw new TypeError(
      `Props \`storageKey\` for 'ProvidersThemesApp' must be of type \`string\` or \`undefined\` and value cant be empty-string as types from 'ThemeProviderProps', but received: \`${getPreciseType(storageKey)}\`.`
    );
  }

  if (
    (isBoolean(enableColorScheme) && enableColorScheme !== false) ||
    (isString(enableColorScheme) && !["html", "body"].includes(enableColorScheme))
  ) {
    throw new TypeError(
      `Props \`enableColorScheme\` for 'ProvidersThemesApp' must be of type \`string\`, \`boolean\` or \`undefined\` and if value is a string must one of ("body" or "html") if \`boolean\` valid value only \`false\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(enableColorScheme)}\`, with current value: \`${safeStableStringify(enableColorScheme, { keepUndefined: true })}\`.`
    );
  }

  if (!isUndefined(forcedTheme) && !isString(forcedTheme)) {
    throw new TypeError(
      `Props \`forcedTheme\` for 'ProvidersThemesApp' must be of type \`string\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(forcedTheme)}\`.`
    );
  }

  assertIsBoolean(disableTransitionOnChange, {
    message({ currentType, validType }) {
      return `Props \`disableTransitionOnChange\` for 'ProvidersThemesApp' must be of type \`${currentType}\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${validType}\`.`;
    }
  });
  assertIsBoolean(enableSystem, {
    message({ currentType, validType }) {
      return `Props \`enableSystem\` for 'ProvidersThemesApp' must be of type \`${currentType}\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${validType}\`.`;
    }
  });
  assertIsBoolean(enableMetaColorScheme, {
    message({ currentType, validType }) {
      return `Props \`enableMetaColorScheme\` for 'ProvidersThemesApp' must be of type \`${currentType}\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${validType}\`.`;
    }
  });

  // Set Default Props Values;
  const defaultTheme = enableSystem
    ? _defaultTheme && themes.includes(_defaultTheme)
      ? _defaultTheme
      : "system"
    : _defaultTheme && _defaultTheme !== "system" && themes.includes(_defaultTheme)
      ? _defaultTheme
      : "light";

  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, themes, defaultTheme)
  );

  themes = themes.filter((theme) => theme !== "system");

  const [resolvedTheme, setResolvedTheme] = useState(() =>
    theme === "system" ? getSystemTheme() : theme
  );
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme?: string) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === "system" && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation(nonce) : null;

      handlingApplyTheme({
        attribute,
        attributes: attrs,
        defaultTheme,
        enableColorScheme,
        name,
        resolved
      });

      updateMetaThemeColor({ theme, enableMetaColorScheme });
      enable?.();
    },
    [nonce]
  );

  const setTheme = useCallback(
    (value: SetStateAction<(string & {}) | ThemeMode> | string) => {
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

  const handleMediaQuery = useCallback(
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
  useEffect(() => {
    const media = window.matchMedia(MEDIA_SCHEME_THEME);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  useEffect(() => {
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
  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme]);

  const providerValue = useMemo(
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

const ThemeScript = memo(
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
    const isServerInserted = useRef(false);

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
              __html: `(${cleaningScriptFuncToString(scriptThemesApp)})(${scriptArgs})`
            }}
          />
        );
      }

      return null;
    });

    return null;
  }
);

export default InternalThemeProvider;
