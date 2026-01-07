// Note: Stories section renderer.
import { renderSectionShell } from "./sectionShell.js";

export function renderStories(stories) {
  const cards = stories.items
    .map(
      (story, index) => `
        <div class="testimonial reveal delay-${index + 1}">
          <strong>${story.name}</strong>
          <p>${story.quote}</p>
        </div>`
    )
    .join("");

  return renderSectionShell({
    id: "stories",
    tag: stories.tag,
    title: stories.title,
    copy: stories.copy,
    content: `<div class="testimonials">${cards}</div>`
  });
}
