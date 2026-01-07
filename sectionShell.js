// Note: Shared section wrapper for consistent headings.
export function renderSectionShell({ id, tag, title, copy, content, titleClass = "" }) {
  const titleClassName = titleClass ? ` section-title--${titleClass}` : "";
  return `
    <section class="page" id="${id}">
      <div class="container">
        <div class="section-title${titleClassName}">
          <div>
            <span class="tag">${tag}</span>
            <h2>${title}</h2>
          </div>
          <p>${copy}</p>
        </div>
        ${content}
      </div>
    </section>
  `;
}
