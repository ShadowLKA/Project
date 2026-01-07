// Note: Team cards page with admin management.
import { renderSectionShell } from "./sectionShell.js";
import { getSupabaseClient } from "./supabase.js";

const TEAM_TABLE = "team_members";

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

export function initTeamPage() {
  const grid = document.querySelector("[data-team-grid]");
  const emptyState = document.querySelector("[data-team-empty]");

  if (!grid) {
    return;
  }

  const supabaseClient = getSupabaseClient();
  if (!supabaseClient) {
    return;
  }

  const loadMembers = async () => {
    const { data, error } = await supabaseClient
      .from(TEAM_TABLE)
      .select("id,name,title,role,bio,image_url,created_at")
      .order("created_at", { ascending: true });
    if (error) {
      return;
    }
    renderTeamGrid(grid, emptyState, data || []);
  };

  loadMembers();
}


