import { renderSectionShell } from "./sectionShell.js";
import { getSupabaseClient } from "./supabase.js";
import { normalizePhone, syncAuthButtons } from "./auth/state.js";
import { getTheme, setTheme } from "./theme.js";

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
            <button class="btn btn-primary" type="button" data-open-modal="loginModal">Log in</button>
          </div>
        </div>
        <form class="intake-form settings-form" data-settings-form>
          <div class="intake-group">
            <h3>Theme</h3>
            <div class="settings-theme">
              <span>Current mode</span>
              <button class="btn btn-secondary" type="button" data-theme-toggle>Switch to dark</button>
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

  const updateThemeButton = () => {
    const button = form.querySelector("[data-theme-toggle]");
    if (!button) {
      return;
    }
    const theme = getTheme();
    button.textContent = theme === "dark" ? "Switch to light" : "Switch to dark";
  };

  const themeButton = form.querySelector("[data-theme-toggle]");
  if (themeButton) {
    updateThemeButton();
    themeButton.addEventListener("click", () => {
      const nextTheme = getTheme() === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      updateThemeButton();
    });
  }

  const syncVisibility = (isLoggedIn) => {
    if (guestCard) {
      guestCard.classList.toggle("is-hidden", isLoggedIn);
    }
    form.classList.toggle("is-hidden", !isLoggedIn);
    if (side) {
      side.classList.toggle("is-hidden", !isLoggedIn);
    }
  };

  const hydrateProfile = async () => {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const session = sessionData?.session || null;
    syncVisibility(Boolean(session));
    syncAuthButtons({ currentSession: session });
    if (!session) {
      return;
    }
    const { data: userData } = await supabaseClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return;
    }
    const fullName = user.user_metadata?.full_name || "";
    const phone = user.user_metadata?.phone || user.phone || "";
    const email = user.email || "";
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
  };

  hydrateProfile();

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
    if (!Object.keys(updates).length) {
      setMessage("No changes to save.");
      return;
    }

    const { error } = await supabaseClient.auth.updateUser(updates);
    if (error) {
      setMessage(error.message || "Could not update your settings.");
      return;
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
