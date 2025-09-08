// /api/request-demo.js  (Node function on Vercel)
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { Resend } = require('resend');
  const { name, email, company, website, platform, message, honey } = req.body || {};

  // Honeypot: if a hidden input is filled, quietly succeed
  if (honey) return res.status(200).json({ ok: true });

  if (!email) return res.status(400).json({ ok: false, error: 'Missing email' });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.FROM_EMAIL || 'Nobi <onboarding@resend.dev>';
    const to = process.env.TO_EMAIL;

    const subject = `New “Try it on your store” — ${company || name || email}`;
    const text = [
      `Name: ${name || ''}`,
      `Email: ${email || ''}`,
      `Company: ${company || ''}`,
      `Website: ${website || ''}`,
      `Platform: ${platform || ''}`,
      '',
      (message || '').trim()
    ].join('\n');

    await resend.emails.send({
      from,
      to,
      subject,
      text,
      reply_to: email, // so you can reply directly
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('request-demo error:', err);
    res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};
