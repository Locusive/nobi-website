import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";

export default function WebinarIPullRank() {
  useEffect(() => {
    document.title = "Webinar: Christmas in June - Get Your Site Ready for AI-Powered Black Friday Shoppers | Nobi";
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    botcheck: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("access_key", "c7a3fd79-0e4f-47ce-aa30-c141616d21e3");
      formData.append("subject", "iPullRank Webinar Registration: " + (form.firstName + " " + form.lastName).trim());
      formData.append("from_name", "Nobi x iPullRank Webinar");
      formData.append("name", (form.firstName + " " + form.lastName).trim());
      formData.append("email", form.email);
      formData.append("company", form.company);
      formData.append("botcheck", form.botcheck);

      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err.message || "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout>
      <div className="wip-page">
        <style>{`
          .wip-page {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #111827;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            --bg-page: #ffffff;
            --bg-card: #f7f7f9;
            --bg-card-alt: #f0f0f4;
            --text-primary: #111827;
            --text-secondary: #6b7280;
            --border-color: rgba(0,0,0,0.07);
            --nobi-purple: #7c3aed;
            --nobi-pink: #db2777;
            --nobi-gradient: linear-gradient(120deg, #7c3aed, #db2777);
            --nobi-gradient-subtle: linear-gradient(120deg, rgba(124,58,237,0.08), rgba(219,39,119,0.08));
            --ipr-black: #1a1a1a;
            --ipr-accent: #0d9488;
            --ipr-accent-light: rgba(13,148,136,0.1);
          }

          .wip-nav {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.25rem 2rem;
            border-bottom: 1px solid var(--border-color);
          }
          .wip-nav-logos {
            display: flex;
            align-items: center;
            gap: 1.5rem;
          }
          .wip-nav-logos .wip-divider {
            color: var(--text-secondary);
            font-size: 1.25rem;
            opacity: 0.3;
          }
          .wip-logo-nobi {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 700;
            font-size: 1.25rem;
            text-decoration: none;
            color: var(--text-primary);
          }
          .wip-logo-ipr {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
          }
          .wip-logo-ipr img { height: 28px; width: auto; }
          .wip-logo-ipr-text {
            font-weight: 800;
            font-size: 1.2rem;
            color: var(--ipr-black);
            letter-spacing: -0.03em;
          }

          .wip-hero {
            position: relative;
            overflow: hidden;
            text-align: center;
            padding: 5rem 1.5rem 4rem;
            max-width: 850px;
            margin: 0 auto;
          }
          .wip-hero::before {
            content: '';
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 650px;
            height: 650px;
            background: radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 65%);
            pointer-events: none;
          }
          .wip-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--ipr-accent-light);
            border: 1px solid rgba(13,148,136,0.2);
            border-radius: 100px;
            padding: 0.4rem 1rem;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--ipr-accent);
            margin-bottom: 1.75rem;
          }
          .wip-badge .wip-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--nobi-pink);
            animation: wipPulse 2s infinite;
          }
          @keyframes wipPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .wip-hero h1 {
            font-size: clamp(2rem, 5vw, 3.15rem);
            font-weight: 800;
            line-height: 1.15;
            letter-spacing: -0.03em;
            margin-bottom: 1.5rem;
          }
          .wip-hero h1 .wip-highlight {
            background: linear-gradient(120deg, var(--ipr-accent), var(--nobi-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .wip-hero p.wip-subtitle {
            font-size: 1.1rem;
            color: var(--text-secondary);
            max-width: 640px;
            margin: 0 auto 2.5rem;
            line-height: 1.7;
          }
          .wip-meta-row {
            display: flex;
            justify-content: center;
            gap: 2.5rem;
            flex-wrap: wrap;
            margin-bottom: 2.5rem;
          }
          .wip-meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            color: var(--text-secondary);
          }
          .wip-meta-item svg {
            width: 18px;
            height: 18px;
            stroke: var(--ipr-accent);
            fill: none;
            strokeWidth: 2;
            strokeLinecap: round;
            strokeLinejoin: round;
          }
          .wip-meta-item strong {
            color: var(--text-primary);
            font-weight: 600;
          }

          .wip-cta-btn {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: linear-gradient(120deg, var(--ipr-accent), var(--nobi-purple));
            color: #fff;
            font-size: 1.05rem;
            font-weight: 700;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 20px rgba(13,148,136,0.25);
          }
          .wip-cta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 30px rgba(13,148,136,0.35);
          }

          .wip-page section {
            max-width: 920px;
            margin: 0 auto;
            padding: 3rem 1.5rem;
          }
          .wip-page section + section {
            margin-top: 1rem;
          }
          .wip-section-heading {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--ipr-accent);
            margin-bottom: 0.75rem;
          }
          .wip-section-title {
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 2rem;
          }

          .wip-stats { padding-bottom: 4rem; }
          .wip-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }
          .wip-stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 1.75rem;
            text-align: center;
          }
          .wip-stat-card .wip-number {
            font-size: 2.25rem;
            font-weight: 800;
            background: linear-gradient(120deg, var(--ipr-accent), var(--nobi-purple));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
          }
          .wip-stat-card .wip-label {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 0.35rem;
          }

          .wip-agenda { padding-top: 5rem; padding-bottom: 4rem; }
          .wip-timeline { display: grid; gap: 1rem; }
          .wip-timeline-item {
            display: grid;
            grid-template-columns: 90px 1fr;
            gap: 1.25rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 1.5rem;
            transition: border-color 0.2s;
          }
          .wip-timeline-item:hover {
            border-color: rgba(13,148,136,0.25);
            background: var(--bg-card-alt);
          }
          .wip-time-badge {
            background: var(--ipr-accent-light);
            color: var(--ipr-accent);
            font-size: 0.8rem;
            font-weight: 700;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            white-space: nowrap;
          }
          .wip-timeline-item h3 {
            font-size: 1.05rem;
            font-weight: 700;
            margin-bottom: 0.35rem;
          }
          .wip-timeline-item p {
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.6;
          }
          .wip-timeline-item .wip-presenter {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--nobi-purple);
            margin-top: 0.5rem;
          }

          .wip-speakers { padding-top: 3rem; padding-bottom: 5rem; }
          .wip-speakers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.25rem;
          }
          .wip-speaker-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 2rem 1.5rem;
            text-align: center;
          }
          .wip-speaker-avatar {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            color: #fff;
            overflow: hidden;
          }
          .wip-speaker-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .wip-speaker-avatar.wip-nobi { background: var(--nobi-gradient); }
          .wip-speaker-avatar.wip-ipr { background: var(--ipr-black); }
          .wip-speaker-card h3 {
            font-size: 1.05rem;
            font-weight: 700;
            margin-bottom: 0.2rem;
          }
          .wip-speaker-card .wip-role {
            font-size: 0.85rem;
            color: var(--text-secondary);
          }
          .wip-speaker-card .wip-company {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-top: 0.5rem;
          }
          .wip-speaker-card .wip-company.wip-nobi { color: var(--nobi-purple); }
          .wip-speaker-card .wip-company.wip-ipr { color: var(--ipr-black); }
          .wip-speaker-card .wip-bio {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 0.75rem;
            line-height: 1.55;
          }

          .wip-brands { padding-top: 3rem; padding-bottom: 5rem; }
          .wip-brands-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2.5rem;
            flex-wrap: wrap;
          }
          .wip-brand-pill {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 100px;
            padding: 0.6rem 1.5rem;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
            letter-spacing: -0.01em;
          }
          .wip-brand-pill img {
            height: 24px;
            width: auto;
            object-fit: contain;
            display: block;
          }

          .wip-audience { padding-top: 3rem; padding-bottom: 5rem; }
          .wip-audience-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .wip-audience-tag {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 100px;
            padding: 0.6rem 1.25rem;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .wip-bottom-cta {
            text-align: center;
            padding: 4rem 1.5rem 5rem;
            position: relative;
          }
          .wip-bottom-cta::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 500px;
            height: 400px;
            background: radial-gradient(circle, rgba(13,148,136,0.05) 0%, transparent 70%);
            pointer-events: none;
          }
          .wip-bottom-cta h2 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            letter-spacing: -0.02em;
          }
          .wip-bottom-cta p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
            font-size: 1rem;
          }

          .wip-register {
            max-width: 920px;
            margin: 0 auto;
            padding: 4rem 1.5rem 5rem;
          }
          .wip-register h2 {
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
          }
          .wip-register .wip-register-sub {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 2rem;
          }
          .wip-register form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.875rem;
          }
          .wip-register form .wip-full { grid-column: 1 / -1; }
          .wip-register input {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            padding: 0.8rem 0.875rem;
            border: 1.5px solid var(--border-color);
            border-radius: 8px;
            font-size: 0.92rem;
            background: #fff;
            color: var(--text-primary);
            width: 100%;
            transition: border-color 0.15s;
          }
          .wip-register input:focus {
            outline: none;
            border-color: var(--ipr-accent);
          }
          .wip-register input::placeholder { color: #aaa; }
          .wip-register button {
            grid-column: 1 / -1;
            padding: 1rem;
            background: linear-gradient(120deg, var(--ipr-accent), var(--nobi-purple));
            color: #fff;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 20px rgba(13,148,136,0.25);
          }
          .wip-register button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 30px rgba(13,148,136,0.35);
          }
          .wip-register .wip-fine-print {
            grid-column: 1 / -1;
            font-size: 0.78rem;
            color: var(--text-secondary);
            text-align: center;
            margin-top: 0.25rem;
          }

          @media (max-width: 600px) {
            .wip-hero { padding: 3rem 1rem 2.5rem; }
            .wip-meta-row { gap: 1rem; }
            .wip-timeline-item { grid-template-columns: 1fr; }
            .wip-time-badge { width: fit-content; padding: 0 0.75rem; }
          }
        `}</style>

        <nav className="wip-nav">
          <div className="wip-nav-logos">
            <a href="https://nobi.ai" className="wip-logo-nobi">
              <img src="/media/nobi-logo.png" alt="Nobi" style={{ height: "32px", width: "auto" }} />
            </a>
            <span className="wip-divider">&times;</span>
            <a href="https://ipullrank.com" className="wip-logo-ipr">
              <img src="/media/ipullrank.svg" alt="iPullRank" />
            </a>
          </div>
        </nav>

        <div className="wip-hero">
          <div className="wip-badge">
            <span className="wip-dot"></span>
            Live Webinar
          </div>
          <h1>Christmas in June - <span className="wip-highlight">Get Your Site Ready for AI-Powered Black Friday Shoppers</span></h1>
          <p className="wip-subtitle">Last year's Black Friday was the first where AI-driven shoppers showed up in force. This year, the wave will be bigger. Join iPullRank and Nobi to learn how to capture that traffic and convert it before your competitors do.</p>
          <div className="wip-meta-row">
            <div className="wip-meta-item">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <strong>June 2026 - Date TBD</strong>
            </div>
            <div className="wip-meta-item">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <strong>30 min + Q&amp;A</strong>
            </div>
            <div className="wip-meta-item">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              <strong>Free &amp; Virtual</strong>
            </div>
          </div>
          <a href="#register" className="wip-cta-btn">Reserve Your Seat</a>
        </div>

        <section className="wip-stats">
          <div className="wip-stats-grid">
            <div className="wip-stat-card">
              <div className="wip-number">$4B+</div>
              <div className="wip-label">Revenue generated by iPullRank for clients</div>
            </div>
            <div className="wip-stat-card">
              <div className="wip-number">2025</div>
              <div className="wip-label">AI Search Marketer of the Year (Search Engine Land)</div>
            </div>
            <div className="wip-stat-card">
              <div className="wip-number">BFCM</div>
              <div className="wip-label">Real data &amp; experiments from last year's Black Friday</div>
            </div>
          </div>
        </section>

        <section className="wip-agenda">
          <p className="wip-section-heading">Agenda</p>
          <h2 className="wip-section-title">What We'll Cover</h2>
          <div className="wip-timeline">
            <div className="wip-timeline-item">
              <div className="wip-time-badge">0 - 10 min</div>
              <div>
                <h3>What Last Year's Black Friday Told Us About AI Shoppers</h3>
                <p>Data and insights from BFCM 2025, including experiments with Profound (LLM monitoring) that reveal how AI-driven traffic actually behaves on e-commerce sites. What worked, what didn't, and what's changing for this year.</p>
                <div className="wip-presenter">Presented by Mike King, iPullRank</div>
              </div>
            </div>
            <div className="wip-timeline-item">
              <div className="wip-time-badge">10 - 25 min</div>
              <div>
                <h3>Capturing AI-Driven Shopper Intent with Nobi</h3>
                <p>What "AI search" means for e-commerce - how shoppers arriving from AI assistants carry richer context and intent, and how Nobi's AI search layer captures that to drive conversions. Live demo plus real data from brands like Faherty and UNTUCKit on VDP engagement and conversion lift.</p>
                <div className="wip-presenter">Presented by Tyler, Nobi</div>
              </div>
            </div>
            <div className="wip-timeline-item">
              <div className="wip-time-badge">25 - 30 min</div>
              <div>
                <h3>Your BFCM 2026 AI Readiness Playbook</h3>
                <p>A joint iPullRank + Nobi breakdown of what e-commerce brands should be doing right now to prepare: SEO for AI visibility, on-site AI search, and conversion optimization for the new shopper journey.</p>
                <div className="wip-presenter">Joint: iPullRank + Nobi</div>
              </div>
            </div>
            <div className="wip-timeline-item">
              <div className="wip-time-badge">30 - 40 min</div>
              <div>
                <h3>Live Q&amp;A</h3>
                <p>Your questions, answered live. Submit ahead of time or drop them in the chat.</p>
                <div className="wip-presenter">All speakers</div>
              </div>
            </div>
          </div>
        </section>

        <section className="wip-speakers">
          <p className="wip-section-heading">Speakers</p>
          <h2 className="wip-section-title">Who You'll Hear From</h2>
          <div className="wip-speakers-grid">
            <div className="wip-speaker-card">
              <div className="wip-speaker-avatar wip-ipr">
                <img src="/media/mike king.jpeg" alt="Mike King" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = 'MK'; }} />
              </div>
              <h3>Mike King</h3>
              <div className="wip-role">Founder &amp; CEO</div>
              <div className="wip-company wip-ipr">iPullRank</div>
              <p className="wip-bio">Search Engine Land's 2025 AI Search Marketer of the Year. Two decades in digital marketing, three in web development. Mike has helped generate over $4B in revenue for clients including SAP, American Express, and HSBC.</p>
            </div>
            <div className="wip-speaker-card">
              <div className="wip-speaker-avatar wip-nobi">
                <img src="/media/tyler headshot.jpeg" alt="Tyler" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = 'T'; }} />
              </div>
              <h3>Tyler Muse</h3>
              <div className="wip-role">Co-Founder</div>
              <div className="wip-company wip-nobi">Nobi</div>
              <p className="wip-bio">13+ years building and scaling tech startups that have partnered with F500 firms like Microsoft, Facebook, and Ford. Now co-founder of Nobi, the leading AI Shopping Assistant for major retail brands across the globe.</p>
            </div>
          </div>
        </section>

        <section className="wip-brands">
          <p className="wip-section-heading">Featuring Data From</p>
          <h2 className="wip-section-title">Real Results from Real Brands</h2>
          <div className="wip-brands-row">
            <div className="wip-brand-pill"><img src="/media/logos/untuckit.svg" alt="UNTUCKit" /></div>
            <div className="wip-brand-pill"><img src="/media/logos/lucchese.svg" alt="Lucchese" /></div>
            <div className="wip-brand-pill"><img src="/media/logos/toolup.svg" alt="TOOLUP" /></div>
            <div className="wip-brand-pill"><img src="/media/logos/kilte.svg" alt="Kilte" /></div>
          </div>
        </section>

        <section className="wip-audience">
          <p className="wip-section-heading">Who This Is For</p>
          <h2 className="wip-section-title">Built for E-Commerce Leaders Preparing for BFCM</h2>
          <div className="wip-audience-tags">
            <div className="wip-audience-tag">Heads of E-Commerce</div>
            <div className="wip-audience-tag">Digital Marketing Directors</div>
            <div className="wip-audience-tag">SEO &amp; Growth Leads</div>
            <div className="wip-audience-tag">CMOs &amp; VPs of Marketing</div>

          </div>
        </section>

        <section className="wip-register" id="register">
          <h2>Reserve Your Seat</h2>
          <p className="wip-register-sub">30 minutes of real data, live demos, and an actionable playbook. No fluff.</p>
          {!done ? (
            <form onSubmit={handleSubmit}>
              <input type="text" name="botcheck" value={form.botcheck} onChange={update} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
              <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={update} required />
              <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={update} />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={update} required className="wip-full" />
              <input type="text" name="company" placeholder="Company (optional)" value={form.company} onChange={update} className="wip-full" />
              {error && <div className="wip-full" style={{ color: "#c00", fontSize: "0.88rem" }}>{error}</div>}
              <button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Register - it's free"}</button>
              <div className="wip-fine-print">No spam. Just a reminder and the recording.</div>
            </form>
          ) : (
            <div style={{ fontSize: "1rem", color: "#333", padding: "20px 0" }}>
              <p>You're registered! We'll send you a reminder before the webinar.</p>
            </div>
          )}
        </section>

        <div className="wip-bottom-cta">
          <h2>Black Friday is coming. Is your site ready for AI shoppers?</h2>
          <p>30 minutes of real data, live demos, and an actionable playbook. No fluff.</p>
          <a href="#register" className="wip-cta-btn">Reserve Your Seat</a>
        </div>
      </div>
    </PageLayout>
  );
}
