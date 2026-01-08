// Note: App entry point that wires components together.
import siteData from "./siteData.js";
import { renderHeader, bindHeader } from "./header.js";
import { renderFooter } from "./footer.js";
import { renderHome } from "./home.js";
import { renderConsultForm } from "./consultForm.js";
import { renderAdvisors } from "./advisors.js";
import { renderProcess } from "./process.js";
import { renderContact } from "./contact.js";
import { renderTeamPage, initTeamPage } from "./team.js";
import { renderNewsPage, initNewsPage } from "./news.js";
import { renderModal, bindModal } from "./modal.js";
import { renderSettings, initSettingsPage } from "./settings.js";
import { initTheme } from "./theme.js";

const headerEl = document.getElementById("siteHeader");
const app = document.getElementById("app");
const footerEl = document.getElementById("siteFooter");
let accordionsBound = false;
let refreshAccordions = null;

function bindAccordions() {
  if (accordionsBound) {
    if (typeof refreshAccordions === "function") {
      refreshAccordions();
    }
    return;
  }
  accordionsBound = true;

  const isMobile = () => window.innerWidth <= 720;
  const triggers = () => Array.from(document.querySelectorAll("[data-accordion-trigger]"));

  const setState = (trigger, panel, expanded, animate = true, lockOpen = false) => {
    if (!trigger || !panel) {
      return;
    }
    if (lockOpen) {
      trigger.setAttribute("aria-expanded", "true");
      panel.classList.add("is-open");
      panel.style.maxHeight = "";
      return;
    }
    trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    panel.classList.toggle("is-open", expanded);
    if (!isMobile()) {
      panel.style.maxHeight = "";
      return;
    }
    if (!animate) {
      panel.style.transition = "none";
    }
    panel.style.maxHeight = expanded ? `${panel.scrollHeight}px` : "0px";
    if (!animate) {
      requestAnimationFrame(() => {
        panel.style.transition = "";
      });
    }
  };

  const initTriggers = () => {
    const mobile = isMobile();
    triggers().forEach((trigger) => {
      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) {
        return;
      }
      const stored = sessionStorage.getItem(`accordion:${panelId}`);
      const isFooterPanel = panelId.startsWith("footer-section-");
      const isMobileMenuPanel = panelId.startsWith("mobile-menu-");
      const hasStored = stored === "true" || stored === "false";
      const expanded = mobile ? (hasStored ? stored === "true" : !isMobileMenuPanel) : true;
      setState(trigger, panel, expanded, false, isMobileMenuPanel);
    });
  };
  refreshAccordions = initTriggers;

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }
    const trigger = target.closest("[data-accordion-trigger]");
    if (!trigger) {
      return;
    }
    if (!isMobile()) {
      return;
    }
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) {
      return;
    }
    if (panelId.startsWith("mobile-menu-")) {
      return;
    }
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    setState(trigger, panel, !isExpanded);
    sessionStorage.setItem(`accordion:${panelId}`, (!isExpanded).toString());
  });

  window.addEventListener("resize", initTriggers);
  initTriggers();
}

if (window.location.pathname.endsWith("/index.html")) {
  const cleanPath = window.location.pathname.replace(/index\.html$/, "");
  history.replaceState(null, "", `${cleanPath}${window.location.search}${window.location.hash}`);
}

const getPage = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("page");
};

const getSection = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("section");
};

const stripSectionParam = () => {
  const params = new URLSearchParams(window.location.search);
  params.delete("section");
  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  history.replaceState(null, "", nextUrl);
};

function renderApp() {
  headerEl.innerHTML = renderHeader(siteData.brand, siteData.nav);
  bindHeader(headerEl);
  const currentPage = getPage();
  const isTeamPage = currentPage === "team";
  const isSettingsPage = currentPage === "settings";

  if (currentPage === "consult") {
    app.innerHTML = renderConsultForm(siteData.pages.consultForm);
  } else if (isSettingsPage) {
    app.innerHTML = renderSettings(siteData.pages.settings);
  } else if (isTeamPage) {
    app.innerHTML = renderTeamPage(siteData.pages.team);
  } else if (currentPage === "news") {
    app.innerHTML = renderNewsPage(siteData.pages.news);
  } else {
    app.innerHTML = [
      renderHome(siteData.pages.home.hero),
      renderAdvisors(siteData.pages.advisors),
      renderProcess(siteData.pages.process),
      renderContact(siteData.pages.contact)
    ].join("");
  }

  footerEl.innerHTML = renderFooter(siteData.footer, siteData.license, siteData.footerContact);

  if (!document.getElementById("signupModal")) {
    document.body.insertAdjacentHTML("beforeend", renderModal());
  }

  bindModal();
  bindAccordions();
  if (isTeamPage) {
    initTeamPage();
  }
  if (isSettingsPage) {
    initSettingsPage();
  }
  if (currentPage === "news") {
    initNewsPage();
  }

  const heroVideo = document.querySelector(".hero-visual-photo video");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.loop = true;
    heroVideo.autoplay = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute("muted", "");
    heroVideo.setAttribute("playsinline", "");
    heroVideo.setAttribute("webkit-playsinline", "");
  }
}

initTheme();
renderApp();

const setupBottomBar = () => {
  const bottomBar = document.getElementById("bottomBar");
  if (!bottomBar) {
    return;
  }

  const updateBottomBar = () => {
    const doc = document.documentElement;
    const offset = 40;
    const reachedBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - offset;
    bottomBar.classList.toggle("bottom-bar--visible", reachedBottom);
  };

  updateBottomBar();
  window.addEventListener("scroll", updateBottomBar, { passive: true });
  window.addEventListener("resize", updateBottomBar);
};

setupBottomBar();

document.addEventListener(
  "click",
  (event) => {
    const targetEl = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!targetEl) {
      return;
    }
    const link = targetEl.closest("a[href^=\"#\"]");
    if (!link) {
      const button = targetEl.closest("[data-scroll-target]");
      if (!button) {
        return;
      }
      const buttonTargetId = button.getAttribute("data-scroll-target");
      if (!buttonTargetId) {
        return;
      }
      const buttonTarget = document.querySelector(buttonTargetId);
      if (!buttonTarget) {
        return;
      }
      event.preventDefault();
      if (
        getPage() === "consult" ||
        getPage() === "team" ||
        getPage() === "news" ||
        getPage() === "settings"
      ) {
        window.location.href = `./?section=${buttonTargetId.replace("#", "")}`;
        return;
      }
      buttonTarget.scrollIntoView({ behavior: "smooth", block: "start" });
      stripSectionParam();
      return;
    }
    const targetId = link.getAttribute("href");
    if (!targetId) {
      return;
    }
    const anchorTarget = document.querySelector(targetId);
    event.preventDefault();
    if (
      getPage() === "consult" ||
      getPage() === "team" ||
      getPage() === "news" ||
      getPage() === "settings"
    ) {
      window.location.href = `./?section=${targetId.replace("#", "")}`;
      return;
    }
    if (!anchorTarget) {
      return;
    }
    const headerOffset = getComputedStyle(document.documentElement).getPropertyValue("--nav-height");
    const offset = parseFloat(headerOffset) || 0;
    const top = anchorTarget.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    stripSectionParam();
  },
  true
);

const initialSection = getSection();
if (initialSection) {
  const initialTarget = document.getElementById(initialSection);
  if (initialTarget) {
    const headerOffset = getComputedStyle(document.documentElement).getPropertyValue("--nav-height");
    const offset = parseFloat(headerOffset) || 0;
    const top = initialTarget.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    stripSectionParam();
  }
}
