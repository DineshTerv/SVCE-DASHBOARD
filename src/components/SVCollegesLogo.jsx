import React from 'react';

export default function SVCollegesLogo({ className = "h-11 w-11" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${className}`}>
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Navy Blue Gradient Background */}
          <radialGradient id="svNavyGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#142a5c" />
            <stop offset="70%" stopColor="#0c1b3d" />
            <stop offset="100%" stopColor="#061026" />
          </radialGradient>

          {/* Gold Metallic Gradients */}
          <linearGradient id="svGoldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3d078" />
            <stop offset="30%" stopColor="#c59837" />
            <stop offset="70%" stopColor="#e9c263" />
            <stop offset="100%" stopColor="#9a7122" />
          </linearGradient>

          <linearGradient id="svGoldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe699" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>

          {/* Text Path for "EDUCATION FOR A BETTER SOCIETY" */}
          <path
            id="textPathArc"
            d="M 28 100 A 72 72 0 1 1 172 100"
            fill="none"
          />
        </defs>

        {/* ── Outer Golden Border Ring ── */}
        <circle cx="100" cy="100" r="96" fill="url(#svGoldRing)" />
        <circle cx="100" cy="100" r="92" fill="#071228" />

        {/* ── Navy Blue Main Body ── */}
        <circle cx="100" cy="100" r="90" fill="url(#svNavyGrad)" stroke="url(#svGoldRing)" strokeWidth="2.5" />
        
        {/* ── Inner Gold Guide Circle ── */}
        <circle cx="100" cy="100" r="62" fill="none" stroke="url(#svGoldRing)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />

        {/* ── TOP CURVED TEXT: EDUCATION FOR A BETTER SOCIETY ── */}
        <text fill="#ffffff" fontSize="9.5" fontWeight="bold" letterSpacing="0.14em" fontFamily="serif">
          <textPath href="#textPathArc" startOffset="50%" textAnchor="middle">
            EDUCATION FOR A BETTER SOCIETY
          </textPath>
        </text>

        {/* ── SUN RAYS BEHIND CROWN ── */}
        <g stroke="#e2b755" strokeWidth="1" opacity="0.5">
          <line x1="100" y1="36" x2="100" y2="44" />
          <line x1="90" y1="39" x2="93" y2="46" />
          <line x1="110" y1="39" x2="107" y2="46" />
          <line x1="82" y1="44" x2="87" y2="50" />
          <line x1="118" y1="44" x2="113" y2="50" />
          <line x1="76" y1="52" x2="83" y2="56" />
          <line x1="124" y1="52" x2="117" y2="56" />
        </g>

        {/* ── CENTER: TIRUPATI BALAJI DEITY EMBLEM ── */}
        <g id="deity" transform="translate(0, 5)">
          {/* Golden Crown / Kireetam */}
          <path
            d="M 92 68 L 94 48 L 100 40 L 106 48 L 108 68 Z"
            fill="url(#svGoldGlow)"
            stroke="#6a4a0f"
            strokeWidth="0.8"
          />
          {/* Crown horizontal tiers */}
          <line x1="93" y1="62" x2="107" y2="62" stroke="#7a5513" strokeWidth="1" />
          <line x1="95" y1="54" x2="105" y2="54" stroke="#7a5513" strokeWidth="1" />
          <circle cx="100" cy="42" r="1.8" fill="#ffffff" />

          {/* Deity Face Base & Ear Ornaments (Kundalams) */}
          <path d="M 91 68 C 91 80, 109 80, 109 68 Z" fill="#0b1730" stroke="url(#svGoldGlow)" strokeWidth="1" />
          <ellipse cx="88" cy="70" rx="3" ry="5" fill="url(#svGoldGlow)" stroke="#7a5513" strokeWidth="0.5" />
          <ellipse cx="112" cy="70" rx="3" ry="5" fill="url(#svGoldGlow)" stroke="#7a5513" strokeWidth="0.5" />

          {/* White Namam & Red Tilakam */}
          <path d="M 96 64 L 98 75 L 100 75 L 102 75 L 104 64 L 102 64 L 100 71 L 98 64 Z" fill="#ffffff" />
          <rect x="99.2" y="65" width="1.6" height="7" fill="#dc2626" rx="0.5" />

          {/* Left: Sudarshana Chakra with gold garland */}
          <g transform="translate(73, 64)">
            <circle cx="6" cy="6" r="7" fill="url(#svGoldGlow)" stroke="#6a4a0f" strokeWidth="0.6" />
            <circle cx="6" cy="6" r="3.5" fill="#c2410c" />
            <circle cx="6" cy="6" r="1.5" fill="#ffffff" />
          </g>

          {/* Right: Shankha (Conch) with gold garland */}
          <g transform="translate(115, 64)">
            <circle cx="6" cy="6" r="7" fill="url(#svGoldGlow)" stroke="#6a4a0f" strokeWidth="0.6" />
            <path d="M 4 8 C 4 3, 8 3, 8 8 C 8 10, 6 10, 4 8 Z" fill="#ffffff" />
          </g>
        </g>

        {/* ── BOTTOM TEXT: SV COLLEGES ── */}
        <text
          x="100"
          y="138"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="serif"
          fontSize="15.5"
          fontWeight="900"
          letterSpacing="0.08em"
        >
          SV COLLEGES
        </text>

        {/* ── SUBTITLE: SINCE 1981 ── */}
        <text
          x="100"
          y="152"
          textAnchor="middle"
          fill="#f3d078"
          fontFamily="sans-serif"
          fontSize="8.5"
          fontWeight="bold"
          letterSpacing="0.18em"
        >
          SINCE 1981
        </text>
      </svg>
    </div>
  );
}
