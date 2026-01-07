// Note: Login flow (email + OTP).
import { setAuthState, reloadAfterAuth } from "./state.js";
import { showLoginOtpSection } from "./ui.js";

export const bindLogin = ({
  state,
  setModalMessage,
  clearAuthForm,
  closeAllModals
}) => {
  document.querySelectorAll("[data-login-auth]").forEach((button) => {
    button.addEventListener("click", async () => {
      const modal = button.closest(".modal");
      if (!modal) {
        return;
      }
      const supabaseClient = state.supabaseClient;
      if (!supabaseClient) {
        setModalMessage(modal, "Supabase failed to load. Please refresh and try again.");
        return;
      }
      button.disabled = true;
      const emailInput = modal.querySelector('input[name="loginEmail"]');
      const passwordInput = modal.querySelector('input[name="loginPassword"]');
      if (!emailInput || !passwordInput) {
        button.disabled = false;
        return;
      }
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      if (!email || !password) {
        setModalMessage(modal, "Please enter your email and password.");
        button.disabled = false;
        return;
      }
      setModalMessage(modal, "");
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      button.disabled = false;
      if (error) {
        if (error.message?.includes("Email not confirmed")) {
          state.pendingLoginEmail = email.trim().toLowerCase();
          sessionStorage.setItem("pendingEmailLogin", "true");
          showLoginOtpSection(modal);
          const { error: otpError } = await supabaseClient.auth.signInWithOtp({
            email: state.pendingLoginEmail,
            options: { shouldCreateUser: false }
          });
          if (otpError) {
            setModalMessage(modal, otpError.message || "Could not send verification email. Try again.");
            return;
          }
          setModalMessage(modal, "Verification code sent. Check your email.", "success");
          return;
        }
        const message = error.message?.includes("Email logins are disabled")
          ? "Email logins are disabled in Supabase. Enable the Email provider."
          : error.message || "Login failed. Try again.";
        setModalMessage(modal, message);
        return;
      }
      setAuthState(state, data.session);
      clearAuthForm(modal);
      state.pendingLoginEmail = "";
      sessionStorage.removeItem("pendingEmailLogin");
      closeAllModals();
      reloadAfterAuth(state);
    });
  });

  document.querySelectorAll("[data-email-otp-send]").forEach((button) => {
    button.addEventListener("click", async () => {
      const modal = button.closest(".modal");
      if (!modal) {
        return;
      }
      const supabaseClient = state.supabaseClient;
      if (!supabaseClient) {
        setModalMessage(modal, "Supabase failed to load. Please refresh and try again.");
        return;
      }
      const emailInput = modal.querySelector('input[name="loginEmail"]');
      const email = state.pendingLoginEmail || emailInput?.value.trim().toLowerCase() || "";
      if (!email) {
        setModalMessage(modal, "Please enter your email first.");
        return;
      }
      button.disabled = true;
      setModalMessage(modal, "");
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      });
      button.disabled = false;
      if (error) {
        setModalMessage(modal, error.message || "Email verification failed. Try again.");
        return;
      }
      state.pendingLoginEmail = email;
      setModalMessage(modal, "Verification code sent. Check your email.", "success");
    });
  });

  document.querySelectorAll("[data-email-otp-verify]").forEach((button) => {
    button.addEventListener("click", async () => {
      const modal = button.closest(".modal");
      if (!modal) {
        return;
      }
      const supabaseClient = state.supabaseClient;
      if (!supabaseClient) {
        setModalMessage(modal, "Supabase failed to load. Please refresh and try again.");
        return;
      }
      const codeInput = modal.querySelector('input[name="loginOtp"]');
      const emailInput = modal.querySelector('input[name="loginEmail"]');
      const email = state.pendingLoginEmail || emailInput?.value.trim().toLowerCase() || "";
      const token = codeInput?.value.trim() || "";
      if (!email || !token) {
        setModalMessage(modal, "Please enter the verification code.");
        return;
      }
      button.disabled = true;
      setModalMessage(modal, "");
      const { data, error } = await supabaseClient.auth.verifyOtp({
        email,
        token,
        type: "email"
      });
      button.disabled = false;
      if (error) {
        setModalMessage(modal, error.message || "Verification failed. Try again.");
        return;
      }
      setAuthState(state, data.session);
      clearAuthForm(modal);
      state.pendingLoginEmail = "";
      sessionStorage.removeItem("pendingEmailLogin");
      closeAllModals();
      reloadAfterAuth(state);
    });
  });
};
