import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Animated SVG circular progress ring.
 * @param {number}  pct       - 0-100 percentage
 * @param {string}  color     - stroke gradient id colour string
 * @param {string}  label     - label below the pct
 * @param {string}  gradFrom  - gradient start colour
 * @param {string}  gradTo    - gradient end colour
 * @param {number}  size      - svg size px (default 160)
 */
export default function ProgressRing({
  pct = 0,
  label = "",
  gradFrom = "#38bdf8",
  gradTo   = "#818cf8",
  size     = 160,
  thick    = 14,
}) {
  const id = `grad-${gradFrom.replace("#","")}-${gradTo.replace("#","")}`;
  const radius = (size - thick) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradFrom} />
              <stop offset="100%" stopColor={gradTo} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth={thick}
          />

          {/* Animated progress arc */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth={thick}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${gradFrom}80)` }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tabular-nums text-slate-800" style={{ fontVariantNumeric:"tabular-nums" }}>
            {pct}<span className="text-base font-bold text-slate-400">%</span>
          </span>
        </div>
      </div>

      <p className="text-xs font-semibold text-slate-500 text-center leading-tight">{label}</p>
    </div>
  );
}
