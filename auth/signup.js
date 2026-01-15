// Note: Signup flow (email + password).
import { consumePostAuthRedirect, normalizePhone, setAuthState, reloadAfterAuth } from "./state.js";
import { resetSignupOtpUi } from "./ui.js";

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

const setSubmitState = (button, isLoading, label) => {
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
  if (button.dataset.cooldownActive !== "true") {
    button.textContent = button.dataset.originalLabel || button.textContent || "";
  }
  delete button.dataset.originalLabel;
  button.disabled = false;
  button.removeAttribute("aria-busy");
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
    const { data, error } = await withTimeout(query, 15000, "Account lookup timed out. Please try again.");
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
  document.querySelectorAll("[data-signup-form]").forEach((form) => {
    if (form.dataset.signupBound === "true") {
      return;
    }
    form.dataset.signupBound = "true";
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const modal = form.closest(".modal");
      if (!modal) {
        return;
      }
      const actionButton = form.querySelector("[data-signup-action]");
      if (form.dataset.requestPending === "true") {
        return;
      }
      form.dataset.requestPending = "true";
      try {
        const supabaseClient = state.supabaseClient;
        if (!supabaseClient) {
          setModalMessage(modal, "Supabase failed to load. Please refresh and try again.");
          return;
        }
        const nameInput = form.querySelector('input[name="fullName"]');
        const emailInput = form.querySelector('input[name="email"]');
        const phoneInput = form.querySelector('input[name="phone"]');
        const passwordInput = form.querySelector('input[name="password"]');
        if (!emailInput || !phoneInput || !passwordInput) {
          return;
        }
        const email = emailInput.value.trim().toLowerCase();
        const rawPhone = phoneInput.value.trim();
        const phone = rawPhone ? normalizePhone(rawPhone) : "";
        const password = passwordInput.value.trim();
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

        setSubmitState(actionButton, true, "Creating account...");
        console.info("[auth] signup:start", { email });
        const exists = await checkAccountExists(supabaseClient, email, phone);
        if (exists) {
          setModalMessage(modal, "This account already exists. Please log in instead.");
          return;
        }
        const { data, error } = await withTimeout(
          supabaseClient.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone || null
              }
            }
          }),
          15000,
          "Signup timed out. Please try again."
        );
        if (error) {
          console.error("[auth] signup:error", error);
          const message = error.message?.includes("User already registered")
            ? "This account already exists. Please log in instead."
            : error.message || "Signup failed. Try again.";
          setModalMessage(modal, message);
          return;
        }
        const session = data?.session || null;
        console.info("[auth] signup:success", { email });
        if (session) {
          setAuthState(state, session);
          clearAuthForm(modal);
          resetSignupOtpUi(modal, setModalMessage);
          closeAllModals();
          reloadAfterAuth(state);
          consumePostAuthRedirect();
          return;
        }
        setModalMessage(
          modal,
          "Account created. Check your email to confirm and then log in.",
          "success"
        );
        clearAuthForm(modal);
        resetSignupOtpUi(modal, setModalMessage, { clearMessage: false });
        return;
      } catch (error) {
        console.error("[auth] signup:error", error);
        setModalMessage(modal, error?.message || "Signup failed. Try again.");
      } finally {
        form.dataset.requestPending = "false";
        setSubmitState(actionButton, false);
      }
    });
  });
};
