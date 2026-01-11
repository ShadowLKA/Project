// Note: Header layout and navigation rendering.
import { getSupabaseClient } from "./supabase.js";
import { setAuthState } from "./auth/state.js";
import { bindThemeToggles } from "./theme.js";
export function renderHeader(brand, nav) {
  const navItems = nav
    .map(
      (item) => `
        <li class="nav-item">
          <a href="${item.hash}">${item.label}</a>
        </li>`
    )
    .join("");
  const settingsItem = `
    <li class="nav-item nav-item--settings">
      <a href="./?page=settings">Settings</a>
    </li>`;
  const themeToggleItem = `
    <li class="nav-item">
      <a href="#" data-theme-toggle aria-label="Toggle dark mode">
        <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" role="presentation">
            <path d="M12 4.25a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V5a.75.75 0 0 1 .75-.75Zm5.657 2.093a.75.75 0 0 1 1.06 0l1.237 1.238a.75.75 0 1 1-1.06 1.06l-1.237-1.237a.75.75 0 0 1 0-1.061Zm-11.314 0a.75.75 0 0 1 0 1.06L5.106 8.64a.75.75 0 1 1-1.06-1.06l1.237-1.237a.75.75 0 0 1 1.06 0ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm8.75 3a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Zm-16.5 0a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Zm14.204 6.409a.75.75 0 0 1 0 1.06l-1.237 1.238a.75.75 0 0 1-1.06-1.06l1.237-1.238a.75.75 0 0 1 1.06 0ZM6.583 17.66a.75.75 0 0 1 0 1.06l-1.237 1.238a.75.75 0 0 1-1.06-1.06l1.237-1.238a.75.75 0 0 1 1.06 0ZM12 18.25a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V19a.75.75 0 0 1 .75-.75Z"></path>
          </svg>
        </span>
        <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" role="presentation">
            <path d="M15.5 3.5a.75.75 0 0 1 .739.89 6.75 6.75 0 1 0 7.372 7.372.75.75 0 0 1 .89.739 9 9 0 1 1-9-9Z"></path>
          </svg>
        </span>
        <span class="theme-toggle__text" aria-hidden="true">Dark mode</span>
        <span class="visually-hidden" data-theme-label>Switch to dark</span>
      </a>
    </li>`;

  return `
    <nav id="navbar">
      <div class="container nav-container">
        <div class="nav-left">
          <div class="logo">
            <span class="logo-mark"></span>
            <span>${brand.name}</span>
          </div>
        </div>
        <div class="nav-center">
          <ul class="nav-links">${navItems}${settingsItem}</ul>
        </div>
        <div class="nav-right">
          <div class="nav-actions">
            <div class="nav-auth-slot">
              <div class="nav-auth" data-auth-guest>
                <button class="btn btn-ghost" type="button" data-open-modal="signupModal">Create account</button>
                <a class="btn btn-primary" href="./?page=consult" data-consult-cta>${brand.navPrimary}</a>
              </div>
              <div class="nav-auth is-hidden" data-auth-required>
                <button class="btn btn-ghost" type="button" data-logout>Log out</button>
                <a class="btn btn-primary" href="./?page=consult" data-consult-cta>${brand.navPrimary}</a>
              </div>
            </div>
          </div>
          <button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobileMenu" aria-haspopup="dialog">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-menu-backdrop" data-mobile-backdrop></div>
      <div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Mobile menu" tabindex="-1">
        <div class="drawer-body">
          <div class="mobile-menu__section">
            <button class="mobile-menu__title" type="button">
              Navigation
            </button>
            <div class="mobile-menu__panel" id="mobile-menu-nav">
              <ul class="mobile-menu__list">
                ${navItems}
                ${settingsItem}
              </ul>
            </div>
          </div>
        </div>
        <div class="drawer-actions">
          ${themeToggleItem.replace("nav-item", "nav-item drawer-theme-toggle")}
          <span class="mobile-menu__title">Account</span>
          <div class="nav-auth" data-auth-guest>
            <button class="btn btn-ghost" type="button" data-open-modal="signupModal">Create account</button>
            <a class="btn btn-primary" href="./?page=consult" data-consult-cta>${brand.navPrimary}</a>
          </div>
          <div class="nav-auth is-hidden" data-auth-required>
            <button class="btn btn-ghost" type="button" data-logout>Log out</button>
            <a class="btn btn-primary" href="./?page=consult" data-consult-cta>${brand.navPrimary}</a>
          </div>
        </div>
      </div>
      <div class="nav-status is-hidden" data-auth-required>
        <span class="nav-auth__label">Signed in</span>
        <span class="nav-auth__name" data-account-email></span>
      </div>
    </nav>
  `;
}

