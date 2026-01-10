(function () {
  var stored = null;
  try {
    stored = localStorage.getItem("siteTheme");
  } catch (error) {
    stored = null;
  }
  var isDark = stored === "dark";
  var root = document.documentElement;
  if (isDark) {
    root.classList.add("theme-dark");
  } else {
    root.classList.remove("theme-dark");
  }
  root.dataset.theme = isDark ? "dark" : "light";
  root.dataset.themeResolved = isDark ? "dark" : "light";
})();
