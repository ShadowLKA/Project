const THEME_KEY = "siteTheme";

export const getTheme = () => localStorage.getItem(THEME_KEY) || "light";

export const applyTheme = (theme) => {
  document.documentElement.classList.toggle("theme-dark", theme === "dark");
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
};

export const updateThemeToggleLabels = (root = document) => {
  const theme = getTheme();
  root.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const nextLabel = theme === "dark" ? "Switch to light" : "Switch to dark";
    button.dataset.themeState = theme;
    const label = button.querySelector("[data-theme-label]");
    if (label) {
      label.textContent = nextLabel;
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
      updateThemeToggleLabels(document);
    });
  });
};

export const initTheme = () => {
  applyTheme(getTheme());
};
