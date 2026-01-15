// Note: Auth flows and Supabase integration.
import { getSupabaseClient } from "./supabase.js";
import { bindAuthTargets, consumePostAuthRedirect, normalizePhone, setAuthState, syncAuthButtons } from "./auth/state.js";
import { initAuthSession } from "./auth/session.js";

export function bindAuth({
  openModal,
  closeAllModals,
  setModalMessage,
  clearAuthForm
}) {
  const state = {
    getSupabaseClient,
    supabaseClient: getSupabaseClient(),
    currentSession: null,
    isReloadingAfterAuth: false,
    hasBoundAuthTargets: false,
    authInitStarted: false,
    authReady: false
  };

  initAuthSession({
    state,
    openModal,
    closeAllModals
  });

  syncAuthButtons(state);
  bindAuthTargets(state, openModal);

  const authModal = () => document.getElementById("authModal");
  const redirectTo = () => `${window.location.origin}${window.location.pathname}`;
  const setPostAuthRedirect = (target) => {
    if (!target) {
      return;
    }
    sessionStorage.setItem("postAuthRedirect", target);
    localStorage.setItem("postAuthRedirect", target);
  };
  const setButtonLoading = (button, isLoading, label) => {
    if (!button) {
      return;
    }
    if (isLoading) {
      button.dataset.originalLabel = button.dataset.originalLabel || button.textContent || "";
      button.textContent = label || button.textContent || "";
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      return;
    }
    button.textContent = button.dataset.originalLabel || button.textContent || "";
    delete button.dataset.originalLabel;
    button.disabled = false;
    button.removeAttribute("aria-busy");
  };
  const setButtonsLoading = (buttons, isLoading, label) => {
    buttons.forEach((button) => setButtonLoading(button, isLoading, label));
  };
  const storeCurrentLocation = () => {
    const target = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    setPostAuthRedirect(target);
  };

  const finalizeCallback = async () => {
    const supabaseClient = state.supabaseClient || getSupabaseClient();
    if (!supabaseClient) {
      return;
    }
    const url = new URL(window.location.href);
    const hasCode = url.searchParams.has("code");
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (!hasCode && !accessToken) {
      return;
    }
    try {
      if (hasCode && supabaseClient.auth.exchangeCodeForSession) {
        const { error } = await supabaseClient.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          console.error("[auth] callback:error", error);
        }
      } else if (accessToken && refreshToken) {
        const { error } = await supabaseClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        if (error) {
          console.error("[auth] callback:error", error);
        }
      }
      const { data } = await supabaseClient.auth.getSession();
      if (data?.session) {
        setAuthState(state, data.session);
      }
    } catch (error) {
      console.error("[auth] callback:error", error);
    } finally {
      const cleanUrl = `${window.location.origin}${window.location.pathname}`;
      history.replaceState(null, "", cleanUrl);
      closeAllModals();
      consumePostAuthRedirect();
    }
  };

  document.querySelectorAll("[data-consult-cta]").forEach((cta) => {
    if (cta.dataset.consultBound === "true") {
      return;
    }
    cta.dataset.consultBound = "true";
    cta.addEventListener("click", (event) => {
      if (state.currentSession) {
        return;
      }
      event.preventDefault();
      setPostAuthRedirect("consult");
      openModal("authModal");
    });
  });

  document.querySelectorAll("[data-auth-provider]").forEach((button) => {
    if (button.dataset.authBound === "true") {
      return;
    }
    button.dataset.authBound = "true";
    button.addEventListener("click", async () => {
      const provider = button.dataset.authProvider;
      const modal = authModal();
      if (!provider || !modal) {
        return;
      }
      const supabaseClient = state.supabaseClient || getSupabaseClient();
      if (!supabaseClient) {
        setModalMessage(modal, "Supabase failed to load. Please refresh and try again.");
        return;
      }
      setModalMessage(modal, "");
      storeCurrentLocation();
      const actionButtons = modal.querySelectorAll(
        "[data-auth-provider], [data-auth-passkey], [data-auth-login-form] button, [data-open-modal]"
      );
      setButtonsLoading(Array.from(actionButtons), true, "Connecting...");
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectTo() }
      });
      if (error) {
        console.error("[auth] oauth:error", error);
        setButtonsLoading(Array.from(actionButtons), false);
        setModalMessage(modal, error.message || "Unable to continue. Try again.");
      }
    });
  });

  const passkeyButton = document.querySelector("[data-auth-passkey]");
  if (passkeyButton) {
    const canUsePasskeys = Boolean(window.PublicKeyCredential);
    if (!canUsePasskeys || !state.supabaseClient?.auth?.signInWithWebAuthn) {
      passkeyButton.classList.add("is-hidden");
      console.warn("[auth] passkeys disabled: enable WebAuthn in Supabase Auth settings.");
    } else {
      passkeyButton.addEventListener("click", async () => {
        const modal = authModal();
        const supabaseClient = state.supabaseClient || getSupabaseClient();
        if (!modal || !supabaseClient?.auth?.signInWithWebAuthn) {
          return;
        }
        setModalMessage(modal, "");
        storeCurrentLocation();
        setButtonLoading(passkeyButton, true, "Connecting...");
        try {
          const { data, error } = await supabaseClient.auth.signInWithWebAuthn();
          if (error) {
            console.error("[auth] passkey:error", error);
            setModalMessage(modal, error.message || "Passkey sign-in failed. Try again.");
            return;
          }
          if (data?.session) {
            setAuthState(state, data.session);
            clearAuthForm(modal);
            closeAllModals();
            consumePostAuthRedirect();
          }
        } catch (error) {
          console.error("[auth] passkey:error", error);
          setModalMessage(modal, error?.message || "Passkey sign-in failed. Try again.");
        } finally {
          setButtonLoading(passkeyButton, false);
        }
      });
    }
  }
  const loginForm = document.querySelector("[data-auth-login-form]");
  if (loginForm) {
    const emailInput = loginForm.querySelector('input[name="loginEmail"]');
    const passwordInput = loginForm.querySelector('input[name="loginPassword"]');
    const errorEl = loginForm.querySelector("[data-auth-error]");
    const loginState = {
      hasFocused: false,
      hasBlurred: false,
      hasSubmitted: false,
      hasTyped: false
    };
    const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const clearAuthError = () => {
      if (!errorEl) {
        return;
      }
      errorEl.textContent = "";
      errorEl.classList.add("is-hidden");
      [emailInput, passwordInput].forEach((input) => {
        if (input) {
          input.removeAttribute("aria-invalid");
        }
      });
    };
    const showAuthError = (message, input) => {
      if (!errorEl) {
        return;
      }
      errorEl.textContent = message;
      errorEl.classList.remove("is-hidden");
      if (input) {
        input.setAttribute("aria-invalid", "true");
      }
    };

    if (errorEl) {
      errorEl.classList.add("is-hidden");
    }
    if (emailInput) {
      emailInput.addEventListener("focus", () => {
        loginState.hasFocused = true;
        clearAuthError();
      });
      emailInput.addEventListener("input", () => {
        loginState.hasTyped = true;
        clearAuthError();
      });
      emailInput.addEventListener("blur", () => {
        loginState.hasBlurred = true;
        const value = emailInput.value.trim();
        if (!value) {
          if (loginState.hasSubmitted) {
            showAuthError("Please enter your email.", emailInput);
          }
          return;
        }
        if (!isEmailValid(value) && loginState.hasTyped) {
          showAuthError("Please enter a valid email.", emailInput);
        }
      });
    }
    if (passwordInput) {
      passwordInput.addEventListener("focus", () => {
        clearAuthError();
      });
      passwordInput.addEventListener("input", () => {
        clearAuthError();
      });
    }

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (loginForm.dataset.requestPending === "true") {
        return;
      }
      const modal = authModal();
      const supabaseClient = state.supabaseClient || getSupabaseClient();
      if (!modal || !supabaseClient) {
        return;
      }
      if (!emailInput || !passwordInput) {
        return;
      }
      loginState.hasSubmitted = true;
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;
      if (!email) {
        showAuthError("Please enter your email.", emailInput);
        return;
      }
      if (!isEmailValid(email)) {
        showAuthError("Please enter a valid email.", emailInput);
        return;
      }
      if (!password) {
        showAuthError("Please enter your password.", passwordInput);
        return;
      }
      loginForm.dataset.requestPending = "true";
      setModalMessage(modal, "");
      const submitButton = loginForm.querySelector('button[type="submit"]');
      setButtonLoading(submitButton, true, "Logging in...");
      storeCurrentLocation();
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          console.error("[auth] login:error", error);
          setModalMessage(modal, error.message || "Could not log in. Try again.");
          return;
        }
        if (data?.session) {
          setAuthState(state, data.session);
          clearAuthForm(modal);
          closeAllModals();
          consumePostAuthRedirect();
        } else {
          setModalMessage(modal, "Logged in.", "success");
        }
      } catch (error) {
        console.error("[auth] login:error", error);
        setModalMessage(modal, error?.message || "Could not log in. Try again.");
      } finally {
        loginForm.dataset.requestPending = "false";
        setButtonLoading(submitButton, false);
      }
    });
  }

  const signupForm = document.querySelector("[data-auth-signup-form]");
  if (signupForm) {
    const emailInput = signupForm.querySelector('input[name="signupEmail"]');
    const phoneInput = signupForm.querySelector('input[name="signupPhone"]');
    const passwordInput = signupForm.querySelector('input[name="signupPassword"]');
    const errorEl = signupForm.querySelector("[data-auth-error]");
    const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const clearAuthError = () => {
      if (!errorEl) {
        return;
      }
      errorEl.textContent = "";
      errorEl.classList.add("is-hidden");
      [emailInput, phoneInput, passwordInput].forEach((input) => {
        if (input) {
          input.removeAttribute("aria-invalid");
        }
      });
    };
    const showAuthError = (message, input) => {
      if (!errorEl) {
        return;
      }
      errorEl.textContent = message;
      errorEl.classList.remove("is-hidden");
      if (input) {
        input.setAttribute("aria-invalid", "true");
      }
    };

    if (errorEl) {
      errorEl.classList.add("is-hidden");
    }
    if (emailInput) {
      emailInput.addEventListener("focus", clearAuthError);
      emailInput.addEventListener("input", clearAuthError);
    }
    if (phoneInput) {
      phoneInput.addEventListener("focus", clearAuthError);
      phoneInput.addEventListener("input", clearAuthError);
    }
    if (passwordInput) {
      passwordInput.addEventListener("focus", clearAuthError);
      passwordInput.addEventListener("input", clearAuthError);
    }

    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (signupForm.dataset.requestPending === "true") {
        return;
      }
      const modal = document.getElementById("createAccountModal");
      const supabaseClient = state.supabaseClient || getSupabaseClient();
      if (!modal || !supabaseClient) {
        return;
      }
      if (!emailInput || !passwordInput) {
        return;
      }
      const email = emailInput.value.trim().toLowerCase();
      const rawPhone = phoneInput?.value.trim() || "";
      const phone = rawPhone ? normalizePhone(rawPhone) : "";
      const password = passwordInput.value;
      if (!email) {
        showAuthError("Please enter your email.", emailInput);
        return;
      }
      if (!isEmailValid(email)) {
        showAuthError("Please enter a valid email.", emailInput);
        return;
      }
      if (rawPhone && !phone) {
        showAuthError("Please enter a phone number in + country format.", phoneInput);
        return;
      }
      if (!password || password.length < 8) {
        showAuthError("Password must be at least 8 characters.", passwordInput);
        return;
      }
      signupForm.dataset.requestPending = "true";
      setModalMessage(modal, "");
      const submitButton = signupForm.querySelector('button[type="submit"]');
      setButtonLoading(submitButton, true, "Creating...");
      storeCurrentLocation();
      try {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo(),
            data: { phone: phone || null }
          }
        });
        if (error) {
          console.error("[auth] signup:error", error);
          setModalMessage(modal, error.message || "Could not create the account. Try again.");
          return;
        }
        setModalMessage(modal, "Account created. Check your email to confirm.", "success");
        signupForm.reset();
        clearAuthError();
      } catch (error) {
        console.error("[auth] signup:error", error);
        setModalMessage(modal, error?.message || "Could not create the account. Try again.");
      } finally {
        signupForm.dataset.requestPending = "false";
        setButtonLoading(submitButton, false);
      }
    });
  }

  window.addEventListener("auth:required", () => {
    if (!state.currentSession && localStorage.getItem("authModalSeen") !== "1") {
      localStorage.setItem("authModalSeen", "1");
      openModal("authModal");
    }
  });

  finalizeCallback();
}













