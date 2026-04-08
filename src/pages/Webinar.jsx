import React, { useEffect, useState } from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";

export default function Webinar() {
  useSEO({
    title: "Claude Code Webinar Series | Nobi",
    description: "Join Nobi's webinar series on AI tools. Learn how to use AI to convert more visitors and grow your business.",
    path: "/webinar",
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    sessions: "",
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
      formData.append("subject", "Webinar Registration: " + (form.firstName + " " + form.lastName).trim());
      formData.append("from_name", "Nobi Webinar");
      formData.append("name", (form.firstName + " " + form.lastName).trim());
      formData.append("email", form.email);
      formData.append("company", form.company);
      formData.append("sessions", form.sessions);
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
      <div className="webinar-page">
        <style>{`
          .webinar-page {
            font-family: 'Georgia', 'Times New Roman', serif;
            color: #222;
            line-height: 1.7;
            font-size: 17px;
          }
          .webinar-page a { color: #222; }

          .webinar-hero {
            max-width: 720px;
            margin: 0 auto;
            padding: 60px 32px 60px;
          }
          .webinar-hero-top {
            display: flex;
            align-items: flex-start;
            gap: 48px;
            margin-bottom: 36px;
          }
          .webinar-hero-text { flex: 1; }
          .webinar-hero-visual {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding-top: 38px;
          }
          .webinar-hero-visual img {
            height: 48px;
            width: auto;
          }
          .webinar-hero-visual .plus {
            font-size: 22px;
            color: #ccc;
            font-weight: 300;
            margin: 0;
            position: relative;
            left: 12px;
          }
          .webinar-hero .eyebrow {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #888;
            margin-bottom: 20px;
          }
          .webinar-hero h1 {
            font-size: 2.6rem;
            font-weight: 400;
            line-height: 1.2;
            margin-bottom: 28px;
            letter-spacing: -0.5px;
          }
          .webinar-hero h1 em { font-style: italic; }
          .webinar-hero .intro {
            color: #555;
            margin-bottom: 28px;
            font-size: 1.05rem;
          }
          .webinar-hero .details {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 0.88rem;
            color: #888;
            margin-bottom: 8px;
          }
          .webinar-hero-cta { margin-top: 28px; }
          .webinar-hero-cta a {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: inline-block;
            background: #222;
            color: #fff;
            text-decoration: none;
            padding: 13px 32px;
            border-radius: 6px;
            font-size: 0.92rem;
            font-weight: 500;
            transition: background 0.15s;
          }
          .webinar-hero-cta a:hover { background: #444; }

          .webinar-page hr {
            border: none;
            border-top: 1px solid #e0e0e0;
            max-width: 720px;
            margin: 0 auto;
          }

          .webinar-sessions {
            max-width: 720px;
            margin: 0 auto;
            padding: 60px 32px;
          }
          .webinar-sessions h2 {
            font-weight: 400;
            font-size: 1.6rem;
            margin-bottom: 40px;
          }
          .webinar-session {
            margin-bottom: 48px;
            display: grid;
            grid-template-columns: 56px 1fr;
            gap: 0 24px;
          }
          .webinar-session-number {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #aaa;
            padding-top: 4px;
          }
          .webinar-session h3 {
            font-weight: 600;
            font-size: 1.15rem;
            margin-bottom: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          .webinar-session .meta {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 0.82rem;
            color: #999;
            margin-bottom: 10px;
          }
          .webinar-session p {
            color: #555;
            font-size: 0.98rem;
            grid-column: 2;
          }
          .webinar-session .topics {
            grid-column: 2;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 0.85rem;
            color: #777;
            margin-top: 10px;
          }

          .webinar-pitch {
            max-width: 720px;
            margin: 0 auto;
            padding: 60px 32px;
          }
          .webinar-pitch p {
            color: #555;
            font-size: 1.05rem;
            margin-bottom: 16px;
          }
          .webinar-pitch p:last-of-type { margin-bottom: 0; }

          .webinar-register {
            max-width: 720px;
            margin: 0 auto;
            padding: 60px 32px 80px;
          }
          .webinar-register h2 {
            font-weight: 400;
            font-size: 1.6rem;
            margin-bottom: 8px;
          }
          .webinar-register .sub {
            color: #888;
            font-size: 0.95rem;
            margin-bottom: 32px;
          }
          .webinar-register form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .webinar-register form .full { grid-column: 1 / -1; }
          .webinar-register input,
          .webinar-register select {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 13px 14px;
            border: 1.5px solid #ddd;
            border-radius: 6px;
            font-size: 0.92rem;
            background: #fff;
            color: #222;
            width: 100%;
            transition: border-color 0.15s;
          }
          .webinar-register input:focus,
          .webinar-register select:focus {
            outline: none;
            border-color: #222;
          }
          .webinar-register input::placeholder { color: #aaa; }
          .webinar-register select { color: #aaa; }
          .webinar-register button {
            grid-column: 1 / -1;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 14px;
            background: #222;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;
          }
          .webinar-register button:hover { background: #444; }
          .webinar-register .fine-print {
            grid-column: 1 / -1;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 0.78rem;
            color: #aaa;
            text-align: center;
          }

          @media (max-width: 640px) {
            .webinar-hero { padding: 48px 20px 40px; }
            .webinar-hero h1 { font-size: 2rem; }
            .webinar-hero-top { flex-direction: column; gap: 32px; }
            .webinar-hero-visual { width: 100%; justify-content: center; }
            .webinar-hero-visual img { height: 48px; }
            .webinar-session { grid-template-columns: 1fr; }
            .webinar-session-number { margin-bottom: 4px; }
            .webinar-session p,
            .webinar-session .topics { grid-column: 1; }
            .webinar-register form { grid-template-columns: 1fr; }
            .webinar-sessions,
            .webinar-pitch,
            .webinar-register { padding-left: 20px; padding-right: 20px; }
          }
        `}</style>

        <section className="webinar-hero">
          <div className="webinar-hero-top">
            <div className="webinar-hero-text">
              <div className="eyebrow">Free webinar series &middot; 4 weeks</div>
              <h1>We'll show you how to use Claude Code to <em>actually</em> run your business</h1>
            </div>
            <div className="webinar-hero-visual">
              <a href="https://nobi.ai"><img src="/media/nobi-logo.webp" alt="Nobi" style={{ height: "80px", marginBottom: "-14px" }} /></a>
              <span className="plus">+</span>
              <img src="/media/claude-logo.svg" alt="Claude" />
            </div>
          </div>
          <p className="intro">
            Not a lecture. Not a pitch deck. We're going to open a terminal and build things
            in front of you — marketing systems, outreach pipelines, data analysis, real software.
            Four sessions, 30 minutes each.
          </p>
          <p className="details">New webinar every week in April &middot; 30 min each</p>
          <p className="details">Hosted by Tyler &amp; Shanif, co-founders of Nobi</p>
          <div className="webinar-hero-cta">
            <a href="#register">Register for the series</a>
          </div>
        </section>

        <hr />

        <section className="webinar-sessions">
          <h2>The sessions</h2>

          <div className="webinar-session">
            <div className="webinar-session-number">Week 1</div>
            <div>
              <h3>Reach Your Ideal Customer Where They Already Are</h3>
              <div className="meta">Tyler &middot; April 10th</div>
            </div>
            <p>
              We'll find where your customers actually hang out online, engage authentically
              in their communities, and create targeted content that resonates — then turn the
              whole thing into a repeatable marketing system. All built live.
            </p>
            <div className="topics">Community discovery &middot; Authentic engagement &middot; Targeted content &middot; Repeatable systems</div>
          </div>

          <div className="webinar-session">
            <div className="webinar-session-number">Week 2</div>
            <div>
              <h3>Send Outreach That Actually Gets Replies</h3>
              <div className="meta">Tyler &middot; April 16th</div>
            </div>
            <p>
              We'll write personalized outreach at scale — not mail merge, real personalization
              based on automatic prospect research. Then we'll set up follow-ups at the right time
              and build a pipeline you can actually track and optimize.
            </p>
            <div className="topics">Personalized outreach &middot; Prospect research &middot; Follow-up sequences &middot; Pipeline tracking</div>
          </div>

          <div className="webinar-session">
            <div className="webinar-session-number">Week 3</div>
            <div>
              <h3>Turn Raw Data Into Decisions</h3>
              <div className="meta">Tyler &middot; April 23rd</div>
            </div>
            <p>
              We'll write SQL naturally, simulate user journeys, generate a deck with real
              insights, and then actually implement the recommendations — including live site
              updates. From messy data to action in 30 minutes.
            </p>
            <div className="topics">Natural SQL &middot; User journey simulation &middot; Insight decks &middot; Live implementation</div>
          </div>

          <div className="webinar-session">
            <div className="webinar-session-number">Week 4</div>
            <div>
              <h3>Stop Vibe Coding: Build Software the Right Way</h3>
              <div className="meta">Shanif &middot; April 30th</div>
            </div>
            <p>
              Most people think you can just go in and vibe code a whole app. You can't — or
              rather, you can, but you'll end up with security flaws and errors that compound
              until the whole thing falls over. Shanif will show the right way: break the work
              into small, iterative pieces, prompt Claude correctly, and add tests as you go.
              The way you'd actually ship software.
            </p>
            <div className="topics">Incremental development &middot; Prompting &middot; Testing &middot; Engineering workflow</div>
          </div>
        </section>

        <hr />

        <section className="webinar-pitch">
          <p>
            We're showing you all of this because we think it's genuinely useful and we want
            you to see what's possible. If you walk away and build it all yourself — great.
          </p>
          <p>
            But if you'd rather skip the setup and have someone who's already done this
            handle it for you, that's what Nobi does. After the series, we're offering a
            free 30-minute call where we'll look at your workflows and tell you exactly
            where Claude Code can help.
          </p>
        </section>

        <hr />

        <section className="webinar-register" id="register">
          <h2>Register</h2>
          <p className="sub">Pick one session or sign up for all four. We'll send the recordings either way.</p>
          {!done ? (
            <form onSubmit={handleSubmit}>
              <input type="text" name="botcheck" value={form.botcheck} onChange={update} style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
              <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={update} required />
              <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={update} />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={update} required className="full" />
              <input type="text" name="company" placeholder="Company (optional)" value={form.company} onChange={update} className="full" />
              <select className="full" name="sessions" value={form.sessions} onChange={update}>
                <option value="" disabled>Which sessions?</option>
                <option value="all">All four</option>
                <option value="1">Week 1 — Reach Your Ideal Customer</option>
                <option value="2">Week 2 — Send Outreach That Gets Replies</option>
                <option value="3">Week 3 — Turn Data Into Decisions</option>
                <option value="4">Week 4 — Stop Vibe Coding</option>
              </select>
              {error && <div className="full" style={{ color: "#c00", fontFamily: "-apple-system, sans-serif", fontSize: "0.88rem" }}>{error}</div>}
              <button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Register — it's free"}</button>
              <div className="fine-print">No spam. Just reminders and the recording.</div>
            </form>
          ) : (
            <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: "1rem", color: "#333", padding: "20px 0" }}>
              <p>You're registered! We'll send you a reminder before each session.</p>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
