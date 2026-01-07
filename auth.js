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

  window.addEventListener("modal:closed", (event) => {
    if (event.detail?.id !== "signupModal") {
      if (event.detail?.id === "loginModal") {
        state.pendingLoginEmail = "";
        resetLoginOtpUi(document.getElementById("loginModal"));
      }
      return;
    }
    state.pendingSignupEmail = "";
    resetSignupOtpUi(document.getElementById("signupModal"), setModalMessage);
  });
}
