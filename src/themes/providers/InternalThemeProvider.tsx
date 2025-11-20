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
  isString,
  isUndefined
} from "@rzl-zone/utils-js/predicates";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";
import { assertIsBoolean, assertIsPlainObject } from "@rzl-zone/utils-js/assertions";

import type { ThemeProviderProps, UseTheme } from "../types";

import { isProdEnv } from "@/utils";
import {
  disableAnimation,
  getSystemTheme,
  getTheme,
  handlingApplyTheme,
  normalizeThemes,
  saveToLS,
  setMetaColorSchemeValue,
  updateMetaThemeColor,
  validatePropsAttribute
} from "../utils/internal";
import { scriptThemesApp } from "../internals/script-themes-app";
import { minifyInnerHTMLScript } from "../internals/helper";
import LocalStorageRefresherTheme from "../internals/ls-refresher";

import { ThemeContext } from "../contexts/ThemeContext";
import {
  defaultMetaColorSchemeValue,
  defaultThemes,
  MEDIA_SCHEME_THEME
} from "../configs";

const InternalThemeProvider = <EnablingSystem extends boolean = true>(
  props: ThemeProviderProps<EnablingSystem>
) => {
  const context = useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return props.children;
  return <ThemeInternal<EnablingSystem> {...props} />;
};

