import React from "react";
import { motion } from "framer-motion";
import useCountUp from "../hooks/useCountUp";
import { Activity } from "lucide-react";

export default function HeroStat({ totalStudents, totalBatches, todayCompleted, formattedDate }) {
  const countStudents = useCountUp(totalStudents, 1200);
  const countBatches  = useCountUp(totalBatches, 900);
  const countToday    = useCountUp(todayCompleted, 1400);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="col-span-full rounded-3xl px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      style={{
        background: "rgba(255,255,255,0.60)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.80)",
        boxShadow: "0 8px 32px 0 rgba(56,189,248,0.10)",
      }}
    >
      {/* Left copy */}
      <div>
        <p className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> Live · {formattedDate}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
          <span className="tabular-nums" style={{ background:"linear-gradient(135deg,#0ea5e9,#6366f1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {countStudents}
          </span>{" "}
          students,{" "}
          <span className="tabular-nums" style={{ background:"linear-gradient(135deg,#a78bfa,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {countBatches}
          </span>{" "}
          batches tracking live
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          Real-time coding progress — updated every 5 minutes from Google Sheets
        </p>
      </div>

      {/* Right quick stat */}
      <div className="shrink-0 flex flex-col items-end">
        <div className="text-5xl font-black tabular-nums" style={{ background:"linear-gradient(135deg,#38bdf8,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          {countToday}
        </div>
        <p className="text-xs font-semibold text-slate-500 mt-1">hit today's target ✅</p>
      </div>
    </motion.div>
  );
}
