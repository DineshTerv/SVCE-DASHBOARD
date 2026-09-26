import React from "react";

// Fixed gradient palette for avatar backgrounds
const PALETTES = [
  ["#38bdf8","#818cf8"],
  ["#34d399","#06b6d4"],
  ["#fb923c","#f43f5e"],
  ["#a78bfa","#ec4899"],
  ["#fbbf24","#f97316"],
  ["#4ade80","#22d3ee"],
];

function hashName(name = "") {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(h);
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

/**
 * Circular avatar with gradient background and initials.
 * @param {string}  name     – student name
 * @param {number}  size     – px (default 40)
 * @param {boolean} glow     – enable animated glow ring (for #1 student)
 */
export default function Avatar({ name = "", size = 40, glow = false }) {
  const idx   = hashName(name) % PALETTES.length;
  const [c1, c2] = PALETTES[idx];
  const initials  = getInitials(name);
  const fontSize  = Math.round(size * 0.35);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Glow ring for top performer */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ background: `radial-gradient(circle, ${c1}, ${c2})` }}
        />
      )}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center font-black text-white shadow-md"
        style={{
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          fontSize,
          letterSpacing: "0.02em",
        }}
      >
        {initials}
      </div>
    </div>
  );
}
