// Note: Team cards page with admin management.
import { renderSectionShell } from "./sectionShell.js";
import { getSupabaseClient } from "./supabase.js";

const TEAM_TABLE = "team_members";
const TEAM_BUCKET = "team-images";

export function renderTeamPage(team) {
  return renderSectionShell({
    id: "team",
    tag: team.tag,
    title: team.title,
    copy: team.copy,
    content: `
      <div class="team-layout">
        <div>
          <div class="team-grid" data-team-grid></div>
          <p class="team-empty is-hidden" data-team-empty>No team members yet.</p>
        </div>
        <details class="team-admin-shell is-hidden" data-team-admin-shell>
          <summary class="team-admin__toggle">Admin tools</summary>
          <aside class="team-admin" data-team-admin>
            <div class="team-admin__header">
              <h3>Admin: Team cards</h3>
              <p>Upload images and update the team roster.</p>
            </div>
            <div class="team-admin__message" data-team-message></div>
            <form class="team-admin__form" data-team-form>
              <input type="hidden" name="id">
              <label>
                Name
                <input type="text" name="name" placeholder="Jordan Lee" required>
              </label>
              <label>
                Title
                <input type="text" name="title" placeholder="Senior Advisor" required>
              </label>
              <label>
                Role
                <input type="text" name="role" placeholder="Operations" required>
              </label>
              <label>
                Bio
                <textarea name="bio" rows="4" placeholder="Short bio" required></textarea>
              </label>
              <label>
                Image upload
                <input type="file" name="image" accept="image/*">
              </label>
              <label>
                Image URL (optional)
                <input type="text" name="image_url" placeholder="https://">
              </label>
              <div class="team-admin__actions">
                <button class="btn btn-primary" type="submit">Save member</button>
                <button class="btn btn-ghost" type="button" data-team-reset>New member</button>
              </div>
            </form>
            <div class="team-admin__list" data-team-list></div>
          </aside>
        </details>
        <div class="team-confirm is-hidden" data-team-confirm aria-hidden="true">
          <div class="team-confirm__backdrop" data-team-cancel></div>
          <div class="team-confirm__dialog" role="dialog" aria-modal="true" aria-labelledby="teamConfirmTitle">
            <h4 id="teamConfirmTitle">Delete team member?</h4>
            <p data-team-confirm-copy>This action cannot be undone.</p>
            <div class="team-confirm__actions">
              <button class="btn btn-ghost" type="button" data-team-cancel>Cancel</button>
              <button class="btn btn-primary" type="button" data-team-confirm>Delete</button>
            </div>
          </div>
        </div>
      </div>
    `
  });
}

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const renderTeamGrid = (grid, emptyState, members) => {
  if (!grid) {
    return;
  }
  if (!members.length) {
    grid.innerHTML = "";
    if (emptyState) {
      emptyState.classList.remove("is-hidden");
    }
    return;
  }
  if (emptyState) {
    emptyState.classList.add("is-hidden");
  }
  grid.innerHTML = members
    .map(
      (member) => `
        <article class="team-card">
          <div class="team-card__media">
            ${
              member.image_url
                ? `<img src="${member.image_url}" alt="${member.name}">`
                : `<span>${getInitials(member.name)}</span>`
            }
          </div>
          <div class="team-card__meta">
            <strong>${member.name || ""}</strong>
            <span>${member.title || ""}</span>
            <small>${member.role || ""}</small>
          </div>
          <p>${member.bio || ""}</p>
        </article>`
    )
    .join("");
};

const renderAdminList = (list, members) => {
  if (!list) {
    return;
  }
  if (!members.length) {
    list.innerHTML = "<p class=\"team-admin__empty\">No entries yet.</p>";
    return;
  }
  list.innerHTML = members
    .map(
      (member) => `
        <div class="team-admin__item" data-id="${member.id}">
          <div>
            <strong>${member.name || ""}</strong>
            <span>${member.title || ""} · ${member.role || ""}</span>
          </div>
          <div class="team-admin__item-actions">
            <button class="btn btn-ghost" type="button" data-team-edit>Edit</button>
            <button class="btn btn-ghost" type="button" data-team-delete>Delete</button>
          </div>
        </div>`
    )
    .join("");
};

