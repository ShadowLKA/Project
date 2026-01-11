// Note: Modal rendering and base interactions.
import { renderAuthModal } from "./modals/authModal.js";
import { bindAuth } from "./auth.js";

export function renderModal() {
  return `${renderAuthModal()}`;
}

export function bindModal() {
  const modals = document.querySelectorAll(".modal");
  if (!modals.length) {
    return;
  }
  let scrollPosition = 0;

  const setModalMessage = (modal, message, type = "error") => {
    if (!modal) {
      return;
    }
    const messageEl = modal.querySelector("[data-modal-message]");
    if (!messageEl) {
      return;
    }
    messageEl.textContent = message || "";
    messageEl.classList.toggle("is-visible", Boolean(message));
    messageEl.classList.toggle("is-success", type === "success");
  };

  const clearAuthForm = (modal) => {
    if (!modal) {
      return;
    }
    const inputs = modal.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });
  };

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) {
      return;
    }
    if (modal.classList.contains("is-open")) {
      return;
    }
    if (id === "signupModal" || id === "loginModal") {
      clearAuthForm(modal);
      setTimeout(() => clearAuthForm(modal), 50);
    }
    setModalMessage(modal, "");
    const alreadyLocked = document.body.classList.contains("modal-open");
    modals.forEach((active) => {
      if (active !== modal) {
        active.classList.remove("is-open");
        active.setAttribute("aria-hidden", "true");
      }
    });
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    window.dispatchEvent(
      new CustomEvent("modal:opened", {
        detail: { id }
      })
    );
    if (!alreadyLocked) {
      scrollPosition = window.scrollY;
      document.body.classList.add("no-scroll");
      document.body.classList.add("modal-open");
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
    }
  };

  const closeModal = (modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    setModalMessage(modal, "");
    delete modal.dataset.lockBackdrop;
    document.body.classList.remove("no-scroll");
    document.body.classList.remove("modal-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
    window.dispatchEvent(
      new CustomEvent("modal:closed", {
        detail: { id: modal.id }
      })
    );
  };

  const closeAllModals = () => {
    modals.forEach((modal) => closeModal(modal));
  };

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.openModal));
  });

  modals.forEach((modal) => {
    modal.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => {
        const isBackdrop = button.classList.contains("modal__backdrop");
        if (isBackdrop && modal.dataset.lockBackdrop === "true") {
          return;
        }
        closeModal(modal);
      });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  bindAuth({
    openModal,
    closeModal,
    closeAllModals,
    setModalMessage,
    clearAuthForm
  });
}
