// Note: Auth flows and Supabase integration.
import { getSupabaseClient } from "./supabase.js";
import { bindAuthTargets, syncAuthButtons } from "./auth/state.js";
import { hideLoginOtpSection, resetLoginOtpUi, resetSignupOtpUi } from "./auth/ui.js";
import { bindSignup } from "./auth/signup.js";
import { bindLogin } from "./auth/login.js";
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
    pendingSignupEmail: "",
    pendingLoginEmail: "",
    isReloadingAfterAuth: false,
    hasBoundAuthTargets: false,
    authInitStarted: false
  };

  bindSignup({
    state,
    setModalMessage,
    clearAuthForm,
    closeAllModals
  });

  bindLogin({
    state,
    setModalMessage,
    clearAuthForm,
    closeAllModals
  });

  initAuthSession({
    state,
    openModal,
    closeAllModals
  });

  hideLoginOtpSection();
  syncAuthButtons(state);
  bindAuthTargets(state, openModal);
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
      sessionStorage.setItem("postAuthRedirect", "consult");
      openModal("loginModal");
    });
  });

  window.addEventListener("modal:closed", (event) => {
    const closedId = event.detail?.id;
    if ((closedId === "loginModal" || closedId === "signupModal") && !state.currentSession) {
      sessionStorage.removeItem("postAuthRedirect");
    }
    if (closedId !== "signupModal") {
      if (closedId === "loginModal") {
        state.pendingLoginEmail = "";
        resetLoginOtpUi(document.getElementById("loginModal"));
      }
      return;
    }
    state.pendingSignupEmail = "";
    resetSignupOtpUi(document.getElementById("signupModal"), setModalMessage);
  });
}