export function bindHeader(headerEl) {
  const supabaseClient = getSupabaseClient();
  const mobileMenuBtn = headerEl.querySelector("#mobileMenuBtn");
  const mobileMenu = headerEl.querySelector("#mobileMenu");
  const mobileBackdrop = headerEl.querySelector("[data-mobile-backdrop]");
  const mobileQuery = window.matchMedia("(max-width: 720px)");

  if (!mobileMenuBtn || !mobileMenu) {
    return;
  }
  let lastFocused = null;
  let focusables = [];

  const setScrollLock = (locked) => {
    document.body.classList.toggle("no-scroll", locked);
    document.documentElement.classList.toggle("no-scroll", locked);
    document.body.style.overflow = locked ? "hidden" : "";
  };

  const getFocusable = () =>
    Array.from(
      mobileMenu.querySelectorAll(
        "a[href], button:not([disabled]), [tabindex]:not([tabindex=\"-1\"])"
      )
    ).filter((el) => !el.hasAttribute("disabled"));

  const handleMenuKeydown = (event) => {
    if (!mobileMenu.classList.contains("active")) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileMenu();
      return;
    }
    if (event.key !== "Tab") {
      return;
    }
    focusables = getFocusable();
    if (!focusables.length) {
      event.preventDefault();
      mobileMenu.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openMobileMenu = () => {
    if (mobileMenu.classList.contains("active")) {
      return;
    }
    lastFocused = document.activeElement;
    mobileMenu.classList.add("active");
    headerEl.classList.add("nav-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    setScrollLock(true);
    focusables = getFocusable();
    const focusTarget = focusables[0] || mobileMenu;
    if (focusTarget) {
      focusTarget.focus();
    }
    document.addEventListener("keydown", handleMenuKeydown);
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove("active");
    headerEl.classList.remove("nav-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    setScrollLock(false);
    document.removeEventListener("keydown", handleMenuKeydown);
    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  };

  closeMobileMenu();

  const syncNavHeight = () => {
    const height = headerEl.offsetHeight || 72;
    document.documentElement.style.setProperty("--nav-height", `${height}px`);
    if (window.innerWidth <= 720) {
      document.body.style.paddingTop = `${height}px`;
    } else {
      document.body.style.paddingTop = "";
    }
  };

  const scrollThreshold = 12;
  let lastScrollY = window.scrollY;
  let navHidden = false;
  let scrollTicking = false;

  const setNavHidden = (hidden) => {
    if (navHidden === hidden) {
      return;
    }
    navHidden = hidden;
    headerEl.classList.toggle("nav-hidden", hidden);
  };

  const handleScroll = () => {
    if (!mobileQuery.matches) {
      setNavHidden(false);
      lastScrollY = window.scrollY;
      return;
    }
    if (headerEl.classList.contains("nav-open")) {
      setNavHidden(false);
      lastScrollY = window.scrollY;
      return;
    }
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    if (Math.abs(delta) < scrollThreshold) {
      return;
    }
    if (currentY <= scrollThreshold) {
      setNavHidden(false);
      lastScrollY = currentY;
      return;
    }
    setNavHidden(delta > 0);
    lastScrollY = currentY;
  };

  const onScroll = () => {
    if (scrollTicking) {
      return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      handleScroll();
      scrollTicking = false;
    });
  };

  const confirmMenuState = (isLoggedIn) => {
    headerEl.querySelectorAll("[data-auth-required]").forEach((el) => {
      el.classList.toggle("is-hidden", !isLoggedIn);
    });
    headerEl.querySelectorAll("[data-auth-guest]").forEach((el) => {
      el.classList.toggle("is-hidden", isLoggedIn);
    });
  };

  mobileMenuBtn.addEventListener("click", () => {
    if (mobileMenu.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeMobileMenu);
  }

  mobileMenu.querySelectorAll("a, button").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = event.currentTarget;
      if (target instanceof Element && target.hasAttribute("data-accordion-trigger")) {
        return;
      }
      closeMobileMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMobileMenu();
    }
    syncNavHeight();
    if (!mobileQuery.matches) {
      setNavHidden(false);
    }
    lastScrollY = window.scrollY;
  });

  syncNavHeight();
  bindThemeToggles(headerEl);

  const setHeaderAuthState = (session) => {
    const isLoggedIn = Boolean(session);
    confirmMenuState(isLoggedIn);
    const fullName = session?.user?.user_metadata?.full_name || "";
    const email = session?.user?.email || "";
    const label = fullName || email;
    headerEl.querySelectorAll("[data-account-email]").forEach((node) => {
      node.textContent = label ? `(${label})` : "";
    });
  };

  confirmMenuState(false);

  window.addEventListener("auth:changed", (event) => {
    setHeaderAuthState(event.detail?.session || null);
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  handleScroll();

  if (supabaseClient) {
    const fetchSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setHeaderAuthState(data?.session || null);
    };
    fetchSession();
    setTimeout(fetchSession, 800);
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setHeaderAuthState(session);
    });
  }

  const forceLocalLogout = () => {
    sessionStorage.removeItem("pendingEmailLogin");
    setAuthState({ currentSession: null }, null);
  };

  headerEl.querySelectorAll("[data-logout]").forEach((button) => {
    if (button.dataset.logoutBound === "true") {
      return;
    }
    button.dataset.logoutBound = "true";
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      if (button.dataset.logoutPending === "true") {
        return;
      }
      button.dataset.logoutPending = "true";
      button.disabled = true;

      try {
        if (supabaseClient) {
          const { error } = await supabaseClient.auth.signOut();
          if (error) {
            await supabaseClient.auth.signOut({ scope: "local" });
          }
        }
      } catch (_error) {
        if (supabaseClient) {
          try {
            await supabaseClient.auth.signOut({ scope: "local" });
          } catch (_ignore) {
          }
        }
      } finally {
        forceLocalLogout();
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          if (params.get("page") === "consult") {
            window.location.href = "./";
          } else {
            window.location.reload();
          }
        }, 150);
        button.disabled = false;
        button.dataset.logoutPending = "false";
      }
    });
  });
}
