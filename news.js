// Note: News/about page renderer.
import { renderSectionShell } from "./sectionShell.js";
import { getSupabaseClient } from "./supabase.js";

const NEWS_SLOTS_TABLE = "news_slots";
const NEWS_BUCKET = "news-images";
const SLOT_COUNT = 3;
const NEWS_CACHE_KEY = "news_slots_cache_v1";
const NEWS_CACHE_TTL_MS = 10 * 60 * 1000;

export function renderNewsPage(news) {
  const highlights = news.highlights
    .map(
      (item) => `
        <div class="news-highlight">
          <strong>${item.title}</strong>
          <p>${item.copy}</p>
        </div>`
    )
    .join("");

  const timeline = news.timeline
    .map(
      (item) => `
        <div class="news-timeline__item">
          <span>${item.year}</span>
          <div>
            <strong>${item.title}</strong>
            <p>${item.copy}</p>
          </div>
        </div>`
    )
    .join("");

  const slotTitle = news.slotTitle || "Photo highlights";
  const slotCopy = news.slotCopy || "Milestones and moments from the journey.";
  const about = Array.isArray(news.about) ? news.about : [];
  const aboutLeft = about[0]
    ? `<div class="news-about news-about--side">
        <h4>${about[0].title}</h4>
        <p>${about[0].copy}</p>
      </div>`
    : "";
  const aboutRight = about[1]
    ? `<div class="news-about news-about--side">
        <h4>${about[1].title}</h4>
        <p>${about[1].copy}</p>
      </div>`
    : "";
  const aboutWide = about[2]
    ? `<div class="news-about news-about--side">
        <h4>${about[2].title}</h4>
        <p>${about[2].copy}</p>
      </div>`
    : "";
  const sideNotes = Array.isArray(news.sideNotes) ? news.sideNotes : [];
  const sideNotesMarkup = sideNotes
    .map(
      (note) => `
        <div class="news-about news-about--note">
          <h4>${note.title}</h4>
          <p>${note.copy}</p>
        </div>`
    )
    .join("");
  const renderSlotMarkup = (slotNumber) => `
      <figure class="news-slot" data-slot="${slotNumber}">
        <div class="news-slot__media">
          <img class="is-hidden" data-slot-image alt="News highlight ${slotNumber}">
          <span class="news-slot__placeholder">Photo ${slotNumber}</span>
        </div>
        <figcaption data-slot-caption>Caption goes here.</figcaption>
      </figure>
    `;

  return renderSectionShell({
    id: "news",
    tag: news.tag,
    title: news.title,
    copy: news.copy,
    content: `
      <div class="news-layout">
        <div class="news-column">
          <div class="news-card">
            <h3>${news.storyTitle}</h3>
            <p>${news.storyCopy}</p>
          </div>
          <div class="news-slot-block">
            <div class="news-slots news-slots--left">
              <div class="news-slots__header">
                <div>
                  <h3>${slotTitle}</h3>
                  <p>${slotCopy}</p>
                </div>
              </div>
              <div class="news-slots__grid" data-news-slots-left>
                ${renderSlotMarkup(1)}
              </div>
            </div>
            ${aboutLeft}
          </div>
        </div>
        <div class="news-column">
          <div class="news-highlights">${highlights}</div>
          <div class="news-slot-block">
            <div class="news-slots news-slots--right">
              <div class="news-slots__grid" data-news-slots-right>
                ${renderSlotMarkup(2)}
              </div>
            </div>
            ${aboutRight}
          </div>
        </div>
      </div>
      <div class="news-timeline">
        <h3>${news.timelineTitle}</h3>
        ${timeline}
      </div>
      <div class="news-slot-block news-slot-block--full">
        <div class="news-slots news-slots--full">
          <div class="news-slots__grid" data-news-slots-full>
            ${renderSlotMarkup(3)}
          </div>
        </div>
        <div class="news-slot-block__side">
          ${aboutWide}
          ${sideNotesMarkup}
        </div>
      </div>
    `
  });
}

const getStoragePath = (publicUrl) => {
  if (!publicUrl) {
    return "";
  }
  const marker = `/storage/v1/object/public/${NEWS_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) {
    return "";
  }
  return publicUrl.slice(index + marker.length);
};

const updateSlot = (slotEl, data) => {
  const imageEl = slotEl.querySelector("[data-slot-image]");
  const captionEl = slotEl.querySelector("[data-slot-caption]");
  const placeholder = slotEl.querySelector(".news-slot__placeholder");

  if (data?.image_url) {
    if (imageEl) {
      imageEl.src = data.image_url;
      imageEl.classList.remove("is-hidden");
    }
    if (placeholder) {
      placeholder.classList.add("is-hidden");
    }
  } else {
    if (imageEl) {
      imageEl.removeAttribute("src");
      imageEl.classList.add("is-hidden");
    }
    if (placeholder) {
      placeholder.classList.remove("is-hidden");
    }
  }

  if (captionEl) {
    captionEl.textContent = data?.caption || "Caption goes here.";
  }

};

export function initNewsPage() {
  const slotsLeft = document.querySelector("[data-news-slots-left]");
  const slotsRight = document.querySelector("[data-news-slots-right]");
  const slotsFull = document.querySelector("[data-news-slots-full]");

  if (!slotsLeft || !slotsRight || !slotsFull) {
    return;
  }

  const supabaseClient = getSupabaseClient();
  if (!supabaseClient) {
    return;
  }

  let slotsData = {};

  const warmImageCache = (items) => {
    (items || []).forEach((item) => {
      if (item?.image_url) {
        const img = new Image();
        img.src = item.image_url;
      }
    });
  };

  const syncSlots = () => {
    document.querySelectorAll(".news-slot").forEach((slotEl) => {
      const slotNumber = Number(slotEl.dataset.slot);
      updateSlot(slotEl, slotsData[slotNumber]);
    });
  };

  const loadCachedSlots = () => {
    try {
      const raw = localStorage.getItem(NEWS_CACHE_KEY);
      if (!raw) {
        return false;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return false;
      }
      if (Date.now() - parsed.savedAt > NEWS_CACHE_TTL_MS) {
        return false;
      }
      const items = Array.isArray(parsed.items) ? parsed.items : [];
      slotsData = items.reduce((acc, item) => {
        acc[item.slot_number] = item;
        return acc;
      }, {});
      syncSlots();
      warmImageCache(items);
      return true;
    } catch (err) {
      return false;
    }
  };

  const loadSlots = async () => {
    const { data, error } = await supabaseClient
      .from(NEWS_SLOTS_TABLE)
      .select("slot_number,caption,image_url,updated_at")
      .order("slot_number", { ascending: true });
    if (error) {
      return;
    }
    slotsData = (data || []).reduce((acc, item) => {
      acc[item.slot_number] = item;
      return acc;
    }, {});
    try {
      localStorage.setItem(
        NEWS_CACHE_KEY,
        JSON.stringify({ savedAt: Date.now(), items: data || [] })
      );
    } catch (err) {
      // Ignore storage failures (private mode, quota).
    }
    syncSlots();
    warmImageCache(data);
  };

  loadCachedSlots();
  loadSlots();
}
