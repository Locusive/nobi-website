// api/request-demo.js
import { Resend } from "resend";

export const config = { runtime: "nodejs20.x" }; // ensures a modern Node runtime

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // Required server config
    const API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL;
    if (!API_KEY) {
      console.error("Missing RESEND_API_KEY.");
      return res
        .status(500)
        .json({ ok: false, error: "Server not configured (RESEND_API_KEY missing)." });
    }
    if (!TO_EMAIL) {
      console.error("Missing TO_EMAIL.");
      return res
        .status(500)
        .json({ ok: false, error: "Server not configured (TO_EMAIL missing)." });
    }

    // Body parsing fallback (handles both parsed and raw JSON)
    let data = req.body;
    if (!data || typeof data !== "object") {
      try { data = JSON.parse(req.body || "{}"); } catch { data = {}; }
    }

    const { name, email, company, website, platform, message, honey } = data;

    // Honeypot: if filled, silently succeed to discard bots
    if (honey) return res.status(200).json({ ok: true });

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "Name and email are required." });
    }

    const resend = new Resend(API_KEY);

    const subject = `New Nobi request from ${name}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "-"}`,
      `Website: ${website || "-"}`,
      `Platform: ${platform || "-"}`,
      "",
      `Message:`,
      `${message || "-"}`,
    ].join("\n");

    // You can keep onboarding@resend.dev for dev/testing.
    await resend.emails.send({
      from: "Nobi <onboarding@resend.dev>",
      to: TO_EMAIL,
      reply_to: email,
      subject,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("request-demo error:", err);
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Email send failed." });
  }
}
