(function () {
  const COOKIE_NAME = "whichbatman_theme";
  const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
  const DEFAULT_THEME = "gotham";
  const VALID_THEMES = new Set([
    "gotham",
    "west",
    "keaton",
    "kilmer",
    "clooney",
    "bale",
    "affleck",
    "pattinson",
  ]);

  const BATMAN_THEME_MAP = {
    west: "west",
    keaton: "keaton",
    kilmer: "kilmer",
    clooney: "clooney",
    bale: "bale",
    affleck: "affleck",
    pattinson: "pattinson",
  };

  function normalizeTheme(theme) {
    return VALID_THEMES.has(theme) ? theme : DEFAULT_THEME;
  }

  function readThemeCookie() {
    const match = document.cookie.match(/(?:^|; )whichbatman_theme=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeThemeCookie(theme) {
    document.cookie =
      COOKIE_NAME +
      "=" +
      encodeURIComponent(theme) +
      "; max-age=" +
      COOKIE_MAX_AGE +
      "; path=/; SameSite=Lax";
  }

  function applyTheme(theme) {
    const normalizedTheme = normalizeTheme(theme);
    document.documentElement.setAttribute("data-theme", normalizedTheme);

    if (document.body) {
      document.body.setAttribute("data-theme", normalizedTheme);
    }

    const themeColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-color")
      .trim();
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta && themeColor) {
      themeMeta.setAttribute("content", themeColor);
    }

    return normalizedTheme;
  }

  function setTheme(theme, options) {
    const settings = options || {};
    const normalizedTheme = applyTheme(theme);

    if (settings.persist !== false) {
      writeThemeCookie(normalizedTheme);
    }

    return normalizedTheme;
  }

  function setThemeForBatman(batmanId, options) {
    return setTheme(BATMAN_THEME_MAP[batmanId] || DEFAULT_THEME, options);
  }

  function getSavedTheme() {
    return normalizeTheme(readThemeCookie() || DEFAULT_THEME);
  }

  function initDocumentTheme() {
    applyTheme(getSavedTheme());
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getSavedTheme());
  });

  window.WhichBatmanTheme = {
    applyTheme,
    getSavedTheme,
    initDocumentTheme,
    readThemeCookie,
    setTheme,
    setThemeForBatman,
  };
})();
