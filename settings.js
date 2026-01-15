import { renderSectionShell } from "./sectionShell.js";
import { getSupabaseClient } from "./supabase.js";
import { normalizePhone, syncAuthButtons } from "./auth/state.js";
import { bindThemeToggles } from "./theme.js";

export function renderSettings(settings) {
  return renderSectionShell({
    id: "settings",
    tag: settings.tag,
    title: settings.title,
    copy: settings.copy,
    content: `
      <div class="intake-grid settings-grid">
        <div class="settings-guest is-hidden" data-settings-guest>
          <div class="intake-card">
            <h3>Log in required</h3>
            <p>Sign in to manage your account details and preferences.</p>
            <button class="btn btn-primary" type="button" data-open-modal="authModal">Sign in</button>
          </div>
        </div>
        <form class="intake-form settings-form" data-settings-form>
          <div class="settings-status is-hidden" data-settings-status>
            <span class="settings-status__label">Signed in</span>
            <span class="settings-status__value" data-settings-status-value></span>
          </div>
          <div class="intake-group settings-theme-group">
            <h3>Theme</h3>
            <div class="settings-theme">
              <span>Current mode</span>
              <button class="btn btn-secondary" type="button" data-theme-toggle aria-label="Toggle dark mode">
                <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" role="presentation">
                    <path d="M12 4.25a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V5a.75.75 0 0 1 .75-.75Zm5.657 2.093a.75.75 0 0 1 1.06 0l1.237 1.238a.75.75 0 1 1-1.06 1.06l-1.237-1.237a.75.75 0 0 1 0-1.061Zm-11.314 0a.75.75 0 0 1 0 1.06L5.106 8.64a.75.75 0 1 1-1.06-1.06l1.237-1.237a.75.75 0 0 1 1.06 0ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm8.75 3a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Zm-16.5 0a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V12a.75.75 0 0 1 .75-.75Zm14.204 6.409a.75.75 0 0 1 0 1.06l-1.237 1.238a.75.75 0 0 1-1.06-1.06l1.237-1.238a.75.75 0 0 1 1.06 0ZM6.583 17.66a.75.75 0 0 1 0 1.06l-1.237 1.238a.75.75 0 0 1-1.06-1.06l1.237-1.238a.75.75 0 0 1 1.06 0ZM12 18.25a.75.75 0 0 1 .75.75v1.75a.75.75 0 0 1-1.5 0V19a.75.75 0 0 1 .75-.75Z"></path>
                  </svg>
                </span>
                <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" role="presentation">
                    <path d="M15.5 3.5a.75.75 0 0 1 .739.89 6.75 6.75 0 1 0 7.372 7.372.75.75 0 0 1 .89.739 9 9 0 1 1-9-9Z"></path>
                  </svg>
                </span>
                <span class="visually-hidden" data-theme-label>Switch to dark</span>
              </button>
            </div>
          </div>
          <div class="intake-group">
            <h3>Account details</h3>
            <label>
              Full name
              <input type="text" name="fullName" placeholder="Your name" autocomplete="name">
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="you@email.com" autocomplete="email">
            </label>
            <label>
              Phone
              <input type="tel" name="phone" placeholder="+1 (555) 123-4567" autocomplete="tel">
            </label>
          </div>
          <div class="intake-group">
            <h3>Change password</h3>
            <label>
              New password
              <input type="password" name="newPassword" placeholder="Minimum 8 characters" autocomplete="new-password">
            </label>
            <label>
              Confirm new password
              <input type="password" name="confirmPassword" placeholder="Repeat new password" autocomplete="new-password">
            </label>
          </div>
          <button class="btn btn-primary" type="submit">Save changes</button>
          <p class="settings-message" data-settings-message></p>
        </form>
        <div class="intake-side settings-side">
          <div class="intake-card">
            <h3>Security tips</h3>
            <ul>
              <li>Use a strong, unique password.</li>
              <li>Keep your email current for alerts.</li>
              <li>Update your phone for verification.</li>
            </ul>
          </div>
          <div class="intake-card">
            <h3>Need help?</h3>
            <p>Email support for account changes or access issues.</p>
          </div>
        </div>
      </div>
    `
  });
}

