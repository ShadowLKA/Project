// Note: Signup flow (email OTP).
import { consumePostAuthRedirect, normalizePhone, setAuthState, reloadAfterAuth } from "./state.js";
import { resetSignupOtpUi, startSignupCooldown } from "./ui.js";

const formatSupabaseError = (error) => {
  if (!error) {
    return "Unknown database error.";
  }
  const details = [error.message, error.details, error.hint, error.code]
    .filter(Boolean)
    .join(" | ");
  return details || "Unknown database error.";
};

const checkAccountExists = async (supabaseClient, email, phone) => {
  if (!supabaseClient) {
    return false;
  }
  try {
    let query = supabaseClient.from("profiles").select("id").limit(1);
    if (phone) {
      query = query.or(`email.eq.${email},phone.eq.${phone}`);
    } else {
      query = query.eq("email", email);
    }
    const { data, error } = await query;
    if (error) {
      return false;
    }
    return Array.isArray(data) && data.length > 0;
  } catch (_err) {
    return false;
  }
};

export const bindSignup = ({
  state,
  setModalMessage,
  clearAuthForm,
  closeAllModals
}) => {
  document.querySelectorAll("[data-signup-otp-verify]").forEach((button) => {
    button.addEventListener("click", async () => {
      const modal = button.closest(".modal");
      if (!modal) {
        return;
      }
      if (button.dataset.requestPending === "true") {
        return;
      }
      button.dataset.requestPending = "true";
      try {
        const supabaseClient = state.supabaseClient;
        if (!supabaseClient) {
          setModalMessage(modal, "Supabase failed to load. Please refresh and try again.");
          return;
        }
        const nameInput = modal.querySelector('input[name="fullName"]');
        const emailInput = modal.querySelector('input[name="email"]');
        const phoneInput = modal.querySelector('input[name="phone"]');
        const passwordInput = modal.querySelector('input[name="password"]');
        const codeInput = modal.querySelector('input[name="signupOtp"]');
        const otpWrapper = modal.querySelector("[data-signup-otp-wrapper]");
        const otpSection = modal.querySelector("[data-signup-otp-section]");
        if (!emailInput || !phoneInput || !codeInput || !passwordInput) {
          return;
        }
        const email = emailInput.value.trim().toLowerCase();
        const rawPhone = phoneInput.value.trim();
        const phone = rawPhone ? normalizePhone(rawPhone) : "";
        const password = passwordInput.value.trim();
        const token = codeInput.value.trim();
        const fullName = nameInput?.value.trim() || "";
        if (!fullName) {
          setModalMessage(modal, "Please enter your full name.");
          return;
        }
        if (!email) {
          setModalMessage(modal, "Please enter your email.");
          return;
        }
        if (rawPhone && !phone) {
          setModalMessage(modal, "Please enter a phone number in + country format.");
          return;
        }
        if (password.length < 8) {
          setModalMessage(modal, "Please enter a password with at least 8 characters.");
          return;
        }

        if (
          !token &&
          (otpWrapper?.classList.contains("is-hidden") || otpSection?.classList.contains("is-hidden"))
        ) {
          const exists = await checkAccountExists(supabaseClient, email, phone);
          if (exists) {
            setModalMessage(
              modal,
              "This account already exists. We sent a new verification code so you can finish signing in.",
              "success"
            );
          }
          button.disabled = true;
          setModalMessage(modal, "");
          const { error } = await supabaseClient.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: true }
          });
          button.disabled = false;
          if (error) {
            setModalMessage(modal, error.message || "Could not send code. Try again.");
            return;
          }
          state.pendingSignupEmail = email;
          if (otpSection) {
            otpSection.classList.remove("is-hidden");
          }
          if (otpWrapper) {
            otpWrapper.classList.remove("is-hidden");
          }
          if (codeInput) {
            codeInput.value = "";
          }
          setModalMessage(modal, "Verification code sent. Check your email.", "success");
          return;
        }

        if (!token) {
          if (button.dataset.cooldownActive === "true") {
            setModalMessage(modal, "Please wait before requesting another code.");
            return;
          }
          button.disabled = true;
          setModalMessage(modal, "");
          const { error } = await supabaseClient.auth.signInWithOtp({
            email: state.pendingSignupEmail || email,
            options: { shouldCreateUser: true }
          });
          button.disabled = false;
          if (error) {
            setModalMessage(modal, error.message || "Could not resend code. Try again.");
            return;
          }
          state.pendingSignupEmail = email;
          setModalMessage(modal, "Verification code resent. Check your email.", "success");
          startSignupCooldown(modal);
          if (otpSection) {
            otpSection.classList.remove("is-hidden");
          }
          if (otpWrapper) {
            otpWrapper.classList.remove("is-hidden");
          }
          if (codeInput) {
            codeInput.value = "";
          }
          return;
        }

        const existsNow = await checkAccountExists(supabaseClient, email, phone);
        if (existsNow) {
          setModalMessage(modal, "This account already exists. Verify the code to continue signing in.", "success");
        }

        button.disabled = true;
        setModalMessage(modal, "");
        const { data, error } = await supabaseClient.auth.verifyOtp({
          email: state.pendingSignupEmail || email,
          token,
          type: "email"
        });
        if (error) {
          button.disabled = false;
          setModalMessage(modal, error.message || "Verification failed. Try again.");
          return;
        }
        let session = data?.session || null;
        if (!session) {
          const { data: sessionData } = await supabaseClient.auth.getSession();
          session = sessionData?.session || null;
        }
        const { error: updateError } = await supabaseClient.auth.updateUser({
          password,
          data: {
            full_name: fullName,
            phone: phone || null
          }
        });
        if (updateError) {
          button.disabled = false;
          await supabaseClient.auth.signOut();
          setAuthState(state, null);
          setModalMessage(modal, updateError.message || "Could not set password. Try again.");
          return;
        }
        if (!session) {
          const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
            email,
            password
          });
          if (loginError) {
            button.disabled = false;
            setModalMessage(modal, loginError.message || "Could not log in. Try again.");
            return;
          }
          session = loginData?.session || session;
        }
        // Profile row is synced by a database trigger on auth.users.
        button.disabled = false;
        setAuthState(state, session);
        clearAuthForm(modal);
        state.pendingSignupEmail = "";
        resetSignupOtpUi(modal, setModalMessage);
        closeAllModals();
        reloadAfterAuth(state);
        consumePostAuthRedirect();
        return;
      } finally {
        button.dataset.requestPending = "false";
      }
    });
  });
};
