// Note: Consultation types section renderer.
import { renderSectionShell } from "./sectionShell.js";

export function renderConsultations(consultations) {
  const cards = consultations.items
    .map(
      (item, index) => `
        <div class="consult-card reveal delay-${index + 1}">
          <div class="consult-badge">${item.meta}</div>
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
        </div>`
    )
    .join("");

  return renderSectionShell({
    id: "consultations",
    tag: consultations.tag,
    title: consultations.title,
    copy: consultations.copy,
    content: `<div class="consult-grid">${cards}</div>`
  });
}