const getStoragePath = (publicUrl) => {
  if (!publicUrl) {
    return "";
  }
  const marker = `/storage/v1/object/public/${TEAM_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) {
    return "";
  }
  return publicUrl.slice(index + marker.length);
};

export function initTeamPage() {
  const grid = document.querySelector("[data-team-grid]");
  const emptyState = document.querySelector("[data-team-empty]");
  const adminShell = document.querySelector("[data-team-admin-shell]");
  const adminPanel = document.querySelector("[data-team-admin]");
  const list = document.querySelector("[data-team-list]");
  const form = document.querySelector("[data-team-form]");
  const message = document.querySelector("[data-team-message]");
  const resetButton = document.querySelector("[data-team-reset]");
  const confirmOverlay = document.querySelector("[data-team-confirm]");
  const confirmCopy = document.querySelector("[data-team-confirm-copy]");
  const confirmButton = document.querySelector("[data-team-confirm]");
  const confirmCancel = document.querySelectorAll("[data-team-cancel]");

  if (!grid) {
    return;
  }

  if (confirmOverlay && confirmOverlay.parentElement !== document.body) {
    document.body.appendChild(confirmOverlay);
  }

  const supabaseClient = getSupabaseClient();
  if (!supabaseClient) {
    if (message) {
      message.textContent = "Supabase is unavailable.";
      message.classList.add("is-visible");
    }
    return;
  }

  let members = [];
  let isAdmin = false;
  let pendingDeleteId = "";
  let confirmLocked = false;
  let confirmScroll = 0;

  const setMessage = (text, type = "") => {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.classList.toggle("is-visible", Boolean(text));
    message.classList.toggle("is-success", type === "success");
  };

  const resetForm = () => {
    if (!form) {
      return;
    }
    form.reset();
    const idInput = form.querySelector("input[name=\"id\"]");
    if (idInput) {
      idInput.value = "";
    }
    setMessage("");
  };

  const openConfirm = (member) => {
    if (!confirmOverlay) {
      return;
    }
    pendingDeleteId = member?.id || "";
    if (confirmCopy) {
      confirmCopy.textContent = `Delete ${member?.name || "this member"}? This action cannot be undone.`;
    }
    confirmOverlay.classList.remove("is-hidden");
    confirmOverlay.setAttribute("aria-hidden", "false");
    if (!document.body.classList.contains("modal-open")) {
      confirmLocked = true;
      confirmScroll = window.scrollY;
      document.body.classList.add("no-scroll");
      document.body.classList.add("modal-open");
      document.body.style.position = "fixed";
      document.body.style.top = `-${confirmScroll}px`;
      document.body.style.width = "100%";
    }
  };

  const closeConfirm = () => {
    if (!confirmOverlay) {
      return;
    }
    pendingDeleteId = "";
    confirmOverlay.classList.add("is-hidden");
    confirmOverlay.setAttribute("aria-hidden", "true");
    if (confirmLocked) {
      document.body.classList.remove("no-scroll");
      document.body.classList.remove("modal-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, confirmScroll);
      confirmLocked = false;
    }
  };

  const syncAdminUi = () => {
    if (adminShell) {
      adminShell.classList.toggle("is-hidden", !isAdmin);
    }
  };

  const loadMembers = async () => {
    const { data, error } = await supabaseClient
      .from(TEAM_TABLE)
      .select("id,name,title,role,bio,image_url,created_at")
      .order("created_at", { ascending: true });
    if (error) {
      setMessage("Unable to load team members.");
      return;
    }
    members = data || [];
    renderTeamGrid(grid, emptyState, members);
    renderAdminList(list, members);
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
    const filePath = `team/${Date.now()}-${safeName}`;
    const { error } = await supabaseClient.storage
      .from(TEAM_BUCKET)
      .upload(filePath, file, { upsert: true });
    if (error) {
      throw error;
    }
    const { data } = supabaseClient.storage.from(TEAM_BUCKET).getPublicUrl(filePath);
    return data?.publicUrl || "";
  };

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!isAdmin) {
        setMessage("Admin access required.");
        return;
      }
      const formData = new FormData(form);
      const id = formData.get("id");
      const name = String(formData.get("name") || "").trim();
      const title = String(formData.get("title") || "").trim();
      const role = String(formData.get("role") || "").trim();
      const bio = String(formData.get("bio") || "").trim();
      let imageUrl = String(formData.get("image_url") || "").trim();
      const imageFile = form.querySelector("input[name=\"image\"]")?.files?.[0] || null;

      if (!name || !title || !role || !bio) {
        setMessage("Please fill out all fields.");
        return;
      }

      try {
        if (imageFile) {
          imageUrl = await uploadImage(imageFile);
        }
        const payload = {
          name,
          title,
          role,
          bio,
          image_url: imageUrl || null
        };
        let response;
        if (id) {
          response = await supabaseClient.from(TEAM_TABLE).update(payload).eq("id", id);
        } else {
          response = await supabaseClient.from(TEAM_TABLE).insert(payload);
        }
        if (response.error) {
          setMessage("Unable to save team member.");
          return;
        }
        setMessage("Saved.", "success");
        resetForm();
        await loadMembers();
      } catch (error) {
        const detail = error?.message || error?.error_description || error?.name || "";
        setMessage(`Image upload failed${detail ? `: ${detail}` : "."}`);
        if (error) {
          console.error("Team image upload failed:", error);
        }
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetForm);
  }

  if (list) {
    list.addEventListener("click", async (event) => {
      const editButton = event.target.closest("[data-team-edit]");
      const deleteButton = event.target.closest("[data-team-delete]");
      const item = event.target.closest("[data-id]");
      if (!item) {
        return;
      }
      const id = item.getAttribute("data-id");
      const member = members.find((entry) => entry.id === id);
      if (!member) {
        return;
      }
      if (editButton && form) {
        form.querySelector("input[name=\"id\"]").value = member.id;
        form.querySelector("input[name=\"name\"]").value = member.name;
        form.querySelector("input[name=\"title\"]").value = member.title;
        form.querySelector("input[name=\"role\"]").value = member.role;
        form.querySelector("textarea[name=\"bio\"]").value = member.bio;
        form.querySelector("input[name=\"image_url\"]").value = member.image_url || "";
        setMessage("");
        return;
      }
      if (deleteButton) {
        openConfirm(member);
      }
    });
  }

  if (confirmButton) {
    confirmButton.addEventListener("click", async () => {
      if (!pendingDeleteId) {
        closeConfirm();
        return;
      }
      const member = members.find((entry) => entry.id === pendingDeleteId);
      if (!member) {
        closeConfirm();
        return;
      }
      if (member.image_url) {
        const imagePath = getStoragePath(member.image_url);
        if (imagePath) {
          await supabaseClient.storage.from(TEAM_BUCKET).remove([imagePath]);
        }
      }
      const { error } = await supabaseClient.from(TEAM_TABLE).delete().eq("id", member.id);
      if (error) {
        setMessage("Unable to delete team member.");
        closeConfirm();
        return;
      }
      setMessage("Deleted.", "success");
      closeConfirm();
      await loadMembers();
    });
  }

  if (confirmCancel.length) {
    confirmCancel.forEach((button) => {
      button.addEventListener("click", closeConfirm);
    });
  }

  window.addEventListener("auth:changed", () => {
    loadAdmin();
  });

  loadMembers();
  loadAdmin();
}
