const THEME_KEY = "siteTheme";
const THEME_VALUES = new Set(["light", "dark"]);

const normalizeTheme = (theme) => (THEME_VALUES.has(theme) ? theme : null);

const readStoredTheme = () => {
  try {
    return normalizeTheme(localStorage.getItem(THEME_KEY));
  } catch (error) {
    return null;
  }
};

export const getTheme = () => readStoredTheme() || "light";

export const getResolvedTheme = (theme = getTheme()) => theme;

export const applyTheme = (theme = getTheme()) => {
  const resolved = getResolvedTheme(theme);
  const root = document.documentElement;
  root.classList.toggle("theme-dark", resolved === "dark");
  root.dataset.theme = theme;
  root.dataset.themeResolved = resolved;
};

const applyInitialTheme = () => {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  if (root.dataset && root.dataset.themeResolved) {
    return;
  }
  applyTheme(getTheme());
};

export const setTheme = (theme) => {
  const nextTheme = normalizeTheme(theme);
  if (!nextTheme) {
    return;
  }
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch (error) {
    return;
  }
  applyTheme(nextTheme);
  updateThemeToggleLabels(document);
};

export const updateThemeToggleLabels = (root = document) => {
  const theme = getTheme();
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const nextLabel = theme === "dark" ? "Switch to light" : "Switch to dark";
    const nextMode = theme === "dark" ? "Dark mode" : "Light mode";
    button.dataset.themeState = theme;
    const label = button.querySelector("[data-theme-label]");
    if (label) {
      label.textContent = nextLabel;
    }
    const text = button.querySelector(".theme-toggle__text");
    if (text) {
      text.textContent = nextMode;
    }
  });
};

export const bindThemeToggles = (root = document) => {
  const buttons = root.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) {
    return;
  }
  updateThemeToggleLabels(root);
  buttons.forEach((button) => {
    if (button.dataset.themeToggleBound === "true") {
      return;
    }
    button.dataset.themeToggleBound = "true";
    button.addEventListener("click", (event) => {
      if (button.tagName === "A") {
        event.preventDefault();
      }
      const nextTheme = getTheme() === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });
};

export const initTheme = () => {
  applyInitialTheme();
};

applyInitialTheme();
