// Note: Footer rendering.
export function renderFooter(footerGroups, licenseText, contact) {
  const columns = footerGroups
    .map((group, index) => {
      const panelId = `footer-section-${index}`;
      const items = group.items.map((item) => `<li><span>${item}</span></li>`).join("");
      return `
        <div class="footer-column">
          <button
            class="footer-title"
            type="button"
            data-accordion-trigger
            aria-expanded="false"
            aria-controls="${panelId}"
          >
            ${group.title}
          </button>
          <div class="footer-panel" id="${panelId}" data-accordion-panel>
            <ul class="footer-links">${items}</ul>
          </div>
        </div>
      `;
    })
    .join("");

  const hasContact = Boolean(
    contact?.heading || contact?.message || contact?.phone || contact?.email || contact?.note
  );
  const contactBlock = hasContact
    ? `
        <div class="footer-contact">
          <div>
            <strong>${contact.heading}</strong>
            ${contact.message ? `<p>${contact.message}</p>` : ""}
          </div>
          <div class="footer-contact__details">
            ${contact.phone ? `<p><strong>${contact.phone}</strong></p>` : ""}
            ${contact.email ? `<p>${contact.email}</p>` : ""}
            ${contact.note ? `<p class="footer-contact__note">${contact.note}</p>` : ""}
          </div>
        </div>
      `
    : "";

  return `
    <div class="container footer-shell">
      <div class="footer-grid">${columns}</div>
      ${contactBlock}
    </div>
    <div class="bottom-bar" id="bottomBar">
      <div class="container">${licenseText}</div>
    </div>
  `;
}
