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
              <span class="auth-btn__icon" aria-hidden="true">
                <svg viewBox="0 0 18 18" role="presentation" focusable="false">
                  <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.26-.17-1.86H9v3.52h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.58 2.68-3.91 2.68-6.64z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.16l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.35 0-4.34-1.58-5.05-3.7H.93v2.33A8.99 8.99 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.95 10.74a5.4 5.4 0 0 1 0-3.48V4.93H.93a9 9 0 0 0 0 8.14l3.02-2.33z"/>
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.43 1.34l2.57-2.57C13.47.89 11.43 0 9 0 5.48 0 2.44 2.02.93 4.93l3.02 2.33C4.66 5.14 6.65 3.58 9 3.58z"/>
                </svg>
              </span>
              <span>Continue with Google</span>
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




