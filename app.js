// Note: App entry point that wires components together.
import siteData from "./siteData.js";
import { renderHeader, bindHeader } from "./header.js";
import { renderFooter } from "./footer.js";
import { renderHome } from "./home.js";
import { renderConsultForm, initConsultForm } from "./consultForm.js";
import { renderServices } from "./services.js";
import { renderProcess } from "./process.js";
import { renderContact } from "./contact.js";
import { renderTeamPage, initTeamPage } from "./team.js";
import { renderNewsPage, initNewsPage } from "./news.js";
import { renderModal, bindModal } from "./modal.js";
import { renderSettings, initSettingsPage } from "./settings.js";
import { renderExpertSecondOpinion } from "./ExpertSecondOpinion.js";
import { renderMultiSpecialistReview } from "./MultiSpecialistReview.js";
import { renderUSVisitCoordination } from "./USVisitCoordination.js";
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
      const expanded = mobile
        ? hasStored
          ? stored === "true"
          : isMobileMenuPanel
            ? true
            : !isFooterPanel
        : true;
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
  const isConsultPage = currentPage === "consult";
  const isExpertService = currentPage === "service-expert-second-opinion";
  const isMultiService = currentPage === "service-multi-specialist-review";
  const isVisitService = currentPage === "service-us-visit-coordination";

  if (isConsultPage) {
    app.innerHTML = renderConsultForm(siteData.pages.consultForm);
  } else if (isSettingsPage) {
    app.innerHTML = renderSettings(siteData.pages.settings);
  } else if (isTeamPage) {
    app.innerHTML = renderTeamPage(siteData.pages.team);
  } else if (isExpertService) {
    app.innerHTML = renderExpertSecondOpinion(siteData.pages.serviceDetails?.expertSecondOpinion);
  } else if (isMultiService) {
    app.innerHTML = renderMultiSpecialistReview(siteData.pages.serviceDetails?.multiSpecialistReview);
  } else if (isVisitService) {
    app.innerHTML = renderUSVisitCoordination(siteData.pages.serviceDetails?.usVisitCoordination);
  } else if (currentPage === "news") {
    app.innerHTML = renderNewsPage(siteData.pages.news);
  } else {
    app.innerHTML = [
      renderHome(siteData.pages.home.hero),
      renderServices(siteData.pages.services),
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
  if (isConsultPage) {
    initConsultForm();
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

let bottomBarBound = false;
let hasUserScrolled = false;

const setupBottomBar = () => {
  const minScroll = 40;
  const updateBottomBar = () => {
    const bottomBar = document.getElementById("bottomBar");
    if (!bottomBar) {
      return;
    }
    if (document.body.classList.contains("modal-open")) {
      bottomBar.classList.remove("bottom-bar--visible");
      return;
    }
    const doc = document.documentElement;
    const offset = 40;
    const scrollY = window.scrollY;
    const reachedBottom = scrollY + window.innerHeight >= doc.scrollHeight - offset;
    const canShow = hasUserScrolled && scrollY >= minScroll && doc.scrollHeight > window.innerHeight + minScroll;
    bottomBar.classList.toggle("bottom-bar--visible", canShow && reachedBottom);
  };

  updateBottomBar();
  if (bottomBarBound) {
    return;
  }
  bottomBarBound = true;
  window.addEventListener(
    "scroll",
    () => {
      hasUserScrolled = true;
      updateBottomBar();
    },
    { passive: true }
  );
  window.addEventListener("resize", updateBottomBar);
};

setupBottomBar();

let hasSeenAuthEvent = false;
let lastAuthUserId = null;

window.addEventListener("auth:changed", (event) => {
  const nextId = event.detail?.session?.user?.id || null;
  if (!hasSeenAuthEvent) {
    hasSeenAuthEvent = true;
    lastAuthUserId = nextId;
    return;
  }
  if (nextId !== lastAuthUserId) {
    lastAuthUserId = nextId;
    window.location.reload();
  }
});


document.addEventListener(
  "click",
  (event) => {
    const targetEl = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!targetEl) {
      return;
    }
    const routeLink = targetEl.closest("[data-route]");
    if (routeLink) {
      event.preventDefault();
      const nextRoute = routeLink.getAttribute("data-route");
      if (nextRoute) {
        history.pushState(null, "", nextRoute);
        renderApp();
        scrollToSectionIfNeeded();
        scrollToTopIfNeeded();
      }
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
      const currentPage = getPage();
      if (currentPage) {
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
    const currentPage = getPage();
    if (currentPage) {
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

const scrollToTopIfNeeded = () => {
  if (getSection()) {
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

const initialSection = getSection();
const scrollToSectionIfNeeded = () => {
  const section = getSection();
  if (!section) {
    return;
  }
  const target = document.getElementById(section);
  if (!target) {
    return;
  }
  const headerOffset = getComputedStyle(document.documentElement).getPropertyValue("--nav-height");
  const offset = parseFloat(headerOffset) || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  stripSectionParam();
};

if (initialSection) {
  scrollToSectionIfNeeded();
} else {
  scrollToTopIfNeeded();
}

window.addEventListener("popstate", () => {
  renderApp();
  scrollToSectionIfNeeded();
  scrollToTopIfNeeded();
});
