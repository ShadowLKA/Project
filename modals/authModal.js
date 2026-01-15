// Note: Unified auth modal markup.
export function renderAuthModal() {
  return `
    <div class="modal modal--auth" id="authModal" aria-hidden="true">
      <div class="modal__backdrop" data-close-modal></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
        <button class="modal__close" type="button" data-close-modal aria-label="Close dialog">Close</button>
        <div class="modal__content auth-modal">
          <h3 id="authModalTitle">Sign in</h3>
          <p class="modal__message" data-modal-message></p>
          <div class="auth-modal__actions">
            <button class="btn auth-btn auth-btn--google" type="button" data-auth-provider="google">
              Continue with Google
            </button>
            <button class="btn btn-secondary auth-btn auth-btn--create" type="button" data-open-modal="createAccountModal">
              Create account
            </button>
          </div>
          <div class="modal__divider">or</div>
          <button class="btn btn-secondary auth-btn auth-btn--passkey" type="button" data-auth-passkey>
            Sign in with a passkey
          </button>
          <form class="auth-modal__form" autocomplete="off" novalidate data-auth-login-form>
            <label>
              Email
              <input type="email" name="loginEmail" placeholder="Your Email" autocomplete="email">
            </label>
            <label>
              Password
              <input type="password" name="loginPassword" placeholder="Your password" autocomplete="current-password">
            </label>
            <p class="auth-modal__error" data-auth-error aria-live="polite"></p>
            <button class="btn btn-primary" type="submit">Log in</button>
          </form>
          <p class="auth-modal__footnote">
            Use your email and password to log in.
          </p>
        </div>
      </div>
    </div>
  `;
}




