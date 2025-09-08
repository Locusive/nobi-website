// api/request-demo.js
// Vercel Function: receives your form, emails you via Resend, returns {ok:true}

const esc = (s) =>
  String(s || "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    // simple bot trap
    if (body.honey) return res.status(200).json({ ok: true });

    const {
      name = "", email = "", company = "", website = "",
      platform = "", message = ""
    } = body;

    // Email content
    const html = `
      <h2>New “Try it on your store” submission</h2>
      <ul>
        <li><b>Name:</b> ${esc(name)}</li>
        <li><b>Email:</b> ${esc(email)}</li>
        <li><b>Company:</b> ${esc(company)}</li>
        <li><b>Website:</b> ${esc(website)}</li>
        <li><b>Platform:</b> ${esc(platform)}</li>
      </ul>
      <p><b>Message:</b><br>${esc(message).replace(/\n/g, "<br>")}</p>
    `;

    // Send the email via Resend (no extra packages needed)
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,        // e.g. "Nobi <onboarding@resend.dev>"
        to: process.env.EMAIL_TO,            // your email
        subject: "New Nobi demo request",
        html,
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return res.status(500).json({ ok: false, error: `Send failed: ${txt}` });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "Server error" });
  }
};
