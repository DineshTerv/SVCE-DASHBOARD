import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Avatar from "./Avatar";
import { Trophy } from "lucide-react";

const GLASS = {
  background: "rgba(255,255,255,0.60)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.80)",
  boxShadow: "0 8px 32px 0 rgba(56,189,248,0.10)",
};

const RANK_STYLES = ["text-amber-500", "text-slate-400", "text-orange-400", "text-slate-400", "text-slate-400"];

export default function Leaderboard({ performers, delayIndex = 0 }) {

  // Fire confetti once on mount for the top performer
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x: 0.18, y: 0.45 },
        colors: ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e"],
        zIndex: 9999,
      });
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + delayIndex * 0.08 }}
      className="rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300"
      style={GLASS}
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800">Top Performers</h3>
      </div>

      <div className="flex flex-col gap-3">
        {performers.map((s, idx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="flex items-center gap-3 py-2 px-3 rounded-2xl hover:bg-white/60 transition"
          >
            {/* Rank */}
            <span className={`text-xs font-black w-5 text-center tabular-nums ${RANK_STYLES[idx]}`}>
              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
            </span>

            {/* Avatar */}
            <Avatar name={s.name} size={38} glow={idx === 0} />

            {/* Name + reg */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{s.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{s.regNo}</p>
            </div>

            {/* Score badge */}
            <div className="flex flex-col items-end gap-0.5">
              <span
                className="text-xs font-black px-2.5 py-0.5 rounded-full text-white"
                style={{ background: "linear-gradient(135deg,#38bdf8,#818cf8)" }}
              >
                {s.tillDateQ}Q
              </span>
              <span className="text-[10px] text-slate-400 font-medium">today: {s.todayQ}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
