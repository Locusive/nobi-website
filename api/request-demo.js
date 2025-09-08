// /api/request-demo.js
import { Resend } from "resend";

export default async function handler(req, res) {
  // Quick health check in the browser: /api/request-demo?health=1
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "request-demo is alive" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, company, website, platform, message, honey } = req.body || {};

    // Honeypot: if a bot fills this hidden field, pretend all is fine.
    if (honey) return res.status(200).json({ ok: true });

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ ok: false, error: "Missing RESEND_API_KEY" });
    }
    if (!process.env.TO_EMAIL) {
      return res.status(500).json({ ok: false, error: "Missing TO_EMAIL env var" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // TIP: While testing with Resend, use a verified domain or the
    // sandbox sender: "Acme <onboarding@resend.dev>" and a verified recipient.
    const from = process.env.MAIL_FROM || "Nobi Site <onboarding@resend.dev>";

    const text = [
      `New request from the website:`,
      `Name:    ${name || "-"}`,
      `Email:   ${email || "-"}`,
      `Company: ${company || "-"}`,
      `Website: ${website || "-"}`,
      `Platform:${platform || "-"}`,
      "",
      `Message:`,
      message || "-",
    ].join("\n");

    await resend.emails.send({
      from,
      to: process.env.TO_EMAIL, // your inbox
      subject: "Nobi – Try it on your store",
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    // Surface the real error so the UI can show it
    return res.status(500).json({ ok: false, error: err?.message || "Email failed" });
  }
}
