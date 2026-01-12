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

  var handleFirstTab = function (event) {
    if (event.key !== "Tab") {
      return;
    }
    root.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDownOnce);
    window.addEventListener("touchstart", handleMouseDownOnce);
  };

  var handleMouseDownOnce = function () {
    root.classList.remove("user-is-tabbing");
    window.removeEventListener("mousedown", handleMouseDownOnce);
    window.removeEventListener("touchstart", handleMouseDownOnce);
    window.addEventListener("keydown", handleFirstTab);
  };

  window.addEventListener("keydown", handleFirstTab);
})();
