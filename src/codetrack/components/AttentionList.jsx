import React from "react";
import { motion } from "framer-motion";
import Avatar from "./Avatar";
import { AlertTriangle } from "lucide-react";

const GLASS = {
  background: "rgba(255,255,255,0.60)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.80)",
  boxShadow: "0 8px 32px 0 rgba(248,113,113,0.08)",
};

export default function AttentionList({ students, delayIndex = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + delayIndex * 0.08 }}
      className="rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300"
      style={GLASS}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-500" />
        <h3 className="text-sm font-bold text-slate-800">Needs Attention</h3>
        <span className="ml-auto text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full">
          0 today or &lt;70% attendance
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {students.map((s, idx) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="flex items-center gap-3 py-2 px-3 rounded-2xl transition"
            style={{ background: "rgba(254,226,226,0.35)" }}
          >
            <Avatar name={s.name} size={36} />

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{s.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{s.regNo}</p>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              {/* Today badge */}
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                s.todayQ === 0
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {s.todayQ === 0 ? "0 today" : `${s.todayQ}/10`}
              </span>
              {/* Attendance */}
              <span className="text-[10px] text-slate-400 font-medium">{s.attendance}% att.</span>
            </div>
          </motion.div>
        ))}

        {students.length === 0 && (
          <p className="text-xs text-slate-400 font-medium text-center py-4">
            🎉 Everyone is on track today!
          </p>
        )}
      </div>
    </motion.div>
  );
}
