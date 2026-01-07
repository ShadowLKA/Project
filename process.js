// Note: Process section renderer.
import { renderSectionShell } from "./sectionShell.js";

export function renderProcess(process) {
  const steps = process.steps
    .map(
      (step, index) => `
        <div class="process-step reveal delay-${index + 1}">
          <div class="process-step__marker">${step.step}</div>
          <div class="process-step__content">
            <h3>${step.title}</h3>
            <p>${step.copy}</p>
          </div>
        </div>`
    )
    .join("");

  const ctaMarkup = process.cta
    ? `<div class="process-cta">
        <a class="btn btn-secondary" href="${process.cta.href}">${process.cta.label}</a>
      </div>`
    : "";

  return renderSectionShell({
    id: "process",
    tag: process.tag,
    title: process.title,
    copy: process.copy,
    content: `
      <div class="process-layout">
        <div class="process-steps">${steps}</div>
        <div class="process-visual" aria-hidden="true">
          <img src="images/hands.png" alt="" loading="lazy">
        </div>
      </div>
      ${ctaMarkup}
    `,
    titleClass: "stacked"
  });
}
