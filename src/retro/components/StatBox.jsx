import React from "react";

export default function StatBox({ label, value, progressAscii, isAmber = false }) {
  const colorClass = isAmber ? "text-[#FFB000] border-[#FFB000]" : "text-[#39FF14] border-[#39FF14]";
  
  return (
    <div className={`border p-4 ${colorClass} bg-[#0A0A0A] flex flex-col justify-between`}>
      <div className="text-xs uppercase opacity-80 mb-2">{label}</div>
      <div className="text-2xl font-bold tracking-wider">{value}</div>
      {progressAscii && (
        <div className="text-xs mt-2 tracking-widest">
          [{progressAscii}]
        </div>
      )}
    </div>
  );
}
