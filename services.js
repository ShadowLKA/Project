// Note: Services section renderer.
import { renderSectionShell } from "./sectionShell.js";

export function renderServices(services) {
  const cards = services.items
    .map((item, index) => {
      const routes = {
        "Expert Second Opinion": "./?page=service-expert-second-opinion",
        "Multi-Specialist Review": "./?page=service-multi-specialist-review",
        "U.S. Visit Coordination": "./?page=service-us-visit-coordination"
      };
      const route = routes[item.title] || "/?section=services";
      return `
        <div class="service-card reveal delay-${index + 1}">
          <strong>${item.title}</strong>
          <p>${item.copy}</p>
          <a class="btn btn-secondary service-card__cta" href="${route}" data-route="${route}">Read more</a>
        </div>`;
    })
    .join("");

  return renderSectionShell({
    id: "services",
    tag: services.tag,
    title: services.title,
    copy: services.copy,
    content: `<div class="card-grid">${cards}</div>`
  });
}
