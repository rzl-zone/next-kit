export const scriptThemesApp = (
  attribute: string | string[],
  storageKey: string,
  defaultTheme: string,
  forcedTheme: string,
  themes: string[],
  value: { [x: string]: string },
  enableSystem: boolean | undefined,
  enableColorScheme?: "html" | "body" | false | undefined,
  /** Whether to indicate to browsers which color scheme in meta head, is used (dark or light) for built-in UI like inputs and buttons */
  enableMetaColorScheme?: boolean | undefined
) => {
  const el = document.documentElement;
  const bodyEl = document.body;
  const systemThemes = ["light", "dark"];

  const updateDOM = (theme: string) => {
    const attributes = Array.isArray(attribute) ? attribute : [attribute];

    attributes.forEach((attr) => {
      const isClass = attr === "class";
      const classes = isClass && value ? themes.map((t) => value[t] || t) : themes;
      if (isClass) {
        el.classList.remove(...classes);
        el.classList.add(value && value[theme] ? value[theme] : theme);
      } else {
        el.setAttribute(attr, theme);
      }
    });

    setColorScheme(theme, enableColorScheme);
    updateMetaThemeColor({ theme, enableMetaColorScheme });
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

  const setColorScheme = (
    theme: string,
    enableColorScheme?: "html" | "body" | false | undefined
  ) => {
    if (enableColorScheme && systemThemes.includes(theme)) {
      if (enableColorScheme === "body") {
        bodyEl.style.colorScheme = theme;
      } else {
        el.style.colorScheme = theme;
      }
    }
  };

  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  if (forcedTheme) {
    updateDOM(forcedTheme);
  } else {
    try {
      const getTheme = localStorage.getItem(storageKey);
      const themeName = getTheme && themes.includes(getTheme) ? getTheme : defaultTheme;
      const isSystem = enableSystem && themeName === "system";
      const theme = isSystem ? getSystemTheme() : themeName;
      updateDOM(theme);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // mean is not support, so const skip.
    }
  }
};
