// Note: Care advisors section renderer.
import { renderSectionShell } from "./sectionShell.js";

export function renderAdvisors(advisors) {
  const cards = advisors.items
    .map(
      (advisor, index) => `
        <article class="advisor-card reveal delay-${index + 1}">
          <div class="advisor-header">
            <div class="avatar">${advisor.initials}</div>
            <div>
              <strong>${advisor.name}</strong>
              <div>${advisor.role}</div>
            </div>
          </div>
          <ul>${advisor.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>`
    )
    .join("");

  return renderSectionShell({
    id: "advisors",
    tag: advisors.tag,
    title: advisors.title,
    copy: advisors.copy,
    content: `<div class="card-grid">${cards}</div>`
  });
}
