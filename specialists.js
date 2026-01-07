// Note: Specialists section renderer.
import { renderSectionShell } from "./sectionShell.js";

export function renderSpecialists(specialists) {
  const cards = specialists.items
    .map(
      (doc, index) => `
        <article class="doctor-card reveal delay-${index + 1}">
          <div class="doctor-header">
            <div class="avatar">${doc.initials}</div>
            <div>
              <strong>${doc.name}</strong>
              <div>${doc.role}</div>
            </div>
          </div>
          <ul>${doc.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>`
    )
    .join("");

  return renderSectionShell({
    id: "specialists",
    tag: specialists.tag,
    title: specialists.title,
    copy: specialists.copy,
    content: `<div class="card-grid">${cards}</div>`
  });
}
