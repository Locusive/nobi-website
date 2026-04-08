import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";

export default function Webinar() {
  useSEO({
    title: "Claude Code Webinar Series | Nobi",
    description: "Join Nobi's webinar series on AI tools. Learn how to use AI to convert more visitors and grow your business.",
    path: "/webinar",
  });

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
          <p className="sub">Pick a session to register via Zoom. Sign up for one or all four — we'll send the recordings either way.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <a href="https://us06web.zoom.us/webinar/register/WN_fSW4DDOGSYGiipZi5HWsVQ" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "16px 20px", border: "1.5px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#222", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", transition: "border-color 0.15s" }}>
              <strong style={{ fontSize: "0.95rem" }}>Week 1 — Reach Your Ideal Customer</strong><br />
              <span style={{ fontSize: "0.82rem", color: "#999" }}>Friday, April 10th &middot; 12 PM PT</span>
            </a>
            <a href="https://us06web.zoom.us/webinar/register/WN_Y1SIzq6BRh6FRFgzrjGGIw" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "16px 20px", border: "1.5px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#222", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", transition: "border-color 0.15s" }}>
              <strong style={{ fontSize: "0.95rem" }}>Week 2 — Outreach That Gets Replies</strong><br />
              <span style={{ fontSize: "0.82rem", color: "#999" }}>Thursday, April 16th &middot; 12 PM PT</span>
            </a>
            <a href="https://us06web.zoom.us/webinar/register/WN_BB3Z9e-5S8q0CM36XnLoVg" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "16px 20px", border: "1.5px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#222", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", transition: "border-color 0.15s" }}>
              <strong style={{ fontSize: "0.95rem" }}>Week 3 — Data Into Decisions</strong><br />
              <span style={{ fontSize: "0.82rem", color: "#999" }}>Thursday, April 23rd &middot; 12 PM PT</span>
            </a>
            <a href="https://us06web.zoom.us/webinar/register/WN_3glh79uMRT6T_FAMXFtQVA" target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "16px 20px", border: "1.5px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#222", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", transition: "border-color 0.15s" }}>
              <strong style={{ fontSize: "0.95rem" }}>Week 4 — Stop Vibe Coding</strong><br />
              <span style={{ fontSize: "0.82rem", color: "#999" }}>Thursday, April 30th &middot; 12 PM PT</span>
            </a>
          </div>
          <p className="fine-print" style={{ marginTop: "16px" }}>No spam. Just reminders and the recording.</p>
        </section>
      </div>
    </PageLayout>
  );
}
