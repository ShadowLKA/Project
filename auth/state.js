// Note: Shared auth state helpers.
export const normalizePhone = (value) => {
  const trimmed = (value || "").trim();
  if (!trimmed) {
    return "";
  }
  if (!trimmed.startsWith("+")) {
    return "";
  }
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `+${digits}` : "";
};

export const syncAuthButtons = (state) => {
  const isLoggedIn = Boolean(state.currentSession);
  document.querySelectorAll("[data-auth-required]").forEach((button) => {
    button.classList.toggle("is-hidden", !isLoggedIn);
  });
  document.querySelectorAll("[data-auth-guest]").forEach((button) => {
    button.classList.toggle("is-hidden", isLoggedIn);
  });
  document.querySelectorAll("[data-consult-cta]").forEach((element) => {
    const shouldDisable = !isLoggedIn;
    element.classList.toggle("is-disabled", shouldDisable);
    if (element.classList.contains("hero-tab")) {
      element.classList.toggle("is-enabled", isLoggedIn);
    }
    if (element.tagName === "BUTTON") {
      element.disabled = shouldDisable;
      element.setAttribute("aria-disabled", shouldDisable ? "true" : "false");
    } else {
      element.setAttribute("aria-disabled", shouldDisable ? "true" : "false");
      element.tabIndex = shouldDisable ? -1 : 0;
    }
  });
};

export const setAuthState = (state, session) => {
  state.currentSession = session;
  document.body.classList.toggle("is-authenticated", Boolean(session?.user?.email));
  const email = session?.user?.email || "";
  const fullName = session?.user?.user_metadata?.full_name || "";
  const rawPhone = session?.user?.phone || session?.user?.user_metadata?.phone || "";
  const phone = normalizePhone(rawPhone) || rawPhone;
  if (session?.user?.email) {
    localStorage.setItem("accountEmail", email);
    if (fullName) {
      localStorage.setItem("accountName", fullName);
    } else {
      localStorage.removeItem("accountName");
    }
    if (phone) {
      localStorage.setItem("accountPhone", phone);
    } else {
      localStorage.removeItem("accountPhone");
    }
    localStorage.setItem("isLoggedIn", "true");
  } else {
    localStorage.removeItem("accountEmail");
    localStorage.removeItem("accountName");
    localStorage.removeItem("accountPhone");
    localStorage.removeItem("isLoggedIn");
  }
  window.dispatchEvent(
    new CustomEvent("auth:changed", {
      detail: { session: state.currentSession, email, fullName }
    })
  );
  syncAuthButtons(state);
};

export const consumePostAuthRedirect = () => {
  const target = sessionStorage.getItem("postAuthRedirect") || localStorage.getItem("postAuthRedirect");
  if (!target) {
    return;
  }
  sessionStorage.removeItem("postAuthRedirect");
  localStorage.removeItem("postAuthRedirect");
  if (target === "consult") {
    window.location.href = "./?page=consult";
    return;
  }
  if (target.startsWith("/") || target.startsWith("./")) {
    window.location.href = target;
    return;
  }
};

export const reloadAfterAuth = (state) => {
  if (state.isReloadingAfterAuth) {
    return;
  }
  state.isReloadingAfterAuth = true;
  document.body.classList.remove("no-scroll", "modal-open");
  document.documentElement.classList.remove("no-scroll");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.paddingRight = "";
  document.documentElement.style.removeProperty("--scrollbar-width");
  setTimeout(() => {
    state.isReloadingAfterAuth = false;
  }, 300);
};

export const bindAuthTargets = (state, openModal) => {
  if (state.hasBoundAuthTargets) {
    return;
  }
  document.querySelectorAll("[data-auth-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const isLoggedIn = Boolean(state.currentSession);
      if (isLoggedIn) {
        const targetModal = button.dataset.authTarget;
        if (targetModal) {
          openModal(targetModal);
        }
      } else {
        openModal("authModal");
      }
    });
  });
  state.hasBoundAuthTargets = true;
};