const ThemeInternal = <EnablingSystem extends boolean = true>(
  props: ThemeProviderProps<EnablingSystem>
) => {
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
  let { themes = defaultThemes, metaColorSchemeValue = defaultMetaColorSchemeValue } =
    props;

  if (!isUndefined(nonce) && !isString(nonce)) {
    throw new TypeError(
      `Props \`nonce\` for 'ProvidersThemesApp' must be of type \`string\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(
        nonce
      )}\`, with current value: \`${safeStableStringify(nonce, {
        keepUndefined: true
      })}\`.`
    );
  }

  if (!isUndefined(value)) {
    assertIsPlainObject(value, {
      message({ currentType, validType }) {
        return `Props \`value\` for 'ProvidersThemesApp' must be a \`${validType}\`, but received: \`${currentType}\`.`;
      }
    });

    for (const [themeName, themeValue] of Object.entries(value)) {
      if (!isNonEmptyString(themeName)) {
        throw new TypeError(
          `Props \`value\` at 'ProvidersThemesApp', the key name theme "${themeName}" must be of type a \`string\` and \`non-empty string\`, but received: \`${getPreciseType(
            themeName
          )}\`, with current value: \`${safeStableStringify(themeName, {
            keepUndefined: true
          })}\`.`
        );
      }
      if (!isNonEmptyString(themeValue)) {
        throw new TypeError(
          `Props \`value\` at 'ProvidersThemesApp', the value for theme key "${themeName}" must be of type a \`string\` and \`non-empty string\`, but received: \`${getPreciseType(
            themeValue
          )}\`, with current value: \`${safeStableStringify(themeValue, {
            keepUndefined: true
          })}\`.`
        );
      }
    }
  }

  if (!isUndefined(attribute)) {
    if (isArray(attribute)) {
      attribute.forEach(validatePropsAttribute);
    } else {
      validatePropsAttribute(attribute);
    }
  }

  if (!isUndefined(_defaultTheme) && !isNonEmptyString(_defaultTheme)) {
    throw new TypeError(
      `Props \`defaultTheme\` for 'ProvidersThemesApp' must be of type a \`string\` and \`non-empty string\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(
        _defaultTheme
      )}\`.`
    );
  }
  if (!isUndefined(storageKey) && !isNonEmptyString(storageKey)) {
    throw new TypeError(
      `Props \`storageKey\` for 'ProvidersThemesApp' must be of type \`string\` and value cant be \`empty-string\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(
        storageKey
      )}\`.`
    );
  }

  if (
    (isBoolean(enableColorScheme) && enableColorScheme !== false) ||
    (isString(enableColorScheme) && !["html", "body"].includes(enableColorScheme))
  ) {
    throw new TypeError(
      `Props \`enableColorScheme\` for 'ProvidersThemesApp' must be of type \`string\`, \`boolean\` and if value is a string must one of ("body" or "html") if \`boolean\` valid value only \`false\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(
        enableColorScheme
      )}\`, with current value: \`${safeStableStringify(enableColorScheme, {
        keepUndefined: true
      })}\`.`
    );
  }

  if (!isUndefined(forcedTheme) && !isString(forcedTheme)) {
    throw new TypeError(
      `Props \`forcedTheme\` for 'ProvidersThemesApp' must be of type \`string\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(
        forcedTheme
      )}\`.`
    );
  }

  if (!isUndefined(metaColorSchemeValue)) {
    assertIsPlainObject(metaColorSchemeValue, {
      message({ currentType, validType }) {
        return `Props \`metaColorSchemeValue\` for 'ProvidersThemesApp' must be a \`${validType}\`, but received: \`${currentType}\`.`;
      }
    });

    metaColorSchemeValue = setMetaColorSchemeValue(metaColorSchemeValue);

    if (!isNonEmptyString(metaColorSchemeValue.light)) {
      throw new TypeError(
        `Props \`metaColorSchemeValue.light\` for 'ProvidersThemesApp' must be of type \`string\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(
          metaColorSchemeValue.light
        )}\`.`
      );
    }

    if (!isNonEmptyString(metaColorSchemeValue.dark)) {
      throw new TypeError(
        `Props \`metaColorSchemeValue.dark\` for 'ProvidersThemesApp' must be of type \`string\` as types from 'ThemeProviderProps', but received: \`${getPreciseType(
          metaColorSchemeValue.dark
        )}\`.`
      );
    }
  }

  assertIsBoolean(enableSystem, {
    message({ currentType, validType }) {
      return `Props \`enableSystem\` for 'ProvidersThemesApp' must be of type \`${validType}\` as types from 'ThemeProviderProps', but received: \`${currentType}\`.`;
    }
  });
  assertIsBoolean(enableMetaColorScheme, {
    message({ currentType, validType }) {
      return `Props \`enableMetaColorScheme\` for 'ProvidersThemesApp' must be of type \`${validType}\` as types from 'ThemeProviderProps', but received: \`${currentType}\`.`;
    }
  });
  assertIsBoolean(disableTransitionOnChange, {
    message({ currentType, validType }) {
      return `Props \`disableTransitionOnChange\` for 'ProvidersThemesApp' must be of type \`${validType}\` as types from 'ThemeProviderProps', but received: \`${currentType}\`.`;
    }
  });

  themes = normalizeThemes(themes, enableSystem);

  // Set Default Props Values;
  const defaultTheme =
    _defaultTheme && themes.includes(_defaultTheme)
      ? _defaultTheme
      : enableSystem
        ? "system"
        : "light";

  const [themeState, setThemeState] = useState<UseTheme["theme"]>(() =>
    getTheme(storageKey, themes, defaultTheme)
  );

  const [resolvedTheme, setResolvedTheme] = useState<
    Exclude<UseTheme["theme"], "system">
  >(() => (themeState === "system" ? getSystemTheme() : themeState));

  const attrs = useMemo(() => (!value ? themes : Object.values(value)), [value, themes]);

  const applyTheme = useCallback(
    (theme?: string) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === "system") {
        resolved = enableSystem ? getSystemTheme() : defaultTheme;
      }

      const name = value && value[resolved] ? value[resolved] : resolved;
      const disablingAnimation = disableTransitionOnChange
        ? disableAnimation(nonce)
        : null;

      handlingApplyTheme({
        theme: themeState,
        attribute,
        attributes: attrs,
        defaultTheme: defaultTheme === "system" ? getSystemTheme() : defaultTheme,
        enableColorScheme,
        name,
        resolved
      });

      updateMetaThemeColor({
        theme,
        enableMetaColorScheme,
        metaColorSchemeValue: setMetaColorSchemeValue(metaColorSchemeValue)
      });
      disablingAnimation?.();
    },
    [
      nonce,
      attrs,
      value,
      attribute,
      themeState,
      defaultTheme,
      enableSystem,
      enableColorScheme,
      metaColorSchemeValue,
      enableMetaColorScheme,
      disableTransitionOnChange
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
        const validValue = themes.includes(value) ? value : defaultTheme;
        setThemeState(validValue);
        saveToLS(storageKey, validValue);
      }
    },
    [themes, storageKey, defaultTheme]
  );

  const resolvingTheme = (resolved: ReturnType<typeof getSystemTheme>) => {
    setResolvedTheme(resolved);
  };

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);

      resolvingTheme(resolved);

      if (themeState === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [themeState, forcedTheme, applyTheme, enableSystem, resolvedTheme]
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA_SCHEME_THEME);

    if (isFunction(media.addEventListener)) {
      media.addEventListener("change", handleMediaQuery);
    } else {
      // Intentionally use deprecated listener methods to support iOS & old browsers
      media.addListener(handleMediaQuery);
    }

    handleMediaQuery(media);

    return () => {
      if (isFunction(media.removeEventListener)) {
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
    applyTheme(forcedTheme ?? themeState);
  }, [forcedTheme, themeState, applyTheme]);

  const providerValue = useMemo(
    () => ({
      theme: themeState,
      themes,
      setTheme,
      forcedTheme,
      systemTheme: enableSystem ? resolvedTheme : undefined,
      resolvedTheme: themeState === "system" ? resolvedTheme : themeState
    }),
    [themeState, setTheme, forcedTheme, resolvedTheme, enableSystem, themes]
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
          scriptProps,
          metaColorSchemeValue: setMetaColorSchemeValue(metaColorSchemeValue)
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
  <EnablingSystem extends boolean = true>({
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
    enableMetaColorScheme,
    metaColorSchemeValue = defaultMetaColorSchemeValue
  }: Omit<ThemeProviderProps<EnablingSystem>, "children" | "metaColorSchemeValue"> &
    Required<NonNullable<Pick<ThemeProviderProps, "metaColorSchemeValue">>>) => {
    const isServerInserted = useRef(false);

    const scriptArgs = safeStableStringify([
      storageKey,
      attribute,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      (metaColorSchemeValue = setMetaColorSchemeValue(metaColorSchemeValue)),
      enableColorScheme,
      enableMetaColorScheme
    ]).slice(1, -1);

    useServerInsertedHTML(() => {
      if (!isServerInserted?.current && isFunction(scriptThemesApp)) {
        isServerInserted.current = true;

        return (
          <script
            {...scriptProps}
            {...(nonce ? { nonce } : {})}
            data-script="rzlzone-themes"
            dangerouslySetInnerHTML={{
              __html: `(${minifyInnerHTMLScript(scriptThemesApp)})(${scriptArgs})`
            }}
          />
        );
      }

      return null;
    });

    return null;
  }
);
ThemeScript.displayName = isProdEnv() ? undefined : "ThemeScript(RzlzoneThemes)";

export default InternalThemeProvider;
