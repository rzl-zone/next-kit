import {
  getPreciseType,
  isArray,
  isNonEmptyString,
  isString,
  isServer,
  isBoolean
} from "@rzl-zone/utils-js/predicates";
import { safeStableStringify } from "@rzl-zone/utils-js/conversions";

import type { Attribute, ThemeProviderProps } from "../types";
import { defaultColorSchemes, MEDIA_SCHEME_THEME } from "../configs/default";

export const saveToLS = (storageKey: string, value?: string): void => {
  if (isServer()) return undefined;
  // Save to storage
  if (isString(storageKey) && isNonEmptyString(value)) {
    try {
      localStorage.setItem(storageKey, value);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // Unsupported
    }
  }
};

export const getTheme = (
  key: string,
  validTheme: string[],
  fallback?: string
): string | undefined => {
  if (isServer()) return undefined;

  let theme: string | undefined;
  try {
    const getTheme = localStorage.getItem(key);
    theme = getTheme && validTheme.includes(getTheme) ? getTheme : fallback;
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    // Unsupported
  }
  return theme || fallback;
};

export const disableAnimation = (nonce?: string): VoidFunction | undefined => {
  if (isServer()) return undefined;

  const css = document.createElement("style");
  if (isNonEmptyString(nonce)) css.setAttribute("nonce", nonce);
  css.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
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

export const getSystemTheme = (ev?: MediaQueryList | MediaQueryListEvent) => {
  if (!ev) ev = window?.matchMedia(MEDIA_SCHEME_THEME);
  const isDark = ev.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

export const updateMetaThemeColor = ({
  theme,
  enableMetaColorScheme
}: {
  theme: string | undefined;
  /** Whether to indicate to browsers which color scheme in meta head, is used (dark or light) for built-in UI like inputs and buttons */
  enableMetaColorScheme: boolean | undefined;
}): void => {
  if (
    !isServer() &&
    isString(theme) &&
    isBoolean(enableMetaColorScheme) &&
    enableMetaColorScheme === true
  ) {
    // eslint-disable-next-line quotes
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

export const validatePropsAttribute = (val: Attribute | Attribute[]): void => {
  if (!isString(val) || !isNonEmptyString(val)) {
    throw new TypeError(
      `Props \`storageKey\` for 'ProvidersThemesApp' must be of type \`string\` or \`undefined\` and value can't be empty-string as types from 'ThemeProviderProps', but received: \`${getPreciseType(val)}\`.`
    );
  }
  if (val !== "class" && !val.startsWith("data-")) {
    throw new TypeError(
      `Props \`storageKey\` for 'ProvidersThemesApp' must be \`"class"\` or start with \`"data-"\`, but received value: \`${safeStableStringify(val)}\`.`
    );
  }
};

type NonUndefThemeProviderProps = Required<ThemeProviderProps>;

export const handlingApplyTheme = ({
  attribute,
  attributes,
  defaultTheme,
  enableColorScheme,
  name,
  resolved
}: {
  name: string | undefined;
  resolved: string;
  defaultTheme: string;
  attributes: string[];
  attribute: NonUndefThemeProviderProps["attribute"];
  enableColorScheme: NonUndefThemeProviderProps["enableColorScheme"];
}): void => {
  if (isServer()) return undefined;

  const docEl = document.documentElement;
  const bodyEl = document.body;

  const handleAttribute = (attr: Attribute) => {
    if (attr === "class") {
      docEl.classList.remove(...attributes);
      if (name) docEl.classList.add(name);
    } else if (attr.startsWith("data-")) {
      if (name) {
        docEl.setAttribute(attr, name);
      } else {
        docEl.removeAttribute(attr);
      }
    }
  };

  isArray(attribute) ? attribute.forEach(handleAttribute) : handleAttribute(attribute);

  if (enableColorScheme !== false) {
    const fallback = defaultColorSchemes.includes(defaultTheme) ? defaultTheme : null;
    const colorScheme = defaultColorSchemes.includes(resolved) ? resolved : fallback;
    if (colorScheme) {
      if (enableColorScheme === "body") {
        bodyEl.style.colorScheme = colorScheme;
      } else {
        docEl.style.colorScheme = colorScheme;
      }
    }
  }
};
