import React from 'react';

const LOGOS = [
  { src: '/media/logos/untuckit.svg', alt: 'UNTUCKit', height: 23 },
  { src: '/media/logos/lucchese.svg', alt: 'Lucchese', height: 31 },
  { src: '/media/logos/toolup.svg', alt: 'TOOLUP', height: 22 },
  { src: '/media/logos/kilte.webp', alt: 'Kilte', height: 27 },
];

/** Shared with the homepage so logo scale, order, and treatment stay consistent. */
export default function CustomerLogos() {
  return (
    <>
      <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a49dba' }}>
        Trusted by modern teams
      </span>
      <div className="nb-customer-logos" style={{ marginTop: 24, width: '100%', maxWidth: 780, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(60px,7vw,80px)' }}>
        {LOGOS.map(logo => <img key={logo.alt} src={logo.src} alt={logo.alt} style={{ height: logo.height, width: 'auto', filter: 'grayscale(1)', opacity: 0.6 }} />)}
      </div>
    </>
  );
}
