// Note: Footer rendering.
export function renderFooter(footerGroups, licenseText, contact) {
  const columns = footerGroups
    .map((group) => {
      const items = group.items.map((item) => `<p>${item}</p>`).join("");
      return `<div><strong>${group.title}</strong>${items}</div>`;
    })
    .join("");

  return `
    <div class="container footer-grid">${columns}</div>
    <div class="container footer-contact">
      <div>
        <strong>${contact.heading}</strong>
        <p>${contact.message}</p>
      </div>
      <div class="footer-contact__details">
        <p><strong>${contact.phone}</strong></p>
        <p>${contact.email}</p>
        <p class="footer-contact__note">${contact.note}</p>
      </div>
    </div>
    <div class="bottom-bar" id="bottomBar">
      <div class="container">${licenseText}</div>
    </div>
  `;
}
