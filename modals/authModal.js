// Note: Auth modal markup (signup + login).
export function renderAuthModal() {
  return `
    <div class="modal" id="signupModal" aria-hidden="true">
      <div class="modal__backdrop" data-close-modal></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="signupModalTitle">
        <button class="modal__close" type="button" data-close-modal aria-label="Close dialog">Close</button>
        <p class="modal__tag">Create account</p>
        <h3 id="signupModalTitle">Sign up for a patient account</h3>
        <p>Save your records, track consults, and receive updates securely.</p>
        <p class="modal__message" data-modal-message></p>
        <form class="modal__form" autocomplete="off">
          <div class="modal__section">
            <div class="modal__section-title">About you</div>
            <label>
              Full name
              <input type="text" name="fullName" placeholder="John Doe" autocomplete="off">
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="JohnDoe@gmail.com" autocomplete="email">
            </label>
            <label>
              Phone number
              <input type="tel" name="phone" placeholder="(555) 123-4567" autocomplete="tel">
            </label>
            <label>
              Create password
              <input type="password" name="password" placeholder="Minimum 8 characters" autocomplete="new-password">
            </label>
          </div>
          <div class="modal__section is-hidden" data-signup-otp-section>
            <div class="modal__section-title">Email verification</div>
            <label data-signup-otp-wrapper>
              Verification code
              <input type="text" name="signupOtp" placeholder="6-digit code" inputmode="numeric" autocomplete="one-time-code">
            </label>
          </div>
          <button class="btn btn-primary" type="button" data-signup-otp-verify data-signup-action>Create account</button>
        </form>
        <button class="btn btn-primary modal__switch" type="button" data-open-modal="loginModal">
          Log in instead
        </button>
      </div>
    </div>
    <div class="modal" id="loginModal" aria-hidden="true">
      <div class="modal__backdrop" data-close-modal></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="loginModalTitle">
        <button class="modal__close" type="button" data-close-modal aria-label="Close dialog">Close</button>
        <p class="modal__tag">Welcome back</p>
        <h3 id="loginModalTitle">Log in to your account</h3>
        <p>Access your saved consultations and updates.</p>
        <p class="modal__message" data-modal-message></p>
        <form class="modal__form" autocomplete="off">
          <div class="modal__section" data-login-email>
            <div class="modal__section-title">Email & password</div>
            <label>
              Email
              <input type="email" name="loginEmail" placeholder="you@gmail.com" autocomplete="email">
            </label>
            <label>
              Password
              <input type="password" name="loginPassword" placeholder="Enter your password" autocomplete="current-password">
            </label>
            <button class="btn btn-primary" type="button" data-login-auth>Log in</button>
          </div>
          <div class="modal__section is-hidden" data-login-otp>
            <div class="modal__section-title">Email verification</div>
            <button class="btn btn-secondary" type="button" data-email-otp-send data-login-send>Send code</button>
            <label>
              Verification code
              <input type="text" name="loginOtp" placeholder="6-digit code" inputmode="numeric" autocomplete="one-time-code">
            </label>
            <button class="btn btn-primary" type="button" data-email-otp-verify>Verify code</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
