// Note: Login flow (email + OTP).
import { consumePostAuthRedirect, setAuthState, reloadAfterAuth } from "./state.js";
import { showLoginOtpSection } from "./ui.js";

const withTimeout = async (promise, ms, message) => {
  let timerId;
  const timeout = new Promise((_resolve, reject) => {
    timerId = setTimeout(() => reject(new Error(message)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timerId);
  }
};

const setSubmitState = (buttons, isLoading, label) => {
  buttons.forEach((button) => {
    if (!button) {
      return;
    }
    if (isLoading) {
      button.dataset.originalLabel = button.dataset.originalLabel || button.textContent || "";
      if (label) {
        button.textContent = label;
      }
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    } else {
      button.textContent = button.dataset.originalLabel || button.textContent || "";
      delete button.dataset.originalLabel;
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  });
};

export const bindLogin = ({
  state,
  setModalMessage,
  clearAuthForm,
  closeAllModals
}) => {
  document.querySelectorAll("[data-login-form]").forEach((form) => {
    if (form.dataset.loginBound === "true") {
      return;
    }
    form.dataset.loginBound = "true";
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.requestPending === "true") {
        return;
      }
      const modal = form.closest(".modal");
      if (!modal) {
        return;
      }
      const supabaseClient = state.supabaseClient;
      if (!supabaseClient) {
        setModalMessage(modal, "Supabase failed to load. Please refresh and try again.");
        return;
      }
      const loginButton = form.querySelector("[data-login-auth]");
      const verifyButton = form.querySelector("[data-email-otp-verify]");
      const otpSection = form.querySelector("[data-login-otp]");
      const isOtpVisible = Boolean(otpSection && !otpSection.classList.contains("is-hidden"));
      const activeButton = isOtpVisible ? verifyButton : loginButton;
      const submitButtons = [loginButton, verifyButton].filter(Boolean);
      const emailInput = form.querySelector('input[name="loginEmail"]');
      const passwordInput = form.querySelector('input[name="loginPassword"]');
      const codeInput = form.querySelector('input[name="loginOtp"]');
      const email = (state.pendingLoginEmail || emailInput?.value || "").trim().toLowerCase();
      const password = passwordInput?.value.trim() || "";
      const token = codeInput?.value.trim() || "";
      form.dataset.requestPending = "true";
      try {
        if (!emailInput || (!isOtpVisible && !passwordInput)) {
          return;
        }
        if (isOtpVisible && !token) {
          setModalMessage(modal, "Please enter the verification code.");
          return;
        }
        if (!email) {
          setModalMessage(modal, "Please enter your email.");
          return;
        }
        if (!isOtpVisible && !password) {
          setModalMessage(modal, "Please enter your email and password.");
          return;
        }
        setModalMessage(modal, "");
        const loadingLabel = isOtpVisible ? "Verifying..." : "Logging in...";
        setSubmitState(submitButtons, true, loadingLabel);
        if (!isOtpVisible) {
          console.info("[auth] login:start", { email });
          const { data, error } = await withTimeout(
            supabaseClient.auth.signInWithPassword({ email, password }),
            15000,
            "Login timed out. Please try again."
          );
          if (error) {
            if (error.message?.includes("Email not confirmed")) {
              state.pendingLoginEmail = email;
              sessionStorage.setItem("pendingEmailLogin", "true");
              showLoginOtpSection(modal);
              const { error: otpError } = await withTimeout(
                supabaseClient.auth.signInWithOtp({
                  email: state.pendingLoginEmail,
                  options: { shouldCreateUser: false }
                }),
                15000,
                "Verification email timed out. Please try again."
              );
              if (otpError) {
                console.error("[auth] login:otp:error", otpError);
                setModalMessage(modal, otpError.message || "Could not send verification email. Try again.");
                return;
              }
              console.info("[auth] login:otp:sent", { email });
              setModalMessage(modal, "Verification code sent. Check your email.", "success");
              return;
            }
            const message = error.message?.includes("Email logins are disabled")
              ? "Email logins are disabled in Supabase. Enable the Email provider."
              : error.message || "Login failed. Try again.";
            console.error("[auth] login:error", error);
            setModalMessage(modal, message);
            return;
          }
          console.info("[auth] login:success", { email });
          setAuthState(state, data.session);
          clearAuthForm(modal);
          state.pendingLoginEmail = "";
          sessionStorage.removeItem("pendingEmailLogin");
          closeAllModals();
          reloadAfterAuth(state);
          consumePostAuthRedirect();
          return;
        }
        console.info("[auth] login:otp:verify:start", { email });
        const { data, error } = await withTimeout(
          supabaseClient.auth.verifyOtp({
            email,
            token,
            type: "email"
          }),
          15000,
          "Verification timed out. Please try again."
        );
        if (error) {
          console.error("[auth] login:otp:verify:error", error);
          setModalMessage(modal, error.message || "Verification failed. Try again.");
          return;
        }
        console.info("[auth] login:otp:verify:success", { email });
        setAuthState(state, data.session);
        clearAuthForm(modal);
        state.pendingLoginEmail = "";
        sessionStorage.removeItem("pendingEmailLogin");
        closeAllModals();
        reloadAfterAuth(state);
        consumePostAuthRedirect();
      } catch (error) {
        console.error("[auth] login:error", error);
        setModalMessage(modal, error?.message || "Login failed. Try again.");
      } finally {
        form.dataset.requestPending = "false";
        setSubmitState(submitButtons, false);
      }
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
      const { error } = await withTimeout(
        supabaseClient.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false }
        }),
        15000,
        "Verification email timed out. Please try again."
      );
      button.disabled = false;
      if (error) {
        setModalMessage(modal, error.message || "Email verification failed. Try again.");
        return;
      }
      state.pendingLoginEmail = email;
      setModalMessage(modal, "Verification code sent. Check your email.", "success");
    });
  });
};
