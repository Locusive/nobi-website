// nobiField.js — the animated hero "liquid light" background.
// Framework-agnostic. Call startNobiField(canvasEl) → returns a cleanup fn.
// In React: useEffect(() => startNobiField(ref.current), [])
//
// Renders at 0.6x internal resolution and is CSS-blurred (see canvas style in Hero:
//   transform: scale(1.13); filter: blur(34px)) so low-res is fine and cheap.
// Driven by setInterval (not rAF) so it keeps a steady cadence; auto-pauses when the
// canvas scrolls out of view via IntersectionObserver.

export function startNobiField(cv) {
  if (!cv) return () => {};
  const ctx = cv.getContext('2d');
  let w, h, timer = null, io = null;

  const fit = () => {
    const r = cv.getBoundingClientRect();
    w = Math.max(2, Math.round(r.width * 0.6));
    h = Math.max(2, Math.round(r.height * 0.6));
    cv.width = w; cv.height = h;
  };
  fit();

  const rnd = (a, b) => a + Math.random() * (b - a);
  const hex = (c) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const palette = [
    { c: hex('#de8652'), light: hex('#dcb497'), glow: false },
    { c: hex('#c950ad'), light: hex('#e29bce'), glow: false },
    { c: hex('#8a4bd0'), light: hex('#b48ae0'), glow: true  },
    { c: hex('#6f54cc'), light: hex('#9f8ce0'), glow: true  },
    { c: hex('#5f78d8'), light: hex('#97a8de'), glow: false },
    { c: hex('#7d54cc'), light: hex('#aa90e0'), glow: true  },
    { c: hex('#de9b6a'), light: hex('#dcc3ad'), glow: false }
  ];
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (A, B, t) => [Math.round(lerp(A[0], B[0], t)), Math.round(lerp(A[1], B[1], t)), Math.round(lerp(A[2], B[2], t))];

  const blobs = [];
  const starts = [[-0.18, 0.12], [1.18, 0.10], [1.24, 0.92], [-0.22, 0.90]];
  for (let i = 0; i < 4; i++) {
    blobs.push({
      hx: starts[i][0], hy: starts[i][1],
      dax: rnd(0.06, 0.13), day: rnd(0.05, 0.11),
      oxs: rnd(0.011, 0.022) * (Math.random() < 0.5 ? 1 : -1),
      oys: rnd(0.009, 0.019) * (Math.random() < 0.5 ? 1 : -1),
      oxp: rnd(0, 6.28), oyp: rnd(0, 6.28),
      r: rnd(0.17, 0.32),
      glow: i % 2 === 1,
      phase: rnd(0, 6.28), pSpeed: rnd(0.008, 0.016) * (Math.random() < 0.5 ? 1 : -1),
      lobes: 3 + (i % 3),
      amp: rnd(0.12, 0.22),
      ci: i % palette.length,
      cSpeed: rnd(0.0011, 0.0022),
      bphase: rnd(0, 6.28), bSpeed: rnd(0.008, 0.016)
    });
  }
  const t0 = performance.now();

  const draw = () => {
    const T = (performance.now() - t0) / 1000;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#6656ce';
    ctx.fillRect(0, 0, w, h);
    for (const b of blobs) {
      const bx = b.hx + Math.sin(T * b.oxs * 6.28 + b.oxp) * b.dax;
      const by = b.hy + Math.cos(T * b.oys * 6.28 + b.oyp) * b.day;
      const cf = T * b.cSpeed * 30 + b.ci;
      const idx = Math.floor(cf) % palette.length;
      const frac = cf - Math.floor(cf);
      const et = frac * frac * (3 - 2 * frac);
      const cur = palette[idx], nxt = palette[(idx + 1) % palette.length];
      const bodyC = mix(cur.c, nxt.c, et);
      const lightC = mix(cur.light, nxt.light, et);
      const cx = bx * w, cy = by * h;
      const breathe = 1 + 0.08 * Math.sin(T * b.bSpeed * 6.28 + b.bphase);
      const R = b.r * breathe * Math.min(w, h);
      ctx.save();
      ctx.globalCompositeOperation = b.glow ? 'screen' : 'source-over';
      ctx.beginPath();
      const steps = 48;
      for (let s = 0; s <= steps; s++) {
        const t = (s / steps) * Math.PI * 2;
        const wob = 1 + b.amp * (Math.sin(b.lobes * t + b.phase + T * b.pSpeed * 6.28) * 0.55 + Math.cos((b.lobes + 1) * t - (b.phase + T * b.pSpeed * 6.28) * 0.7) * 0.45);
        const rr = R * wob;
        const x = cx + Math.cos(t) * rr, y = cy + Math.sin(t) * rr;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const g = ctx.createRadialGradient(cx - R * 0.34, cy - R * 0.34, R * 0.04, cx, cy, R * 1.18);
      g.addColorStop(0, 'rgba(' + lightC[0] + ',' + lightC[1] + ',' + lightC[2] + ',0.95)');
      g.addColorStop(0.55, 'rgba(' + bodyC[0] + ',' + bodyC[1] + ',' + bodyC[2] + ',0.82)');
      g.addColorStop(1, 'rgba(' + bodyC[0] + ',' + bodyC[1] + ',' + bodyC[2] + ',0)');
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }
  };

  const start = () => { if (!timer) timer = setInterval(draw, 33); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const onResize = () => { fit(); draw(); };

  draw();
  start();
  window.addEventListener('resize', onResize);
  try {
    io = new IntersectionObserver((entries) => {
      if (entries[0] && entries[0].isIntersecting) start(); else stop();
    }, { threshold: 0.01 });
    io.observe(cv);
  } catch (e) { /* no-op */ }

  return () => {
    stop();
    window.removeEventListener('resize', onResize);
    if (io) io.disconnect();
  };
}
