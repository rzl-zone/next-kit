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

import type { ThemeProviderProps, UseTheme } from "../types";

import {
  disableAnimation,
  getSystemTheme,
  getTheme,
  handlingApplyTheme,
  normalizeThemes,
  saveToLS,
  updateMetaThemeColor,
  validatePropsAttribute
} from "../utils/internal";
import { scriptThemesApp } from "../internals/script-themes-app";
import { cleaningScriptFuncToString } from "../internals/helper";
import LocalStorageRefresherTheme from "../internals/ls-refresher";

import { ThemeContext } from "../contexts/ThemeContext";
import { defaultThemes, MEDIA_SCHEME_THEME } from "../configs";

const InternalThemeProvider = (props: ThemeProviderProps) => {
  const context = useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return props.children;
  return <ThemeInternal {...props} />;
};

const ThemeInternal = (props: ThemeProviderProps) => {
  const {
    forcedTheme,
    disableTransitionOnChange = true,
    enableSystem = true,
    enableColorScheme = "html",
    enableMetaColorScheme = true,
    storageKey = "rzl-theme",
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
      `Props \`defaultTheme\` for 'ProvidersThemesApp' must be of type \`string\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(_defaultTheme)}\`.`
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
      return `Props \`disableTransitionOnChange\` for 'ProvidersThemesApp' must be of type \`${validType}\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${currentType}\`.`;
    }
  });
  assertIsBoolean(enableSystem, {
    message({ currentType, validType }) {
      return `Props \`enableSystem\` for 'ProvidersThemesApp' must be of type \`${validType}\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${currentType}\`.`;
    }
  });
  assertIsBoolean(enableMetaColorScheme, {
    message({ currentType, validType }) {
      return `Props \`enableMetaColorScheme\` for 'ProvidersThemesApp' must be of type \`${validType}\` or \`undefined\` as types from 'ThemeProviderProps', but received: \`${currentType}\`.`;
    }
  });

  themes = normalizeThemes(themes, enableSystem);

  // Set Default Props Values;
  const defaultTheme = enableSystem
    ? _defaultTheme && themes.includes(_defaultTheme)
      ? _defaultTheme
      : "system"
    : _defaultTheme && _defaultTheme !== "system" && themes.includes(_defaultTheme)
      ? _defaultTheme
      : "light";

  const [theme, setThemeState] = useState<UseTheme["theme"]>(() =>
    getTheme(storageKey, themes, defaultTheme)
  );

  const [resolvedTheme, setResolvedTheme] = useState<
    Exclude<UseTheme["theme"], "system">
  >(() => (theme === "system" ? getSystemTheme() : theme));

  const attrs = useMemo(() => (!value ? themes : Object.values(value)), [value, themes]);

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
        defaultTheme: defaultTheme === "system" ? getSystemTheme() : defaultTheme,
        enableColorScheme,
        name,
        resolved
      });

      updateMetaThemeColor({ theme, enableMetaColorScheme });
      enable?.();
    },
    [
      nonce,
      attribute,
      attrs,
      defaultTheme,
      enableColorScheme,
      value,
      enableMetaColorScheme,
      enableSystem
    ]
  );

  const setTheme = useCallback(
    (value: SetStateAction<NonNullable<UseTheme["theme"]>>) => {
      if (isFunction(value)) {
        setThemeState((prevTheme) => {
          const prev = isNonEmptyString(prevTheme) ? prevTheme : defaultTheme;
          const candidate = value(prev);

          if (!isNonEmptyString(candidate) || !themes.includes(candidate)) {
            // invalid value -> keep previous theme
            return prevTheme;
          }
          const newTheme = candidate;
          saveToLS(storageKey, newTheme);
          return newTheme;
        });
      } else if (isNonEmptyString(value)) {
        setThemeState(value);
        saveToLS(storageKey, value);
      }
    },
    [storageKey, defaultTheme]
  );

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [theme, forcedTheme, applyTheme, enableSystem]
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA_SCHEME_THEME);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleMediaQuery);
    } else {
      // Intentionally use deprecated listener methods to support iOS & old browsers
      media.addListener(handleMediaQuery);
    }

    handleMediaQuery(media);

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", handleMediaQuery);
      } else {
        media.removeListener(handleMediaQuery);
      }
    };
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
        return;
      }

      // validate stored theme is allowed
      if (themes.includes(e.newValue)) {
        // update directly to avoid saving again to localStorage loop
        setThemeState(e.newValue);
      } else {
        // fallback to default
        setTheme(defaultTheme);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, themes, setTheme, defaultTheme]);

  // Whenever theme or forcedTheme changes, apply it
  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [forcedTheme, theme, applyTheme]);

  const providerValue = useMemo(
    () => ({
      theme,
      themes,
      setTheme,
      forcedTheme,
      systemTheme: enableSystem ? resolvedTheme : undefined,
      resolvedTheme: theme === "system" ? resolvedTheme : theme
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

    const scriptArgs = [
      attribute,
      storageKey,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      enableColorScheme,
      enableMetaColorScheme
    ]
      .map((a) => JSON.stringify(a))
      .join(",");

    useServerInsertedHTML(() => {
      if (!isServerInserted?.current) {
        isServerInserted.current = true;

        return (
          <script
            {...scriptProps}
            suppressHydrationWarning
            {...(nonce ? { nonce } : {})}
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
