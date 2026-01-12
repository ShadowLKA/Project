// Note: Contact section renderer.
export function renderContact(contact) {
  const extraCta = contact.ctaTertiary
    ? `<a class="btn btn-secondary" href="${contact.ctaTertiary.href}">${contact.ctaTertiary.label}</a>`
    : "";
  return `
    <section class="page" id="contact">
      <div class="container">
        <div class="cta">
          <h2>${contact.title}</h2>
          <p>${contact.copy}</p>
          <div class="cta-actions">
            ${extraCta}
            <a class="btn btn-ghost" href="${contact.ctaSecondary.href}">${contact.ctaSecondary.label}</a>
            <a class="btn btn-primary" href="${contact.ctaPrimary.href}" data-consult-cta>${contact.ctaPrimary.label}</a>
          </div>
        </div>
      </div>
    </section>
  `;
}
