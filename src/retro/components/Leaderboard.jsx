import React from "react";
import { generateAsciiBar } from "../data";

export default function Leaderboard({ topStudents }) {
  return (
    <div className="border border-[#39FF14] bg-[#0A0A0A] flex flex-col min-h-[250px]">
      <div className="bg-[#39FF14] text-[#0A0A0A] font-bold text-xs px-3 py-1 uppercase">
        $ ./leaderboard --top 10
      </div>

      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {topStudents.map((s, idx) => {
          const isTop = idx === 0;
          return (
            <div 
              key={s.registerNumber} 
              className={`flex items-center justify-between text-xs sm:text-sm px-2 py-1 ${isTop ? 'bg-[#39FF14] text-[#0A0A0A] font-bold' : 'text-[#39FF14]'}`}
            >
              <div className="flex gap-4 items-center">
                <span className="w-4">#{idx + 1}</span>
                <span className="w-32 sm:w-48 truncate">{s.name}</span>
                <span className="w-24 hidden sm:inline-block opacity-80">{s.registerNumber}</span>
              </div>
              <div className="flex gap-2 items-center tracking-widest">
                <span className="hidden md:inline-block">[{generateAsciiBar(s.todayCount, 10)}]</span>
                <span>{s.todayCount}/10</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
