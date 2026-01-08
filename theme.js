const THEME_KEY = "siteTheme";

export const getTheme = () => localStorage.getItem(THEME_KEY) || "light";

export const applyTheme = (theme) => {
  document.documentElement.classList.toggle("theme-dark", theme === "dark");
};

export const setTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
};

export const initTheme = () => {
  applyTheme(getTheme());
};
