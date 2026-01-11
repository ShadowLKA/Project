// Note: Session bootstrap and Supabase readiness.
import { consumePostAuthRedirect, setAuthState, reloadAfterAuth } from "./state.js";

export const initAuthSession = ({ state, openModal, closeAllModals }) => {
  const maybePromptSignup = () => {
    if (state.hasPromptedSignup || state.currentSession || !state.authReady) {
      return;
    }
    if (sessionStorage.getItem("signupPrompted") === "true") {
      state.hasPromptedSignup = true;
      return;
    }
    sessionStorage.setItem("signupPrompted", "true");
    state.hasPromptedSignup = true;
    openModal("signupModal");
    const modal = document.getElementById("signupModal");
    if (modal) {
      modal.dataset.lockBackdrop = "true";
    }
  };

  const initSession = async () => {
    const supabaseClient = state.supabaseClient;
    if (!supabaseClient) {
      return;
    }
    if (sessionStorage.getItem("pendingEmailLogin") === "true") {
      await supabaseClient.auth.signOut();
      setAuthState(state, null);
      state.authReady = true;
      return;
    }
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const session = sessionData?.session || null;
    if (session) {
      const { data: userData, error: userError } = await supabaseClient.auth.getUser();
      if (userError || !userData?.user) {
        setAuthState(state, null);
      } else {
        setAuthState(state, session);
        consumePostAuthRedirect();
      }
    } else {
      setAuthState(state, null);
    }
    state.authReady = true;
    maybePromptSignup();
  };

  const startAuthInit = () => {
    if (state.authInitStarted || !state.supabaseClient) {
      return;
    }
    state.authInitStarted = true;
    state.supabaseClient.auth.onAuthStateChange((_event, session) => {
      setAuthState(state, session);
      if (session) {
        consumePostAuthRedirect();
      }
      if (session && document.querySelector(".modal.is-open")) {
        closeAllModals();
        reloadAfterAuth(state);
      }
    });
    initSession();
  };

  const waitForSupabase = () => {
    if (state.supabaseClient) {
      startAuthInit();
      return;
    }
    setTimeout(() => {
      state.supabaseClient = state.getSupabaseClient();
      if (state.supabaseClient) {
        startAuthInit();
      } else {
        waitForSupabase();
      }
    }, 150);
  };

  if (state.supabaseClient) {
    startAuthInit();
  } else {
    waitForSupabase();
  }
};
