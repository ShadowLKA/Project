// Note: Header layout and navigation rendering.
import { getSupabaseClient } from "./supabase.js";
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
        <div class="mobile-menu__section">
          <button
            class="mobile-menu__title"
            type="button"
            data-accordion-trigger
            aria-expanded="false"
            aria-controls="mobile-menu-nav"
          >
            Navigation
          </button>
          <div class="mobile-menu__panel" id="mobile-menu-nav" data-accordion-panel>
            <ul class="mobile-menu__list">
              ${navItems}
              ${settingsItem}
            </ul>
          </div>
        </div>
        <div class="mobile-menu__section">
          <button
            class="mobile-menu__title"
            type="button"
            data-accordion-trigger
            aria-expanded="false"
            aria-controls="mobile-menu-account"
          >
            Account
          </button>
          <div class="mobile-menu__panel" id="mobile-menu-account" data-accordion-panel>
            <div class="mobile-actions">
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
  });

  syncNavHeight();

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

  headerEl.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!supabaseClient) {
        return;
      }
      await supabaseClient.auth.signOut();
      localStorage.removeItem("accountEmail");
      localStorage.removeItem("accountName");
      localStorage.removeItem("accountPhone");
      localStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("pendingEmailLogin");
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("page") === "consult") {
          window.location.href = "./";
        } else {
          window.location.reload();
        }
      }, 150);
    });
  });
}
