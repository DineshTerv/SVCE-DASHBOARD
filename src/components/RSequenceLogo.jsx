import React from 'react';

export default function RSequenceLogo({ className = "h-11 w-auto" }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <svg 
        viewBox="0 0 380 120" 
        className="h-full w-auto overflow-visible"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for Calligraphic R */}
          <linearGradient id="rGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8d6653" />
            <stop offset="40%" stopColor="#b48c77" />
            <stop offset="80%" stopColor="#cfab97" />
            <stop offset="100%" stopColor="#7e533e" />
          </linearGradient>

          {/* Gradient for Chevron */}
          <linearGradient id="chevGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c5a9cb" />
            <stop offset="100%" stopColor="#d8bfe0" />
          </linearGradient>
          <linearGradient id="chevGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3b8c5" />
            <stop offset="100%" stopColor="#fbd3dc" />
          </linearGradient>
        </defs>

        {/* ── ARTISTIC CALLIGRAPHIC 'R' ── */}
        <g id="artistic-r">
          {/* Top Outer Loop arc */}
          <path 
            d="M 52 14 C 28 8, 10 24, 12 50 C 14 74, 38 82, 54 62 C 60 54, 62 42, 58 32 C 54 22, 44 26, 44 38 C 44 54, 52 58, 62 60" 
            stroke="url(#rGrad)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Profile inner details inside loop */}
          <path 
            d="M 42 32 L 52 46 L 40 48" 
            stroke="url(#rGrad)" 
            strokeWidth="2.8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="56" cy="38" r="2.2" fill="#8d6653" />

          {/* Base pedestal / foot */}
          <path 
            d="M 18 100 L 46 100 L 40 94 L 24 94 Z" 
            fill="url(#rGrad)" 
          />

          {/* Main sweeping dynamic stem / curve */}
          <path 
            d="M 43 45 L 36 96 C 36 96, 50 106, 68 76 C 88 44, 82 86, 120 114 C 138 126, 160 125, 172 118 C 160 120, 140 114, 126 100 C 104 78, 102 46, 88 56 C 76 66, 64 64, 50 48" 
            fill="url(#rGrad)" 
          />
          <path 
            d="M 43 45 C 50 48, 64 64, 76 66 C 92 68, 104 88, 126 102 C 142 114, 162 120, 172 118" 
            stroke="#5c3826" 
            strokeWidth="1.2" 
            strokeLinecap="round"
          />
        </g>

        {/* ── TEXT: "sequence" ── */}
        <text 
          x="94" 
          y="88" 
          fill="#66686c" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          fontSize="68" 
          fontWeight="400" 
          letterSpacing="0.02em"
        >
          sequence
        </text>

        {/* ── TOP RIGHT CHEVRONS (^^) ── */}
        <g id="chevrons" transform="translate(348, 42)">
          {/* Top Chevron */}
          <path 
            d="M 0 16 L 12 0 L 24 16" 
            stroke="url(#chevGrad1)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Bottom Chevron */}
          <path 
            d="M 0 30 L 12 14 L 24 30" 
            stroke="url(#chevGrad2)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </g>

        {/* ── BOTTOM PASTEL ACCENT STRIPES ── */}
        <g id="stripes">
          {/* Stripe 1: Soft Rose Pink */}
          <rect x="175" y="103" width="205" height="3" rx="1.5" fill="#f8cad3" />
          {/* Stripe 2: Pale Peach */}
          <rect x="175" y="111" width="205" height="3" rx="1.5" fill="#fde0d7" />
          {/* Stripe 3: Soft Aqua / Seafoam Teal */}
          <rect x="175" y="119" width="205" height="3" rx="1.5" fill="#9ec9cb" />
        </g>
      </svg>
    </div>
  );
}
