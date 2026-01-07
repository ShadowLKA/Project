// Note: Consultation intake modal markup.
export function renderConsultModal() {
  return `
    <div class="modal modal--survey" id="consultModal" aria-hidden="true">
      <div class="modal__backdrop" data-close-modal></div>
      <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="consultModalTitle">
        <button class="modal__close" type="button" data-close-modal aria-label="Close dialog">Close</button>
        <p class="modal__tag">Consultation request</p>
        <h3 id="consultModalTitle">Start with a quick intake</h3>
        <p>Tell us what you need and we will match you with the right specialist.</p>
        <form class="modal__form">
          <label>
            Full name
            <input type="text" name="name" placeholder="Jane Doe">
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="jane@email.com">
          </label>
          <label>
            What do you need help with?
            <textarea name="message" rows="3" placeholder="Briefly describe your concern"></textarea>
          </label>
          <button class="btn btn-primary" type="button">Request consultation</button>
        </form>
      </div>
    </div>
  `;
}
