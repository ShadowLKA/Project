// Note: Services section renderer.
import { renderSectionShell } from "./sectionShell.js";

export function renderServices(services) {
  const cards = services.items
    .map(
      (item, index) => `
        <div class="service-card reveal delay-${index + 1}">
          <div class="icon">${item.icon}</div>
          <strong>${item.title}</strong>
          <p>${item.copy}</p>
        </div>`
    )
    .join("");

  return renderSectionShell({
    id: "services",
    tag: services.tag,
    title: services.title,
    copy: services.copy,
    content: `<div class="card-grid">${cards}</div>`
  });
}
