// Note: Create account modal markup.
export function renderCreateAccountModal() {
  return `
    <div class="modal modal--auth" id="createAccountModal" aria-hidden="true">
      <div class="modal__backdrop" data-close-modal></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="createAccountTitle">
        <button class="modal__close" type="button" data-close-modal aria-label="Close dialog">Close</button>
        <div class="modal__content auth-modal">
          <h3 id="createAccountTitle">Create account</h3>
          <p class="modal__message" data-modal-message></p>
          <form class="auth-modal__form" autocomplete="off" novalidate data-auth-signup-form>
            <label>
              Email
              <input type="email" name="signupEmail" placeholder="you@example.com" autocomplete="email">
            </label>
            <label>
              Phone number
              <input type="tel" name="signupPhone" placeholder="+1 (555) 123-4567" autocomplete="tel">
            </label>
            <label>
              Password
              <input type="password" name="signupPassword" placeholder="Create a password" autocomplete="new-password">
            </label>
            <p class="auth-modal__error" data-auth-error aria-live="polite"></p>
            <button class="btn btn-primary" type="submit">Create account</button>
          </form>
          <p class="auth-modal__footnote">
            Already have an account? <button class="auth-modal__link" type="button" data-open-modal="authModal">Log in</button>
          </p>
        </div>
      </div>
    </div>
  `;
}

