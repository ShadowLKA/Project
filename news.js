// Note: News/about page renderer.
import { renderSectionShell } from "./sectionShell.js";
import { getSupabaseClient } from "./supabase.js";

const NEWS_SLOTS_TABLE = "news_slots";
const NEWS_BUCKET = "news-images";
const SLOT_COUNT = 3;

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
        <div class="news-slot__admin is-hidden" data-slot-admin>
          <label>
            Caption
            <input type="text" data-slot-caption-input placeholder="Milestone event">
          </label>
          <label>
            Replace image
            <input type="file" data-slot-file accept="image/*">
          </label>
          <div class="news-slot__actions">
            <button class="btn btn-ghost" type="button" data-slot-clear>Clear</button>
            <button class="btn btn-primary" type="button" data-slot-save>Save</button>
          </div>
        </div>
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
          <div class="news-admin__message is-hidden" data-news-message></div>
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

const updateSlot = (slotEl, data, isAdmin) => {
  const imageEl = slotEl.querySelector("[data-slot-image]");
  const captionEl = slotEl.querySelector("[data-slot-caption]");
  const placeholder = slotEl.querySelector(".news-slot__placeholder");
  const adminEl = slotEl.querySelector("[data-slot-admin]");
  const captionInput = slotEl.querySelector("[data-slot-caption-input]");

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

  if (captionInput) {
    captionInput.value = data?.caption || "";
  }

  if (adminEl) {
    adminEl.classList.toggle("is-hidden", !isAdmin);
  }
};

export function initNewsPage() {
  const slotsLeft = document.querySelector("[data-news-slots-left]");
  const slotsRight = document.querySelector("[data-news-slots-right]");
  const slotsFull = document.querySelector("[data-news-slots-full]");
  const message = document.querySelector("[data-news-message]");

  if (!slotsLeft || !slotsRight || !slotsFull) {
    return;
  }

  const supabaseClient = getSupabaseClient();
  if (!supabaseClient) {
    if (message) {
      message.textContent = "Supabase is unavailable.";
      message.classList.add("is-visible");
    }
    return;
  }

  let slotsData = {};
  let isAdmin = false;

  const setMessage = (text, type = "") => {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.classList.toggle("is-visible", Boolean(text));
    message.classList.toggle("is-success", type === "success");
  };

  const syncAdminUi = () => {
    document.querySelectorAll(".news-slot").forEach((slotEl) => {
      const slotNumber = Number(slotEl.dataset.slot);
      updateSlot(slotEl, slotsData[slotNumber], isAdmin);
    });
  };

  const loadSlots = async () => {
    const { data, error } = await supabaseClient
      .from(NEWS_SLOTS_TABLE)
      .select("slot_number,caption,image_url,updated_at")
      .order("slot_number", { ascending: true });
    if (error) {
      setMessage("Unable to load photos.");
      return;
    }
    slotsData = (data || []).reduce((acc, item) => {
      acc[item.slot_number] = item;
      return acc;
    }, {});
    syncAdminUi();
  };

  const loadAdmin = async () => {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const session = sessionData?.session;
    if (!session) {
      isAdmin = false;
      syncAdminUi();
      return;
    }
    const { data, error } = await supabaseClient
      .from("profiles")
      .select("is_admin, role")
      .eq("id", session.user.id)
      .single();
    if (error) {
      isAdmin = false;
      syncAdminUi();
      return;
    }
    isAdmin = data?.is_admin === true || data?.role === "admin";
    syncAdminUi();
  };

  const uploadImage = async (file) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const ext = safeName.includes(".") ? safeName.split(".").pop() : "jpg";
    const slotNumber = Number(file.datasetSlot || 0);
    const filePath = `news/slot-${slotNumber}.${ext}`;
    const { error } = await supabaseClient.storage
      .from(NEWS_BUCKET)
      .upload(filePath, file, { upsert: true });
    if (error) {
      throw error;
    }
    const { data } = supabaseClient.storage.from(NEWS_BUCKET).getPublicUrl(filePath);
    return data?.publicUrl || "";
  };

  const handleSlotClick = async (event) => {
    const saveButton = event.target.closest("[data-slot-save]");
    const clearButton = event.target.closest("[data-slot-clear]");
    if (!saveButton && !clearButton) {
      return;
    }
    if (!isAdmin) {
      setMessage("Admin access required.");
      return;
    }
    const slotEl = event.target.closest("[data-slot]");
    if (!slotEl) {
      return;
    }
    const slotNumber = Number(slotEl.dataset.slot);
    const captionInput = slotEl.querySelector("[data-slot-caption-input]");
    const fileInput = slotEl.querySelector("[data-slot-file]");
    const caption = String(captionInput?.value || "").trim();
    const file = fileInput?.files?.[0] || null;
    try {
      if (clearButton) {
        const imageUrl = slotsData[slotNumber]?.image_url || null;
        const imagePath = getStoragePath(imageUrl);
        if (imagePath) {
          await supabaseClient.storage.from(NEWS_BUCKET).remove([imagePath]);
        }
        const { error } = await supabaseClient.from(NEWS_SLOTS_TABLE).upsert({
          slot_number: slotNumber,
          caption: null,
          image_url: null
        });
        if (error) {
          setMessage("Unable to clear slot.");
          return;
        }
        if (captionInput) {
          captionInput.value = "";
        }
        if (fileInput) {
          fileInput.value = "";
        }
        setMessage("Cleared.", "success");
        await loadSlots();
        return;
      }

      let imageUrl = slotsData[slotNumber]?.image_url || null;
      if (file) {
        file.datasetSlot = String(slotNumber);
        imageUrl = await uploadImage(file);
      }
      const { error } = await supabaseClient.from(NEWS_SLOTS_TABLE).upsert({
        slot_number: slotNumber,
        caption: caption || null,
        image_url: imageUrl
      });
      if (error) {
        setMessage("Unable to save slot.");
        return;
      }
      setMessage("Saved.", "success");
      await loadSlots();
    } catch (error) {
      const detail = error?.message || error?.error_description || error?.name || "";
      setMessage(`Upload failed${detail ? `: ${detail}` : "."}`);
      if (error) {
        console.error("News photo upload failed:", error);
      }
    }
  };

  slotsLeft.addEventListener("click", handleSlotClick);
  slotsRight.addEventListener("click", handleSlotClick);
  slotsFull.addEventListener("click", handleSlotClick);

  window.addEventListener("auth:changed", () => {
    loadAdmin();
  });

  loadSlots();
  loadAdmin();
}
