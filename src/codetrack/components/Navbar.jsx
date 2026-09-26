import React, { useState } from "react";
import { Zap, RefreshCw, Calendar } from "lucide-react";

export default function Navbar({ selectedDate, setSelectedDate, onSync, syncing }) {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/60 border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Wordmark ── */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-300/40">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span
            className="text-xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CodeTrack
          </span>
        </div>

        {/* ── Right Controls ── */}
        <div className="flex items-center gap-3">

          {/* Date pill */}
          <label className="flex items-center gap-2 bg-white/70 border border-white/80 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm cursor-pointer hover:border-sky-300 transition">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent outline-none text-slate-700 font-bold cursor-pointer text-xs"
            />
          </label>

          {/* Sync button */}
          <button
            onClick={onSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold shadow-lg shadow-sky-400/30 transition-all duration-200 hover:shadow-sky-400/50 hover:scale-105 active:scale-95 disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)" }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync"}
          </button>
        </div>
      </div>
    </nav>
  );
}
