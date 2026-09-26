import React from "react";

export default function AttentionPanel({ students }) {
  return (
    <div className="border border-[#FF3B30] bg-[#0A0A0A] flex flex-col min-h-[250px]">
      <div className="bg-[#FF3B30] text-[#0A0A0A] font-bold text-xs px-3 py-1 uppercase flex items-center gap-2">
        <span className="animate-blink">!!</span>
        ALERT: LOW_ACTIVITY_DETECTED
        <span className="animate-blink">!!</span>
      </div>

      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {students.map((s) => (
          <div key={s.registerNumber} className="flex items-center justify-between text-xs sm:text-sm px-2 py-1 text-[#FF3B30] border border-transparent hover:border-[#FF3B30]">
            <div className="flex gap-4 items-center">
              <span className="w-32 sm:w-48 truncate">{s.name}</span>
              <span className="w-24 hidden sm:inline-block opacity-80">{s.registerNumber}</span>
            </div>
            <div className="flex gap-4 items-center text-right">
              <span className="w-20">
                {s.todayCount === 0 ? "0 TODAY" : `${s.todayCount}/10`}
              </span>
              <span className="w-16">
                {s.avgAttendance}% ATT
              </span>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="text-[#39FF14] text-xs">NO EXCEPTIONS FOUND.</div>
        )}
      </div>
    </div>
  );
}
