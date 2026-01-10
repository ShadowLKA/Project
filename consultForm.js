// Note: Consultation intake page section.
import { renderSectionShell } from "./sectionShell.js";
import { getSupabaseClient } from "./supabase.js";

export function renderConsultForm(consultForm) {
  return renderSectionShell({
    id: "consultation-form",
    tag: consultForm.tag,
    title: consultForm.title,
    copy: consultForm.copy,
    content: `
      <div class="intake-grid">
        <form class="intake-form" data-consult-form>
          <div class="intake-group">
            <label>
              Full name
              <input type="text" name="name" placeholder="Jane Doe" autocomplete="name">
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="jane@email.com" autocomplete="email">
            </label>
            <label>
              Phone
              <input type="tel" name="phone" placeholder="(555) 123-4567" autocomplete="tel">
            </label>
            <label>
              Preferred contact
              <select name="contact">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text</option>
              </select>
            </label>
          </div>
          <div class="intake-group">
            <label>
              Specialty needed
              <select name="specialty">
                <option value="">Select a specialty</option>
                <option value="cardiology">Cardiology</option>
                <option value="oncology">Oncology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="neurology">Neurology</option>
                <option value="primary-care">Primary care</option>
              </select>
            </label>
            <label>
              Describe your concern
              <textarea name="message" rows="5" placeholder="Briefly describe what you need help with"></textarea>
            </label>
            <label class="intake-upload">
              Upload records (optional)
              <input type="file" name="records" multiple>
            </label>
          </div>
          <button class="btn btn-primary" type="submit">Submit request</button>
          <p class="intake-message" data-consult-message aria-live="polite"></p>
        </form>
        <div class="intake-side">
          <div class="intake-card">
            <h3>What happens next</h3>
            <ul>
              <li>We review your intake within 24 hours.</li>
              <li>A care concierge matches you with a specialist.</li>
              <li>You receive a clear plan and next steps.</li>
            </ul>
          </div>
          <div class="intake-card">
            <h3>Need urgent care?</h3>
            <p>If this is an emergency, call 911 or go to the nearest ER.</p>
          </div>
        </div>
      </div>
    `
  });
}

const setSubmitState = (button, isLoading, label) => {
  if (!button) {
    return;
  }
  if (isLoading) {
    button.dataset.originalLabel = button.dataset.originalLabel || button.textContent || "";
    button.textContent = label || button.textContent || "";
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  } else {
    button.textContent = button.dataset.originalLabel || button.textContent || "";
    delete button.dataset.originalLabel;
    button.disabled = false;
    button.removeAttribute("aria-busy");
  }
};

export function initConsultForm() {
  const form = document.querySelector("[data-consult-form]");
  const messageEl = document.querySelector("[data-consult-message]");
  if (!form) {
    return;
  }

  const setMessage = (text, type = "error") => {
    if (!messageEl) {
      return;
    }
    messageEl.textContent = text;
    messageEl.classList.toggle("is-visible", Boolean(text));
    messageEl.classList.toggle("is-success", type === "success");
  };

  const supabaseClient = getSupabaseClient();
  if (!supabaseClient) {
    setMessage("Supabase failed to load. Please refresh and try again.");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.requestPending === "true") {
      return;
    }

    const name = form.querySelector('input[name="name"]')?.value.trim() || "";
    const email = form.querySelector('input[name="email"]')?.value.trim().toLowerCase() || "";
    const phone = form.querySelector('input[name="phone"]')?.value.trim() || "";
    const contact = form.querySelector('select[name="contact"]')?.value || "";
    const specialty = form.querySelector('select[name="specialty"]')?.value || "";
    const concern = form.querySelector('textarea[name="message"]')?.value.trim() || "";
    const recordsInput = form.querySelector('input[name="records"]');
    const records = Array.from(recordsInput?.files || [])
      .map((file) => file.name)
      .filter(Boolean);

    if (!name) {
      setMessage("Please enter your full name.");
      return;
    }
    if (!contact) {
      setMessage("Please select a preferred contact method.");
      return;
    }
    if (contact === "email" && !email) {
      setMessage("Please provide an email address.");
      return;
    }
    if ((contact === "phone" || contact === "text") && !phone) {
      setMessage("Please provide a phone number.");
      return;
    }
    if (!email && !phone) {
      setMessage("Please provide at least one way to contact you.");
      return;
    }
    if (!specialty) {
      setMessage("Please select a specialty.");
      return;
    }
    if (!concern) {
      setMessage("Please describe your concern.");
      return;
    }

    form.dataset.requestPending = "true";
    setMessage("");
    setSubmitState(submitButton, true, "Submitting...");

    try {
      const payload = {
        name,
        email: email || null,
        phone: phone || null,
        contact,
        specialty,
        message: concern,
        records: records.length ? records : null
      };
      const { error } = await supabaseClient.from("consultations").insert(payload);
      if (error) {
        console.error("[consult] submit:error", error);
        setMessage(error.message || "Submission failed. Please try again.");
        return;
      }
      setMessage("Request received. We'll follow up within 24 hours.", "success");
      form.reset();
    } catch (error) {
      console.error("[consult] submit:error", error);
      setMessage(error?.message || "Submission failed. Please try again.");
    } finally {
      form.dataset.requestPending = "false";
      setSubmitState(submitButton, false);
    }
  });
}
