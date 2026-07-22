// featureScroll.js — the pinned feature stack: crossfade panels + progress rail.
// Framework-agnostic. Call initFeatureScroll() after the DOM is mounted → returns cleanup.
//
// Expected DOM (see reference-homepage.html for exact markup):
//   .nb-fstack  — tall spacer (height ~ (nPanels)*100vh) that provides scroll distance
//     .nb-fstage  — position:sticky; top:0; height:100vh; overflow:hidden
//       .nb-feat  — one per feature panel (position:absolute; inset:0; opacity animated)
//   #nb-rail      — fixed dot rail; contains .nb-dot buttons (one per panel)
//
// Behavior: exactly one panel visible at a time. Old panel exits (fades up, translateY -18px),
// new panel enters (fades up from +18px). Rail only shows while the stack is pinned.
// On mobile (<=768px) panels flow normally (all visible), rail hidden.

export function initFeatureScroll() {
  const feats = Array.prototype.slice.call(document.querySelectorAll('.nb-feat'));
  const rail = document.getElementById('nb-rail');
  const stack = document.querySelector('.nb-fstack');
  if (!feats.length || !rail || !stack) return () => {};
  const dots = Array.prototype.slice.call(rail.querySelectorAll('.nb-dot'));
  const n = feats.length;
  let cur = -1, ticking = false;

  const update = () => {
    ticking = false;
    if (window.innerWidth <= 768) {
      feats.forEach((f) => { f.style.opacity = '1'; });
      rail.style.opacity = '0';
      return;
    }
    const vh = window.innerHeight;
    const total = stack.offsetHeight - vh;
    const top = stack.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, -top / total));
    const active = Math.max(0, Math.min(n - 1, Math.floor(progress * n)));
    if (active !== cur) {
      const prev = cur; cur = active;
      feats.forEach((f, i) => {
        f.style.transitionDelay = '0s';
        if (i === active) { f.style.opacity = '1'; f.style.transform = 'translateY(0)'; f.style.pointerEvents = 'auto'; }
        else if (i === prev) { f.style.opacity = '0'; f.style.transform = 'translateY(-18px)'; f.style.pointerEvents = 'none'; }
        else { f.style.opacity = '0'; f.style.transform = 'translateY(18px)'; f.style.pointerEvents = 'none'; }
      });
    }
    const pinned = top <= 1 && (-top) < total;
    rail.style.opacity = pinned ? '1' : '0';
    rail.style.pointerEvents = pinned ? 'auto' : 'none';
    dots.forEach((d, i) => d.setAttribute('data-active', i === active ? '1' : '0'));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  const dotHandlers = dots.map((d, i) => {
    const fn = () => {
      const total = stack.offsetHeight - window.innerHeight;
      const target = stack.offsetTop + (i / (n - 1)) * total;
      window.scrollTo({ top: target, behavior: 'smooth' });
    };
    d.addEventListener('click', fn);
    return fn;
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  rail.style.transition = 'opacity .3s ease';
  update();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    dots.forEach((d, i) => d.removeEventListener('click', dotHandlers[i]));
  };
}