export function initSettingsPage() {
  const form = document.querySelector("[data-settings-form]");
  const message = document.querySelector("[data-settings-message]");
  const guestCard = document.querySelector("[data-settings-guest]");
  const side = document.querySelector(".settings-side");
  const status = document.querySelector("[data-settings-status]");
  const statusValue = document.querySelector("[data-settings-status-value]");
  const profileTable = "profiles";
  const profileIdField = "id";

  if (!form) {
    return;
  }

  const setMessage = (text, type = "error") => {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.classList.toggle("is-visible", Boolean(text));
    message.classList.toggle("is-success", type === "success");
  };

  const supabaseClient = getSupabaseClient();
  if (!supabaseClient) {
    setMessage("Supabase failed to load. Please refresh and try again.");
    return;
  }

  bindThemeToggles(form);

  const setStatus = (session, user) => {
    if (!status || !statusValue) {
      return;
    }
    const email = user?.email || session?.user?.email || "";
    statusValue.textContent = email || "Active session";
    status.classList.toggle("is-hidden", !session);
  };
  const setStatusFromStorage = () => {
    if (!status || !statusValue) {
      return;
    }
    const storedEmail = localStorage.getItem("accountEmail") || "";
    const storedName = localStorage.getItem("accountName") || "";
    const label = storedEmail || storedName;
    if (!label) {
      status.classList.add("is-hidden");
      return;
    }
    statusValue.textContent = label;
    status.classList.remove("is-hidden");
  };

  const syncVisibility = (isLoggedIn) => {
    if (guestCard) {
      guestCard.classList.toggle("is-hidden", isLoggedIn);
    }
    form.classList.toggle("is-hidden", !isLoggedIn);
    if (side) {
      side.classList.toggle("is-hidden", !isLoggedIn);
    }
  };

  const fetchProfile = async (userId) => {
    if (!userId) {
      return null;
    }
    const { data, error } = await supabaseClient
      .from(profileTable)
      .select("full_name,email,phone")
      .eq(profileIdField, userId)
      .maybeSingle();
    if (error) {
      console.error("[settings] profile:read-error", error);
      return null;
    }
    return data || null;
  };

  const hydrateProfile = async () => {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const session = sessionData?.session || null;
    syncVisibility(Boolean(session));
    syncAuthButtons({ currentSession: session });
    setStatus(session, session?.user || null);
    if (!session) {
      setStatusFromStorage();
      return;
    }
    const { data: userData } = await supabaseClient.auth.getUser();
    const user = userData?.user;
    const profile = await fetchProfile(session.user.id);
    const storedEmail = localStorage.getItem("accountEmail") || "";
    const storedName = localStorage.getItem("accountName") || "";
    const storedPhone = localStorage.getItem("accountPhone") || "";
    const fullName = profile?.full_name || user?.user_metadata?.full_name || storedName;
    const phone = profile?.phone || user?.user_metadata?.phone || user?.phone || storedPhone;
    const email = profile?.email || user?.email || storedEmail;
    const nameInput = form.querySelector('input[name="fullName"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    if (nameInput) {
      nameInput.value = fullName;
    }
    if (emailInput) {
      emailInput.value = email;
    }
    if (phoneInput) {
      phoneInput.value = phone;
    }
  };

  const updateSessionUi = async () => {
    const { data } = await supabaseClient.auth.getSession();
    const session = data?.session || null;
    window.dispatchEvent(new CustomEvent("auth:changed", { detail: { session } }));
    syncAuthButtons({ currentSession: session });
    setStatus(session, session?.user || null);
  };

  hydrateProfile();

  window.addEventListener("auth:changed", (event) => {
    const session = event.detail?.session || null;
    setStatus(session, session?.user || null);
    if (!session) {
      setStatusFromStorage();
      syncVisibility(false);
      return;
    }
    syncVisibility(true);
    hydrateProfile();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("");
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData?.session) {
      syncVisibility(false);
      setMessage("Please log in to update your settings.");
      return;
    }

    const fullName = form.querySelector('input[name="fullName"]')?.value.trim() || "";
    const email = form.querySelector('input[name="email"]')?.value.trim().toLowerCase() || "";
    const rawPhone = form.querySelector('input[name="phone"]')?.value.trim() || "";
    const newPassword = form.querySelector('input[name="newPassword"]')?.value || "";
    const confirmPassword = form.querySelector('input[name="confirmPassword"]')?.value || "";

    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        setMessage("Please enter a password with at least 8 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
    }

    let phone = rawPhone;
    if (rawPhone) {
      phone = normalizePhone(rawPhone);
      if (!phone) {
        setMessage("Please enter a phone number in + country format.");
        return;
      }
    }

    const updates = {};
    const metadata = {};
    if (fullName) {
      metadata.full_name = fullName;
    }
    if (phone) {
      metadata.phone = phone;
    }
    if (Object.keys(metadata).length) {
      updates.data = metadata;
    }
    if (email) {
      updates.email = email;
    }
    if (newPassword) {
      updates.password = newPassword;
    }

    const profileUpdates = {
      [profileIdField]: sessionData.session.user.id
    };
    if (fullName) {
      profileUpdates.full_name = fullName;
    }
    if (email) {
      profileUpdates.email = email;
    }
    if (phone) {
      profileUpdates.phone = phone;
    }

    if (!Object.keys(updates).length && Object.keys(profileUpdates).length === 1) {
      setMessage("No changes to save.");
      return;
    }

    if (Object.keys(updates).length) {
      const { error } = await supabaseClient.auth.updateUser(updates);
      if (error) {
        setMessage(error.message || "Could not update your settings.");
        return;
      }
    }

    if (Object.keys(profileUpdates).length > 1) {
      const { error } = await supabaseClient
        .from(profileTable)
        .upsert(profileUpdates, { onConflict: profileIdField });
      if (error) {
        setMessage(error.message || "Could not update your profile.");
        return;
      }
    }

    if (email) {
      setMessage("Profile updated. Check your inbox to confirm the new email.", "success");
    } else {
      setMessage("Settings updated.", "success");
    }
    const passwordInput = form.querySelector('input[name="newPassword"]');
    const confirmInput = form.querySelector('input[name="confirmPassword"]');
    if (passwordInput) {
      passwordInput.value = "";
    }
    if (confirmInput) {
      confirmInput.value = "";
    }
    await updateSessionUi();
  });
}
