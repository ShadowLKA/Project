// Note: Auth UI helpers.
export const hideLoginOtpSection = () => {
  document.querySelectorAll("[data-login-otp]").forEach((section) => {
    section.classList.add("is-hidden");
  });
};

export const showLoginOtpSection = (modal) => {
  if (!modal) {
    return;
  }
  const otpSection = modal.querySelector("[data-login-otp]");
  const emailSection = modal.querySelector("[data-login-email]");
  if (emailSection) {
    emailSection.classList.add("is-hidden");
  }
  if (otpSection) {
    otpSection.classList.remove("is-hidden");
  }
};

export const resetSignupOtpUi = (modal, setModalMessage, { clearMessage = true } = {}) => {
  if (!modal) {
    return;
  }
  const otpSection = modal.querySelector("[data-signup-otp-section]");
  const otpWrapper = modal.querySelector("[data-signup-otp-wrapper]");
  const otpInput = modal.querySelector('input[name="signupOtp"]');
  if (otpSection) {
    otpSection.classList.add("is-hidden");
  }
  if (otpWrapper) {
    otpWrapper.classList.add("is-hidden");
  }
  if (otpInput) {
    otpInput.value = "";
  }
  const actionButton = modal.querySelector("[data-signup-action]");
  if (actionButton) {
    if (actionButton.dataset.cooldownTimer) {
      clearInterval(Number(actionButton.dataset.cooldownTimer));
      actionButton.dataset.cooldownTimer = "";
    }
    delete actionButton.dataset.cooldownActive;
    delete actionButton.dataset.requestPending;
    actionButton.textContent = "Create account";
    actionButton.disabled = false;
    if (clearMessage) {
      setModalMessage(modal, "");
    }
  }
};

export const resetLoginOtpUi = (modal) => {
  if (!modal) {
    return;
  }
  const otpSection = modal.querySelector("[data-login-otp]");
  const emailSection = modal.querySelector("[data-login-email]");
  const codeInput = modal.querySelector('input[name="loginOtp"]');
  if (otpSection) {
    otpSection.classList.add("is-hidden");
  }
  if (emailSection) {
    emailSection.classList.remove("is-hidden");
  }
  if (codeInput) {
    codeInput.value = "";
  }
};

export const startSignupCooldown = (modal, seconds = 60) => {
  if (!modal) {
    return;
  }
  const actionButton = modal.querySelector("[data-signup-action]");
  if (!actionButton) {
    return;
  }
  if (actionButton.dataset.cooldownTimer) {
    clearInterval(Number(actionButton.dataset.cooldownTimer));
    actionButton.dataset.cooldownTimer = "";
  }
  let remaining = seconds;
  actionButton.disabled = false;
  actionButton.dataset.cooldownActive = "true";
  actionButton.textContent = `Resend in ${remaining}s`;
  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      delete actionButton.dataset.cooldownActive;
      actionButton.textContent = "Create account";
      return;
    }
    actionButton.textContent = `Resend in ${remaining}s`;
  }, 1000);
  actionButton.dataset.cooldownTimer = String(timer);
};
