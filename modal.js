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
  let activeModal = null;
  let lastFocusedElement = null;
  const focusableSelector = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ].join(",");

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

  const getFocusableElements = (modal) => {
    if (!modal) {
      return [];
    }
    return Array.from(modal.querySelectorAll(focusableSelector)).filter(
      (element) =>
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-hidden") !== "true" &&
        (element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement)
    );
  };

  const lockScroll = () => {
    scrollPosition = window.scrollY;
    document.body.classList.add("no-scroll");
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("no-scroll");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    document.body.classList.remove("no-scroll");
    document.body.classList.remove("modal-open");
    document.documentElement.classList.remove("no-scroll");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
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
        closeModal(active, { keepLocked: true, restoreFocus: false });
      }
    });
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    activeModal = modal;
    lastFocusedElement = document.activeElement;
    window.dispatchEvent(
      new CustomEvent("modal:opened", {
        detail: { id }
      })
    );
    if (!alreadyLocked) {
      lockScroll();
    }
    requestAnimationFrame(() => {
      const focusable = getFocusableElements(modal);
      if (focusable.length) {
        focusable[0].focus();
      }
    });
  };

  const closeModal = (modal, { keepLocked = false, restoreFocus = true } = {}) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    setModalMessage(modal, "");
    delete modal.dataset.lockBackdrop;
    if (activeModal === modal) {
      activeModal = null;
    }
    if (!keepLocked && !document.querySelector(".modal.is-open")) {
      unlockScroll();
    }
    if (restoreFocus && lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
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
    if (!activeModal) {
      return;
    }
    if (event.key === "Tab") {
      const focusable = getFocusableElements(activeModal);
      if (!focusable.length) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.key === "Escape") {
      closeModal(activeModal);
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
