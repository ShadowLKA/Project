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
          <ul class="nav-links">${navItems}</ul>
        </div>
        <div class="nav-right">
          <div class="nav-actions">
            <div class="nav-auth-slot">
              <div class="nav-auth" data-auth-guest>
                <button class="btn btn-ghost" type="button" data-open-modal="signupModal">Create account</button>
                <a class="btn btn-primary" href="index.html?page=consult" data-consult-cta>${brand.navPrimary}</a>
              </div>
              <div class="nav-auth is-hidden" data-auth-required>
                <button class="btn btn-ghost" type="button" data-logout>Log out</button>
                <a class="btn btn-primary" href="index.html?page=consult" data-consult-cta>${brand.navPrimary}</a>
              </div>
            </div>
          </div>
          <div class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu">
        <ul>
          ${navItems}
          <li class="mobile-actions">
            <div class="nav-auth" data-auth-guest>
              <button class="btn btn-ghost" type="button" data-open-modal="signupModal">Create account</button>
              <a class="btn btn-primary" href="index.html?page=consult" data-consult-cta>${brand.navPrimary}</a>
            </div>
            <div class="nav-auth is-hidden" data-auth-required>
              <button class="btn btn-ghost" type="button" data-logout>Log out</button>
              <a class="btn btn-primary" href="index.html?page=consult" data-consult-cta>${brand.navPrimary}</a>
            </div>
          </li>
        </ul>
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

  if (!mobileMenuBtn || !mobileMenu) {
    return;
  }

  const setScrollLock = (locked) => {
    document.body.classList.toggle("no-scroll", locked);
    document.documentElement.classList.toggle("no-scroll", locked);
    document.body.style.overflow = locked ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove("active");
    headerEl.classList.remove("nav-open");
    setScrollLock(false);
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
    mobileMenu.classList.toggle("active");
    const isOpen = mobileMenu.classList.contains("active");
    headerEl.classList.toggle("nav-open", isOpen);
    setScrollLock(isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
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
          window.location.href = "index.html";
        } else {
          window.location.reload();
        }
      }, 150);
    });
  });
}
