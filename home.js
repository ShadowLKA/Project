// Note: Hero section renderer.
export function renderHome(hero) {
  const statMarkup = hero.stats
    .map(
      (stat) => `<div class="hero-meta-item"><strong>${stat.value}</strong><span>${stat.label}</span></div>`
    )
    .join("");

  const tabs = ["Doctor", "Consult", "Pharmacy", "Diagnostics"];
  const tabMarkup = tabs
    .map(
      (label, index) =>
        `<button class="hero-tab${index === 0 ? " is-active" : ""}" type="button">${label}</button>`
    )
    .join("");

  return `
    <section class="page hero" id="home">
      <div class="container hero-shell">
        <div class="hero-content">
          <span class="hero-tag">${hero.tag}</span>
          <h1>${hero.title}</h1>
          <p>${hero.copy}</p>
          <div class="hero-search">
            <label class="hero-search-field">
              <span class="hero-search-icon" aria-hidden="true"></span>
              <input type="text" placeholder="Search symptoms, specialty, or doctor">
            </label>
            <a class="btn btn-primary" href="index.html?page=consult" data-consult-cta>Search</a>
          </div>
          <div class="hero-tabs" role="tablist">
            ${tabMarkup}
          </div>
          <div class="hero-actions">
            <button class="btn btn-secondary" data-open-modal="signupModal">Create account</button>
            <button class="btn btn-ghost" type="button" data-scroll-target="#consultations">Browse services</button>
          </div>
          <div class="hero-meta">${statMarkup}</div>
        </div>
        <div class="hero-visual">
          <div class="hero-visual-card reveal delay-2">
            <div class="hero-visual-top">
              <span class="hero-visual-chip">24/7 Support</span>
              <span class="hero-visual-chip">HIPAA Secure</span>
            </div>
            <div class="hero-visual-media">
              <div class="hero-visual-frame">
                <div class="hero-visual-photo">
                  <video
                    autoplay
                    muted
                    loop
                    playsinline
                    webkit-playsinline
                    preload="auto"
                    aria-label="Virtual consultation video"
                  >
                    <source src="videos/main-page.mp4" type="video/mp4">
                    <source src="videos/main-page.webm" type="video/webm">
                  </video>
                  <button class="hero-video-play" type="button" aria-label="Play background video">
                    <span></span>
                  </button>
                </div>
              </div>
              <span class="hero-visual-pill">Live</span>
            </div>
            <div class="hero-visual-bottom">
              <div class="hero-visual-stat">
                <strong>98%</strong>
                <span>Resolution rate</span>
              </div>
              <div class="hero-visual-stat">
                <strong>12 min</strong>
                <span>Average wait</span>
              </div>
            </div>
          </div>
          <div class="hero-float hero-float-left">
            <strong>Consultation</strong>
            <span>Video + chat</span>
          </div>
          <div class="hero-float hero-float-right">
            <strong>Reports</strong>
            <span>Lab review</span>
          </div>
        </div>
      </div>
      <div class="hero-blend" aria-hidden="true"></div>
    </section>
  `;
}







