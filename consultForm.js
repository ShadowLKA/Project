// Note: Consultation intake page section.
import { renderSectionShell } from "./sectionShell.js";

export function renderConsultForm(consultForm) {
  return renderSectionShell({
    id: "consultation-form",
    tag: consultForm.tag,
    title: consultForm.title,
    copy: consultForm.copy,
    content: `
      <div class="intake-grid">
        <form class="intake-form">
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
          <button class="btn btn-primary" type="button">Submit request</button>
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
