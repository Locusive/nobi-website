// /api/request-demo.js
import { Resend } from "resend";

// Either keep this line:
export const config = { runtime: "nodejs" };
// or delete it entirely — both are valid. Do NOT use "nodejs20.x".

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_TO = process.env.EMAIL_TO || ""; // e.g. "you@yourdomain.com"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const { name, email, company, website, platform, message, honey } = body;

    // Honeypot for bots
    if (honey) return res.status(200).json({ ok: true });

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "Name and email are required." });
    }

    const subject = `New Nobi request from ${name} (${email})`;
    const html = `
      <h2>${subject}</h2>
      <ul>
        <li><b>Name:</b> ${escapeHtml(name)}</li>
        <li><b>Email:</b> ${escapeHtml(email)}</li>
        <li><b>Company:</b> ${escapeHtml(company || "")}</li>
        <li><b>Website:</b> ${escapeHtml(website || "")}</li>
        <li><b>Platform:</b> ${escapeHtml(platform || "")}</li>
      </ul>
      <p><b>Message:</b></p>
      <pre style="white-space:pre-wrap">${escapeHtml(message || "")}</pre>
    `;

    // If Resend is configured, send the email. Otherwise just log & succeed.
    if (resend && EMAIL_TO) {
      const { data, error } = await resend.emails.send({
        from: "Nobi Forms <forms@your-verified-domain.com>", // must be a verified domain in Resend
        to: [EMAIL_TO],
        subject,
        html,
      });
      if (error) throw error;
      return res.status(200).json({ ok: true, id: data?.id || null });
    } else {
      console.log("Form submission (no email provider configured):", {
        name,
        email,
        company,
        website,
        platform,
        message,
      });
      return res.status(200).json({ ok: true, preview: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

// tiny helper
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch])
  );
}
