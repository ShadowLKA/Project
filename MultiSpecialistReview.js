// Note: Service detail page.
import { renderSectionShell } from "./sectionShell.js";

export function renderMultiSpecialistReview(details) {
  const blocks = Array.isArray(details?.blocks) && details.blocks.length
    ? details.blocks
    : [
        { type: "text", title: "Overview", copy: "Add overview copy for this service." },
        { type: "image", caption: "Add image caption.", alt: details?.title || "Service image", src: "" },
        { type: "text", title: "How the panel works", copy: "Add the collaboration details here." }
      ];
  const paddedBlocks = [...blocks];
  while (paddedBlocks.length < 7) {
    paddedBlocks.push({
      type: "text",
      title: "Additional details",
      copy: "Add more detail for this service."
    });
  }
  const blocksMarkup = paddedBlocks
    .map((block, index) => {
      if (block.type === "image") {
        if (block.src) {
          return `
            <figure class="service-detail__slot service-detail__slot--image">
              <div class="service-detail__media">
                <img src="${block.src}" alt="${block.alt || details?.title || "Service image"}">
              </div>
              <figcaption>${block.caption || `Image caption ${index + 1}.`}</figcaption>
            </figure>
          `;
        }
        return `
          <figure class="service-detail__slot service-detail__slot--image is-placeholder">
            <div class="service-detail__media">
              <span class="service-detail__placeholder">Image slot ${index + 1}</span>
            </div>
            <figcaption>${block.caption || `Image caption ${index + 1}.`}</figcaption>
          </figure>
        `;
      }
      if (block.type === "list") {
        const items = Array.isArray(block.items) ? block.items : [];
        return `
          <div class="service-detail__slot service-detail__slot--text">
            <h3>${block.title || "Section title"}</h3>
            <ul>
              ${items.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        `;
      }
      const isPlaceholder = block.title === "Additional details";
      return `
        <div class="service-detail__slot service-detail__slot--text${isPlaceholder ? " service-detail__slot--placeholder" : ""}">
          <h3>${block.title || "Section title"}</h3>
          <p>${block.copy || "Add section copy for this service."}</p>
        </div>
      `;
    })
    .join("");
  return renderSectionShell({
    id: "service-multi-specialist-review",
    tag: details?.tag || "Signature service",
    title: details?.title || "Multi-Specialist Review",
    copy: details?.intro || "Add intro copy for this service.",
    content: `
      <div class="service-detail__grid">
        ${blocksMarkup}
      </div>
      <div class="process-cta">
        <a class="btn btn-secondary" href="./?section=services" data-route="./?section=services">Back to Services</a>
      </div>
    `
  });
}
