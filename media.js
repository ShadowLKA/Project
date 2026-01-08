// Note: Shared video markup helpers.
export const renderMediaVideo = ({
  className = "",
  poster = "",
  sources = [],
  ariaLabel = "Video preview"
} = {}) => {
  const sourceMarkup = sources
    .map((source) => `<source src="${source.src}" type="${source.type}">`)
    .join("");
  const posterAttr = poster ? ` poster="${poster}"` : "";
  return `
    <video
      class="${className}"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"${posterAttr}
      aria-label="${ariaLabel}"
    >
      ${sourceMarkup}
    </video>
  `;
};
